import TrialRating from "./TrialRating";
import "./TrialCard.css";

type TrialCardProps = {
  onNavigateMoreDetails: () => void;
};

export default function TrialCard({ onNavigateMoreDetails }: TrialCardProps) {
  return (
    <section className="trial-card" aria-label="Trial details">
      <h2 className="trial-card-title">Title</h2>

      <div className="trial-card-grid">
        <div className="trial-visual-box" />

        <div className="trial-details-panel">
          <div className="trial-detail-row">
            <span className="trial-detail-label">Study Type</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-date">[00/00/0000]</span>
          </div>
          <div className="trial-detail-row trial-detail-row-split">
            <span className="trial-detail-label">Location</span>
            <span className="trial-detail-meta-right">[time]</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Compensation</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Time Commitment</span>
          </div>
          <div className="trial-detail-row">
            <span className="trial-detail-label">Remote/in person</span>
          </div>

          <div className="trial-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 trial-more-info-button"
              onClick={onNavigateMoreDetails}
            >
              More Info
            </button>
            <TrialRating value="00" />
          </div>
        </div>
      </div>
    </section>
  );
}
