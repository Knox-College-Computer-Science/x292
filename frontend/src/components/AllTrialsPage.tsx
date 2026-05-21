import { useEffect, useMemo, useState } from "react";
import { getMySavedTrials, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import TrialModeButton from "./TrialModeButton";
import "./AllTrialsPage.css";

type AllTrialsPageProps = {
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

const DEFAULT_CONDITION = "";

function formatTrialMeta(trial: Trial) {
  const status = trial.recruitment_status || "Status not listed";
  const phase = trial.study_phase ?? "Phase not listed";
  const location = trial.location || "Location not listed";
  return `${status} - ${phase} - ${location}`;
}

function includesText(value: string | null | undefined, search: string) {
  return value?.toLowerCase().includes(search.toLowerCase()) ?? false;
}

function matchesText(value: string | null | undefined, search: string) {
  return value?.trim().toLowerCase() === search.trim().toLowerCase();
}

export default function AllTrialsPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateFindTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: AllTrialsPageProps) {
  const [savedTrials, setSavedTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [condition, setCondition] = useState(DEFAULT_CONDITION);
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");
  const [participation, setParticipation] = useState("Either");
  const [requiresCompensation, setRequiresCompensation] = useState(false);

  async function loadTrials() {
    try {
      setLoading(true);
      setError(null);

      const userSaved = authToken ? await getMySavedTrials(authToken) : [];

      setSavedTrials(userSaved);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load trials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrials();
  }, [authToken]);

  const activeTrials = useMemo(() => {
    const conditionFilter = condition.trim();
    const locationFilter = location.trim();
    const statusFilter = status.trim();
    const phaseFilter = phase.trim();

    return savedTrials.filter((trial) => {
      if (conditionFilter && !includesText(trial.condition, conditionFilter)) {
        return false;
      }

      if (locationFilter && !includesText(trial.location, locationFilter)) {
        return false;
      }

      if (statusFilter && !matchesText(trial.recruitment_status, statusFilter)) {
        return false;
      }

      if (phaseFilter && !includesText(trial.study_phase, phaseFilter)) {
        return false;
      }

      if (participation === "Remote" && !trial.remote_eligible) {
        return false;
      }

      if (participation === "In-person" && trial.remote_eligible) {
        return false;
      }

      if (requiresCompensation && !trial.compensation) {
        return false;
      }

      return true;
    });
  }, [
    condition,
    location,
    participation,
    phase,
    requiresCompensation,
    savedTrials,
    status,
  ]);

  const upNextTrials = activeTrials.slice(0, 2);
  const statusTrials = activeTrials.slice(0, 8);

  return (
    <main className="all-trials-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section className="all-trials-content" aria-label="All trials">
        <form
          className="all-trials-filters"
          onSubmit={(event) => {
            event.preventDefault();
            void loadTrials();
          }}
        >
          <label>
            Condition
            <input
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              placeholder="Filter saved trials"
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, State"
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="Recruiting">Recruiting</option>
              <option value="Not yet recruiting">Not yet recruiting</option>
              <option value="">Any</option>
            </select>
          </label>

          <label>
            Study Phase
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
          </label>

          <label>
            Participation
            <select
              value={participation}
              onChange={(event) => setParticipation(event.target.value)}
            >
              <option value="Either">Either</option>
              <option value="Remote">Remote</option>
              <option value="In-person">In-person</option>
            </select>
          </label>

          <label className="all-trials-checkbox">
            <input
              type="checkbox"
              checked={requiresCompensation}
              onChange={(event) =>
                setRequiresCompensation(event.target.checked)
              }
            />
            Compensation only
          </label>

          <button type="submit" className="atlas-button atlas-button-variant-3">
            Apply filters
          </button>
        </form>

        <div className="all-trials-filter-actions">
          <span className="all-trials-saved-label">Showing saved trials</span>
          <span className="all-trials-saved-label">
            {activeTrials.length} of {savedTrials.length} saved visible
          </span>

          <TrialModeButton mode="swipe" onClick={onNavigateFindTrials} />
        </div>

        <div className="all-trials-up-next">
          <div className="all-trials-up-next-header">Up Next</div>
          {loading ? (
            Array.from({ length: 2 }, (_, index) => (
              <div
                key={`up-next-skeleton-${index}`}
                className={`all-trials-up-next-entry all-trials-up-next-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
                aria-hidden="true"
              >
                <div className="skeleton skeleton-line all-trials-skeleton-title" />
                <div className="skeleton skeleton-line all-trials-skeleton-date" />
              </div>
            ))
          ) : error ? (
            <div className="all-trials-message-row all-trials-message-row-transparent">
              <div
                className="state-card state-card-error all-trials-error-card"
                role="alert"
              >
                <p className="state-card-title">Could not load trials</p>
                <p className="state-card-message">{error}</p>
              </div>
            </div>
          ) : upNextTrials.length === 0 ? (
            <div className="all-trials-message-row">
              No saved trials matched the selected filters.
            </div>
          ) : (
            upNextTrials.map((trial, index) => (
              <div
                key={trial.id}
                className={`all-trials-up-next-entry all-trials-up-next-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
              >
                <div className="all-trials-up-next-title">
                  {trial.title}
                  {trial.match_reasons && trial.match_reasons.length > 0 ? (
                    <span className="all-trials-match-reason">
                      Match: {trial.match_reasons.join(", ")}
                    </span>
                  ) : null}
                </div>
                <div className="all-trials-up-next-date">
                  {trial.start_date ?? "Date not listed"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="all-trials-status">
          <div className="all-trials-status-header">
            <div className="all-trials-status-trial-col">Trial</div>
            <div className="all-trials-status-status-col">Status</div>
          </div>
          {loading ? (
            Array.from({ length: 6 }, (_, index) => (
              <div
                key={`status-skeleton-${index}`}
                className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
                aria-hidden="true"
              >
                <div className="skeleton skeleton-line all-trials-skeleton-title" />
                <div className="skeleton skeleton-line all-trials-skeleton-meta" />
                <div className="skeleton skeleton-block all-trials-skeleton-button" />
              </div>
            ))
          ) : error ? (
            <div className="all-trials-message-row all-trials-message-row-transparent">
              <div
                className="state-card state-card-error all-trials-error-card"
                role="alert"
              >
                <p className="state-card-title">Could not load trials</p>
                <p className="state-card-message">{error}</p>
              </div>
            </div>
          ) : statusTrials.length === 0 ? (
            <div className="all-trials-message-row">
              No saved trials matched the selected filters. Try broadening your
              criteria or save more trials from the matcher.
            </div>
          ) : (
            statusTrials.map((trial, index) => (
              <div
                key={trial.id}
                className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
              >
                <div className="all-trials-status-title">{trial.title}</div>
                <div className="all-trials-status-date">
                  {formatTrialMeta(trial)}
                </div>
                <button
                  type="button"
                  className="atlas-button all-trials-status-more-details"
                  onClick={() => onNavigateMoreDetails(trial.id)}
                >
                  More Info
                </button>
              </div>
            ))
          )}
        </div>

        <div className="all-trials-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-back all-trials-back"
            onClick={onNavigateFindTrials}
          >
            Back
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 all-trials-find-trials"
            onClick={() => void loadTrials()}
          >
            Refresh Trials
          </button>
        </div>
      </section>
    </main>
  );
}
