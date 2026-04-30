import HomeNavBar from "./HomeNavBar";
import TrialCard from "./TrialCard";
import Arrows from "./Arrows";
import "./TrialPage.css";
import { useEffect, useMemo, useState } from "react";
import {
  AuthSession,
  Trial,
  getMyProfile,
  listTrials,
  passTrial,
  saveTrial,
} from "../api";

type TrialPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  session: AuthSession;
};

export default function TrialPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
  session,
}: TrialPageProps) {
  const [conditionFilter, setConditionFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("RECRUITING");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [studyTypeFilter, setStudyTypeFilter] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [compensationRequired, setCompensationRequired] = useState(false);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchTrialsWithFilters() {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const fetched = await listTrials({
        condition: conditionFilter.trim() || "diabetes",
        location: locationFilter.trim() || undefined,
        status: statusFilter || undefined,
        phase: phaseFilter || undefined,
        remoteOnly,
        studyType: studyTypeFilter || undefined,
        compensationRequired,
      });
      setTrials(fetched);
      setActiveIndex(0);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load trials.",
      );
      setTrials([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;
    async function loadInitialFilters() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const profile = await getMyProfile(session.token);
        if (isMounted) {
          setConditionFilter(profile.health_conditions?.trim() || "diabetes");
          setLocationFilter(profile.location?.trim() || "");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load trials.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialFilters();
    return () => {
      isMounted = false;
    };
  }, [session.token]);

  useEffect(() => {
    if (!conditionFilter.trim()) {
      return;
    }
    fetchTrialsWithFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionFilter, locationFilter, statusFilter, phaseFilter, remoteOnly, studyTypeFilter, compensationRequired]);

  const activeTrial = useMemo(() => {
    if (!trials.length) {
      return null;
    }
    return trials[Math.min(activeIndex, trials.length - 1)];
  }, [activeIndex, trials]);

  async function handleSave() {
    if (!activeTrial) {
      return;
    }
    try {
      await saveTrial(activeTrial.id, session.userId);
      setTrials((previous) => previous.filter((trial) => trial.id !== activeTrial.id));
      setActiveIndex(0);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save trial.");
    }
  }

  async function handlePass() {
    if (!activeTrial) {
      return;
    }
    try {
      await passTrial(activeTrial.id, session.userId);
      setTrials((previous) => previous.filter((trial) => trial.id !== activeTrial.id));
      setActiveIndex(0);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to pass trial.");
    }
  }

  return (
    <main className="trial-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section className="trial-page-content" aria-label="Trial details">
        {errorMessage ? <p className="trial-page-error">{errorMessage}</p> : null}
        <section className="trial-filter-panel" aria-label="Trial filters">
          <h2 className="trial-filter-title">Find Better-Matched Trials</h2>
          <div className="trial-filter-grid">
            <label>
              <span>Condition</span>
              <input
                type="text"
                value={conditionFilter}
                onChange={(event) => setConditionFilter(event.target.value)}
                placeholder="Ex: diabetes"
              />
            </label>
            <label>
              <span>Location</span>
              <input
                type="text"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
                placeholder="Ex: Chicago"
              />
            </label>
            <label>
              <span>Recruitment Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="RECRUITING">Recruiting</option>
                <option value="">Any status</option>
                <option value="COMPLETED">Completed</option>
                <option value="ACTIVE_NOT_RECRUITING">Active, not recruiting</option>
              </select>
            </label>
            <label>
              <span>Study Phase</span>
              <select
                value={phaseFilter}
                onChange={(event) => setPhaseFilter(event.target.value)}
              >
                <option value="">Any phase</option>
                <option value="PHASE1">Phase 1</option>
                <option value="PHASE2">Phase 2</option>
                <option value="PHASE3">Phase 3</option>
                <option value="PHASE4">Phase 4</option>
              </select>
            </label>
            <label>
              <span>Study Type</span>
              <input
                type="text"
                value={studyTypeFilter}
                onChange={(event) => setStudyTypeFilter(event.target.value)}
                placeholder="Ex: Interventional"
              />
            </label>
            <label className="trial-filter-check">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(event) => setRemoteOnly(event.target.checked)}
              />
              <span>Remote eligible only</span>
            </label>
            <label className="trial-filter-check">
              <input
                type="checkbox"
                checked={compensationRequired}
                onChange={(event) => setCompensationRequired(event.target.checked)}
              />
              <span>Compensation info required</span>
            </label>
            <button
              type="button"
              className="atlas-button atlas-button-variant-1 trial-filter-refresh"
              onClick={fetchTrialsWithFilters}
              disabled={isLoading || !conditionFilter.trim()}
            >
              Apply Filters
            </button>
          </div>
        </section>
        <TrialCard
          trial={activeTrial}
          isLoading={isLoading}
          onSave={handleSave}
          onPass={handlePass}
          onNavigateMoreDetails={onNavigateMoreDetails}
        />
        <div className="trial-page-controls">
          <div className="trial-page-actions">
            <button
              type="button"
              className="atlas-button atlas-button-variant-back trial-page-back"
              onClick={onNavigateProfile}
            >
              Back
            </button>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3 trial-page-all-trials"
              onClick={onNavigateAllTrials}
            >
              All Trials
            </button>
          </div>
          <div className="trial-page-arrows">
            <Arrows />
          </div>
          <div className="trial-page-controls-spacer" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
