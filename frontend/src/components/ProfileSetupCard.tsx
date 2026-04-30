import "./ProfileSetupCard.css";
import { FormEvent, useMemo, useState } from "react";
import { ProfileResponse } from "../api";

type ProfileSetupCardProps = {
  initialProfile: ProfileResponse | null;
  initialMatchingFields?: Record<string, boolean>;
  isSaving: boolean;
  onSubmit: (payload: {
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
  }) => Promise<void>;
};

export default function ProfileSetupCard({
  initialProfile,
  initialMatchingFields,
  isSaving,
  onSubmit,
}: ProfileSetupCardProps) {
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [ageRangeText, setAgeRangeText] = useState(
    initialProfile?.age ? `${initialProfile.age}` : "",
  );
  const [location, setLocation] = useState(initialProfile?.location ?? "");
  const [preferredLanguage, setPreferredLanguage] = useState(
    initialProfile?.preferred_language ?? "English",
  );
  const [gender, setGender] = useState(initialProfile?.gender ?? "Prefer not to say");
  const [insuranceStatus, setInsuranceStatus] = useState(
    initialProfile?.insurance_status ?? "Insured",
  );
  const [healthConditions, setHealthConditions] = useState(
    initialProfile?.health_conditions ?? "",
  );
  const [trialInterests, setTrialInterests] = useState(
    initialProfile?.trial_interests ?? "",
  );
  const [participationPreference, setParticipationPreference] = useState(
    initialProfile?.participation_preference ?? "Either",
  );
  const [travelWillingness, setTravelWillingness] = useState(
    initialProfile?.travel_willingness ?? "Up to 25 miles",
  );
  const [notificationPreference, setNotificationPreference] = useState(
    initialProfile?.notification_preferences ?? "Email",
  );
  const [timeCommitment, setTimeCommitment] = useState(
    initialProfile?.time_commitment ?? "",
  );
  const [consentGiven, setConsentGiven] = useState(
    initialProfile?.consent_given ?? true,
  );
  const [matchingFields, setMatchingFields] = useState<Record<string, boolean>>(
    initialMatchingFields ?? {
      location: true,
      health_conditions: true,
      age: true,
      gender: true,
      participation_preference: true,
    },
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = useMemo(() => {
    return (
      Boolean(fullName.trim()) &&
      Boolean(location.trim()) &&
      Boolean(healthConditions.trim()) &&
      Boolean(trialInterests.trim())
    );
  }, [fullName, location, healthConditions, trialInterests]);

  const parsedAge = useMemo(() => {
    const match = ageRangeText.match(/\d+/);
    return match ? Number(match[0]) : undefined;
  }, [ageRangeText]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    if (!isFormValid) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    await onSubmit({
      full_name: fullName.trim(),
      age: parsedAge,
      location: location.trim(),
      preferred_language: preferredLanguage,
      gender,
      insurance_status: insuranceStatus,
      health_conditions: healthConditions.trim(),
      trial_interests: trialInterests.trim(),
      participation_preference: participationPreference,
      travel_willingness: travelWillingness,
      notification_preferences: notificationPreference,
      time_commitment: timeCommitment.trim(),
      consent_given: consentGiven,
      profile_completed: true,
      matching_fields_enabled: matchingFields,
    });
  }

  return (
    <section className="profile-card" aria-label="Profile setup form">
      <form id="profile-setup-form" className="profile-form" onSubmit={handleSubmit}>
        <label>
          <span>Full Name *</span>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Age / Age Range</span>
          <input
            type="text"
            name="ageRange"
            placeholder="Ex: 25-34"
            value={ageRangeText}
            onChange={(event) => setAgeRangeText(event.target.value)}
          />
        </label>
        <label>
          <span>Location *</span>
          <input
            type="text"
            name="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Preferred Language</span>
          <select
            name="preferredLanguage"
            value={preferredLanguage}
            onChange={(event) => setPreferredLanguage(event.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Arabic">Arabic</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          <span>Gender</span>
          <select
            name="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
        <label>
          <span>Insurance Status</span>
          <select
            name="insuranceStatus"
            value={insuranceStatus}
            onChange={(event) => setInsuranceStatus(event.target.value)}
          >
            <option value="Insured">Insured</option>
            <option value="Uninsured">Uninsured</option>
            <option value="Student">Student</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          <span>Medical Condition *</span>
          <input
            type="text"
            name="healthConditions"
            value={healthConditions}
            onChange={(event) => setHealthConditions(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Research Interests *</span>
          <input
            type="text"
            name="trialInterests"
            value={trialInterests}
            onChange={(event) => setTrialInterests(event.target.value)}
            required
          />
        </label>
        <label>
          <span>Time Commitment</span>
          <input
            type="text"
            name="timeCommitment"
            placeholder="Ex: 2 visits/month"
            value={timeCommitment}
            onChange={(event) => setTimeCommitment(event.target.value)}
          />
        </label>
        <label>
          <span>Participation Preference</span>
          <select
            name="participationType"
            value={participationPreference}
            onChange={(event) => setParticipationPreference(event.target.value)}
          >
            <option value="Either">Either</option>
            <option value="Remote">Remote</option>
            <option value="In-person">In-person</option>
          </select>
        </label>
        <label>
          <span>Travel Willingness</span>
          <select
            name="travelWillingness"
            value={travelWillingness}
            onChange={(event) => setTravelWillingness(event.target.value)}
          >
            <option value="Up to 10 miles">Up to 10 miles</option>
            <option value="Up to 25 miles">Up to 25 miles</option>
            <option value="Up to 50 miles">Up to 50 miles</option>
            <option value="Any distance">Any distance</option>
          </select>
        </label>
        <label>
          <span>Notification Preferences</span>
          <select
            name="notificationPreference"
            value={notificationPreference}
            onChange={(event) => setNotificationPreference(event.target.value)}
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Both">Both</option>
            <option value="None">None</option>
          </select>
        </label>
        <label className="profile-form-wide profile-consent-row">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(event) => setConsentGiven(event.target.checked)}
          />
          <span>I allow my profile fields to be used for trial matching.</span>
        </label>
        <fieldset className="profile-form-wide matching-fields-panel">
          <legend>Matching Privacy Controls</legend>
          <label className="matching-field-item">
            <input
              type="checkbox"
              checked={Boolean(matchingFields.location)}
              onChange={(event) =>
                setMatchingFields((prev) => ({
                  ...prev,
                  location: event.target.checked,
                }))
              }
            />
            <span>Use location in matching</span>
          </label>
          <label className="matching-field-item">
            <input
              type="checkbox"
              checked={Boolean(matchingFields.health_conditions)}
              onChange={(event) =>
                setMatchingFields((prev) => ({
                  ...prev,
                  health_conditions: event.target.checked,
                }))
              }
            />
            <span>Use medical conditions in matching</span>
          </label>
          <label className="matching-field-item">
            <input
              type="checkbox"
              checked={Boolean(matchingFields.age)}
              onChange={(event) =>
                setMatchingFields((prev) => ({
                  ...prev,
                  age: event.target.checked,
                }))
              }
            />
            <span>Use age in matching</span>
          </label>
          <label className="matching-field-item">
            <input
              type="checkbox"
              checked={Boolean(matchingFields.gender)}
              onChange={(event) =>
                setMatchingFields((prev) => ({
                  ...prev,
                  gender: event.target.checked,
                }))
              }
            />
            <span>Use gender in matching</span>
          </label>
          <label className="matching-field-item">
            <input
              type="checkbox"
              checked={Boolean(matchingFields.participation_preference)}
              onChange={(event) =>
                setMatchingFields((prev) => ({
                  ...prev,
                  participation_preference: event.target.checked,
                }))
              }
            />
            <span>Use participation preference in matching</span>
          </label>
        </fieldset>
        {errorMessage ? <p className="profile-form-error">{errorMessage}</p> : null}
        <button
          type="submit"
          className="atlas-button atlas-button-variant-1 profile-form-submit"
          disabled={isSaving || !isFormValid}
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </button>
      </form>
    </section>
  );
}
