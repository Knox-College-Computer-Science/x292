import TrialRating from "./TrialRating";
import "./TrialCard.css";
import { Trial } from "../api";

type TrialCardProps = {
  trial: Trial | null;
  isLoading: boolean;
  onSave: () => void;
  onPass: () => void;
  onNavigateMoreDetails: () => void;
};

function formatRemoteLabel(trial: Trial): string {
  return trial.remote_eligible ? "Remote eligible" : "In-person";
}

export default function TrialCard({
  trial,
  isLoading,
  onSave,
  onPass,
  onNavigateMoreDetails,
}: TrialCardProps) {
  if (isLoading) {
    return (
      <section className="trial-card" aria-label="Trial details">
        <h2 className="trial-card-title">Loading trial recommendations...</h2>
      </section>
    );
  }

  if (!trial) {
    return (
      <section className="trial-card" aria-label="Trial details">
        <h2 className="trial-card-title">No trials found yet</h2>
        <p className="trial-card-empty-copy">
          Try broadening your condition or location preferences.
        </p>
      </section>
    );
  }

  return (
    <section className="trial-card" aria-label="Trial details">
      <h2 className="trial-card-title">{trial.title}</h2>

      <div className="trial-card-grid">
        <div className="trial-visual-box" />

        <div className="trial-details-panel">
          <div className="trial-detail-row">
            <span className="trial-detail-label">
              {trial.study_type || "Study type not specified"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-date">
              {trial.recruitment_status || "Recruitment status unavailable"}
            </span>
          </div>
          <div className="trial-detail-row trial-detail-row-split">
            <span className="trial-detail-label">{trial.location}</span>
            <span className="trial-detail-meta-right">{trial.study_phase || "Phase N/A"}</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">
              {trial.compensation || "Compensation not available"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">
              {trial.time_commitment || "Time commitment not listed"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">{formatRemoteLabel(trial)}</span>
          </div>

          <div className="trial-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 trial-more-info-button"
              onClick={onNavigateMoreDetails}
            >
              More Info
            </button>
            <div className="trial-actions-secondary">
              <button
                type="button"
                className="atlas-button atlas-button-variant-back trial-pass-button"
                onClick={onPass}
              >
                Pass
              </button>
              <button
                type="button"
                className="atlas-button atlas-button-variant-1 trial-save-button"
                onClick={onSave}
              >
                Save
              </button>
            </div>
            <TrialRating value={String(Math.max(1, trial.saves_count))} />
          </div>
        </div>
      </div>
    </section>
  );
}
