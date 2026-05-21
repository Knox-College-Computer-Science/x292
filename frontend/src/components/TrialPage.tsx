import { useEffect, useMemo, useRef, useState } from "react";
import { listTrials, passTrial, saveTrial, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import TrialCard from "./TrialCard";
import Tooltip from "./Tooltip";
import "./TrialPage.css";

type TrialPageProps = {
  authToken?: string;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateFindTrials: () => void;
  onNavigateMoreDetails: (trialId: string) => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function TrialPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: TrialPageProps) {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [appliedSearch, setAppliedSearch] = useState("diabetes");
  const [appliedStatus, setAppliedStatus] = useState("Recruiting");
  const latestLoadId = useRef(0);

  const [condition, setCondition] = useState("diabetes");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Recruiting");
  const [phase, setPhase] = useState("");
  const [participation, setParticipation] = useState("Either");
  const [requiresCompensation, setRequiresCompensation] = useState(false);

  async function loadTrials() {
    const loadId = latestLoadId.current + 1;
    latestLoadId.current = loadId;

    try {
      setLoading(true);
      setError(null);
      setActionMessage(null);

      const normalizedParticipation =
        participation === "Either" ? undefined : participation;
      const queryCondition = condition.trim() || "your profile";
      const queryStatus = status.trim();

      const data = await listTrials(
        {
          condition: condition.trim() || undefined,
          location: location.trim() || undefined,
          status: status.trim() || undefined,
          phase: phase.trim() || undefined,
          participation: normalizedParticipation,
          requiresCompensation,
        },
        authToken,
      );

      if (loadId !== latestLoadId.current) {
        return;
      }

      setTrials(data);
      setCurrentIndex(0);
      setAppliedSearch(queryCondition);
      setAppliedStatus(queryStatus);
    } catch (err) {
      if (loadId !== latestLoadId.current) {
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "Could not load trial matcher cards.",
      );
      setTrials([]);
      setCurrentIndex(0);
      setAppliedSearch(condition.trim() || "your profile");
      setAppliedStatus(status.trim());
    } finally {
      if (loadId === latestLoadId.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void loadTrials();
  }, [authToken]);

  const currentTrial = useMemo(
    () => (currentIndex < trials.length ? trials[currentIndex] : null),
    [currentIndex, trials],
  );
  const statusSummary = appliedStatus
    ? `${appliedStatus.toLowerCase()} `
    : "";
  const shouldShowStatusHint =
    !loading && !error && appliedStatus === "Recruiting" && trials.length <= 1;

  async function handleAction(action: "save" | "pass") {
    if (!currentTrial) {
      return;
    }

    if (!authToken) {
      setActionMessage("Please sign in to apply or skip trials.");
      return;
    }

    try {
      if (action === "save") {
        await saveTrial(currentTrial.id, authToken);
        setActionMessage("Trial marked as Apply. Moving to next card.");
      } else {
        await passTrial(currentTrial.id, authToken);
        setActionMessage("Trial skipped. Moving to next card.");
      }
      setCurrentIndex((index) => index + 1);
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Could not update trial action.",
      );
    }
  }

  return (
    <main className="trial-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section className="trial-page-content" aria-label="Trial matcher">
        <form
          className="trial-filter-bar"
          onSubmit={(event) => {
            event.preventDefault();
            void loadTrials();
          }}
        >
          <label>
            Condition
            <Tooltip label="Search by condition name (e.g., 'diabetes', 'pneumonia', 'cancer')">
              <input
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
                placeholder="diabetes, pneumonia, cancer"
              />
            </Tooltip>
          </label>

          <label>
            Location
            <Tooltip label="Enter city and state (e.g., 'Boston, MA')">
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City, State"
              />
            </Tooltip>
          </label>

          <label>
            Status
            <Tooltip label="Recruiting = actively enrolling participants now">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Recruiting">Recruiting</option>
                <option value="Not yet recruiting">Not yet recruiting</option>
                <option value="">Any</option>
              </select>
            </Tooltip>
          </label>

          <label>
            Phase
            <Tooltip label="Phase 1: Safety | Phase 2: Efficacy | Phase 3: Effectiveness | Phase 4: Long-term follow-up">
              <select
                value={phase}
                onChange={(event) => setPhase(event.target.value)}
              >
                <option value="">Any</option>
                <option value="Phase 1">Phase 1</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
                <option value="Phase 4">Phase 4</option>
              </select>
            </Tooltip>
          </label>

          <label>
            Participation
            <Tooltip label="'Either' means you're open to both remote and in-person trials">
              <select
                value={participation}
                onChange={(event) => setParticipation(event.target.value)}
              >
                <option value="Either">Either</option>
                <option value="Remote">Remote</option>
                <option value="In-person">In-person</option>
              </select>
            </Tooltip>
          </label>

          <label className="trial-filter-checkbox">
            <Tooltip label="Check to show only trials offering payment or incentives">
              <input
                type="checkbox"
                checked={requiresCompensation}
                onChange={(event) =>
                  setRequiresCompensation(event.target.checked)
                }
              />
            </Tooltip>
            Compensation only
          </label>

          <Tooltip label="Refresh the swipe deck using current filters">
            <button
              type="submit"
              className="atlas-button atlas-button-variant-3"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh cards"}
            </button>
          </Tooltip>
        </form>

        <div className="trial-filter-actions">
          <span className="trial-results-summary">
            Showing {trials.length} {statusSummary}
            {trials.length === 1 ? "card" : "cards"} for {appliedSearch}
          </span>
          <Tooltip label="View all saved trials in a list">
            <button
              type="button"
              className="atlas-button atlas-button-variant-back"
              onClick={onNavigateAllTrials}
            >
              All Trials
            </button>
          </Tooltip>
        </div>

        {shouldShowStatusHint ? (
          <p className="trial-filter-hint">
            Recruiting filter is on. Change Status to Any to include more
            cached matches for {appliedSearch}.
          </p>
        ) : null}

        {loading ? (
          <div className="trial-card-skeleton" aria-hidden="true">
            <div className="skeleton skeleton-line trial-card-skeleton-title" />
            <div className="skeleton skeleton-line trial-card-skeleton-meta" />
            <div className="skeleton skeleton-block trial-card-skeleton-body" />
            <div className="trial-card-skeleton-actions">
              <div className="skeleton skeleton-block trial-card-skeleton-action" />
              <div className="skeleton skeleton-block trial-card-skeleton-action" />
            </div>
          </div>
        ) : null}
        {error ? (
          <div
            className="state-card state-card-error trial-error-card"
            role="alert"
          >
            <p className="state-card-title">Could not load matcher cards</p>
            <p className="state-card-message">{error}</p>
            {appliedStatus === "Recruiting" ? (
              <p className="state-card-message">
                Try Status: Any if the condition has older or non-recruiting
                trial records.
              </p>
            ) : null}
          </div>
        ) : null}

        {!loading && !error && currentTrial ? (
          <TrialCard
            trial={currentTrial}
            currentIndex={currentIndex}
            total={trials.length}
            onNavigateMoreDetails={() => onNavigateMoreDetails(currentTrial.id)}
            onApply={() => void handleAction("save")}
            onSkip={() => void handleAction("pass")}
          />
        ) : null}

        {!loading && !error && !currentTrial ? (
          <div className="trial-page-intro-card">
            <h2>All cards reviewed</h2>
            <p>
              You have swiped through this filtered set. Update filters or
              refresh cards to continue matching.
            </p>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3"
              disabled={loading}
              onClick={() => void loadTrials()}
            >
              {loading ? "Loading..." : "Reload cards"}
            </button>
          </div>
        ) : null}

        {actionMessage ? <p className="trial-state">{actionMessage}</p> : null}
      </section>
    </main>
  );
}
