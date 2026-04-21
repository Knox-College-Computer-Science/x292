import TrialRating from "./TrialRating";
import "./TrialCard.css";

type TrialCardProps = {
  onNavigateMoreDetails: () => void;
};

export default function TrialCard({ onNavigateMoreDetails }: TrialCardProps) {
  return (
    <section className="trial-card" aria-label="Trial details form">
      <h2 className="trial-card-title">Title</h2>

      <div className="trial-card-grid">
        <div className="trial-visual-box" />

        <div className="trial-details-panel">
          <div className="trial-detail-row">
            <span className="trial-detail-label">Study Type</span>
            <span className="trial-detail-value">Placeholder</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Date</span>
            <span className="trial-detail-value">Placeholder</span>
          </div>
          <div className="trial-detail-row trial-detail-row-split">
            <span className="trial-detail-label">Location</span>
            <span className="trial-detail-value trial-detail-value-right">
              Time
            </span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Compensation</span>
            <span className="trial-detail-value">Placeholder</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Time Commitment</span>
            <span className="trial-detail-value">Placeholder</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Remote or In-Person</span>
            <span className="trial-detail-value">Placeholder</span>
          </div>

          <button
            type="button"
            className="atlas-button atlas-button-variant-1 trial-more-info-button"
            onClick={onNavigateMoreDetails}
          >
            More Info
          </button>
        </div>
      </div>

      <TrialRating />
    </section>
  );
}
