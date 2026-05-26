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
  rememberedEmail?: string;
  onAuthenticate: (payload: {
    mode: "sign-in" | "create" | "reset-password";
    email: string;
    password: string;
    organization?: string;
    rememberEmail: boolean;
  }) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function LoginPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  rememberedEmail,
  onAuthenticate,
  isLoading,
  errorMessage,
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
          role="user"
          rememberedEmail={rememberedEmail}
          onAuthenticate={onAuthenticate}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </section>
    </main>
  );
}
