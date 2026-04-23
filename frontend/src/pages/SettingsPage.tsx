import { useState, useEffect } from 'react';
import { api, Profile } from '../api';

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, insightsData] = await Promise.all([
        api.getProfile(),
        api.getUserInsights(),
      ]);
      setProfile(profileData);
      setInsights(insightsData);
    } catch (err) {
      console.error('Failed to load settings data');
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyToggle = async (field: 'privacy_show_age' | 'privacy_show_location') => {
    if (!profile) return;
    
    const newValue = !profile[field];
    try {
      const updated = await api.updateProfile({ [field]: newValue });
      setProfile(updated);
    } catch (err) {
      console.error('Failed to update privacy setting');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (!profile) {
    return <div className="error-message">Failed to load profile</div>;
  }

  return (
    <div className="settings-container">
      <h2>Settings & Insights</h2>

      <div className="settings-section">
        <h3>Privacy Settings</h3>
        <div className="privacy-controls">
          <div className="privacy-item">
            <div>
              <strong>Use age in matching</strong>
              <p>Allow trials to match based on your age</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={profile.privacy_show_age}
                onChange={() => handlePrivacyToggle('privacy_show_age')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="privacy-item">
            <div>
              <strong>Use location in matching</strong>
              <p>Allow trials to match based on your location</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={profile.privacy_show_location}
                onChange={() => handlePrivacyToggle('privacy_show_location')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {insights && (
        <div className="settings-section">
          <h3>Your Activity Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-value">{insights.total_saves}</div>
              <div className="insight-label">Trials Saved</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">{insights.total_passes}</div>
              <div className="insight-label">Trials Passed</div>
            </div>
            <div className="insight-card">
              <div className="insight-value">
                {(insights.engagement_rate * 100).toFixed(0)}%
              </div>
              <div className="insight-label">Engagement Rate</div>
            </div>
          </div>

          {insights.preferred_phases && insights.preferred_phases.length > 0 && (
            <div className="insight-detail">
              <strong>Your preferred phases:</strong>
              <div className="badge-list">
                {insights.preferred_phases.map((phase: string) => (
                  <span key={phase} className="badge">{phase}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="settings-section">
        <h3>Profile Information</h3>
        <div className="profile-info">
          <div className="info-row">
            <span>Condition:</span>
            <strong>{profile.condition}</strong>
          </div>
          <div className="info-row">
            <span>Location:</span>
            <strong>{profile.location_city}, {profile.location_state}</strong>
          </div>
          <div className="info-row">
            <span>Age:</span>
            <strong>{profile.age}</strong>
          </div>
          <div className="info-row">
            <span>Max Distance:</span>
            <strong>{profile.max_distance_miles} miles</strong>
          </div>
          <div className="info-row">
            <span>Willing to Travel:</span>
            <strong>{profile.willing_to_travel ? 'Yes' : 'No'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
