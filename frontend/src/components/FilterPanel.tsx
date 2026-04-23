import { useState } from 'react';

interface Props {
  filters: any;
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

export default function FilterPanel({ filters, onFilterChange, onClose }: Props) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onFilterChange({});
    onClose();
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="filter-content">
        <div className="filter-group">
          <label>Trial Phase</label>
          <select
            value={localFilters.phase || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, phase: e.target.value || undefined })}
          >
            <option value="">All Phases</option>
            <option value="PHASE1">Phase 1</option>
            <option value="PHASE2">Phase 2</option>
            <option value="PHASE3">Phase 3</option>
            <option value="PHASE4">Phase 4</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Condition</label>
          <input
            type="text"
            placeholder="Filter by condition..."
            value={localFilters.condition || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, condition: e.target.value || undefined })}
          />
        </div>

        <div className="filter-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={localFilters.is_remote || false}
              onChange={(e) => setLocalFilters({ ...localFilters, is_remote: e.target.checked || undefined })}
            />
            <span>Remote trials only</span>
          </label>
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={handleClear} className="btn-secondary">
          Clear All
        </button>
        <button onClick={handleApply} className="btn-primary">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
