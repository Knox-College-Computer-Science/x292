import { useEffect, useState } from "react";
import { getTrial, passTrial, saveTrial, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import Tooltip from "./Tooltip";
import TextBox from "./TextBox";
import TrialRating from "./TrialRating";
import "./TrialMoreDetailsPage.css";

type TrialMoreDetailsPageProps = {
  trialId: string | null;
  authToken?: string | null;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

function formatMatchRating(score: number) {
  return `${Math.round(score)}%`;
}

export default function TrialMoreDetailsPage({
  trialId,
  authToken,
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
    null,
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

        const trialData = await getTrial(trialId, authToken ?? undefined);

        if (!ignoreResult) {
          setTrial(trialData);
        }
      } catch (err) {
        if (!ignoreResult) {
          setError(
            err instanceof Error ? err.message : "Could not load trial details",
          );
        }
      } finally {
        if (!ignoreResult) {
          setLoading(false);
        }
      }
    }

    void loadTrialDetails();

    return () => {
      ignoreResult = true;
    };
  }, [authToken, trialId]);

  async function handleTrialAction(action: "save" | "pass") {
    if (!trialId) {
      setActionMessage("No trial selected.");
      return;
    }

    if (!authToken) {
      setActionMessage("Please sign in to save or pass trials.");
      return;
    }

    try {
      setActionLoading(action);
      setActionMessage(null);

      if (action === "save") {
        await saveTrial(trialId, authToken);
        setActionMessage("Trial saved to your account.");
      } else {
        await passTrial(trialId, authToken);
        setActionMessage("Trial marked as passed.");
      }
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Could not update trial.",
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
          <TextBox
            heading="Trial not found"
            body="No trial details were found."
          />
        ) : (
          <>
            <div className="trial-more-details-match-summary">
              <div>
                <h2>{trial.title}</h2>
                <p>
                  {trial.match_reasons && trial.match_reasons.length > 0
                    ? trial.match_reasons.join(", ")
                    : "No match reasons available yet."}
                </p>
              </div>
              {typeof trial.match_score === "number" ? (
                <TrialRating value={formatMatchRating(trial.match_score)} />
              ) : null}
            </div>

            <TextBox
              heading="Study Summary"
              body={
                trial.study_description ??
                "Description not listed by ClinicalTrials.gov."
              }
            />

            <TextBox
              heading="Eligibility + Timeline"
              body={`Eligibility: ${
                trial.eligibility_summary ?? "Not provided"
              }\n\nStart: ${trial.start_date ?? "Not listed"}\nEnd: ${
                trial.end_date ?? "Not listed"
              }\nPhase: ${trial.study_phase ?? "Not listed"}\nRecruitment: ${
                trial.recruitment_status
              }`}
            />

            <TextBox
              heading="Location, Sponsor, Contact"
              body={`Location: ${trial.location}.\nSponsor: ${
                trial.sponsor ?? "Not listed"
              }.\nCompensation: ${
                trial.compensation ??
                "Compensation information is not available."
              }.\nRemote eligible: ${trial.remote_eligible ? "Yes" : "No"}.\nContact/Application: ${
                trial.contact_link ?? "Not listed"
              }`}
            />
          </>
        )}

        <div className="trial-more-details-actions">
          <Tooltip label="Add this trial to your saved applications">
            <button
              type="button"
              className="atlas-button atlas-button-variant-3"
              onClick={() => void handleTrialAction("save")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "save" ? "Saving..." : "Save"}
            </button>
          </Tooltip>

          <Tooltip label="Mark as not interested—you can find it later in your history">
            <button
              type="button"
              className="atlas-button atlas-button-variant-back"
              onClick={() => void handleTrialAction("pass")}
              disabled={actionLoading !== null}
            >
              {actionLoading === "pass" ? "Passing..." : "Pass"}
            </button>
          </Tooltip>

          <Tooltip label="Return to the trial list">
            <button
              type="button"
              className="atlas-button atlas-button-variant-back trial-more-details-back"
              onClick={onNavigateAllTrials}
            >
              Back
            </button>
          </Tooltip>
        </div>

        {actionMessage ? (
          <p className="trial-action-message">{actionMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
