import { useState } from "react";
import HomePage from "./components/HomePage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import BlankPage from "./components/BlankPage";
import TrialPage from "./components/TrialPage";
import TrialMoreDetailsPage from "./components/TrialMoreDetailsPage";
import AllTrialsPage from "./components/AllTrialsPage";
import UserAnalyticsPage from "./components/UserAnalyticsPage";
import "./components/HomeButtons.css";

type AppView =
  | "home"
  | "analytics"
  | "trials"
  | "trial-more-details"
  | "profile"
  | "all-trials";
type ExperienceMode = "clinics" | "participants";

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [experience, setExperience] = useState<ExperienceMode>("participants");

  const pageLabel = `[${experience === "clinics" ? "clinic" : "participant"} - ${view}]`;

  if (view === "home") {
    return (
      <HomePage
        selectedExperience={experience}
        onNavigateProfile={() => setView("profile")}
        onNavigateAnalytics={() => setView("analytics")}
        onNavigateAllTrials={() => setView("all-trials")}
        onNavigateHome={() => setView("home")}
        onSelectExperience={setExperience}
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
        onNavigateMoreDetails={() => setView("trial-more-details")}
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
        onNavigateMoreDetails={() => setView("trial-more-details")}
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
