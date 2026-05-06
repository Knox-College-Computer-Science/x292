import unittest
from io import StringIO
from time import perf_counter

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models
from app.services import matcher


def create_user_with_profile(
    db_session,
    *,
    email="matcher@example.com",
    health_conditions="Diabetes",
    location="Chicago",
    participation_preference="Either",
):
    user = models.User(email=email, hashed_password="hashed", role="user")
    db_session.add(user)
    db_session.flush()

    profile = models.UserProfile(
        user_id=user.id,
        full_name="Matcher User",
        health_conditions=health_conditions,
        location=location,
        participation_preference=participation_preference,
        profile_completed=True,
    )
    db_session.add(profile)
    db_session.commit()
    db_session.refresh(user)
    return user


def create_trial(
    db_session,
    *,
    title,
    condition,
    location,
    recruitment_status="RECRUITING",
    remote_eligible=False,
):
    trial = models.Trial(
        title=title,
        condition=condition,
        location=location,
        recruitment_status=recruitment_status,
        remote_eligible=remote_eligible,
    )
    db_session.add(trial)
    db_session.commit()
    db_session.refresh(trial)
    return trial


TEST_LABELS = {
    "test_condition_match_handles_multiple_conditions_case_insensitively": "Condition matching is case-insensitive",
    "test_condition_match_ignores_blank_items_and_extra_spacing": "Condition matching ignores blanks and spacing",
    "test_location_match_is_case_insensitive_and_safe_for_missing_values": "Location matching handles case and missing values",
    "test_remote_match_respects_participation_preference": "Remote scoring respects user preference",
    "test_score_from_metrics_builds_weighted_score_and_reasons": "Weighted score and reasons are built correctly",
    "test_pareto_front_removes_dominated_trials": "Pareto front removes dominated trials",
    "test_match_trials_returns_empty_list_when_no_trials_match_any_metric": "No-match scenarios return an empty result",
    "test_match_trials_ranks_best_remaining_trial_and_skips_saved_or_passed": "Saved and passed trials are excluded from ranking",
    "test_match_trials_keeps_multiple_non_dominated_trials": "Multiple non-dominated trials are preserved",
    "test_match_trials_raises_when_user_profile_is_missing": "Missing profiles are rejected safely",
    "test_get_matched_trials_filters_by_condition_and_returns_ranked_trials": "End-to-end matching returns ranked filtered trials",
}


class SummaryTestResult(unittest.TextTestResult):
    def __init__(self, stream, descriptions, verbosity):
        super().__init__(stream, descriptions, verbosity)
        self.successes = []

    def addSuccess(self, test):
        super().addSuccess(test)
        self.successes.append(test)


class SummaryTextTestRunner(unittest.TextTestRunner):
    resultclass = SummaryTestResult


def print_summary(result, elapsed_seconds):
    failures_and_errors = {test.id() for test, _ in result.failures + result.errors}
    all_tests = result.successes + [test for test, _ in result.failures + result.errors]
    ordered_tests = sorted(all_tests, key=lambda test: test.id())
    passed = len(result.successes)
    total = result.testsRun
    failed = len(result.failures)
    errored = len(result.errors)
    pass_rate = (passed / total * 100) if total else 0

    print("\nMatchmaking Test Scorecard")
    print("-" * 30)
    print(f"Overall score: {passed}/{total}")
    print(f"Pass rate: {pass_rate:.0f}%")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Errors: {errored}")
    print(f"Runtime: {elapsed_seconds:.3f}s")
    print("\nChecks:")

    for test in ordered_tests:
        test_name = test._testMethodName
        label = TEST_LABELS.get(test_name, test_name)
        status = "PASS" if test.id() not in failures_and_errors else "FAIL"
        print(f"[{status}] {label}")


class MatcherTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        TestingSessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self.engine,
        )
        models.Base.metadata.create_all(bind=self.engine)
        self.db_session = TestingSessionLocal()

    def tearDown(self):
        self.db_session.close()
        models.Base.metadata.drop_all(bind=self.engine)

    def test_condition_match_handles_multiple_conditions_case_insensitively(self):
        self.assertEqual(
            matcher._condition_match("asthma, diabetes", "Type 2 DIABETES study"),
            1,
        )
        self.assertEqual(
            matcher._condition_match("asthma, arthritis", "Type 2 diabetes study"),
            0,
        )

    def test_condition_match_ignores_blank_items_and_extra_spacing(self):
        self.assertEqual(
            matcher._condition_match("  , Diabetes  ,  ", "Diabetes prevention trial"),
            1,
        )
        self.assertEqual(
            matcher._condition_match("", "Diabetes prevention trial"),
            0,
        )

    def test_location_match_is_case_insensitive_and_safe_for_missing_values(self):
        self.assertEqual(matcher._location_match("chicago", "Chicago, Illinois"), 1)
        self.assertEqual(matcher._location_match(None, "Chicago, Illinois"), 0)
        self.assertEqual(matcher._location_match("Chicago", None), 0)

    def test_remote_match_respects_participation_preference(self):
        self.assertEqual(matcher._remote_match("Remote", True), 1)
        self.assertEqual(matcher._remote_match("Either", True), 1)
        self.assertEqual(matcher._remote_match("In-person", True), 0)
        self.assertEqual(matcher._remote_match("Remote", False), 0)

    def test_score_from_metrics_builds_weighted_score_and_reasons(self):
        score, reasons = matcher._score_from_metrics(
            {
                "condition": 1,
                "location": 1,
                "recruiting": 1,
                "remote": 0,
            }
        )

        self.assertEqual(score, 90)
        self.assertEqual(
            reasons,
            ["condition match", "location match", "actively recruiting"],
        )

    def test_pareto_front_removes_dominated_trials(self):
        dominated_trial = object()
        best_trial = object()
        incomparable_trial = object()

        trial_metrics = [
            (dominated_trial, {"condition": 1, "location": 0, "recruiting": 0, "remote": 0}),
            (best_trial, {"condition": 1, "location": 1, "recruiting": 0, "remote": 0}),
            (incomparable_trial, {"condition": 0, "location": 1, "recruiting": 1, "remote": 0}),
        ]

        front = matcher._pareto_front(trial_metrics)
        front_trials = [trial for trial, _ in front]

        self.assertIn(best_trial, front_trials)
        self.assertIn(incomparable_trial, front_trials)
        self.assertNotIn(dominated_trial, front_trials)

    def test_match_trials_returns_empty_list_when_no_trials_match_any_metric(self):
        user = create_user_with_profile(
            self.db_session,
            health_conditions="Diabetes",
            location="Chicago",
            participation_preference="In-person",
        )
        no_match_trial = create_trial(
            self.db_session,
            title="No Match",
            condition="Asthma",
            location="Seattle",
            recruitment_status="COMPLETED",
            remote_eligible=False,
        )

        matches = matcher.match_trials(self.db_session, user.id, [no_match_trial])

        self.assertEqual(matches, [])

    def test_match_trials_ranks_best_remaining_trial_and_skips_saved_or_passed(self):
        user = create_user_with_profile(self.db_session)

        strongest_trial = create_trial(
            self.db_session,
            title="Top Match",
            condition="Type 2 Diabetes",
            location="Chicago, Illinois",
            recruitment_status="RECRUITING",
            remote_eligible=True,
        )
        saved_trial = create_trial(
            self.db_session,
            title="Already Saved",
            condition="Diabetes",
            location="Chicago",
            recruitment_status="RECRUITING",
            remote_eligible=False,
        )
        passed_trial = create_trial(
            self.db_session,
            title="Already Passed",
            condition="Diabetes",
            location="Chicago",
            recruitment_status="RECRUITING",
            remote_eligible=False,
        )
        no_match_trial = create_trial(
            self.db_session,
            title="No Match",
            condition="Asthma",
            location="Seattle",
            recruitment_status="COMPLETED",
            remote_eligible=False,
        )

        self.db_session.add_all(
            [
                models.TrialInteraction(
                    user_id=user.id,
                    trial_id=saved_trial.id,
                    action="save",
                    trial_title=saved_trial.title,
                ),
                models.TrialInteraction(
                    user_id=user.id,
                    trial_id=passed_trial.id,
                    action="pass",
                    trial_title=passed_trial.title,
                ),
            ]
        )
        self.db_session.commit()

        matches = matcher.match_trials(
            self.db_session,
            user.id,
            [saved_trial, passed_trial, strongest_trial, no_match_trial],
        )

        self.assertEqual(len(matches), 1)
        trial, score, reasons = matches[0]
        self.assertEqual(trial.id, strongest_trial.id)
        self.assertEqual(score, 100)
        self.assertEqual(
            reasons,
            [
                "condition match",
                "location match",
                "actively recruiting",
                "remote eligible",
            ],
        )

    def test_match_trials_keeps_multiple_non_dominated_trials(self):
        user = create_user_with_profile(
            self.db_session,
            health_conditions="Diabetes",
            location="Chicago",
            participation_preference="In-person",
        )
        location_trial = create_trial(
            self.db_session,
            title="Location Focus",
            condition="Diabetes",
            location="Chicago, Illinois",
            recruitment_status="COMPLETED",
            remote_eligible=False,
        )
        recruiting_trial = create_trial(
            self.db_session,
            title="Recruiting Focus",
            condition="Diabetes",
            location="Houston, Texas",
            recruitment_status="RECRUITING",
            remote_eligible=False,
        )

        matches = matcher.match_trials(
            self.db_session,
            user.id,
            [location_trial, recruiting_trial],
        )

        self.assertEqual(len(matches), 2)
        returned_ids = {trial.id for trial, _, _ in matches}
        self.assertEqual(returned_ids, {location_trial.id, recruiting_trial.id})
        self.assertEqual(matches[0][1], 70)
        self.assertEqual(matches[1][1], 60)

    def test_match_trials_raises_when_user_profile_is_missing(self):
        user = models.User(email="noprof@example.com", hashed_password="hashed", role="user")
        self.db_session.add(user)
        self.db_session.commit()

        trial = create_trial(
            self.db_session,
            title="Diabetes Trial",
            condition="Diabetes",
            location="Chicago",
        )

        with self.assertRaisesRegex(Exception, "User profile not found"):
            matcher.match_trials(self.db_session, user.id, [trial])

    def test_get_matched_trials_filters_by_condition_and_returns_ranked_trials(self):
        user = create_user_with_profile(
            self.db_session,
            health_conditions="Diabetes",
            location="Chicago",
            participation_preference="Remote",
        )
        top_trial = create_trial(
            self.db_session,
            title="Diabetes Remote Match",
            condition="Diabetes",
            location="Seattle, Washington",
            recruitment_status="RECRUITING",
            remote_eligible=True,
        )
        second_trial = create_trial(
            self.db_session,
            title="Diabetes Local Match",
            condition="Diabetes",
            location="Chicago, Illinois",
            recruitment_status="COMPLETED",
            remote_eligible=False,
        )
        create_trial(
            self.db_session,
            title="Asthma Trial",
            condition="Asthma",
            location="Chicago, Illinois",
            recruitment_status="RECRUITING",
            remote_eligible=True,
        )

        matched_trials = matcher.get_matched_trials(self.db_session, user.id, "Diabetes")

        self.assertEqual([trial.id for trial in matched_trials], [top_trial.id, second_trial.id])


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(MatcherTests)
    start = perf_counter()
    result = SummaryTextTestRunner(stream=StringIO(), verbosity=0).run(suite)
    elapsed = perf_counter() - start
    print_summary(result, elapsed)
    raise SystemExit(0 if result.wasSuccessful() else 1)
