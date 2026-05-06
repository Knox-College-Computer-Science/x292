import { useEffect, useMemo, useState } from "react";
import { loginUser, registerUser, type UserProfile } from "./api";
import AllTrialsPage from "./components/AllTrialsPage";
import BlankPage from "./components/BlankPage";
import ClinicAllTrialsPage from "./components/ClinicAllTrialsPage";
import ClinicAnalyticsPage from "./components/ClinicAnalyticsPage";
import ClinicLoginPage from "./components/ClinicLoginPage";
import ClinicMoreAnalyticsPage from "./components/ClinicMoreAnalyticsPage";
import ClinicProfileSetupPage from "./components/ClinicProfileSetupPage";
import ClinicTrialCardPage from "./components/ClinicTrialCardPage";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import TrialMoreDetailsPage from "./components/TrialMoreDetailsPage";
import TrialPage from "./components/TrialPage";
import UserAnalyticsPage from "./components/UserAnalyticsPage";
import "./components/HomeButtons.css";

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

type SessionState = {
  token: string;
  userId: string;
  email: string;
  role: "user" | "clinic" | "admin";
  profileCompleted: boolean;
};

const SESSION_STORAGE_KEY = "atlas_session";
const REMEMBERED_EMAIL_KEY = "atlas_remembered_email";

function readStoredSession(): SessionState | null {
  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}

function persistSession(session: SessionState | null) {
  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [selectedTrialId, setSelectedTrialId] = useState<string | null>(null);
  const [experience, setExperience] = useState<ExperienceMode>("participants");
  const [clinicMoreBackView, setClinicMoreBackView] = useState<
    "all-trials" | "clinic-trial-card"
  >("all-trials");
  const [session, setSession] = useState<SessionState | null>(() =>
    readStoredSession()
  );
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const rememberedEmail = useMemo(
    () => window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? undefined,
    []
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, experience]);

  async function handleAuthenticate(payload: {
    mode: "sign-in" | "create";
    email: string;
    password: string;
    rememberEmail: boolean;
  }) {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const role = experience === "clinics" ? "clinic" : "user";
      const response =
        payload.mode === "create"
          ? await registerUser(payload.email, payload.password, role)
          : await loginUser(payload.email, payload.password);

      const nextSession: SessionState = {
        token: response.access_token,
        userId: response.user_id,
        email: payload.email,
        role: response.role,
        profileCompleted: response.profile_completed,
      };

      setSession(nextSession);
      persistSession(nextSession);

      if (payload.rememberEmail) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, payload.email);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      if (payload.mode === "create" || !response.profile_completed) {
        setView("profile");
      } else {
        setView("all-trials");
      }
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Could not authenticate."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function handleProfileSaved(profile: UserProfile) {
    const current = session;
    if (!current) {
      return;
    }

    const next = {
      ...current,
      profileCompleted: profile.profile_completed,
    };

    setSession(next);
    persistSession(next);
  }

  const pageLabel = `[${experience === "clinics" ? "clinic" : "participant"} - ${view}]`;

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
        rememberedEmail={rememberedEmail}
        onAuthenticate={handleAuthenticate}
        isLoading={authLoading}
        errorMessage={authError}
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
        rememberedEmail={rememberedEmail}
        onAuthenticate={handleAuthenticate}
        isLoading={authLoading}
        errorMessage={authError}
      />
    );
  }

  if (view === "profile" && experience === "participants") {
    return (
      <ProfileSetupPage
        authToken={session?.token ?? null}
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("trials")}
        onNavigateLogin={() => setView("login")}
        onSelectExperience={setExperience}
        onProfileSaved={handleProfileSaved}
      />
    );
  }

  if (view === "profile" && experience === "clinics") {
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
    return (
      <TrialPage
        authToken={session?.token}
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={(trialId) => {
          setSelectedTrialId(trialId);
          setView("trial-more-details");
        }}
        onSelectExperience={setExperience}
      />
    );
  }

  if (view === "trial-more-details" && experience === "participants") {
    return (
      <TrialMoreDetailsPage
        trialId={selectedTrialId}
        authToken={session?.token}
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
    return (
      <AllTrialsPage
        authToken={session?.token}
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateFindTrials={() => setView("trials")}
        onNavigateMoreDetails={(trialId) => {
          setSelectedTrialId(trialId);
          setView("trial-more-details");
        }}
        onSelectExperience={setExperience}
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
    return (
      <UserAnalyticsPage
        authToken={session?.token}
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("analytics-result-uses")}
        onNavigateHistoryTrial={(trialId) => {
          setSelectedTrialId(trialId);
          setView("trial-more-details");
        }}
        onSelectExperience={setExperience}
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
