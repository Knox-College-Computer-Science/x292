import HomeNavBar from "./HomeNavBar";
import TrialCard from "./TrialCard";
import "./UserAnalyticsPage.css";

type UserAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function UserAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: UserAnalyticsPageProps) {
  return (
    <main className="user-analytics-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section
        className="user-analytics-page-content"
        aria-label="User analytics"
      >
        <TrialCard onNavigateMoreDetails={onNavigateMoreDetails} />
      </section>
    </main>
  );
}
