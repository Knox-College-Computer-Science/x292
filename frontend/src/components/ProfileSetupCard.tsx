import "./ProfileSetupCard.css";

export default function ProfileSetupCard() {
  return (
    <section className="profile-card" aria-label="Profile setup form">
      <form id="profile-setup-form" className="profile-form">
        <label>
          <span>Username</span>
          <input type="text" name="username" />
        </label>
        <label>
          <span>Age</span>
          <input type="number" name="age" />
        </label>
        <label>
          <span>Location</span>
          <input type="text" name="location" />
        </label>
        <label>
          <span>Study Type</span>
          <input type="text" name="studyType" />
        </label>
        <label>
          <span>Compensation</span>
          <input type="text" name="compensation" />
        </label>
        <label>
          <span>Time Commitment</span>
          <input type="text" name="timeCommitment" />
        </label>
        <label>
          <span>Remote or In-Person</span>
          <input type="text" name="participationType" />
        </label>
        <label className="profile-form-wide">
          <span>Preferences</span>
          <textarea name="preferences" rows={4} />
        </label>
      </form>
    </section>
  );
}
