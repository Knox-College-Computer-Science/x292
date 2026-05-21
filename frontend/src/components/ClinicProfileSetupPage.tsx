import HomeNavBar from "./HomeNavBar";
import ClinicProfileSetupCard from "./ClinicProfileSetupCard";
import "./ClinicProfileSetupPage.css";

type ClinicProfileSetupPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  onLogout?: () => void;
};

export default function ClinicProfileSetupPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  onLogout,
}: ClinicProfileSetupPageProps) {
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
        <ClinicProfileSetupCard />
        <button
          type="submit"
          form="clinic-profile-setup-form"
          className="atlas-button atlas-button-variant-3 clinic-profile-submit-button"
          onClick={onNavigateAllTrials}
        >
          Submit
        </button>
      </section>
    </main>
  );
}
