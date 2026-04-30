import HomeNavBar from "./HomeNavBar";
import LoginComponent from "./LoginComponent";
import "./LoginPage.css";
import { AuthSession, Role } from "../api";

type LoginPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  role: Role;
  initialEmail?: string;
  secondaryLabelText?: string;
  onAuthSuccess: (session: AuthSession, isSignUp: boolean) => void;
};

export default function LoginPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  role,
  initialEmail,
  secondaryLabelText,
  onAuthSuccess,
}: LoginPageProps) {
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

      <section className="login-page-content" aria-label="Log in page">
        <LoginComponent
          role={role}
          initialEmail={initialEmail}
          secondaryLabelText={secondaryLabelText}
          onAuthSuccess={onAuthSuccess}
        />
      </section>
    </main>
  );
}
