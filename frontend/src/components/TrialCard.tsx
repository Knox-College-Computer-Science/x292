import { Trial } from '../api';

interface Props {
  trial: Trial;
}

export default function TrialCard({ trial }: Props) {
  return (
    <div className="trial-card">
      <div className="trial-card-header">
        <h3>{trial.title}</h3>
        {trial.sponsor && <p className="trial-sponsor">by {trial.sponsor}</p>}
      </div>

      <div className="trial-badges">
        {trial.phase && <span className="badge badge-phase">{trial.phase}</span>}
        {trial.is_remote && <span className="badge badge-remote">📍 Remote</span>}
        {trial.compensation && <span className="badge badge-comp">💰 Compensated</span>}
        <span className="badge badge-status">{trial.status}</span>
      </div>

      {trial.match_reasons && trial.match_reasons.length > 0 && (
        <div className="match-reasons">
          <strong>Why this matches:</strong>
          <ul>
            {trial.match_reasons.map((reason, index) => (
              <li key={index}>✓ {reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="trial-details">
        <h4>Summary</h4>
        <p>{trial.brief_summary}</p>

        {trial.condition && (
          <div className="detail-row">
            <strong>Condition:</strong> {trial.condition}
          </div>
        )}

        {trial.location_facility && (
          <div className="detail-row">
            <strong>Location:</strong> {trial.location_facility}
            {trial.location_city && `, ${trial.location_city}`}
            {trial.location_state && `, ${trial.location_state}`}
          </div>
        )}

        {(trial.min_age || trial.max_age) && (
          <div className="detail-row">
            <strong>Age Range:</strong> {trial.min_age || '?'} - {trial.max_age || '?'} years
          </div>
        )}

        {trial.gender && (
          <div className="detail-row">
            <strong>Gender:</strong> {trial.gender}
          </div>
        )}

        {trial.eligibility_criteria && (
          <div className="detail-section">
            <h4>Eligibility Criteria</h4>
            <div className="eligibility-text">
              {trial.eligibility_criteria.slice(0, 500)}
              {trial.eligibility_criteria.length > 500 && '...'}
            </div>
          </div>
        )}

        {(trial.contact_email || trial.contact_phone) && (
          <div className="detail-section">
            <h4>Contact Information</h4>
            {trial.contact_email && (
              <div className="contact-info">
                📧 <a href={`mailto:${trial.contact_email}`}>{trial.contact_email}</a>
              </div>
            )}
            {trial.contact_phone && (
              <div className="contact-info">
                📞 {trial.contact_phone}
              </div>
            )}
          </div>
        )}

        <div className="trial-id">
          <strong>Trial ID:</strong> {trial.nct_id}
        </div>
      </div>
    </div>
  );
}
