import { useEffect, useState } from "react";
import { listTrials, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import "./ClinicAllTrialsPage.css";

type ClinicAllTrialsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateAddTrials: () => void;
  onNavigateMoreDetails: (trialId: string) => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

const DEFAULT_CONDITION = "diabetes";

function formatTrialMeta(trial: Trial) {
  const status = trial.recruitment_status || "Status not listed";
  const phase = trial.study_phase ?? "Phase not listed";
  const location = trial.location || "Location not listed";
  return `${status} - ${phase} - ${location}`;
}

export default function ClinicAllTrialsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateAddTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: ClinicAllTrialsPageProps) {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTrials() {
    try {
      setLoading(true);
      setError(null);

      const trialData = await listTrials({ condition: DEFAULT_CONDITION });
      setTrials(trialData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load trials. Please try again.",
      );
      setTrials([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrials();
  }, []);

  const statusTrials = trials.slice(0, 8);

  return (
    <main className="clinic-all-trials-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section
        className="clinic-all-trials-content"
        aria-label="Clinic all trials"
      >
        <div className="clinic-all-trials-status">
          <div className="clinic-all-trials-status-header">
            <div className="clinic-all-trials-status-trial-col">Trial</div>
            <div className="clinic-all-trials-status-status-col">Status</div>
          </div>
          {loading ? (
            Array.from({ length: 6 }, (_, index) => (
              <div
                key={`clinic-status-skeleton-${index}`}
                className={`clinic-all-trials-status-entry clinic-all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
                aria-hidden="true"
              >
                <div className="skeleton skeleton-line clinic-all-trials-skeleton-title" />
                <div className="skeleton skeleton-line clinic-all-trials-skeleton-meta" />
                <div className="skeleton skeleton-block clinic-all-trials-skeleton-button" />
              </div>
            ))
          ) : error ? (
            <div className="clinic-all-trials-message-row clinic-all-trials-message-row-transparent">
              <div
                className="state-card state-card-error clinic-all-trials-error-card"
                role="alert"
              >
                <p className="state-card-title">Could not load trials</p>
                <p className="state-card-message">{error}</p>
              </div>
            </div>
          ) : statusTrials.length === 0 ? (
            <div className="clinic-all-trials-message-row">
              No trials found yet.
            </div>
          ) : (
            statusTrials.map((trial, index) => (
              <div
                key={trial.id}
                className={`clinic-all-trials-status-entry clinic-all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
              >
                <div className="clinic-all-trials-status-title">
                  {trial.title}
                </div>
                <div className="clinic-all-trials-status-date">
                  {formatTrialMeta(trial)}
                </div>
                <button
                  type="button"
                  className="atlas-button clinic-all-trials-status-more-details"
                  onClick={() => onNavigateMoreDetails(trial.id)}
                >
                  More Info
                </button>
              </div>
            ))
          )}
        </div>

        <div className="clinic-all-trials-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-back clinic-all-trials-back"
            onClick={onNavigateProfile}
          >
            Back
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 clinic-all-trials-add-trials"
            onClick={() => void loadTrials()}
          >
            Refresh Trials
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 clinic-all-trials-add-trials"
            onClick={onNavigateAddTrials}
          >
            Add Trials
          </button>
        </div>
      </section>
    </main>
  );
}
