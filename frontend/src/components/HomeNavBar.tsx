import "./HomeNavBar.css";
import Tooltip from "./Tooltip";
import owlIcon from "../assets/owl.png";
import bearIcon from "../assets/bear.png";

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
  const navMascot = selectedExperience === "clinics" ? owlIcon : bearIcon;

  return (
    <header className="home-nav" aria-label="Primary navigation">
      <div className="nav-action nav-home-group">
        <img
          className={`nav-button-icon${selectedExperience === "clinics" ? " nav-button-icon--owl" : ""}`}
          src={navMascot}
          alt=""
          aria-hidden="true"
        />
        <Tooltip label="Return to the homepage">
          <button
            type="button"
            className="atlas-button atlas-button-variant-1 nav-home"
            onClick={onNavigateHome}
          >
            Home
          </button>
        </Tooltip>
      </div>

      <div
        className="experience-select nav-experience"
        role="group"
        aria-label="Experience select"
      >
        <Tooltip label="Switch to clinic administrator view">
          <button
            type="button"
            className="atlas-button atlas-button-variant-experience experience-button"
            aria-pressed={selectedExperience === "clinics"}
            onClick={() => onSelectExperience("clinics")}
          >
            Clinics
          </button>
        </Tooltip>
        <Tooltip label="Switch to participant matching view">
          <button
            type="button"
            className="atlas-button atlas-button-variant-experience experience-button"
            aria-pressed={selectedExperience === "participants"}
            onClick={() => onSelectExperience("participants")}
          >
            Participants
          </button>
        </Tooltip>
      </div>

      <Tooltip label="View analytics and activity stats">
        <button
          type="button"
          className="atlas-button atlas-button-variant-1 nav-analytics"
          onClick={onNavigateAnalytics}
        >
          Analytics
        </button>
      </Tooltip>
      <Tooltip label="Browse all trials">
        <button
          type="button"
          className="atlas-button atlas-button-variant-1 nav-trials"
          onClick={onNavigateAllTrials}
        >
          Trials
        </button>
      </Tooltip>
      <Tooltip label="View or edit your profile settings">
        <button
          type="button"
          className="atlas-button atlas-button-variant-1 nav-profile"
          onClick={onNavigateProfile}
        >
          Profile
        </button>
      </Tooltip>
    </header>
  );
}
