import HomeNavBar from "./HomeNavBar";
import TextBox from "./TextBox";
import "./TrialMoreDetailsPage.css";

type TrialMoreDetailsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function TrialMoreDetailsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
}: TrialMoreDetailsPageProps) {
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
        <TextBox
          heading="About the Organization"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet mauris vitae erat feugiat dictum."
        />
        <TextBox
          heading="About the Trial"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae."
        />
        <TextBox
          heading="Before you arrive"
          body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat, mauris sit amet dapibus gravida, eros lorem ullamcorper arcu, in dictum turpis tortor eget nisl."
        />

        <div className="trial-more-details-actions">
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
      </section>
    </main>
  );
}
