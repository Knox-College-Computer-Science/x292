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
  rememberedEmail?: string;
  onAuthenticate: (payload: {
    mode: "sign-in" | "create";
    email: string;
    password: string;
    organization?: string;
    rememberEmail: boolean;
  }) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function ClinicLoginPage({
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
          rememberedEmail={rememberedEmail}
          onAuthenticate={onAuthenticate}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </section>
    </main>
  );
}
