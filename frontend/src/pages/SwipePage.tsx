import { useState, useEffect } from 'react';
import { api, Trial } from '../api';
import TrialCard from '../components/TrialCard';
import FilterPanel from '../components/FilterPanel';

export default function SwipePage() {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadTrials();
  }, [filters]);

  const loadTrials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getRecommendations(filters);
      setTrials(data);
      setCurrentIndex(0);
    } catch (err) {
      setError('Failed to load trials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: 'save' | 'pass') => {
    if (currentIndex >= trials.length) return;

    const trial = trials[currentIndex];
    
    try {
      await api.performAction(trial.id, action);
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      setError('Failed to save action');
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await api.refreshTrials();
      await loadTrials();
    } catch (err) {
      setError('Failed to refresh trials');
    } finally {
      setLoading(false);
    }
  };

  const currentTrial = trials[currentIndex];
  const hasMore = currentIndex < trials.length;

  return (
    <div className="swipe-container">
      <div className="swipe-header">
        <h2>Discover Clinical Trials</h2>
        <div className="header-actions">
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary">
            🔍 Filters
          </button>
          <button onClick={handleRefresh} className="btn-secondary" disabled={loading}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {showFilters && (
        <FilterPanel filters={filters} onFilterChange={setFilters} onClose={() => setShowFilters(false)} />
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="swipe-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading trials...</p>
          </div>
        ) : !hasMore ? (
          <div className="empty-state">
            <h3>🎉 You've reviewed all available trials!</h3>
            <p>Check back later for new matches or adjust your filters.</p>
            <button onClick={loadTrials} className="btn-primary">
              Load More
            </button>
          </div>
        ) : (
          <>
            <div className="trial-counter">
              {currentIndex + 1} / {trials.length}
            </div>
            
            <TrialCard trial={currentTrial} />

            <div className="swipe-actions">
              <button onClick={() => handleSwipe('pass')} className="btn-pass">
                ❌ Pass
              </button>
              <button onClick={() => handleSwipe('save')} className="btn-save">
                ❤️ Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
