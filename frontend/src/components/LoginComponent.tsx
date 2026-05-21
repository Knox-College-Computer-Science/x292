import { FormEvent, useMemo, useState } from "react";
import "./LoginComponent.css";

type LoginMode = "sign-in" | "create" | "reset-password";

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
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const isClinic = role === "clinic";
  const titleText = useMemo(() => {
    if (mode === "reset-password") {
      return "Reset password";
    }
    if (isClinic) {
      return mode === "sign-in" ? "Clinic sign in" : "Create clinic account";
    }
    return mode === "sign-in" ? "Sign in" : "Create your account";
  }, [isClinic, mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (mode === "reset-password") {
      // Simulate password reset
      setResetMessage(`Password reset instructions have been sent to ${email.trim()}`);
      setTimeout(() => {
        setResetMessage(null);
        setMode("sign-in");
      }, 3000);
      return;
    }
    
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
      <div className="login-title-row">
        <h2 className="login-title">{titleText}</h2>
        {mode === "sign-in" ? (
          <button
            type="button"
            className="login-switch-cta"
            onClick={() => setMode("create")}
          >
            New here? Create Account
          </button>
        ) : null}
      </div>

      <div className="login-logo-placeholder" aria-hidden="true" />

      <form className="login-form" aria-label={`${titleText} form`} onSubmit={handleSubmit}>
        <div className="login-field-group">
          <label className="login-field-label" htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            className="login-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {mode !== "reset-password" && (
          <div className="login-field-group login-field-group-secondary">
            <label className="login-field-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className="login-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
        )}

        {isClinic && mode !== "reset-password" ? (
          <div className="login-field-group login-field-group-secondary">
            <label className="login-field-label" htmlFor="login-organization">
              Organization
            </label>
            <input
              id="login-organization"
              className="login-input"
              type="text"
              value={organization}
              onChange={(event) => setOrganization(event.target.value)}
            />
          </div>
        ) : null}

        {mode !== "reset-password" && (
          <label className="login-checkbox-row" htmlFor="remember-email">
            <input
              id="remember-email"
              type="checkbox"
              checked={rememberEmail}
              onChange={(event) => setRememberEmail(event.target.checked)}
            />
            Remember email on this device
          </label>
        )}

        {mode === "sign-in" && (
          <button
            type="button"
            className="login-forgot-password"
            onClick={() => setMode("reset-password")}
          >
            Forgot password?
          </button>
        )}

        {errorMessage ? <p className="login-error-message">{errorMessage}</p> : null}

        {resetMessage ? (
          <p className="login-success-message">{resetMessage}</p>
        ) : null}

        <div className="login-actions">
<<<<<<< Updated upstream
          <button
            type="button"
            className="atlas-button atlas-button-variant-back login-create-account"
            onClick={() => setMode(mode === "sign-in" ? "create" : "sign-in")}
          >
            {mode === "sign-in" ? "Create Account" : "Back to Sign In"}
          </button>
          <button
            type="submit"
            className="atlas-button atlas-button-variant-3 login-next"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : mode === "sign-in"
                ? "Sign In"
                : "Create + Continue"}
          </button>
=======
          {mode === "reset-password" ? (
            <>
              <button
                type="button"
                className="atlas-button atlas-button-variant-back login-create-account"
                onClick={() => setMode("sign-in")}
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                className="atlas-button atlas-button-variant-3 login-next"
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : "Send Reset Link"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="atlas-button atlas-button-variant-back login-create-account"
                onClick={() => setMode(mode === "sign-in" ? "create" : "sign-in")}
              >
                {mode === "sign-in" ? "Create Account" : "Back to Sign In"}
              </button>
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
            </>
          )}
>>>>>>> Stashed changes
        </div>
      </form>
    </section>
  );
}
