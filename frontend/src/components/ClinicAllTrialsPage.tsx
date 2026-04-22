import HomeNavBar from "./HomeNavBar";
import "./ClinicAllTrialsPage.css";

type ClinicAllTrialsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateAddTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

const statusTrials = [
  { id: 1, title: "Title", date: "[Date, and other info]" },
  { id: 2, title: "Title", date: "[Date, and other info]" },
  { id: 3, title: "Title", date: "[Date, and other info]" },
  { id: 4, title: "Title", date: "[Date, and other info]" },
  { id: 5, title: "Title", date: "[Date, and other info]" },
  { id: 6, title: "Title", date: "[Date, and other info]" },
  { id: 7, title: "Title", date: "[Date, and other info]" },
];

export default function ClinicAllTrialsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateAddTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: ClinicAllTrialsPageProps) {
  return (
    <main className="clinic-all-trials-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section
        className="clinic-all-trials-content"
        aria-label="Clinic all trials"
      >
        <div className="clinic-all-trials-status">
          <div className="clinic-all-trials-status-header">
            <div className="clinic-all-trials-status-trial-col">Trial</div>
            <div className="clinic-all-trials-status-status-col">Status</div>
          </div>
          {statusTrials.map((trial, index) => (
            <div
              key={trial.id}
              className={`clinic-all-trials-status-entry clinic-all-trials-status-entry-${index % 2 === 0 ? "accent-40" : "accent-30"}`}
            >
              <div className="clinic-all-trials-status-title">
                {trial.title}
              </div>
              <div className="clinic-all-trials-status-date">{trial.date}</div>
              <button
                type="button"
                className="atlas-button clinic-all-trials-status-more-details"
                onClick={onNavigateMoreDetails}
              >
                More Info
              </button>
            </div>
          ))}
        </div>

        <div className="clinic-all-trials-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-back clinic-all-trials-back"
            onClick={onNavigateProfile}
          >
            Back
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 clinic-all-trials-add-trials"
            onClick={onNavigateAddTrials}
          >
            Add Trials
          </button>
        </div>
      </section>
    </main>
  );
}
