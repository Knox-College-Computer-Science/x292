import "./LoginComponent.css";
import { useState } from "react";
import {
  AuthSession,
  Role,
  loginUser,
  registerUser,
  storeSession,
} from "../api";

type LoginComponentProps = {
  role: Role;
  initialEmail?: string;
  secondaryLabelText?: string;
  onAuthSuccess?: (session: AuthSession, isSignUp: boolean) => void;
};

export default function LoginComponent({
  role,
  initialEmail = "",
  secondaryLabelText,
  onAuthSuccess,
}: LoginComponentProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const session = await loginUser({ email: email.trim(), password });
      storeSession(session);
      onAuthSuccess?.(session, false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateAccount() {
    setErrorMessage("");
    setIsLoading(true);

    try {
      const session = await registerUser({
        email: email.trim(),
        password,
        role,
      });

      storeSession(session);
      if (secondaryLabelText && !secondaryValue.trim()) {
        setErrorMessage("Please add your organization name.");
        return;
      }
      onAuthSuccess?.(session, true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create account right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="login-component" aria-label="Log in">
      <div className="login-logo-placeholder" aria-hidden="true" />

      <form className="login-form" aria-label="Authentication form">
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
            autoComplete="email"
            required
          />
        </div>

        {secondaryLabelText ? (
          <div className="login-field-group login-field-group-secondary">
            <label className="login-field-label" htmlFor="login-secondary">
              {secondaryLabelText}
            </label>
            <input
              id="login-secondary"
              className="login-input"
              type="text"
              value={secondaryValue}
              onChange={(event) => setSecondaryValue(event.target.value)}
            />
          </div>
        ) : null}

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
            autoComplete="current-password"
            minLength={6}
            required
          />
          <button
            type="button"
            className="login-forgot-email"
            onClick={() => setErrorMessage("Use your account email and password.")}
          >
            Need help?
          </button>
        </div>

        {errorMessage ? (
          <div className="login-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
      </form>

      <div className="login-actions">
        <button
          type="button"
          className="atlas-button atlas-button-variant-1 login-create-account"
          onClick={handleCreateAccount}
          disabled={isLoading || !email.trim() || !password.trim()}
        >
          Create Account
        </button>
        <button
          type="button"
          className="atlas-button atlas-button-variant-3 login-next"
          onClick={handleSignIn}
          disabled={isLoading || !email.trim() || !password.trim()}
        >
          Sign In
        </button>
      </div>
    </section>
  );
}
