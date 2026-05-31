import "./ClinicProfileSetupCard.css";

type ClinicProfileSetupCardProps = {
  defaultContactEmail?: string | null;
};

export default function ClinicProfileSetupCard({
  defaultContactEmail,
}: ClinicProfileSetupCardProps) {
  return (
    <section
      className="clinic-profile-card"
      aria-label="Clinic profile setup form"
    >
      <form id="clinic-profile-setup-form" className="clinic-profile-form">
        <label>
          <span>Organization Name</span>
          <input type="text" name="organizationName" />
        </label>
        <label>
          <span>Contact Email</span>
          <input
            type="email"
            name="contactEmail"
            defaultValue={defaultContactEmail ?? ""}
          />
        </label>
        <label>
          <span>Contact Person</span>
          <input type="text" name="contactPerson" />
        </label>
        <label>
          <span>Contact Phone</span>
          <input type="text" name="contactPhone" />
        </label>
        <label>
          <span>Location</span>
          <input type="text" name="location" />
        </label>
        <label className="clinic-profile-form-wide">
          <span>Preferences</span>
          <textarea name="preferences" rows={4} />
        </label>
        <label className="clinic-profile-form-wide">
          <span>About Organization</span>
          <textarea name="aboutOrganization" rows={4} />
        </label>
        <label className="clinic-profile-form-wide">
          <span>Mission Statement</span>
          <textarea name="missionStatement" rows={4} />
        </label>
        <label className="clinic-profile-form-wide">
          <span>Success So Far</span>
          <textarea name="successSoFar" rows={4} />
        </label>
      </form>
    </section>
  );
}
