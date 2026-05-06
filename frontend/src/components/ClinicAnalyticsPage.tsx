import { useEffect, useState } from "react";
import { getTrialAnalyticsStats, type TrialAnalyticsStats } from "../api";
import HomeNavBar from "./HomeNavBar";
import Arrows from "./Arrows";
import ClinicAnalyticsCard from "./ClinicAnalyticsCard";
import "./ClinicAnalyticsPage.css";

type ClinicAnalyticsPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function ClinicAnalyticsPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: ClinicAnalyticsPageProps) {
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
        console.error("Failed to load clinic analytics stats:", err);
        setError("Could not load analytics.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <main className="clinic-analytics-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section
        className="clinic-analytics-page-content"
        aria-label="Clinic analytics"
      >
        <ClinicAnalyticsCard
          stats={stats}
          isLoading={isLoading}
          error={error}
          onNavigateMoreDetails={onNavigateMoreDetails}
        />
        <div className="clinic-analytics-page-arrows">
          <Arrows />
        </div>
      </section>
    </main>
  );
}
