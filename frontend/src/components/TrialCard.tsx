import type { Trial } from "../api";
import TrialRating from "./TrialRating";
import "./TrialCard.css";
import Tooltip from "./Tooltip";
import useSwipeActions from "./useSwipeActions";

type TrialCardProps = {
  trial: Trial;
  currentIndex: number;
  total: number;
  onNavigateMoreDetails: () => void;
  onApply: () => void;
  onSkip: () => void;
};

function formatMatchRating(score: number) {
  return `${Math.round(score)}%`;
}

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
        <div className="trial-card-header-meta">
          {typeof trial.match_score === "number" ? (
            <TrialRating value={formatMatchRating(trial.match_score)} />
          ) : null}
          <span className="trial-card-counter">
            Card {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      <div className="trial-card-grid">
        <div className="trial-visual-box">
          <p className="trial-visual-condition">{trial.condition}</p>
          {trial.match_reasons && trial.match_reasons.length > 0 ? (
            <Tooltip
              label={`This trial matches your profile based on: ${trial.match_reasons.join(", ")}`}
            >
              <p className="trial-match-reasons">
                Match reasons: {trial.match_reasons.join(", ")}
              </p>
            </Tooltip>
          ) : null}
        </div>

        <div className="trial-details-panel">
          <div className="trial-detail-row">
            <span className="trial-detail-label">Study Type</span>
            <span className="trial-detail-value">
              {trial.study_type ?? "Not listed"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Recruitment</span>
            <span className="trial-detail-value">
              {trial.recruitment_status}
            </span>
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
            <span className="trial-detail-value">
              {trial.study_phase ?? "Not listed"}
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Participation</span>
            <span className="trial-detail-value">
              {trial.remote_eligible ? "Remote eligible" : "In-person"}
            </span>
          </div>

          <div className="trial-actions-row">
            <Tooltip label="See full eligibility, timeline, and contact details">
              <button
                type="button"
                className="atlas-button atlas-button-variant-1 trial-more-info-button"
                onClick={onNavigateMoreDetails}
              >
                View Trial
              </button>
            </Tooltip>

            <Tooltip label="Add this trial to your applications and get notified of updates">
              <button
                type="button"
                className="atlas-button atlas-button-variant-3"
                onClick={onApply}
              >
                Apply
              </button>
            </Tooltip>

            <Tooltip label="Mark as not interested—find it again anytime in your history">
              <button
                type="button"
                className="atlas-button atlas-button-variant-back"
                onClick={onSkip}
              >
                Skip
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}
