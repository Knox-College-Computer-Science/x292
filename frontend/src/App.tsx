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
  const [clinicMoreBackView, setClinicMoreBackView] = useState<
    "all-trials" | "clinic-trial-card"
  >("all-trials");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, experience]);

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
        labelText="Sign in"
        onCreateAccount={() => setView("profile")}
        onNext={() => setView("profile")}
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
        onCreateAccount={() => setView("profile")}
        onNext={() => setView("profile")}
      />
    );
  }

  if (view === "profile" && experience === "participants") {
    return (
      <ProfileSetupPage
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("trials")}
        onSelectExperience={setExperience}
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
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("trial-more-details")}
        onSelectExperience={setExperience}
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
        selectedExperience={experience}
        onNavigateHome={() => setView("home")}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateMoreDetails={() => setView("analytics-result-uses")}
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
