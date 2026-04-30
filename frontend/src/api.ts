const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const SESSION_KEY = "atlas-session";

export type Role = "user" | "clinic" | "admin";

export type AuthSession = {
  token: string;
  userId: string;
  email: string;
  role: Role;
  profileCompleted: boolean;
};

export type ProfileResponse = {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  location?: string | null;
  preferred_language?: string | null;
  age?: number | null;
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
  matching_fields_enabled?: Record<string, boolean> | null;
  profile_completed: boolean;
  created_at: string;
};

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
  eligibility_gender?: string | null;
  eligibility_conditions?: string | null;
  eligibility_summary?: string | null;
  remote_eligible?: boolean;
  sponsor?: string | null;
  contact_link?: string | null;
  views_count: number;
  saves_count: number;
  passes_count: number;
};

export type UserSummary = {
  user_id: string;
  total_views: number;
  total_saves: number;
  total_passes: number;
  top_categories: Array<{ category: string; count: number }>;
};

export type TrialAnalytics = {
  total_views: number;
  total_saves: number;
  total_passes: number;
  top_trials: Array<{ id: string; title: string; saves: number }>;
  category_popularity: Record<string, number>;
};

type TokenResponse = {
  access_token: string;
  token_type: string;
};

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
      ...init,
    });
  } catch {
    throw new Error(
      `Cannot connect to API at ${API_URL}. Make sure backend is running and CORS allows this frontend origin.`,
    );
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const errorData = (await response.json()) as { detail?: string };
      if (errorData?.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep fallback message if response body is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function parseToken(token: string): { sub: string; role: Role } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid session token format");
  }
  const decoded = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
  const payload = JSON.parse(decoded) as { sub?: string; role?: Role };
  if (!payload.sub || !payload.role) {
    throw new Error("Token is missing required identity data");
  }
  return { sub: payload.sub, role: payload.role };
}

function normalizeProfileCompleted(profile: ProfileResponse): boolean {
  return Boolean(
    profile.profile_completed &&
      profile.full_name &&
      profile.health_conditions &&
      profile.location,
  );
}

async function buildSession(
  tokenResponse: TokenResponse,
  email: string,
): Promise<AuthSession> {
  const { sub, role } = parseToken(tokenResponse.access_token);
  const profile = await getMyProfile(tokenResponse.access_token);
  return {
    token: tokenResponse.access_token,
    userId: sub,
    role,
    email,
    profileCompleted: normalizeProfileCompleted(profile),
  };
}

export async function registerUser(payload: {
  email: string;
  password: string;
  role: Role;
}): Promise<AuthSession> {
  const token = await request<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return buildSession(token, payload.email);
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const token = await request<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return buildSession(token, payload.email);
}

export function storeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem("atlas-last-email", session.email);
}

export function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getRememberedEmail(): string {
  return localStorage.getItem("atlas-last-email") ?? "";
}

export async function getMyProfile(token: string): Promise<ProfileResponse> {
  return request<ProfileResponse>("/users/me", undefined, token);
}

export async function updateMyProfile(
  token: string,
  payload: {
    full_name?: string;
    age?: number;
    location?: string;
    preferred_language?: string;
    gender?: string;
    insurance_status?: string;
    health_conditions?: string;
    trial_interests?: string;
    participation_preference?: string;
    travel_willingness?: string;
    notification_preferences?: string;
    time_commitment?: string;
    consent_given?: boolean;
    profile_completed?: boolean;
  },
): Promise<ProfileResponse> {
  return request<ProfileResponse>(
    "/users/me",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export async function listTrials(params: {
  condition: string;
  location?: string;
  status?: string;
  phase?: string;
  remoteOnly?: boolean;
  studyType?: string;
  compensationRequired?: boolean;
}): Promise<Trial[]> {
  const search = new URLSearchParams({ condition: params.condition });
  if (params.location) {
    search.set("location", params.location);
  }
  if (params.status) {
    search.set("status", params.status);
  }
  if (params.phase) {
    search.set("phase", params.phase);
  }
  if (params.remoteOnly) {
    search.set("remote_only", "true");
  }
  if (params.studyType) {
    search.set("study_type", params.studyType);
  }
  if (params.compensationRequired) {
    search.set("compensation_required", "true");
  }
  return request<Trial[]>(`/trials/?${search.toString()}`);
}

export async function getPrivacySettings(token: string): Promise<{
  stored_fields: string[];
  matching_fields_enabled: Record<string, boolean>;
}> {
  return request("/users/me/privacy", undefined, token);
}

export async function updatePrivacySettings(
  token: string,
  matchingFieldsEnabled: Record<string, boolean>,
): Promise<void> {
  await request(
    "/users/me/privacy",
    {
      method: "PUT",
      body: JSON.stringify({ matching_fields_enabled: matchingFieldsEnabled }),
    },
    token,
  );
}

export async function saveTrial(trialId: string, userId: string): Promise<void> {
  await request(`/trials/${trialId}/save?user_id=${encodeURIComponent(userId)}`, {
    method: "POST",
  });
}

export async function passTrial(trialId: string, userId: string): Promise<void> {
  await request(`/trials/${trialId}/pass?user_id=${encodeURIComponent(userId)}`, {
    method: "POST",
  });
}

export async function getSavedTrials(userId: string): Promise<Trial[]> {
  return request<Trial[]>(`/trials/user/${encodeURIComponent(userId)}/saved`);
}

export async function getPassedTrials(userId: string): Promise<Trial[]> {
  return request<Trial[]>(`/trials/user/${encodeURIComponent(userId)}/passed`);
}

export async function getUserSummary(userId: string): Promise<UserSummary> {
  return request<UserSummary>(`/trials/user/${encodeURIComponent(userId)}/summary`);
}

export async function getTrialAnalytics(): Promise<TrialAnalytics> {
  return request<TrialAnalytics>("/trials/analytics/stats");
}
