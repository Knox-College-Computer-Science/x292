import HomeNavBar from "./HomeNavBar";
import ProfileSetupCard from "./ProfileSetupCard";
import "./ProfileSetupPage.css";

type ProfileSetupPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ProfileSetupPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
}: ProfileSetupPageProps) {
  return (
    <main className="profile-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section className="profile-page-content" aria-label="Profile setup">
        <p className="profile-page-intro">
          Please let us know your preferences:
        </p>
        <ProfileSetupCard />
        <button
          type="submit"
          form="profile-setup-form"
          className="atlas-button atlas-button-variant-3 profile-submit-button"
          onClick={onNavigateAllTrials}
        >
          Submit
        </button>
      </section>
    </main>
  );
}
