import { useEffect, useMemo, useRef, useState } from "react";
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

type StoredNavigationState = {
  view: AppView;
  experience: ExperienceMode;
  selectedTrialId: string | null;
  clinicMoreBackView: "analytics" | "all-trials" | "clinic-trial-card";
};

const SESSION_STORAGE_KEY = "atlas_session";
const REMEMBERED_EMAIL_KEY = "atlas_remembered_email";
const NAVIGATION_STORAGE_KEY = "atlas_navigation";
const APP_VIEWS: AppView[] = [
  "home",
  "login",
  "analytics",
  "analytics-result-uses",
  "clinic-analytics-more",
  "trials",
  "trial-more-details",
  "clinic-trial-card",
  "profile",
  "all-trials",
];

function isAppView(value: string): value is AppView {
  return APP_VIEWS.includes(value as AppView);
}

function isExperienceMode(value: string): value is ExperienceMode {
  return value === "clinics" || value === "participants";
}

function isClinicBackView(
  value: string,
): value is "analytics" | "all-trials" | "clinic-trial-card" {
  return (
    value === "analytics" ||
    value === "all-trials" ||
    value === "clinic-trial-card"
  );
}

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

function readStoredNavigation(): StoredNavigationState | null {
  const raw = window.localStorage.getItem(NAVIGATION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return parseNavigationState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function persistNavigation(state: StoredNavigationState) {
  window.localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(state));
}

function parseNavigationState(value: unknown): StoredNavigationState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const parsed = value as Partial<StoredNavigationState>;
  if (
    !parsed.view ||
    !parsed.experience ||
    !parsed.clinicMoreBackView ||
    !isAppView(parsed.view) ||
    !isExperienceMode(parsed.experience) ||
    !isClinicBackView(parsed.clinicMoreBackView)
  ) {
    return null;
  }

  return {
    view: parsed.view,
    experience: parsed.experience,
    selectedTrialId:
      typeof parsed.selectedTrialId === "string"
        ? parsed.selectedTrialId
        : null,
    clinicMoreBackView: parsed.clinicMoreBackView,
  };
}

function readInitialNavigation(): StoredNavigationState | null {
  const fromPath = readNavigationFromPath(window.location.pathname);
  if (fromPath) {
    return fromPath;
  }

  const fromHistory = parseNavigationState(window.history.state);
  if (fromHistory) {
    return fromHistory;
  }
  return readStoredNavigation();
}

function isSameNavigationState(
  left: StoredNavigationState,
  right: StoredNavigationState,
): boolean {
  return (
    left.view === right.view &&
    left.experience === right.experience &&
    left.selectedTrialId === right.selectedTrialId &&
    left.clinicMoreBackView === right.clinicMoreBackView
  );
}

function buildPathFromNavigation(state: StoredNavigationState): string {
  if (state.view === "home") {
    return "/";
  }

  if (state.experience === "clinics") {
    if (state.view === "login") {
      return "/clinic/login";
    }
    if (state.view === "profile") {
      return "/clinic/profile";
    }
    if (state.view === "analytics") {
      return "/clinic/analytics";
    }
    if (state.view === "clinic-analytics-more") {
      return "/clinic/analytics/more";
    }
    if (state.view === "all-trials") {
      return "/clinic/trials";
    }
    if (state.view === "clinic-trial-card") {
      return "/clinic/trials/new";
    }
    return "/clinic";
  }

  if (state.view === "login") {
    return "/participant/login";
  }
  if (state.view === "profile") {
    return "/participant/profile";
  }
  if (state.view === "analytics") {
    return "/participant/analytics";
  }
  if (state.view === "analytics-result-uses") {
    return "/participant/analytics/results";
  }
  if (state.view === "trials") {
    return "/participant/trials/swipe";
  }
  if (state.view === "all-trials") {
    return "/participant/trials/all";
  }
  if (state.view === "trial-more-details") {
    return state.selectedTrialId
      ? `/participant/trials/${encodeURIComponent(state.selectedTrialId)}`
      : "/participant/trials/details";
  }

  return "/participant";
}

