import type { InteractionHistoryItem, TrialAnalyticsStats } from "../api";
import "./UserAnalyticsCard.css";

type UserAnalyticsCardProps = {
  stats: TrialAnalyticsStats | null;
  history: InteractionHistoryItem[];
  isLoading: boolean;
  error: string | null;
  onNavigateMoreDetails: () => void;
  onNavigateHistoryTrial: (trialId: string) => void;
};

function formatAction(action: "save" | "pass" | "view") {
  if (action === "save") {
    return "Applied";
  }
  if (action === "pass") {
    return "Skipped";
  }
  return "Viewed";
}

function formatDate(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleString();
}

export default function UserAnalyticsCard({
  stats,
  history,
  isLoading,
  error,
  onNavigateMoreDetails,
  onNavigateHistoryTrial,
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
      <h2 className="user-analytics-card-title">Matcher Analytics + Swipe History</h2>

      <div className="user-analytics-card-grid">
        <div className="user-analytics-visual-box">
          <h3>Swipe History</h3>
          {history.length === 0 ? (
            <p className="history-empty">No apply/skip history yet.</p>
          ) : (
            <ul className="history-list">
              {history.slice(0, 10).map((item) => (
                <li key={item.interaction_id}>
                  <div>
                    <strong>{item.trial?.title ?? "Trial unavailable"}</strong>
                    <span>
                      {formatAction(item.action)} • {formatDate(item.created_at)}
                    </span>
                  </div>
                  {item.trial ? (
                    <button
                      type="button"
                      className="atlas-button atlas-button-variant-back history-open-btn"
                      onClick={() => onNavigateHistoryTrial(item.trial!.id)}
                    >
                      Reopen
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

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

              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Top Category: {topCategory ? topCategory[0] : "None yet"}
                </span>
              </div>
              <div className="user-analytics-detail-row">
                <span className="user-analytics-detail-label">
                  Drop-off Rate: {stats.drop_off_rate}%
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
