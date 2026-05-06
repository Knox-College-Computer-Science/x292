import HomeNavBar from "./HomeNavBar";
import TrialCard from "./TrialCard";
import Arrows from "./Arrows";
import "./TrialPage.css";

type TrialPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function TrialPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: TrialPageProps) {
  return (
    <main className="trial-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section className="trial-page-content" aria-label="Trial details">
        <TrialCard onNavigateMoreDetails={onNavigateMoreDetails} />
        <div className="trial-page-controls">
          <div className="trial-page-actions">
            <button
              type="button"
              className="atlas-button atlas-button-variant-back trial-page-back"
              onClick={onNavigateProfile}
            >
              Back
            </button>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3 trial-page-all-trials"
              onClick={onNavigateAllTrials}
            >
              All Trials
            </button>
          </div>
          <div className="trial-page-arrows">
            <Arrows />
          </div>
          <div className="trial-page-controls-spacer" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
