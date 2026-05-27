import { FormEvent, useMemo, useState } from "react";
import "./LoginComponent.css";
import Tooltip from "./Tooltip";
import owlFull from "../assets/owl-full.png";
import bearFull from "../assets/bear-full.png";

type LoginMode = "sign-in" | "create";

type LoginComponentProps = {
  role: "user" | "clinic";
  rememberedEmail?: string;
  onAuthenticate: (payload: {
    mode: LoginMode;
    email: string;
    password: string;
    organization?: string;
    rememberEmail: boolean;
  }) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function LoginComponent({
  role,
  rememberedEmail,
  onAuthenticate,
  isLoading = false,
  errorMessage = null,
}: LoginComponentProps) {
  const [mode, setMode] = useState<LoginMode>("sign-in");
  const [email, setEmail] = useState(rememberedEmail ?? "");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [rememberEmail, setRememberEmail] = useState(Boolean(rememberedEmail));

  const isClinic = role === "clinic";
  const loginMascot = isClinic ? owlFull : bearFull;
  const titleText = useMemo(() => {
    if (isClinic) {
      return mode === "sign-in" ? "Clinic Sign In" : "Create Clinic Account";
    }
    return mode === "sign-in" ? "Participant Sign In" : "Create Your Account";
  }, [isClinic, mode]);

  const displayTitleText = useMemo(() => {
    if (mode === "sign-in") {
      return isClinic ? "Clinic\nSign In" : "Participant\nSign In";
    }
    return titleText;
  }, [isClinic, mode, titleText]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onAuthenticate({
      mode,
      email: email.trim(),
      password,
      organization: organization.trim() || undefined,
      rememberEmail,
    });
  }

  return (
    <section className="login-component" aria-label={`${titleText} panel`}>
      <div className="login-header">
        <h2 className="login-title">{displayTitleText}</h2>
        <img
          className="login-logo-placeholder"
          src={loginMascot}
          alt=""
          aria-hidden="true"
        />
      </div>

      <form
        className="login-form"
        aria-label={`${titleText} form`}
        onSubmit={handleSubmit}
      >
        <div className="login-field-group">
          <label className="login-field-label" htmlFor="login-email">
            Email
          </label>
          <Tooltip label="Your email address for login and notifications">
            <input
              id="login-email"
              className="login-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Tooltip>
        </div>

        <div className="login-field-group login-field-group-secondary">
          <label className="login-field-label" htmlFor="login-password">
            Password
          </label>
          <Tooltip label="Password must be at least 8 characters">
            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </Tooltip>
        </div>

        {isClinic ? (
          <div className="login-field-group login-field-group-secondary">
            <label className="login-field-label" htmlFor="login-organization">
              Organization
            </label>
            <Tooltip label="Your clinic's name (optional)">
              <input
                id="login-organization"
                className="login-input"
                type="text"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
              />
            </Tooltip>
          </div>
        ) : null}

        <label className="login-checkbox-row" htmlFor="remember-email">
          <Tooltip label="Auto-fill your email next time (stored locally)">
            <input
              id="remember-email"
              type="checkbox"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
            />
          </Tooltip>
          Remember email on this device
        </label>

        {errorMessage ? (
          <p className="login-error-message">{errorMessage}</p>
        ) : null}

        <div className="login-actions">
          <Tooltip
            label={
              mode === "sign-in" ? "Create a new account" : "Return to sign in"
            }
          >
            <button
              type="button"
              className="atlas-button atlas-button-variant-back login-create-account"
              onClick={() => setMode(mode === "sign-in" ? "create" : "sign-in")}
            >
              {mode === "sign-in" ? "Create Account" : "Back to Sign In"}
            </button>
          </Tooltip>
          <Tooltip
            label={
              mode === "sign-in"
                ? "Sign in to your account"
                : "Create your account"
            }
          >
            <button
              type="submit"
              className="atlas-button atlas-button-variant-3 login-next"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : mode === "sign-in"
                  ? "Sign In"
                  : "Create"}
            </button>
          </Tooltip>
        </div>
      </form>
    </section>
  );
}
