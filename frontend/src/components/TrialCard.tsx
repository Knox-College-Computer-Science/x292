import type { Trial } from "../api";
import "./TrialCard.css";
import useSwipeActions from "./useSwipeActions";

type TrialCardProps = {
  trial: Trial;
  currentIndex: number;
  total: number;
  onNavigateMoreDetails: () => void;
  onApply: () => void;
  onSkip: () => void;
};

export default function TrialCard({
  trial,
  currentIndex,
  total,
  onNavigateMoreDetails,
  onApply,
  onSkip,
}: TrialCardProps) {
  const swipeActions = useSwipeActions({
    onSwipeLeft: onSkip,
    onSwipeRight: onApply,
  });

  return (
    <section
      className="trial-card"
      aria-label="Trial details. Swipe left to skip or swipe right to apply."
      {...swipeActions}
    >
      <div className="trial-card-header-row">
        <h2 className="trial-card-title">{trial.title}</h2>
        <span className="trial-card-counter">
          Card {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="trial-card-grid">
        <div className="trial-visual-box">
          <p className="trial-visual-condition">{trial.condition}</p>
          {trial.match_reasons && trial.match_reasons.length > 0 ? (
            <p className="trial-match-reasons">
              Match reasons: {trial.match_reasons.join(", ")}
            </p>
          ) : null}
        </div>

        <div className="trial-details-panel">
          <div className="trial-detail-row">
            <span className="trial-detail-label">Study Type</span>
            <span className="trial-detail-value">{trial.study_type ?? "Not listed"}</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Recruitment</span>
            <span className="trial-detail-value">{trial.recruitment_status}</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Location</span>
            <span className="trial-detail-value">{trial.location}</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Compensation</span>
            <span className="trial-detail-value">
              {trial.compensation ?? "Compensation info not available"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Phase</span>
            <span className="trial-detail-value">{trial.study_phase ?? "Not listed"}</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Participation</span>
            <span className="trial-detail-value">
              {trial.remote_eligible ? "Remote eligible" : "In-person"}
            </span>
          </div>

          <div className="trial-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 trial-more-info-button"
              onClick={onNavigateMoreDetails}
            >
              View Trial
            </button>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3"
              onClick={onApply}
            >
              Apply
            </button>
            <button
              type="button"
              className="atlas-button atlas-button-variant-back"
              onClick={onSkip}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
