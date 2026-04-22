import HomeNavBar from "./HomeNavBar";
import "./ClinicMoreAnalyticsPage.css";

type ClinicMoreAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateBack: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ClinicMoreAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateBack,
  onSelectExperience,
}: ClinicMoreAnalyticsPageProps) {
  return (
    <main className="clinic-more-analytics-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section
        className="clinic-more-analytics-content"
        aria-label="Clinic more analytics details"
      >
        <div className="clinic-more-analytics-card">
          <h2 className="clinic-more-analytics-title">Title</h2>

          <div className="clinic-more-analytics-columns">
            <div className="clinic-more-analytics-left">
              <p>Factors of User Rating</p>
              <p>Reasons for disinterest</p>
            </div>
            <div className="clinic-more-analytics-right">
              <p>% interested</p>
              <p># viewers</p>
            </div>
          </div>
        </div>

        <div className="clinic-more-analytics-actions">
          <button
            type="button"
            className="atlas-button atlas-button-variant-back clinic-more-analytics-back"
            onClick={onNavigateBack}
          >
            Back
          </button>
          <button
            type="button"
            className="atlas-button atlas-button-variant-3 clinic-more-analytics-all-trials"
            onClick={onNavigateAllTrials}
          >
            All Trials
          </button>
        </div>
      </section>
    </main>
  );
}
