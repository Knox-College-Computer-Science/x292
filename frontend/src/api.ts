const API_BASE_URL = 'http://localhost:8000';

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
  };
}

interface Profile {
  age: number;
  location_city: string;
  location_state: string;
  location_country?: string;
  condition: string;
  max_distance_miles?: number;
  willing_to_travel?: boolean;
  preferred_phase?: string;
  preferred_type?: string;
  privacy_show_age?: boolean;
  privacy_show_location?: boolean;
}

interface Trial {
  id: number;
  nct_id: string;
  title: string;
  brief_summary: string;
  detailed_description?: string;
  condition: string;
  phase?: string;
  status: string;
  sponsor?: string;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  location_facility?: string;
  min_age?: number;
  max_age?: number;
  gender?: string;
  compensation?: string;
  is_remote: boolean;
  eligibility_criteria?: string;
  contact_email?: string;
  contact_phone?: string;
  match_reasons?: string[];
  distance_miles?: number;
}

interface SavedTrial {
  id: number;
  trial: Trial;
  saved_at: string;
  notes?: string;
}

class API {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async signup(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Signup failed');
    }
    
    return res.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Login failed');
    }
    
    return res.json();
  }

  async createProfile(profile: Profile): Promise<Profile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(profile),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to create profile');
    }
    
    return res.json();
  }

  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get profile');
    }
    
    return res.json();
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(profile),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to update profile');
    }
    
    return res.json();
  }

  async getRecommendations(filters?: {
    condition?: string;
    phase?: string;
    is_remote?: boolean;
  }): Promise<Trial[]> {
    const params = new URLSearchParams();
    if (filters?.condition) params.set('condition', filters.condition);
    if (filters?.phase) params.set('phase', filters.phase);
    if (filters?.is_remote !== undefined) params.set('is_remote', String(filters.is_remote));
    
    const res = await fetch(`${API_BASE_URL}/trials/recommendations?${params}`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get recommendations');
    }
    
    return res.json();
  }

  async performAction(trialId: number, action: 'save' | 'pass'): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/trials/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify({ trial_id: trialId, action }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to perform action');
    }
  }

  async getSavedTrials(): Promise<SavedTrial[]> {
    const res = await fetch(`${API_BASE_URL}/trials/saved`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get saved trials');
    }
    
    return res.json();
  }

  async unsaveTrial(trialId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/trials/saved/${trialId}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to unsave trial');
    }
  }

  async getTrialDetails(trialId: number): Promise<Trial> {
    const res = await fetch(`${API_BASE_URL}/trials/${trialId}`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get trial details');
    }
    
    return res.json();
  }

  async refreshTrials(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/trials/refresh`, {
      method: 'POST',
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to refresh trials');
    }
  }

  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/analytics/overview`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get analytics');
    }
    
    return res.json();
  }

  async getUserInsights(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/analytics/user-insights`, {
      headers: this.getAuthHeader(),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || 'Failed to get insights');
    }
    
    return res.json();
  }
}

export const api = new API();
export type { Trial, Profile, SavedTrial, AuthResponse };
