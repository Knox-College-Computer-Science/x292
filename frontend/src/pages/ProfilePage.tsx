import { useState, useEffect } from 'react';
import { api, Profile } from '../api';

interface Props {
  onProfileCreated: () => void;
}

export default function ProfilePage({ onProfileCreated }: Props) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    age: 30,
    location_city: '',
    location_state: '',
    location_country: 'United States',
    condition: '',
    max_distance_miles: 50,
    willing_to_travel: false,
    privacy_show_age: true,
    privacy_show_location: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await api.getProfile();
      setFormData(profile);
      setIsEdit(true);
    } catch {
      setIsEdit(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await api.updateProfile(formData);
      } else {
        await api.createProfile(formData as Profile);
      }
      onProfileCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Profile, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{isEdit ? 'Edit Profile' : 'Create Your Profile'}</h2>
        <p className="subtitle">Help us find the right clinical trials for you</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label>Condition *</label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                placeholder="e.g., Diabetes, Asthma, Cancer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.location_city}
                onChange={(e) => handleChange('location_city', e.target.value)}
                placeholder="San Francisco"
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={formData.location_state}
                onChange={(e) => handleChange('location_state', e.target.value)}
                placeholder="CA"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Maximum Distance (miles)</label>
            <input
              type="number"
              min="0"
              max="500"
              value={formData.max_distance_miles}
              onChange={(e) => handleChange('max_distance_miles', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.willing_to_travel}
                onChange={(e) => handleChange('willing_to_travel', e.target.checked)}
              />
              <span>Willing to travel for trials</span>
            </label>
          </div>

          <div className="form-group">
            <label>Preferred Trial Phase (Optional)</label>
            <select
              value={formData.preferred_phase || ''}
              onChange={(e) => handleChange('preferred_phase', e.target.value || undefined)}
            >
              <option value="">No preference</option>
              <option value="PHASE1">Phase 1</option>
              <option value="PHASE2">Phase 2</option>
              <option value="PHASE3">Phase 3</option>
              <option value="PHASE4">Phase 4</option>
            </select>
          </div>

          <div className="privacy-section">
            <h3>Privacy Settings</h3>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.privacy_show_age}
                  onChange={(e) => handleChange('privacy_show_age', e.target.checked)}
                />
                <span>Include age in matching</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.privacy_show_location}
                  onChange={(e) => handleChange('privacy_show_location', e.target.checked)}
                />
                <span>Include location in matching</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Profile' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
