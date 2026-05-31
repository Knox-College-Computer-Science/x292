import HomeNavBar from "./HomeNavBar";
import ClinicTrialCard from "./ClinicTrialCard";
import { createTrial } from "../api";
import { useState } from "react";
import "./ClinicTrialCardPage.css";

type ClinicTrialCardPageProps = {
  authToken: string | null;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSubmitTrial: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ClinicTrialCardPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSubmitTrial,
  onSelectExperience,
}: ClinicTrialCardPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSubmit() {
    const form = document.getElementById(
      "clinic-trial-card-form",
    ) as HTMLFormElement | null;
    if (!form) {
      return;
    }
    if (!authToken) {
      setSaveError("Please sign in before adding a trial.");
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const condition = String(formData.get("condition") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const participationType = String(
      formData.get("participationType") ?? "",
    ).toLowerCase();

    if (!title || !condition || !location) {
      setSaveError("Title, condition, and location are required.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await createTrial(authToken, {
        title,
        condition,
        location,
        study_type: String(formData.get("studyType") ?? "").trim() || null,
        start_date: String(formData.get("date") ?? "").trim() || null,
        compensation: String(formData.get("compensation") ?? "").trim() || null,
        time_commitment:
          String(formData.get("timeCommitment") ?? "").trim() || null,
        remote_eligible: participationType.includes("remote"),
        recruitment_status: "Recruiting",
      });
      onSubmitTrial();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save trial.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="clinic-trial-card-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section
        className="clinic-trial-card-page-content"
        aria-label="Enter trial information"
      >
        <h1 className="clinic-trial-card-page-title">
          Enter trial information:
        </h1>
        <ClinicTrialCard />
        {saveError ? <p className="clinic-trial-card-save-message">{saveError}</p> : null}
        <button
          type="button"
          className="atlas-button atlas-button-variant-3 clinic-trial-card-submit"
          onClick={() => void handleSubmit()}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </section>
    </main>
  );
}
