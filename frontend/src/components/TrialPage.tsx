import { useEffect, useMemo, useState } from "react";
import { listTrials, passTrial, saveTrial, type Trial } from "../api";
import HomeNavBar from "./HomeNavBar";
import TrialCard from "./TrialCard";
import "./TrialPage.css";

type TrialPageProps = {
  authToken?: string;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateMoreDetails: (trialId: string) => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
};

export default function TrialPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateMoreDetails,
  onSelectExperience,
}: TrialPageProps) {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [condition, setCondition] = useState("diabetes");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Recruiting");
  const [phase, setPhase] = useState("");
  const [participation, setParticipation] = useState("Either");
  const [requiresCompensation, setRequiresCompensation] = useState(false);

  async function loadTrials() {
    try {
      setLoading(true);
      setError(null);
      setActionMessage(null);

      const normalizedParticipation =
        participation === "Either" ? undefined : participation;

      const data = await listTrials(
        {
          condition: condition.trim() || undefined,
          location: location.trim() || undefined,
          status: status.trim() || undefined,
          phase: phase.trim() || undefined,
          participation: normalizedParticipation,
          requiresCompensation,
        },
        authToken
      );

      setTrials(data);
      setCurrentIndex(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load trial matcher cards."
      );
      setTrials([]);
      setCurrentIndex(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrials();
  }, [authToken]);

  const currentTrial = useMemo(
    () => (currentIndex < trials.length ? trials[currentIndex] : null),
    [currentIndex, trials]
  );

  async function handleAction(action: "save" | "pass") {
    if (!currentTrial) {
      return;
    }

    if (!authToken) {
      setActionMessage("Please sign in to apply or skip trials.");
      return;
    }

    try {
      if (action === "save") {
        await saveTrial(currentTrial.id, authToken);
        setActionMessage("Trial marked as Apply. Moving to next card.");
      } else {
        await passTrial(currentTrial.id, authToken);
        setActionMessage("Trial skipped. Moving to next card.");
      }
      setCurrentIndex((index) => index + 1);
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Could not update trial action."
      );
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

      <section className="trial-page-content" aria-label="Trial matcher">
        <form
          className="trial-filter-bar"
          onSubmit={(event) => {
            event.preventDefault();
            void loadTrials();
          }}
        >
          <label>
            Condition
            <input
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            />
          </label>

          <label>
            Location
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City, State"
            />
          </label>

          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="Recruiting">Recruiting</option>
              <option value="Not yet recruiting">Not yet recruiting</option>
              <option value="">Any</option>
            </select>
          </label>

          <label>
            Phase
            <select value={phase} onChange={(event) => setPhase(event.target.value)}>
              <option value="">Any</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          </label>

          <label>
            Participation
            <select
              value={participation}
              onChange={(event) => setParticipation(event.target.value)}
            >
              <option value="Either">Either</option>
              <option value="Remote">Remote</option>
              <option value="In-person">In-person</option>
            </select>
          </label>

          <label className="trial-filter-checkbox">
            <input
              type="checkbox"
              checked={requiresCompensation}
              onChange={(event) => setRequiresCompensation(event.target.checked)}
            />
            Compensation only
          </label>

          <button type="submit" className="atlas-button atlas-button-variant-3">
            Refresh cards
          </button>
        </form>

        {loading ? <p className="trial-state">Loading matcher cards...</p> : null}
        {error ? <p className="trial-state trial-state-error">{error}</p> : null}

        {!loading && !error && currentTrial ? (
          <TrialCard
            trial={currentTrial}
            currentIndex={currentIndex}
            total={trials.length}
            onNavigateMoreDetails={() => onNavigateMoreDetails(currentTrial.id)}
            onApply={() => void handleAction("save")}
            onSkip={() => void handleAction("pass")}
          />
        ) : null}

        {!loading && !error && !currentTrial ? (
          <div className="trial-page-intro-card">
            <h2>All cards reviewed</h2>
            <p>
              You have swiped through this filtered set. Update filters or refresh
              cards to continue matching.
            </p>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3"
              onClick={() => void loadTrials()}
            >
              Reload cards
            </button>
          </div>
        ) : null}

        {actionMessage ? <p className="trial-state">{actionMessage}</p> : null}
      </section>
    </main>
  );
}
