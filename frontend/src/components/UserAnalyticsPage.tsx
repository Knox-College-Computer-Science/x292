import HomeNavBar from "./HomeNavBar";
import Arrows from "./Arrows";
import UserAnalyticsCard from "./UserAnalyticsCard";
import "./UserAnalyticsPage.css";
import { useEffect, useState } from "react";
import { AuthSession, UserSummary, getUserSummary } from "../api";

type UserAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  session: AuthSession;
};

export default function UserAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
  session,
}: UserAnalyticsPageProps) {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadSummary() {
      try {
        const result = await getUserSummary(session.userId);
        if (isMounted) {
          setSummary(result);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load analytics.",
          );
        }
      }
    }

    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [session.userId]);

  return (
    <main className="user-analytics-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section
        className="user-analytics-page-content"
        aria-label="User analytics"
      >
        {errorMessage ? <p className="user-analytics-page-error">{errorMessage}</p> : null}
        <UserAnalyticsCard
          summary={summary}
          onNavigateMoreDetails={onNavigateMoreDetails}
        />
        <div className="user-analytics-page-arrows">
          <Arrows />
        </div>
      </section>
    </main>
  );
}
