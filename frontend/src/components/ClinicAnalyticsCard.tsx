import TrialRating from "./TrialRating";
import "./ClinicAnalyticsCard.css";

type ClinicAnalyticsCardProps = {
  onNavigateMoreDetails: () => void;
};

export default function ClinicAnalyticsCard({
  onNavigateMoreDetails,
}: ClinicAnalyticsCardProps) {
  return (
    <section
      className="clinic-analytics-card"
      aria-label="Clinic analytics details"
    >
      <h2 className="clinic-analytics-card-title">Title</h2>

      <div className="clinic-analytics-card-grid">
        <div className="clinic-analytics-visual-box" />

        <div className="clinic-analytics-details-panel">
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">Study Type</span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-date">[00/00/0000]</span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">Location</span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              # of participants
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">% interested</span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label"># viewers</span>
          </div>

          <div className="clinic-analytics-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 clinic-analytics-more-info-button"
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
