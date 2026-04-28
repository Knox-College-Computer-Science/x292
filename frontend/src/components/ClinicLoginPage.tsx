import HomeNavBar from "./HomeNavBar";
import ClinicLoginComponent from "./ClinicLoginComponent";
import "./LoginPage.css";

type ClinicLoginPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  onCreateAccount: () => void;
  onNext: () => void;
};

export default function ClinicLoginPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  onCreateAccount,
  onNext,
}: ClinicLoginPageProps) {
  return (
    <main className="login-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />

      <section className="login-page-content" aria-label="Clinic log in page">
        <ClinicLoginComponent
          onCreateAccount={onCreateAccount}
          onNext={onNext}
        />
      </section>
    </main>
  );
}
