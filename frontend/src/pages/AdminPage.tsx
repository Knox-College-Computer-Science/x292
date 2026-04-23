import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <div className="error-message">Failed to load analytics</div>;
  }

  return (
    <div className="admin-container">
      <h2>Platform Analytics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{analytics.total_users}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.total_trials}</div>
          <div className="stat-label">Trials in Database</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.total_saves}</div>
          <div className="stat-label">Total Saves</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.total_passes}</div>
          <div className="stat-label">Total Passes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{analytics.avg_swipes_per_user}</div>
          <div className="stat-label">Avg Swipes/User</div>
        </div>
      </div>

      <div className="admin-section">
        <h3>Top Conditions</h3>
        <div className="conditions-list">
          {analytics.top_conditions.map((item: any, index: number) => (
            <div key={index} className="condition-item">
              <div className="condition-name">{item.condition}</div>
              <div className="condition-count">{item.count} users</div>
              <div 
                className="condition-bar" 
                style={{ 
                  width: `${(item.count / analytics.total_users) * 100}%` 
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {analytics.recent_activity.slice(0, 20).map((event: any, index: number) => (
            <div key={index} className="activity-item">
              <span className="activity-type">{event.event_type}</span>
              <span className="activity-time">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
