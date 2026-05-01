import HomeNavBar from "./HomeNavBar";
import Arrows from "./Arrows";
import ClinicAnalyticsCard from "./ClinicAnalyticsCard";
import "./ClinicAnalyticsPage.css";

type ClinicAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ClinicAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: ClinicAnalyticsPageProps) {
  return (
    <main className="clinic-analytics-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section
        className="clinic-analytics-page-content"
        aria-label="Clinic analytics"
      >
        <ClinicAnalyticsCard onNavigateMoreDetails={onNavigateMoreDetails} />
        <div className="clinic-analytics-page-arrows">
          <Arrows />
        </div>
      </section>
    </main>
  );
}
