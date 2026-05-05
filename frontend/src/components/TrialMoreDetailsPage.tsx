import { useEffect, useState } from "react";
import { getTrial, passTrial, saveTrial, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import TextBox from "./TextBox";
import "./TrialMoreDetailsPage.css";

type TrialMoreDetailsPageProps = {
  trialId: string | null;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

const TEMP_USER_ID = "demo-user";

export default function TrialMoreDetailsPage({
  trialId,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
}: TrialMoreDetailsPageProps) {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"save" | "pass" | null>(
    null
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignoreResult = false;

    async function loadTrialDetails() {
      if (!trialId) {
        setError("No trial selected.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const trialData = await getTrial(trialId);

        if (!ignoreResult) {
          setTrial(trialData);
        }
      } catch (err) {
        if (!ignoreResult) {
          setError(
            err instanceof Error ? err.message : "Could not load trial details"
          );
        }
      } finally {
        if (!ignoreResult) {
          setLoading(false);
        }
      }
    }

    loadTrialDetails();

    return () => {
      ignoreResult = true;
    };
  }, [trialId]);

  async function handleTrialAction(action: "save" | "pass") {
    if (!trialId) {
      setActionMessage("No trial selected.");
      return;
    }

    try {
      setActionLoading(action);
      setActionMessage(null);

      if (action === "save") {
        await saveTrial(trialId, TEMP_USER_ID);
        setActionMessage("Trial saved.");
      } else {
        await passTrial(trialId, TEMP_USER_ID);
        setActionMessage("Trial passed.");
      }
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Could not update trial."
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="trial-more-details-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section
        className="trial-more-details-content"
        aria-label="Trial more details"
      >
        {loading ? (
          <TextBox
            heading="Loading trial details"
            body="Please wait while the trial information loads."
          />
        ) : error ? (
          <TextBox heading="Could not load trial" body={error} />
        ) : !trial ? (
          <TextBox heading="Trial not found" body="No trial details were found." />
        ) : (
          <>
            <TextBox
              heading="About the Organization"
              body={trial.sponsor ?? "Sponsor not listed."}
            />

            <TextBox
              heading={trial.title}
              body={
                trial.study_description ??
                trial.eligibility_summary ??
                "Description not listed."
              }
            />

            <TextBox
              heading="Before you arrive"
              body={`Location: ${trial.location}. Duration: ${
                trial.duration ?? "Not listed"
              }. Visit frequency: ${
                trial.visit_frequency ?? "Not listed"
              }. Compensation: ${trial.compensation ?? "Not listed"}.`}
            />
          </>
        )}

        <div className="trial-more-details-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-3"
            onClick={() => handleTrialAction("save")}
            disabled={actionLoading !== null}
          >
            {actionLoading === "save" ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className="atlas-button atlas-button-variant-back"
            onClick={() => handleTrialAction("pass")}
            disabled={actionLoading !== null}
          >
            {actionLoading === "pass" ? "Passing..." : "Pass"}
          </button>

          <button
            type="button"
            className="atlas-button atlas-button-variant-back trial-more-details-back"
            onClick={onNavigateAllTrials}
          >
            Back
          </button>

          <button
            type="button"
            className="atlas-button atlas-button-variant-3 trial-more-details-all-trials"
            onClick={onNavigateAllTrials}
          >
            All Trials
          </button>
        </div>

        {actionMessage ? <p>{actionMessage}</p> : null}
      </section>
    </main>
  );
}
