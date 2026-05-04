import { useEffect, useState } from "react";
import { getTrialAnalyticsStats, type TrialAnalyticsStats } from "../api";
import HomeNavBar from "./HomeNavBar";
import Arrows from "./Arrows";
import UserAnalyticsCard from "./UserAnalyticsCard";
import "./UserAnalyticsPage.css";

type UserAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function UserAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: UserAnalyticsPageProps) {
  const [stats, setStats] = useState<TrialAnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrialAnalyticsStats()
      .then((data) => {
        setStats(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load analytics stats:", err);
        setError("Could not load analytics.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
          isLoading={isLoading}
          error={error}
          onNavigateMoreDetails={onNavigateMoreDetails}
        />

        <div className="user-analytics-page-arrows">
          <Arrows />
        </div>
      </section>
    </main>
  );
}
