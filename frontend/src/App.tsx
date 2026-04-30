import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ClinicLoginPage from "./components/ClinicLoginPage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import ClinicProfileSetupPage from "./components/ClinicProfileSetupPage";
import ClinicAllTrialsPage from "./components/ClinicAllTrialsPage";
import ClinicTrialCardPage from "./components/ClinicTrialCardPage";
import ClinicAnalyticsPage from "./components/ClinicAnalyticsPage";
import ClinicMoreAnalyticsPage from "./components/ClinicMoreAnalyticsPage";
import BlankPage from "./components/BlankPage";
import TrialPage from "./components/TrialPage";
import TrialMoreDetailsPage from "./components/TrialMoreDetailsPage";
import AllTrialsPage from "./components/AllTrialsPage";
import UserAnalyticsPage from "./components/UserAnalyticsPage";
import "./components/HomeButtons.css";
import {
  AuthSession,
  getRememberedEmail,
  loadSession,
  storeSession,
} from "./api";

type AppView =
  | "home"
  | "login"
  | "analytics"
  | "analytics-result-uses"
  | "clinic-analytics-more"
  | "trials"
  | "trial-more-details"
  | "clinic-trial-card"
  | "profile"
  | "all-trials";
type ExperienceMode = "clinics" | "participants";

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [experience, setExperience] = useState<ExperienceMode>("participants");
  const [session, setSession] = useState<AuthSession | null>(() => loadSession());
  const [rememberedEmail, setRememberedEmail] = useState<string>(() =>
    getRememberedEmail(),
  );
  const [clinicMoreBackView, setClinicMoreBackView] = useState<
    "all-trials" | "clinic-trial-card"
  >("all-trials");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, experience]);

  const pageLabel = `[${experience === "clinics" ? "clinic" : "participant"} - ${view}]`;

  function handleAuthSuccess(authSession: AuthSession, isSignUp: boolean) {
    setSession(authSession);
    setRememberedEmail(authSession.email);
    setExperience(authSession.role === "clinic" ? "clinics" : "participants");

    if (isSignUp) {
      setView("profile");
      return;
    }

    if (authSession.profileCompleted) {
      setView(authSession.role === "clinic" ? "all-trials" : "trials");
    } else {
      setView("profile");
    }
  }

  function markProfileComplete() {
    if (!session) {
      return;
    }
    const nextSession = { ...session, profileCompleted: true };
    setSession(nextSession);
    storeSession(nextSession);
  }

  function requireSession(navigateTo: AppView): boolean {
    if (session) {
      return true;
    }
    setView("login");
    return false;
  }

  if (view === "home") {
    return (
      <HomePage
        selectedExperience={experience}
        onNavigateProfile={() => setView("profile")}
        onNavigateLogin={() => setView("login")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateHome={() => setView("home")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "login" && experience === "participants") {
    return (
      <LoginPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSelectExperience={setExperience}
        role="user"
        initialEmail={rememberedEmail}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (view === "login" && experience === "clinics") {
    return (
      <ClinicLoginPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSelectExperience={setExperience}
        initialEmail={rememberedEmail}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (view === "profile" && experience === "participants") {
    if (!requireSession("profile")) {
      return null;
    }
    const activeSession = session;
    if (!activeSession) {
      return null;
    }
    return (
      <ProfileSetupPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("trials")}
        onSelectExperience={setExperience}
        session={activeSession}
        onProfileSaved={markProfileComplete}
      />
    );
  }

  if (view === "profile" && experience === "clinics") {
    if (!requireSession("profile")) {
      return null;
    }
    return (
      <ClinicProfileSetupPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "trials" && experience === "participants") {
    if (!requireSession("trials")) {
      return null;
    }
    const activeSession = session;
    if (!activeSession) {
      return null;
    }
    return (
      <TrialPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("trial-more-details")}
        onSelectExperience={setExperience}
        session={activeSession}
      />
    );
  }

  if (view === "trial-more-details" && experience === "participants") {
    return (
      <TrialMoreDetailsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "all-trials" && experience === "participants") {
    if (!requireSession("all-trials")) {
      return null;
    }
    const activeSession = session;
    if (!activeSession) {
      return null;
    }
    return (
      <AllTrialsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateFindTrials={() => setView("trials")}
        onNavigateMoreDetails={() => setView("trial-more-details")}
        onSelectExperience={setExperience}
        session={activeSession}
      />
    );
  }

  if (view === "all-trials" && experience === "clinics") {
    return (
      <ClinicAllTrialsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateAddTrials={() => setView("clinic-trial-card")}
        onNavigateMoreDetails={() => {
          setClinicMoreBackView("all-trials");
          setView("clinic-analytics-more");
        }}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "clinic-trial-card" && experience === "clinics") {
    return (
      <ClinicTrialCardPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSubmitTrial={() => setView("all-trials")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "analytics" && experience === "participants") {
    if (!requireSession("analytics")) {
      return null;
    }
    const activeSession = session;
    if (!activeSession) {
      return null;
    }
    return (
      <UserAnalyticsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("analytics-result-uses")}
        onSelectExperience={setExperience}
        session={activeSession}
      />
    );
  }

  if (view === "analytics" && experience === "clinics") {
    return (
      <ClinicAnalyticsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("clinic-analytics-more")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "analytics-result-uses" && experience === "participants") {
    return (
      <BlankPage
        label="Study result uses details (to be filled in by clinic)"
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "clinic-analytics-more" && experience === "clinics") {
    return (
      <ClinicMoreAnalyticsPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateBack={() => setView(clinicMoreBackView)}
        onSelectExperience={setExperience}
      />
    );
  }

  return (
    <BlankPage
      label={pageLabel}
      selectedExperience={experience}
      onNavigateHome={() => setView("home")}
      onNavigateProfile={() => setView("profile")}
      onNavigateAnalytics={() => setView("analytics")}
      onNavigateAllTrials={() => setView("all-trials")}
      onSelectExperience={setExperience}
    />
  );
}
