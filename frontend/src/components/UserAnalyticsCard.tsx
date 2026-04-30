import "./UserAnalyticsCard.css";
import { UserSummary } from "../api";

type UserAnalyticsCardProps = {
  summary: UserSummary | null;
  onNavigateMoreDetails: () => void;
};

export default function UserAnalyticsCard({
  summary,
  onNavigateMoreDetails,
}: UserAnalyticsCardProps) {
  const primaryCategory = summary?.top_categories?.[0]?.category ?? "N/A";
  const saveRate =
    summary && summary.total_views > 0
      ? Math.round((summary.total_saves / summary.total_views) * 100)
      : 0;

  return (
    <section
      className="user-analytics-card"
      aria-label="User analytics details"
    >
      <h2 className="user-analytics-card-title">Your Trial Activity</h2>

      <div className="user-analytics-card-grid">
        <div className="user-analytics-visual-box" />

        <div className="user-analytics-details-panel">
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">
              Saved trials: {summary?.total_saves ?? 0}
            </span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-date">
              Passed trials: {summary?.total_passes ?? 0}
            </span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">
              Viewed trials: {summary?.total_views ?? 0}
            </span>
          </div>
          <div className="user-analytics-detail-row">
            <span className="user-analytics-detail-label">
              Save rate: {saveRate}%
            </span>
          </div>
          <div className="user-analytics-detail-row user-analytics-detail-row-split">
            <span className="user-analytics-detail-label">
              Top category: {primaryCategory}
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
