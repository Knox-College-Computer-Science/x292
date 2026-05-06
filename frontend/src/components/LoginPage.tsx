import HomeNavBar from "./HomeNavBar";
import LoginComponent from "./LoginComponent";
import "./LoginPage.css";

type LoginPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  labelText: string;
  secondaryLabelText?: string;
  onCreateAccount: () => void;
  onNext: () => void;
};

export default function LoginPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  labelText,
  secondaryLabelText,
  onCreateAccount,
  onNext,
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
          labelText={labelText}
          secondaryLabelText={secondaryLabelText}
          onCreateAccount={onCreateAccount}
          onNext={onNext}
        />
      </section>
    </main>
  );
}
