import TrialRating from "./TrialRating";
import "./ClinicAnalyticsCard.css";
import { TrialAnalytics } from "../api";

type ClinicAnalyticsCardProps = {
  analytics: TrialAnalytics | null;
  onNavigateMoreDetails: () => void;
};

export default function ClinicAnalyticsCard({
  analytics,
  onNavigateMoreDetails,
}: ClinicAnalyticsCardProps) {
  const topTrial = analytics?.top_trials?.[0];
  const mostSelectedCategory =
    analytics && Object.keys(analytics.category_popularity).length
      ? Object.entries(analytics.category_popularity).sort(
          (a, b) => b[1] - a[1],
        )[0][0]
      : "N/A";

  return (
    <section
      className="clinic-analytics-card"
      aria-label="Clinic analytics details"
    >
      <h2 className="clinic-analytics-card-title">Admin Analytics Dashboard</h2>

      <div className="clinic-analytics-card-grid">
        <div className="clinic-analytics-visual-box" />

        <div className="clinic-analytics-details-panel">
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              Total views: {analytics?.total_views ?? 0}
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-date">
              Total saves: {analytics?.total_saves ?? 0}
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              Total passes: {analytics?.total_passes ?? 0}
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              Top trial: {topTrial?.title ?? "N/A"}
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              Most selected category: {mostSelectedCategory}
            </span>
          </div>
          <div className="clinic-analytics-detail-row">
            <span className="clinic-analytics-detail-label">
              Drop-off signal: {Math.max(0, (analytics?.total_passes ?? 0) - (analytics?.total_saves ?? 0))}
            </span>
          </div>

          <div className="clinic-analytics-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 clinic-analytics-more-info-button"
              onClick={onNavigateMoreDetails}
            >
              More Info
            </button>
            <TrialRating value={String(Math.max(1, analytics?.total_saves ?? 0))} />
          </div>
        </div>
      </div>
    </section>
  );
}
