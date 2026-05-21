import { useEffect, useMemo, useState } from "react";
import type { InteractionHistoryItem, TrialAnalyticsStats } from "../api";
import Arrows from "./Arrows";
import Tooltip from "./Tooltip";
import "./UserAnalyticsCard.css";
import useSwipeActions from "./useSwipeActions";

type UserAnalyticsCardProps = {
  stats: TrialAnalyticsStats | null;
  history: InteractionHistoryItem[];
  isLoading: boolean;
  error: string | null;
  onNavigateMoreDetails: () => void;
  onNavigateHistoryTrial: (trialId: string) => void;
};

function formatAction(action: "save" | "pass" | "view") {
  if (action === "save") return "Applied";
  if (action === "pass") return "Skipped";
  return "Viewed";
}

function formatDate(iso: string) {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
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
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);
  const [showHistoryList, setShowHistoryList] = useState(false);

  const topTrial = stats?.top_trials[0];

  const historyTrials = useMemo(
    () => history.filter((item) => item.trial),
    [history],
  );

  const currentHistoryItem =
    historyTrials[activeHistoryIndex] ?? historyTrials[0] ?? null;

  useEffect(() => {
    if (activeHistoryIndex >= historyTrials.length) setActiveHistoryIndex(0);
  }, [activeHistoryIndex, historyTrials.length]);

  const swipeActions = useSwipeActions({
    onSwipeLeft: () =>
      setActiveHistoryIndex((index) =>
        Math.min(index + 1, Math.max(historyTrials.length - 1, 0)),
      ),
    onSwipeRight: () =>
      setActiveHistoryIndex((index) => Math.max(index - 1, 0)),
  });

  const topCategory = stats
    ? Object.entries(stats.category_popularity).sort((a, b) => b[1] - a[1])[0]
    : null;

  return (
    <section
      className="user-analytics-card"
      aria-label="User analytics details. Swipe left or right through trials."
    >
      <div className="user-analytics-card-header">
        <h2 className="user-analytics-card-title">
          Matcher Analytics + Swipe History
        </h2>

        <Tooltip
          label={showHistoryList ? "Hide history list" : "Show history list"}
        >
          <button
            type="button"
            className="atlas-button atlas-button-variant-back user-analytics-history-toggle"
            onClick={() => setShowHistoryList((v) => !v)}
            disabled={isLoading || history.length === 0}
          >
            {showHistoryList ? "Hide History" : "History"}
          </button>
        </Tooltip>
      </div>

      {!showHistoryList ? (
        <div className="user-analytics-visual-area">
          <div className="user-analytics-visual-box">
            <h3>Swipe Through Trials</h3>

            {isLoading ? (
              <div
                className="user-analytics-history-skeleton"
                aria-hidden="true"
              >
                <div className="skeleton skeleton-line user-analytics-history-skeleton-line user-analytics-history-skeleton-line-wide" />
                <div className="skeleton skeleton-line user-analytics-history-skeleton-line" />
                <div className="skeleton skeleton-line user-analytics-history-skeleton-line user-analytics-history-skeleton-line-short" />
              </div>
            ) : !currentHistoryItem || !currentHistoryItem.trial ? (
              <p className="history-empty">No apply/skip history yet.</p>
            ) : (
              <div
                className="user-analytics-history-card"
                aria-label="Swipable history card"
                {...swipeActions}
              >
                <div className="user-analytics-history-card-topline">
                  <span className="user-analytics-history-card-pill">
                    {formatAction(currentHistoryItem.action)}
                  </span>
                  <span className="user-analytics-history-card-counter">
                    {activeHistoryIndex + 1} / {historyTrials.length}
                  </span>
                </div>

                <h4 className="user-analytics-history-card-title">
                  {currentHistoryItem.trial.title}
                </h4>

                <p className="user-analytics-history-card-meta">
                  {formatDate(currentHistoryItem.created_at)}
                </p>

                <div className="user-analytics-history-card-summary">
                  {currentHistoryItem.trial.match_reasons &&
                  currentHistoryItem.trial.match_reasons.length > 0 ? (
                    <p>
                      Match reasons:{" "}
                      {currentHistoryItem.trial.match_reasons.join(", ")}
                    </p>
                  ) : null}

                  <p>
                    {currentHistoryItem.trial.condition} •{" "}
                    {currentHistoryItem.trial.location}
                  </p>
                </div>

                <Tooltip label="Open trial details for this history item">
                  <button
                    type="button"
                    className="atlas-button atlas-button-variant-3 user-analytics-history-reopen"
                    onClick={() =>
                      onNavigateHistoryTrial(currentHistoryItem.trial!.id)
                    }
                  >
                    Reopen Trial
                  </button>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="user-analytics-history-arrows-outside">
            <Arrows
              onPrevious={() =>
                setActiveHistoryIndex((i) => Math.max(i - 1, 0))
              }
              onNext={() =>
                setActiveHistoryIndex((i) =>
                  Math.min(i + 1, Math.max(historyTrials.length - 1, 0)),
                )
              }
            />
          </div>
        </div>
      ) : null}

      {showHistoryList ? (
        <div className="user-analytics-history-panel">
          <h3 className="user-analytics-history-panel-title">Swipe History</h3>

          {isLoading ? (
            <div className="user-analytics-details-skeleton" aria-hidden="true">
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line user-analytics-detail-skeleton-line-wide" />
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line" />
              <div className="skeleton skeleton-line user-analytics-detail-skeleton-line user-analytics-detail-skeleton-line-short" />
            </div>
          ) : error ? (
            <div className="state-card state-card-error user-analytics-error-card">
              <p className="state-card-title">Could not load analytics</p>
              <p className="state-card-message">{error}</p>
            </div>
          ) : stats ? (
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

              <div className="user-analytics-actions-row">
                <Tooltip label="View more analytics and trial details">
                  <button
                    type="button"
                    className="atlas-button atlas-button-variant-1 user-analytics-more-info-button"
                    onClick={onNavigateMoreDetails}
                    disabled={isLoading || !stats || Boolean(error)}
                  >
                    More Info
                  </button>
                </Tooltip>
              </div>
            </>
          ) : null}

          {history.length === 0 ? (
            <p className="history-empty">No apply/skip history yet.</p>
          ) : (
            <ul className="history-list">
              {history.slice(0, 10).map((item) => (
                <li key={item.interaction_id}>
                  <div>
                    <strong>{item.trial?.title ?? "Trial unavailable"}</strong>
                    <span>
                      {formatAction(item.action)} •{" "}
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  {item.trial ? (
                    <Tooltip label="Open trial details for this history item">
                      <button
                        type="button"
                        className="atlas-button atlas-button-variant-back history-open-btn"
                        onClick={() => onNavigateHistoryTrial(item.trial!.id)}
                      >
                        Reopen
                      </button>
                    </Tooltip>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
