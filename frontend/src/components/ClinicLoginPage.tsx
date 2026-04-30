import HomeNavBar from "./HomeNavBar";
import ClinicLoginComponent from "./ClinicLoginComponent";
import "./LoginPage.css";
import { AuthSession } from "../api";

type ClinicLoginPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  initialEmail?: string;
  onAuthSuccess: (session: AuthSession, isSignUp: boolean) => void;
};

export default function ClinicLoginPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  initialEmail,
  onAuthSuccess,
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
          initialEmail={initialEmail}
          onAuthSuccess={onAuthSuccess}
        />
      </section>
    </main>
  );
}
