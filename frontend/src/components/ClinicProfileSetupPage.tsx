import HomeNavBar from "./HomeNavBar";
import ClinicProfileSetupCard from "./ClinicProfileSetupCard";
import { createClinicProfile } from "../api";
import { useState } from "react";
import "./ClinicProfileSetupPage.css";

type ClinicProfileSetupPageProps = {
  authToken: string | null;
  accountEmail: string | null;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  onLogout?: () => void;
};

export default function ClinicProfileSetupPage({
  authToken,
  accountEmail,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  onLogout,
}: ClinicProfileSetupPageProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSubmit() {
    const form = document.getElementById(
      "clinic-profile-setup-form",
    ) as HTMLFormElement | null;
    if (!form) {
      return;
    }
    if (!authToken) {
      setSaveError("Please sign in before saving your clinic profile.");
      return;
    }

    const formData = new FormData(form);
    const clinicName = String(formData.get("organizationName") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const contactEmail = String(
      formData.get("contactEmail") ?? accountEmail ?? "",
    ).trim();

    if (!clinicName || !location || !contactEmail) {
      setSaveError("Organization name, contact email, and location are required.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await createClinicProfile(authToken, {
        clinic_name: clinicName,
        contact_email: contactEmail,
        contact_person: String(formData.get("contactPerson") ?? "").trim() || null,
        contact_phone: String(formData.get("contactPhone") ?? "").trim() || null,
        location,
        sponsor_institution:
          String(formData.get("preferences") ?? "").trim() || null,
      });
      onNavigateAllTrials();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Could not save clinic profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="clinic-profile-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      {onLogout ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px 16px",
          }}
        >
          <button
            type="button"
            className="atlas-button atlas-button-variant-back"
            onClick={() => onLogout()}
          >
            Log out
          </button>
        </div>
      ) : null}
      <section
        className="clinic-profile-page-content"
        aria-label="Clinic profile setup"
      >
        <p className="clinic-profile-page-intro">
          Please enter your organization information:
        </p>
        <ClinicProfileSetupCard defaultContactEmail={accountEmail} />
        {saveError ? <p className="clinic-profile-save-message">{saveError}</p> : null}
        <button
          type="button"
          className="atlas-button atlas-button-variant-3 clinic-profile-submit-button"
          onClick={() => void handleSubmit()}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </section>
    </main>
  );
}
