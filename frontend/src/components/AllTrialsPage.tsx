import { useEffect, useState } from "react";
import { listTrials, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import "./AllTrialsPage.css";



type AllTrialsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateFindTrials: () => void;
  onNavigateMoreDetails: (trialId: string) => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

// this is the temp default search item
const DEFAULT_CONDITION = "diabetes";

// This combines separate backend fields into one readable line for the Status column.
function formatTrialMeta(trial: Trial) {
  const status = trial.recruitment_status || "Status not listed";
  const date = trial.start_date ? `Starts ${trial.start_date}` : "Date not listed";
  const location = trial.location || "Location not listed";

  return `${status} - ${date} - ${location}`;
  // Return one combined string for the frontend to display.
}

export default function AllTrialsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateFindTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: AllTrialsPageProps) {
  const [trials, setTrials] = useState<Trial[]>([]);
  // trials stores the list returned by the backend; setTrials updates that list.

  const [loading, setLoading] = useState(true);
  // trials stores the list returned by the backend; setTrials updates that list.

  const [error, setError] = useState<string | null>(null);
  // error stores an error message if the backend request fails.




  // Run this code once when the All Trials page first opens.
  useEffect(() => {
    let ignoreResult = false;
    // Prevents state updates if the user leaves the page before the request finishes.


    async function loadTrials() {
      // Async function because backend requests take time.
      try {
        setLoading(true);
        setError(null);
        const trialData = await listTrials(DEFAULT_CONDITION);
        // Call the backend through api.ts and wait for the trial data.

        if (!ignoreResult) {
          // Save the backend response into React state so the page can display it.
          setTrials(trialData);
        }
      } catch (err) {
        if (!ignoreResult) {
          setError(err instanceof Error ? err.message : "Could not load trials");
        }
      } finally {
        if (!ignoreResult) {
          setLoading(false);
        }
      }
    }

    loadTrials();
    //actually starts loading trials
    return () => {
      ignoreResult = true;
    };
  }, []);

  const upNextTrials = trials.slice(0, 1);
  const statusTrials = trials.slice(0, 7);

  return (
    <main className="all-trials-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section className="all-trials-content" aria-label="All trials">
        {/* Up Next Box */}
        <div className="all-trials-up-next">
          <div className="all-trials-up-next-header">Up Next</div>
          {loading ? (
            <div className="all-trials-message-row">Loading trials...</div>
          ) : error ? (
            <div className="all-trials-message-row">{error}</div>
          ) : upNextTrials.length === 0 ? (
            <div className="all-trials-message-row">No trials found.</div>
          ) : (
            upNextTrials.map((trial, index) => (
              <div
                key={trial.id}
                className={`all-trials-up-next-entry all-trials-up-next-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
              >
                <div className="all-trials-up-next-title">{trial.title}</div>
                <div className="all-trials-up-next-date">
                  {trial.start_date ?? "Date not listed"}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status Box */}
        <div className="all-trials-status">
          <div className="all-trials-status-header">
            <div className="all-trials-status-trial-col">Trial</div>
            <div className="all-trials-status-status-col">Status</div>
          </div>
          {loading ? (
            <div className="all-trials-message-row">Loading trials...</div>
          ) : error ? (
            <div className="all-trials-message-row">{error}</div>
          ) : statusTrials.length === 0 ? (
            <div className="all-trials-message-row">No trials found.</div>
          ) : (
            statusTrials.map((trial, index) => (
              <div
                key={trial.id}
                className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
              >
                <div className="all-trials-status-title">{trial.title}</div>
                <div className="all-trials-status-date">
                  {formatTrialMeta(trial)}
                </div>
                <button
                  type="button"
                  className="atlas-button all-trials-status-more-details"
                  onClick={() => onNavigateMoreDetails(trial.id)}
                >
                  More Info
                </button>
              </div>
            ))
          )}
        </div>

        <div className="all-trials-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-back all-trials-back"
            onClick={onNavigateFindTrials}
          >
            Back
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 all-trials-find-trials"
            onClick={onNavigateFindTrials}
          >
            Find Trials
          </button>
        </div>
      </section>
    </main>
  );
}
