import HomeNavBar from "./HomeNavBar";
import ProfileSetupCard from "./ProfileSetupCard";
import "./ProfileSetupPage.css";
import {
  AuthSession,
  ProfileResponse,
  getMyProfile,
  getPrivacySettings,
  updateMyProfile,
  updatePrivacySettings,
} from "../api";
import { useEffect, useState } from "react";

type ProfileSetupPageProps = {
  selectedExperience: "clinics" | "participants";
  onNavigateHome: () => void;
  onNavigateProfile: () => void;
  onNavigateAnalytics: () => void;
  onNavigateAllTrials: () => void;
  onSelectExperience: (experience: "clinics" | "participants") => void;
  session: AuthSession;
  onProfileSaved: () => void;
};

export default function ProfileSetupPage({
  selectedExperience,
  onNavigateHome,
  onNavigateProfile,
  onNavigateAnalytics,
  onNavigateAllTrials,
  onSelectExperience,
  session,
  onProfileSaved,
}: ProfileSetupPageProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [matchingFields, setMatchingFields] = useState<Record<string, boolean>>({
    location: true,
    health_conditions: true,
    age: true,
    gender: true,
    participation_preference: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const [profileData, privacyData] = await Promise.all([
          getMyProfile(session.token),
          getPrivacySettings(session.token),
        ]);
        if (isMounted) {
          setProfile(profileData);
          setMatchingFields(privacyData.matching_fields_enabled);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load profile.",
          );
        }
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [session.token]);

  async function handleSave(payload: {
    full_name: string;
    age?: number;
    location: string;
    preferred_language: string;
    gender: string;
    insurance_status: string;
    health_conditions: string;
    trial_interests: string;
    participation_preference: string;
    travel_willingness: string;
    notification_preferences: string;
    time_commitment: string;
    consent_given: boolean;
    profile_completed: boolean;
    matching_fields_enabled: Record<string, boolean>;
  }) {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const { matching_fields_enabled, ...profilePayload } = payload;
      await Promise.all([
        updateMyProfile(session.token, profilePayload),
        updatePrivacySettings(session.token, matching_fields_enabled),
      ]);
      setMatchingFields(matching_fields_enabled);
      onProfileSaved();
      onNavigateAllTrials();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save preferences.",
      );
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
          Tell us your preferences before we match you with trials:
        </p>
        {errorMessage ? <p className="profile-page-error">{errorMessage}</p> : null}
        <ProfileSetupCard
          initialProfile={profile}
          initialMatchingFields={matchingFields}
          isSaving={isSaving}
          onSubmit={handleSave}
        />
      </section>
    </main>
  );
}
