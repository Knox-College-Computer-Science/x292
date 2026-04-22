import HomeNavBar from "./HomeNavBar";
import ClinicTrialCard from "./ClinicTrialCard";
import "./ClinicTrialCardPage.css";

type ClinicTrialCardPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSubmitTrial: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ClinicTrialCardPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSubmitTrial,
  onSelectExperience,
}: ClinicTrialCardPageProps) {
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
        <button
          type="submit"
          form="clinic-trial-card-form"
          className="atlas-button atlas-button-variant-3 clinic-trial-card-submit"
          onClick={onSubmitTrial}
        >
          Submit
        </button>
      </section>
    </main>
  );
}
