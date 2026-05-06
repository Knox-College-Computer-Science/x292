import type { TrialAnalyticsStats } from "../api";
import "./ClinicAnalyticsCard.css";

type ClinicAnalyticsCardProps = {
  stats: TrialAnalyticsStats | null;
  isLoading: boolean;
  error: string | null;
  onNavigateMoreDetails: () => void;
};

export default function ClinicAnalyticsCard({
  stats,
  isLoading,
  error,
  onNavigateMoreDetails,
}: ClinicAnalyticsCardProps) {
  const topCategory = stats
    ? Object.entries(stats.category_popularity).sort((a, b) => b[1] - a[1])[0]
    : null;

  const topDropOff = stats
    ? Object.entries(stats.drop_off_by_category).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <section
      className="clinic-analytics-card"
      aria-label="Clinic analytics details"
    >
      <h2 className="clinic-analytics-card-title">Admin Analytics Dashboard</h2>

      <div className="clinic-analytics-card-grid">
        <div className="clinic-analytics-visual-box" />

        <div className="clinic-analytics-details-panel">
          {isLoading ? (
            <div className="clinic-analytics-detail-row">
              <span className="clinic-analytics-detail-label">Loading analytics...</span>
            </div>
          ) : error ? (
            <div className="clinic-analytics-detail-row">
              <span className="clinic-analytics-detail-label">{error}</span>
            </div>
          ) : stats ? (
            <>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Total Views: {stats.total_views}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Saves: {stats.total_saves}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Passes: {stats.total_passes}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Most Selected Category: {topCategory ? topCategory[0] : "None"}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Drop-off Rate: {stats.drop_off_rate}%
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Highest Drop-off Category: {topDropOff ? topDropOff[0] : "None"}
                </span>
              </div>
            </>
          ) : null}

          <div className="clinic-analytics-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 clinic-analytics-more-info-button"
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
