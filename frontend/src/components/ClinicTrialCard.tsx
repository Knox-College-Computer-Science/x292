import "./ClinicTrialCard.css";

export default function ClinicTrialCard() {
  return (
    <section
      className="clinic-trial-card"
      aria-label="Clinic trial information form"
    >
      <form id="clinic-trial-card-form" className="clinic-trial-card-form">
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Title</span>
          <input type="text" name="title" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Study Type</span>
          <input type="text" name="studyType" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Condition</span>
          <input type="text" name="condition" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">[00/00/0000]</span>
          <input type="text" name="date" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Location</span>
          <input type="text" name="location" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Compensation</span>
          <input type="text" name="compensation" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Time commitment</span>
          <input type="text" name="timeCommitment" />
        </div>
        <div className="clinic-trial-card-row">
          <span className="clinic-trial-card-label">Remote/in person</span>
          <input type="text" name="participationType" />
        </div>
      </form>
    </section>
  );
}
