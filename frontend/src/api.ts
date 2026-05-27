const API_URL = "http://127.0.0.1:8000";

export type ApiRequestOptions = {
  token?: string;
};

async function request<T>(
  path: string,
  init?: RequestInit,
  options?: ApiRequestOptions
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let detail = `Request failed: ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.detail) {
        detail = payload.detail;
      }
    } catch {
      // fall back to status text
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user_id: string;
  role: "user" | "clinic" | "admin";
  profile_completed: boolean;
};

export type MessageResponse = {
  message: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  preferred_language?: string | null;
  age?: number | null;
  age_range_min?: number | null;
  age_range_max?: number | null;
  gender?: string | null;
  ethnicity?: string | null;
  health_conditions?: string | null;
  insurance_status?: string | null;
  consent_given: boolean;
  trial_interests?: string | null;
  time_commitment?: string | null;
  notification_preferences?: string | null;
  travel_willingness?: string | null;
  participation_preference?: string | null;
  max_distance_miles?: number | null;
  preferred_recruitment_status?: string | null;
  preferred_study_phase?: string | null;
  compensation_required: boolean;
  accessibility_needs?: string | null;
  matching_fields_enabled?: Record<string, boolean> | null;
  profile_completed: boolean;
  created_at: string;
};

export type UserProfileUpdate = Partial<
  Omit<UserProfile, "id" | "email" | "created_at" | "matching_fields_enabled">
>;

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
  match_score?: number | null;
  match_reasons?: string[];
};

export type TrialQuery = {
  condition?: string;
  location?: string;
  status?: string;
  phase?: string;
  participation?: string;
  requiresCompensation?: boolean;
  limit?: number;
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
  drop_off_rate: number;
  drop_off_by_category: Record<string, number>;
};

export type InteractionHistoryItem = {
  interaction_id: string;
  trial_id: string;
  action: "save" | "pass" | "view";
  created_at: string;
  trial: Trial | null;
};

export function registerUser(email: string, password: string, role: "user" | "clinic") {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
}

export function loginUser(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function resetPassword(
  email: string,
  newPassword: string,
  role: "user" | "clinic",
) {
  return request<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, new_password: newPassword, role }),
  });
}

export function getMyProfile(token: string) {
  return request<UserProfile>("/users/me", undefined, { token });
}

export function updateMyProfile(token: string, payload: UserProfileUpdate) {
  return request<UserProfile>(
    "/users/me",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    { token }
  );
}

export function getMyPrivacySettings(token: string) {
  return request<{ stored_fields: string[]; matching_fields_enabled: Record<string, boolean> }>(
    "/users/me/privacy",
    undefined,
    { token }
  );
}

export function updateMyPrivacySettings(token: string, matchingFields: Record<string, boolean>) {
  return request<{ message: string; matching_fields_enabled: Record<string, boolean> }>(
    "/users/me/privacy",
    {
      method: "PUT",
      body: JSON.stringify({ matching_fields_enabled: matchingFields }),
    },
    { token }
  );
}

export function listTrials(query: TrialQuery, token?: string) {
  const params = new URLSearchParams();

  if (query.condition) {
    params.set("condition", query.condition);
  }
  if (query.location) {
    params.set("location", query.location);
  }
  if (query.status) {
    params.set("status", query.status);
  }
  if (query.phase) {
    params.set("phase", query.phase);
  }
  if (query.participation) {
    params.set("participation", query.participation);
  }
  if (query.requiresCompensation) {
    params.set("requires_compensation", "true");
  }
  if (typeof query.limit === "number") {
    params.set("limit", String(query.limit));
  }

  return request<Trial[]>(`/trials/?${params.toString()}`, undefined, { token });
}

export function getTrial(trialId: string, token?: string) {
  return request<Trial>(`/trials/${trialId}`, undefined, { token });
}

export function saveTrial(trialId: string, token?: string) {
  return request<{ status: string; interaction_id: string }>(
    `/trials/${trialId}/save`,
    { method: "POST" },
    { token }
  );
}

export function passTrial(trialId: string, token?: string) {
  return request<{ status: string; interaction_id: string }>(
    `/trials/${trialId}/pass`,
    { method: "POST" },
    { token }
  );
}

export function getMySavedTrials(token: string) {
  return request<Trial[]>("/trials/me/saved", undefined, { token });
}

export function getMyPassedTrials(token: string) {
  return request<Trial[]>("/trials/me/passed", undefined, { token });
}

export function getMyInteractionHistory(
  token: string,
  actions: Array<"save" | "pass" | "view"> = ["save", "pass"]
) {
  const params = new URLSearchParams({ actions: actions.join(",") });
  return request<InteractionHistoryItem[]>(
    `/trials/me/history?${params.toString()}`,
    undefined,
    { token }
  );
}

export function getTrialAnalyticsStats() {
  return request<TrialAnalyticsStats>("/trials/analytics/stats");
}
