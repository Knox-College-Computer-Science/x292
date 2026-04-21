import HomeNavBar from "./HomeNavBar";
import "./AllTrialsPage.css";

type AllTrialsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

// Mock data - can be replaced with backend data later
const upNextTrials = [
  {
    id: 1,
    title: "",
    date: "[00/00/0000]",
  },
];

const statusTrials = [
  {
    id: 1,
    title: "Title",
    date: "[Date, and other info]",
    status: "",
  },
  {
    id: 2,
    title: "",
    date: "",
    status: "",
  },
  {
    id: 3,
    title: "",
    date: "",
    status: "",
  },
  {
    id: 4,
    title: "",
    date: "",
    status: "",
  },
  {
    id: 5,
    title: "",
    date: "",
    status: "",
  },
  {
    id: 6,
    title: "",
    date: "",
    status: "",
  },
];

export default function AllTrialsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: AllTrialsPageProps) {
  return (
    <main className="all-trials-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section className="all-trials-content" aria-label="All trials">
        {/* Up Next Box */}
        <div className="all-trials-up-next">
          <div className="all-trials-up-next-header">Up Next</div>
          {upNextTrials.map((trial, index) => (
            <div
              key={trial.id}
              className={`all-trials-up-next-entry all-trials-up-next-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="all-trials-up-next-title">{trial.title}</div>
              <div className="all-trials-up-next-date">{trial.date}</div>
            </div>
          ))}
        </div>

        {/* Status Box */}
        <div className="all-trials-status">
          <div className="all-trials-status-header">
            <div className="all-trials-status-trial-col">Trial</div>
            <div className="all-trials-status-status-col">Status</div>
          </div>
          {statusTrials.map((trial, index) => (
            <div
              key={trial.id}
              className={`all-trials-status-entry all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="all-trials-status-title">{trial.title}</div>
              <div className="all-trials-status-date-status">
                <div className="all-trials-status-date">{trial.date}</div>
                <div className="all-trials-status-status">{trial.status}</div>
              </div>
              <button
                type="button"
                className="atlas-button all-trials-status-more-details"
                onClick={onNavigateMoreDetails}
              >
                More Info
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
