import "./UserAnalyticsCard.css";

type UserAnalyticsCardProps = {
  onNavigateMoreDetails: () => void;
};

export default function UserAnalyticsCard({
  onNavigateMoreDetails,
}: UserAnalyticsCardProps) {
  return (
    <section
      className="user-analytics-card"
      aria-label="User analytics details"
    >
      <h2 className="user-analytics-card-title">Title</h2>

      <div className="user-analytics-card-grid">
        <div className="user-analytics-visual-box" />

        <div className="user-analytics-details-panel">
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">Study Type</span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-date">[00/00/0000]</span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">
              Compensation status
            </span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">
              Individual study results
            </span>
          </div>
          <div className="user-analytics-detail-row user-analytics-detail-row-split">
            <span className="user-analytics-detail-label">
              Study result uses
            </span>
          </div>

          <div className="user-analytics-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 user-analytics-more-info-button"
              onClick={onNavigateMoreDetails}
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
