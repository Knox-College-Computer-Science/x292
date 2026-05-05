const API_URL = "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type Trial = {
  id: string;
  nct_id?: string | null;
  title: string;
  condition: string;
  category?: string | null;
  location: string;
  study_type?: string | null;
  study_description?: string | null;
  study_phase?: string | null;
  recruitment_status: string;
  compensation?: string | null;
  duration?: string | null;
  visit_frequency?: string | null;
  time_commitment?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  eligibility_age_min?: number | null;
  eligibility_age_max?: number | null;
  eligibility_gender: string;
  eligibility_conditions?: string | null;
  eligibility_summary?: string | null;
  remote_eligible: boolean;
  sponsor?: string | null;
  contact_link?: string | null;
  clinic_id?: string | null;
  views_count: number;
  saves_count: number;
  passes_count: number;
  created_at: string;
};

export type TrialAnalyticsStats = {
  total_views: number;
  total_saves: number;
  total_passes: number;
  top_trials: {
    id: string;
    title: string;
    saves: number;
  }[];
  category_popularity: Record<string, number>;
};

export function listTrials(condition: string, location?: string) {
  const params = new URLSearchParams({ condition });

  if (location) {
    params.set("location", location);
  }

  return request<Trial[]>(`/trials/?${params.toString()}`);
}

export function getTrial(trialId: string) {
  return request<Trial>(`/trials/${trialId}`);
}

export function saveTrial(trialId: string, userId: string) {
  const params = new URLSearchParams({ user_id: userId });

  return request<{ status: string; interaction_id: string }>(
    `/trials/${trialId}/save?${params.toString()}`,
    { method: "POST" }
  );
}

export function passTrial(trialId: string, userId: string) {
  const params = new URLSearchParams({ user_id: userId });

  return request<{ status: string; interaction_id: string }>(
    `/trials/${trialId}/pass?${params.toString()}`,
    { method: "POST" }
  );
}

export function getTrialAnalyticsStats() {
  return request<TrialAnalyticsStats>("/trials/analytics/stats");
}
