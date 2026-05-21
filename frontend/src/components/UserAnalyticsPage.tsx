import { useEffect, useState } from "react";
import {
  getMyInteractionHistory,
  getTrialAnalyticsStats,
  type InteractionHistoryItem,
  type TrialAnalyticsStats,
} from "../api";
import HomeNavBar from "./HomeNavBar";
import UserAnalyticsCard from "./UserAnalyticsCard";
import "./UserAnalyticsPage.css";

type UserAnalyticsPageProps = {
  authToken?: string;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onNavigateHistoryTrial: (trialId: string) => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function UserAnalyticsPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onNavigateHistoryTrial,
  onSelectExperience,
}: UserAnalyticsPageProps) {
  const [stats, setStats] = useState<TrialAnalyticsStats | null>(null);
  const [history, setHistory] = useState<InteractionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const [statsData, historyData] = await Promise.all([
          getTrialAnalyticsStats(),
          authToken ? getMyInteractionHistory(authToken, ["save", "pass"]) : [],
        ]);

        setStats(statsData);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setError(null);
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Could not load analytics.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAnalytics();
  }, [authToken]);

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
        <UserAnalyticsCard
          stats={stats}
          history={history}
          isLoading={isLoading}
          error={error}
          onNavigateMoreDetails={onNavigateMoreDetails}
          onNavigateHistoryTrial={onNavigateHistoryTrial}
        />
      </section>
    </main>
  );
}
