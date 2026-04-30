import HomeNavBar from "./HomeNavBar";
import "./AllTrialsPage.css";
import { useEffect, useState } from "react";
import { AuthSession, Trial, getPassedTrials, getSavedTrials } from "../api";

type AllTrialsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateFindTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  session: AuthSession;
};

export default function AllTrialsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateFindTrials,
  onNavigateMoreDetails,
  onSelectExperience,
  session,
}: AllTrialsPageProps) {
  const [savedTrials, setSavedTrials] = useState<Trial[]>([]);
  const [passedTrials, setPassedTrials] = useState<Trial[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadAccountTrials() {
      try {
        const [saved, passed] = await Promise.all([
          getSavedTrials(session.userId),
          getPassedTrials(session.userId),
        ]);
        if (isMounted) {
          setSavedTrials(saved);
          setPassedTrials(passed);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your saved trials.",
          );
        }
      }
    }

    loadAccountTrials();
    return () => {
      isMounted = false;
    };
  }, [session.userId]);

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
        {errorMessage ? <p className="all-trials-error">{errorMessage}</p> : null}
        {/* Up Next Box */}
        <div className="all-trials-up-next">
          <div className="all-trials-up-next-header">Saved Trials</div>
          {(savedTrials.length ? savedTrials : [{ id: "none", title: "No saved trials yet", start_date: "" } as Trial]).map((trial, index) => (
            <div
              key={trial.id}
              className={`all-trials-up-next-entry all-trials-up-next-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="all-trials-up-next-title">{trial.title}</div>
              <div className="all-trials-up-next-date">
                {trial.start_date || trial.recruitment_status || ""}
              </div>
            </div>
          ))}
        </div>

        {/* Saved Trials Detail */}
        <div className="all-trials-status">
          <div className="all-trials-status-header">
            <div className="all-trials-status-trial-col">Saved Trial</div>
            <div className="all-trials-status-status-col">Condition</div>
          </div>
          {(savedTrials.length
            ? savedTrials
            : [{ id: "none-status", title: "No saved trials yet", condition: "" } as Trial]
          ).map((trial, index) => (
            <div
              key={trial.id}
              className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="all-trials-status-title">{trial.title}</div>
              <div className="all-trials-status-date">{trial.condition}</div>
              <button
                type="button"
                className="atlas-button all-trials-status-more-details"
                onClick={onNavigateMoreDetails}
              >
                More Info
              </button>
            </div>
          ))}
        </div>

        <div className="all-trials-status">
          <div className="all-trials-status-header">
            <div className="all-trials-status-trial-col">Passed Trial</div>
            <div className="all-trials-status-status-col">Condition</div>
          </div>
          {(passedTrials.length ? passedTrials : [{ id: "none-pass", title: "No passed trials yet", condition: "" } as Trial]).map((trial, index) => (
            <div
              key={trial.id}
              className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="all-trials-status-title">{trial.title}</div>
              <div className="all-trials-status-date">{trial.condition}</div>
              <button
                type="button"
                className="atlas-button all-trials-status-more-details"
                onClick={onNavigateFindTrials}
              >
                Find Similar
              </button>
            </div>
          ))}
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
