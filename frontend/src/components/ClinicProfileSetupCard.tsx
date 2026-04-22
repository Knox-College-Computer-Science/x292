import "./ClinicProfileSetupCard.css";

export default function ClinicProfileSetupCard() {
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