function readNavigationFromPath(
  pathname: string,
): StoredNavigationState | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const segments = normalizedPath.split("/").filter(Boolean);

  if (normalizedPath === "/") {
    return {
      view: "home",
      experience: "participants",
      selectedTrialId: null,
      clinicMoreBackView: "all-trials",
    };
  }

  if (segments[0] === "clinic") {
    if (segments.length === 1) {
      return {
        view: "home",
        experience: "clinics",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "login") {
      return {
        view: "login",
        experience: "clinics",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "profile") {
      return {
        view: "profile",
        experience: "clinics",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "analytics") {
      if (segments[2] === "more") {
        return {
          view: "clinic-analytics-more",
          experience: "clinics",
          selectedTrialId: null,
          clinicMoreBackView: "analytics",
        };
      }

      return {
        view: "analytics",
        experience: "clinics",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "trials") {
      if (segments[2] === "new") {
        return {
          view: "clinic-trial-card",
          experience: "clinics",
          selectedTrialId: null,
          clinicMoreBackView: "all-trials",
        };
      }

      return {
        view: "all-trials",
        experience: "clinics",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }
  }

  if (segments[0] === "participant") {
    if (segments.length === 1) {
      return {
        view: "home",
        experience: "participants",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "login") {
      return {
        view: "login",
        experience: "participants",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "profile") {
      return {
        view: "profile",
        experience: "participants",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "analytics") {
      if (segments[2] === "results") {
        return {
          view: "analytics-result-uses",
          experience: "participants",
          selectedTrialId: null,
          clinicMoreBackView: "all-trials",
        };
      }

      return {
        view: "analytics",
        experience: "participants",
        selectedTrialId: null,
        clinicMoreBackView: "all-trials",
      };
    }

    if (segments[1] === "trials") {
      if (segments[2] === "all") {
        return {
          view: "all-trials",
          experience: "participants",
          selectedTrialId: null,
          clinicMoreBackView: "all-trials",
        };
      }

      if (segments[2] === "swipe") {
        return {
          view: "trials",
          experience: "participants",
          selectedTrialId: null,
          clinicMoreBackView: "all-trials",
        };
      }

      if (segments[2] === "details") {
        return {
          view: "trial-more-details",
          experience: "participants",
          selectedTrialId: null,
          clinicMoreBackView: "all-trials",
        };
      }

      if (segments[2]) {
        return {
          view: "trial-more-details",
          experience: "participants",
          selectedTrialId: decodeURIComponent(segments[2]),
          clinicMoreBackView: "all-trials",
        };
      }
    }
  }

  return null;
}

export default function App() {
  const initialNavigation = useMemo(() => readInitialNavigation(), []);
  const [view, setView] = useState<AppView>(initialNavigation?.view ?? "home");
  const [selectedTrialId, setSelectedTrialId] = useState<string | null>(
    initialNavigation?.selectedTrialId ?? null,
  );
  const [experience, setExperience] = useState<ExperienceMode>(
    initialNavigation?.experience ?? "participants",
  );
  const [clinicMoreBackView, setClinicMoreBackView] = useState<
    "analytics" | "all-trials" | "clinic-trial-card"
  >(initialNavigation?.clinicMoreBackView ?? "all-trials");
  const [session, setSession] = useState<SessionState | null>(() =>
    readStoredSession(),
  );
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const rememberedEmail = useMemo(
    () => window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? undefined,
    [],
  );
  const hasSyncedHistoryRef = useRef(false);
  const isApplyingPopStateRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, experience]);

  useEffect(() => {
    const navigationState: StoredNavigationState = {
      view,
      experience,
      selectedTrialId,
      clinicMoreBackView,
    };
    const nextPath = buildPathFromNavigation(navigationState);

    persistNavigation(navigationState);

    if (!hasSyncedHistoryRef.current) {
      window.history.replaceState(navigationState, "", nextPath);
      hasSyncedHistoryRef.current = true;
      return;
    }

    if (isApplyingPopStateRef.current) {
      isApplyingPopStateRef.current = false;
      window.history.replaceState(navigationState, "", nextPath);
      return;
    }

    const currentHistoryState = parseNavigationState(window.history.state);
    if (
      currentHistoryState &&
      isSameNavigationState(currentHistoryState, navigationState) &&
      window.location.pathname === nextPath
    ) {
      return;
    }

    window.history.pushState(navigationState, "", nextPath);
  }, [view, experience, selectedTrialId, clinicMoreBackView]);

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      const nextNavigation =
        parseNavigationState(event.state) ??
        readNavigationFromPath(window.location.pathname);
      if (!nextNavigation) {
        return;
      }

      isApplyingPopStateRef.current = true;
      setView(nextNavigation.view);
      setExperience(nextNavigation.experience);
      setSelectedTrialId(nextNavigation.selectedTrialId);
      setClinicMoreBackView(nextNavigation.clinicMoreBackView);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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
        error instanceof Error ? error.message : "Could not authenticate.",
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
        onNavigateMoreDetails={() => {
          setClinicMoreBackView("analytics");
          setView("clinic-analytics-more");
        }}
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
