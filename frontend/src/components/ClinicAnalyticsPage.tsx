import HomeNavBar from "./HomeNavBar";
import Arrows from "./Arrows";
import ClinicAnalyticsCard from "./ClinicAnalyticsCard";
import "./ClinicAnalyticsPage.css";
import { useEffect, useState } from "react";
import { TrialAnalytics, getTrialAnalytics } from "../api";

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
  const [analytics, setAnalytics] = useState<TrialAnalytics | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadAnalytics() {
      try {
        const result = await getTrialAnalytics();
        if (isMounted) {
          setAnalytics(result);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load analytics.",
          );
        }
      }
    }

    loadAnalytics();
    return () => {
      isMounted = false;
    };
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
        {errorMessage ? (
          <p className="clinic-analytics-page-error">{errorMessage}</p>
        ) : null}
        <ClinicAnalyticsCard
          analytics={analytics}
          onNavigateMoreDetails={onNavigateMoreDetails}
        />
        <div className="clinic-analytics-page-arrows">
          <Arrows />
        </div>
      </section>
    </main>
  );
}
