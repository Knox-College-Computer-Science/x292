import { useState, useEffect } from 'react';
import { api, SavedTrial } from '../api';
import TrialCard from '../components/TrialCard';

export default function SavedPage() {
  const [savedTrials, setSavedTrials] = useState<SavedTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrial, setSelectedTrial] = useState<SavedTrial | null>(null);

  useEffect(() => {
    loadSavedTrials();
  }, []);

  const loadSavedTrials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getSavedTrials();
      setSavedTrials(data);
    } catch (err) {
      setError('Failed to load saved trials');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (trialId: number) => {
    try {
      await api.unsaveTrial(trialId);
      setSavedTrials(savedTrials.filter(st => st.trial.id !== trialId));
      setSelectedTrial(null);
    } catch (err) {
      setError('Failed to remove trial');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading saved trials...</p>
      </div>
    );
  }

  if (savedTrials.length === 0) {
    return (
      <div className="empty-state">
        <h3>No saved trials yet</h3>
        <p>Start swiping to save trials you're interested in!</p>
      </div>
    );
  }

  return (
    <div className="saved-container">
      <div className="saved-header">
        <h2>Saved Trials ({savedTrials.length})</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="saved-grid">
        {savedTrials.map((saved) => (
          <div key={saved.id} className="saved-item">
            <div onClick={() => setSelectedTrial(saved)} className="trial-preview">
              <h3>{saved.trial.title}</h3>
              <p className="trial-condition">{saved.trial.condition}</p>
              <div className="trial-meta">
                {saved.trial.phase && <span className="badge">{saved.trial.phase}</span>}
                {saved.trial.is_remote && <span className="badge badge-remote">Remote</span>}
                {saved.trial.compensation && <span className="badge badge-comp">💰 Compensated</span>}
              </div>
              <p className="saved-date">Saved {new Date(saved.saved_at).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleUnsave(saved.trial.id)} className="btn-remove">
              Remove
            </button>
          </div>
        ))}
      </div>

      {selectedTrial && (
        <div className="modal-overlay" onClick={() => setSelectedTrial(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedTrial(null)}>×</button>
            <TrialCard trial={selectedTrial.trial} />
            <div className="modal-actions">
              <button onClick={() => handleUnsave(selectedTrial.trial.id)} className="btn-secondary">
                Remove from Saved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
