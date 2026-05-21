import "./ProfileSetupCard.css";
import Tooltip from "./Tooltip";

export type ProfileFormValues = {
  full_name: string;
  phone: string;
  location: string;
  health_conditions: string;
  trial_interests: string;
  age_range_min: string;
  age_range_max: string;
  participation_preference: string;
  travel_willingness: string;
  max_distance_miles: string;
  preferred_recruitment_status: string;
  preferred_study_phase: string;
  compensation_required: boolean;
  time_commitment: string;
  notification_preferences: string;
  accessibility_needs: string;
};

type ProfileSetupCardProps = {
  values: ProfileFormValues;
  matchingFields: Record<string, boolean>;
  onFieldChange: (
    field: keyof ProfileFormValues,
    value: string | boolean,
  ) => void;
  onMatchingFieldToggle: (field: string, enabled: boolean) => void;
};

export default function ProfileSetupCard({
  values,
  matchingFields,
  onFieldChange,
  onMatchingFieldToggle,
}: ProfileSetupCardProps) {
  return (
    <section className="profile-card" aria-label="Profile setup form">
      <form id="profile-setup-form" className="profile-form">
        <label>
          <span>Full Name</span>
          <Tooltip label="Your full legal name">
            <input
              type="text"
              value={values.full_name}
              onChange={(event) =>
                onFieldChange("full_name", event.target.value)
              }
            />
          </Tooltip>
        </label>

        <label>
          <span>Phone</span>
          <Tooltip label="Best number to reach you about trial details">
            <input
              type="text"
              value={values.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
            />
          </Tooltip>
        </label>

        <label>
          <span>Location</span>
          <Tooltip label="City and state used to match nearby trials">
            <input
              type="text"
              value={values.location}
              onChange={(event) =>
                onFieldChange("location", event.target.value)
              }
              placeholder="City, State"
            />
          </Tooltip>
        </label>

        <label>
          <span>Conditions / Interests</span>
          <Tooltip label="List conditions or topics you care about, comma-separated">
            <input
              type="text"
              value={values.health_conditions}
              onChange={(event) =>
                onFieldChange("health_conditions", event.target.value)
              }
              placeholder="diabetes, oncology"
            />
          </Tooltip>
        </label>

        <label>
          <span>Age Range Min</span>
          <Tooltip label="Minimum eligible age for trial matching">
            <input
              type="number"
              value={values.age_range_min}
              onChange={(event) =>
                onFieldChange("age_range_min", event.target.value)
              }
            />
          </Tooltip>
        </label>

        <label>
          <span>Age Range Max</span>
          <Tooltip label="Maximum eligible age for trial matching">
            <input
              type="number"
              value={values.age_range_max}
              onChange={(event) =>
                onFieldChange("age_range_max", event.target.value)
              }
            />
          </Tooltip>
        </label>

        <label>
          <span>Participation Preference</span>
          <Tooltip label="Choose if you prefer remote, in-person, or either">
            <select
              value={values.participation_preference}
              onChange={(event) =>
                onFieldChange("participation_preference", event.target.value)
              }
            >
              <option value="Either">Either</option>
              <option value="Remote">Remote</option>
              <option value="In-person">In-person</option>
            </select>
          </Tooltip>
        </label>

        <label>
          <span>Travel Willingness</span>
          <Tooltip label="How far you're willing to travel for an in-person study">
            <select
              value={values.travel_willingness}
              onChange={(event) =>
                onFieldChange("travel_willingness", event.target.value)
              }
            >
              <option value="Local only">Local only</option>
              <option value="Within state">Within state</option>
              <option value="Nationwide">Nationwide</option>
            </select>
          </Tooltip>
        </label>

        <label>
          <span>Max Distance (miles)</span>
          <Tooltip label="Maximum travel distance in miles for study locations">
            <input
              type="number"
              value={values.max_distance_miles}
              onChange={(event) =>
                onFieldChange("max_distance_miles", event.target.value)
              }
            />
          </Tooltip>
        </label>

        <label>
          <span>Recruitment Status Filter</span>
          <Tooltip label="Prefer studies by their recruitment status">
            <select
              value={values.preferred_recruitment_status}
              onChange={(event) =>
                onFieldChange(
                  "preferred_recruitment_status",
                  event.target.value,
                )
              }
            >
              <option value="Recruiting">Recruiting</option>
              <option value="Not yet recruiting">Not yet recruiting</option>
              <option value="Any">Any</option>
            </select>
          </Tooltip>
        </label>

        <label>
          <span>Study Phase Filter</span>
          <Tooltip label="Filter trials by study phase (1-4)">
            <select
              value={values.preferred_study_phase}
              onChange={(event) =>
                onFieldChange("preferred_study_phase", event.target.value)
              }
            >
              <option value="">Any phase</option>
              <option value="Phase 1">Phase 1</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Phase 3">Phase 3</option>
              <option value="Phase 4">Phase 4</option>
            </select>
          </Tooltip>
        </label>

        <label>
          <span>Notifications</span>
          <Tooltip label="How you'd like to receive trial notifications">
            <select
              value={values.notification_preferences}
              onChange={(event) =>
                onFieldChange("notification_preferences", event.target.value)
              }
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Both">Both</option>
            </select>
          </Tooltip>
        </label>

        <label>
          <span>Weekly Time Commitment</span>
          <input
            type="text"
            value={values.time_commitment}
            onChange={(event) =>
              onFieldChange("time_commitment", event.target.value)
            }
            placeholder="e.g. 2-3 hours"
          />
        </label>

        <label className="profile-checkbox-row">
          <Tooltip label="If checked, only trials that list compensation will be shown">
            <input
              type="checkbox"
              checked={values.compensation_required}
              onChange={(event) =>
                onFieldChange("compensation_required", event.target.checked)
              }
            />
          </Tooltip>
          <span>Only show trials with listed compensation</span>
        </label>

        <label className="profile-form-wide">
          <span>Trial Topic Preferences</span>
          <textarea
            value={values.trial_interests}
            onChange={(event) =>
              onFieldChange("trial_interests", event.target.value)
            }
            rows={3}
          />
        </label>

        <label className="profile-form-wide">
          <span>Accessibility Needs</span>
          <textarea
            value={values.accessibility_needs}
            onChange={(event) =>
              onFieldChange("accessibility_needs", event.target.value)
            }
            rows={3}
          />
        </label>

        <div className="profile-form-wide privacy-card">
          <h3>Privacy Matching Controls</h3>
          <p>
            Disable any field below to keep it stored in your profile but
            excluded from future recommendation scoring.
          </p>

          <label className="profile-checkbox-row">
            <Tooltip label="Enable using your location when scoring trial relevance">
              <input
                type="checkbox"
                checked={matchingFields.location ?? true}
                onChange={(event) =>
                  onMatchingFieldToggle("location", event.target.checked)
                }
              />
            </Tooltip>
            <span>Use location for matching</span>
          </label>

          <label className="profile-checkbox-row">
            <Tooltip label="Enable matching based on your listed conditions and interests">
              <input
                type="checkbox"
                checked={matchingFields.health_conditions ?? true}
                onChange={(event) =>
                  onMatchingFieldToggle(
                    "health_conditions",
                    event.target.checked,
                  )
                }
              />
            </Tooltip>
            <span>Use conditions/interests for matching</span>
          </label>

          <label className="profile-checkbox-row">
            <Tooltip label="Enable age range to be considered when matching trials">
              <input
                type="checkbox"
                checked={matchingFields.age_range ?? true}
                onChange={(event) =>
                  onMatchingFieldToggle("age_range", event.target.checked)
                }
              />
            </Tooltip>
            <span>Use age range for matching</span>
          </label>

          <label className="profile-checkbox-row">
            <Tooltip label="Enable matching that respects your participation preference">
              <input
                type="checkbox"
                checked={matchingFields.participation_preference ?? true}
                onChange={(event) =>
                  onMatchingFieldToggle(
                    "participation_preference",
                    event.target.checked,
                  )
                }
              />
            </Tooltip>
            <span>Use participation preference for matching</span>
          </label>

          <label className="profile-checkbox-row">
            <Tooltip label="Enable travel willingness to affect trial recommendations">
              <input
                type="checkbox"
                checked={matchingFields.travel_willingness ?? true}
                onChange={(event) =>
                  onMatchingFieldToggle(
                    "travel_willingness",
                    event.target.checked,
                  )
                }
              />
            </Tooltip>
            <span>Use travel willingness for matching</span>
          </label>
        </div>
      </form>
    </section>
  );
}
