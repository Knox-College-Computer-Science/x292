import type { TrialAnalyticsStats } from "../api";
import "./UserAnalyticsCard.css";

type UserAnalyticsCardProps = {
  stats: TrialAnalyticsStats | null;
  isLoading: boolean;
  error: string | null;
  onNavigateMoreDetails: () => void;
};

export default function UserAnalyticsCard({
  stats,
  isLoading,
  error,
  onNavigateMoreDetails,
}: UserAnalyticsCardProps) {
  const topTrial = stats?.top_trials[0];

  const topCategory = stats
    ? Object.entries(stats.category_popularity).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <section
      className="user-analytics-card"
      aria-label="User analytics details"
    >
      <h2 className="user-analytics-card-title">Trial Analytics</h2>

      <div className="user-analytics-card-grid">
        <div className="user-analytics-visual-box" />

        <div className="user-analytics-details-panel">
          {isLoading && (
            <div className="user-analytics-detail-row">
              <span className="user-analytics-detail-label">Loading...</span>
            </div>
          )}

          {error && (
            <div className="user-analytics-detail-row">
              <span className="user-analytics-detail-label">{error}</span>
            </div>
          )}

          {!isLoading && !error && stats && (
            <>
              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Views: {stats.total_views}
                </span>
              </div>

              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Saves: {stats.total_saves}
                </span>
              </div>

              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Passes: {stats.total_passes}
                </span>
              </div>

              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Top Trial: {topTrial ? topTrial.title : "None yet"}
                </span>
              </div>

              <div className="user-analytics-detail-row user-analytics-detail-row-split">
                <span className="user-analytics-detail-label">
                  Top Category: {topCategory ? topCategory[0] : "None yet"}
                </span>
              </div>
            </>
          )}

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
