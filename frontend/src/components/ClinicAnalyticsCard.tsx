import type { TrialAnalyticsStats } from "../api";
import "./ClinicAnalyticsCard.css";

type ClinicAnalyticsCardProps = {
  stats: TrialAnalyticsStats | null;
  isLoading: boolean;
  error: string | null;
  onNavigateMoreDetails: (trialId: string) => void;
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
  const topTrial = stats?.top_trials?.[0] ?? null;

  return (
    <section
      className="clinic-analytics-card"
      aria-label="Clinic analytics details"
    >
      <h2 className="clinic-analytics-card-title">Admin Analytics Dashboard</h2>

      <div className="clinic-analytics-card-grid">
        <div className="clinic-analytics-visual-box">
          {isLoading ? (
            <div
              className="clinic-analytics-visual-skeleton"
              aria-hidden="true"
            >
              <div className="skeleton skeleton-line clinic-analytics-visual-skeleton-line clinic-analytics-visual-skeleton-line-wide" />
              <div className="skeleton skeleton-line clinic-analytics-visual-skeleton-line" />
              <div className="skeleton skeleton-line clinic-analytics-visual-skeleton-line clinic-analytics-visual-skeleton-line-short" />
            </div>
          ) : null}
        </div>

        <div className="clinic-analytics-details-panel">
          {isLoading ? (
            <div
              className="clinic-analytics-details-skeleton"
              aria-hidden="true"
            >
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line clinic-analytics-detail-skeleton-line-wide" />
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line clinic-analytics-detail-skeleton-line clinic-analytics-detail-skeleton-line-short" />
            </div>
          ) : error ? (
            <div className="state-card state-card-error clinic-analytics-error-card">
              <p className="state-card-title">Could not load analytics</p>
              <p className="state-card-message">{error}</p>
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
                  Most Selected Category:{" "}
                  {topCategory ? topCategory[0] : "None"}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Drop-off Rate: {stats.drop_off_rate}%
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Highest Drop-off Category:{" "}
                  {topDropOff ? topDropOff[0] : "None"}
                </span>
              </div>
              <div className="clinic-analytics-detail-row">
                <span className="clinic-analytics-detail-label">
                  Top Trial: {topTrial ? topTrial.title : "None"}
                </span>
              </div>
            </>
          ) : null}

          <div className="clinic-analytics-actions-row">
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 clinic-analytics-more-info-button"
              onClick={() => topTrial && onNavigateMoreDetails(topTrial.id)}
              disabled={isLoading || !stats || Boolean(error) || !topTrial}
            >
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
