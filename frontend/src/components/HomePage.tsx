import HomeCtaSection from "./HomeCtaSection";
import HomeHero from "./HomeHero";
import HomeNavBar from "./HomeNavBar";
import "./HomeButtons.css";
import "./HomePage.css";

type HomePageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function HomePage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
}: HomePageProps) {
  return (
    <main id="home" className="home-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <HomeHero selectedExperience={selectedExperience} />
      <HomeCtaSection />
    </main>
  );
}
