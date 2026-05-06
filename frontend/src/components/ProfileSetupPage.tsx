import { useEffect, useMemo, useState } from "react";
import {
  getMyPrivacySettings,
  getMyProfile,
  updateMyPrivacySettings,
  updateMyProfile,
  type UserProfile,
} from "../api";
import HomeNavBar from "./HomeNavBar";
import ProfileSetupCard, { type ProfileFormValues } from "./ProfileSetupCard";
import "./ProfileSetupPage.css";

type ProfileSetupPageProps = {
  authToken: string | null;
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onNavigateLogin: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  onProfileSaved: (profile: UserProfile) => void;
};

const DEFAULT_VALUES: ProfileFormValues = {
  full_name: "",
  phone: "",
  location: "",
  health_conditions: "",
  trial_interests: "",
  age_range_min: "",
  age_range_max: "",
  participation_preference: "Either",
  travel_willingness: "Local only",
  max_distance_miles: "",
  preferred_recruitment_status: "Recruiting",
  preferred_study_phase: "",
  compensation_required: false,
  time_commitment: "",
  notification_preferences: "Email",
  accessibility_needs: "",
};

export default function ProfileSetupPage({
  authToken,
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onNavigateLogin,
  onSelectExperience,
  onProfileSaved,
}: ProfileSetupPageProps) {
  const [values, setValues] = useState<ProfileFormValues>(DEFAULT_VALUES);
  const [matchingFields, setMatchingFields] = useState<Record<string, boolean>>({
    location: true,
    health_conditions: true,
    age_range: true,
    participation_preference: true,
    travel_willingness: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = authToken;
    if (!token) {
      setIsLoading(false);
      return;
    }
    const tokenValue: string = token;

    let ignore = false;

    async function loadProfileData() {
      try {
        setIsLoading(true);
        setError(null);

        const [profile, privacy] = await Promise.all([
          getMyProfile(tokenValue),
          getMyPrivacySettings(tokenValue),
        ]);

        if (ignore) {
          return;
        }

        setValues({
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          location: profile.location ?? "",
          health_conditions: profile.health_conditions ?? "",
          trial_interests: profile.trial_interests ?? "",
          age_range_min:
            profile.age_range_min !== null && profile.age_range_min !== undefined
              ? String(profile.age_range_min)
              : "",
          age_range_max:
            profile.age_range_max !== null && profile.age_range_max !== undefined
              ? String(profile.age_range_max)
              : "",
          participation_preference: profile.participation_preference ?? "Either",
          travel_willingness: profile.travel_willingness ?? "Local only",
          max_distance_miles:
            profile.max_distance_miles !== null &&
            profile.max_distance_miles !== undefined
              ? String(profile.max_distance_miles)
              : "",
          preferred_recruitment_status:
            profile.preferred_recruitment_status ?? "Recruiting",
          preferred_study_phase: profile.preferred_study_phase ?? "",
          compensation_required: profile.compensation_required ?? false,
          time_commitment: profile.time_commitment ?? "",
          notification_preferences: profile.notification_preferences ?? "Email",
          accessibility_needs: profile.accessibility_needs ?? "",
        });

        setMatchingFields(
          privacy.matching_fields_enabled ?? {
            location: true,
            health_conditions: true,
            age_range: true,
            participation_preference: true,
            travel_willingness: true,
          }
        );
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Could not load profile.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadProfileData();

    return () => {
      ignore = true;
    };
  }, [authToken]);

  const disabled = useMemo(() => isLoading || isSaving, [isLoading, isSaving]);

  function handleFieldChange(field: keyof ProfileFormValues, value: string | boolean) {
    setValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleMatchingFieldToggle(field: string, enabled: boolean) {
    setMatchingFields((previous) => ({ ...previous, [field]: enabled }));
  }

  async function handleSubmit() {
    const token = authToken;
    if (!token) {
      setError("Please sign in first.");
      return;
    }
    const tokenValue: string = token;

    try {
      setError(null);
      setSuccessMessage(null);
      setIsSaving(true);

      const updatedProfile = await updateMyProfile(tokenValue, {
        full_name: values.full_name.trim() || undefined,
        phone: values.phone.trim() || undefined,
        location: values.location.trim() || undefined,
        health_conditions: values.health_conditions.trim() || undefined,
        trial_interests: values.trial_interests.trim() || undefined,
        age_range_min: values.age_range_min ? Number(values.age_range_min) : null,
        age_range_max: values.age_range_max ? Number(values.age_range_max) : null,
        participation_preference: values.participation_preference,
        travel_willingness: values.travel_willingness,
        max_distance_miles: values.max_distance_miles
          ? Number(values.max_distance_miles)
          : null,
        preferred_recruitment_status: values.preferred_recruitment_status,
        preferred_study_phase: values.preferred_study_phase || null,
        compensation_required: values.compensation_required,
        time_commitment: values.time_commitment.trim() || undefined,
        notification_preferences: values.notification_preferences,
        accessibility_needs: values.accessibility_needs.trim() || undefined,
        profile_completed: true,
      });

      await updateMyPrivacySettings(tokenValue, matchingFields);

      onProfileSaved(updatedProfile);
      setSuccessMessage("Preferences saved. Personalized trial matching is ready.");
      onNavigateAllTrials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="profile-page">
      <HomeNavBar
        selectedExperience={selectedExperience}
        onNavigateHome={onNavigateHome}
        onNavigateProfile={onNavigateProfile}
        onNavigateAnalytics={onNavigateAnalytics}
        onNavigateAllTrials={onNavigateAllTrials}
        onSelectExperience={onSelectExperience}
      />
      <section className="profile-page-content" aria-label="Profile setup">
        <p className="profile-page-intro">
          Choose your account preferences before browsing trials.
        </p>

        {!authToken ? (
          <div className="profile-auth-warning">
            <p>Please sign in or create an account first.</p>
            <button
              type="button"
              className="atlas-button atlas-button-variant-3"
              onClick={onNavigateLogin}
            >
              Go to login
            </button>
          </div>
        ) : (
          <>
            {isLoading ? (
              <p className="profile-message">Loading your profile...</p>
            ) : (
              <ProfileSetupCard
                values={values}
                matchingFields={matchingFields}
                onFieldChange={handleFieldChange}
                onMatchingFieldToggle={handleMatchingFieldToggle}
              />
            )}

            {error ? <p className="profile-message profile-message-error">{error}</p> : null}
            {successMessage ? (
              <p className="profile-message profile-message-success">{successMessage}</p>
            ) : null}

            <button
              type="button"
              className="atlas-button atlas-button-variant-3 profile-submit-button"
              onClick={handleSubmit}
              disabled={disabled}
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
