import "./HomeNavBar.css";

type ExperienceMode = "clinics" | "participants";

type HomeNavBarProps = {
  selectedExperience: ExperienceMode;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateProfile: () => void;
  onNavigateHome: () => void;
  onSelectExperience: (experience: ExperienceMode) => void;
};

export default function HomeNavBar({
  selectedExperience,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateProfile,
  onNavigateHome,
  onSelectExperience,
}: HomeNavBarProps) {
  return (
    <header className="home-nav" aria-label="Primary navigation">
      <button
        type="button"
        className="atlas-button atlas-button-variant-1 nav-home"
        onClick={onNavigateHome}
      >
        Home
      </button>

      <div
        className="experience-select nav-experience"
        role="group"
        aria-label="Experience select"
      >
        <button
          type="button"
          className="atlas-button atlas-button-variant-experience experience-button"
          aria-pressed={selectedExperience === "clinics"}
          onClick={() => onSelectExperience("clinics")}
        >
          Clinics
        </button>
        <button
          type="button"
          className="atlas-button atlas-button-variant-experience experience-button"
          aria-pressed={selectedExperience === "participants"}
          onClick={() => onSelectExperience("participants")}
        >
          Participants
        </button>
      </div>

      <button
        type="button"
        className="atlas-button atlas-button-variant-1 nav-analytics"
        onClick={onNavigateAnalytics}
      >
        Analytics
      </button>
      <button
        type="button"
        className="atlas-button atlas-button-variant-1 nav-trials"
        onClick={onNavigateAllTrials}
      >
        Trials
      </button>
      <button
        type="button"
        className="atlas-button atlas-button-variant-1 nav-profile"
        onClick={onNavigateProfile}
      >
        Profile
      </button>
    </header>
  );
}
