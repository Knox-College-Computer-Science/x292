import "./LoginComponent.css";

type ClinicLoginComponentProps = {
  onCreateAccount?: () => void;
  onNext?: () => void;
};

export default function ClinicLoginComponent({
  onCreateAccount,
  onNext,
}: ClinicLoginComponentProps) {
  return (
    <section className="login-component" aria-label="Organization log in">
      <div className="login-logo-placeholder" aria-hidden="true" />

      <form className="login-form" aria-label="Organization form">
        <div className="login-field-group">
          <label className="login-field-label" htmlFor="clinic-login-email">
            Sign in
          </label>
          <input id="clinic-login-email" className="login-input" type="email" />
          <button type="button" className="login-forgot-email">
            forgot email?
          </button>
        </div>

        <div className="login-field-group login-field-group-secondary">
          <label
            className="login-field-label"
            htmlFor="clinic-login-organization"
          >
            Organization
          </label>
          <input
            id="clinic-login-organization"
            className="login-input"
            type="text"
          />
        </div>
      </form>

      <div className="login-actions">
        <button
          type="button"
          className="atlas-button atlas-button-variant-back login-create-account"
          onClick={onCreateAccount}
        >
          Create Account
        </button>
        <button
          type="button"
          className="atlas-button atlas-button-variant-3 login-next"
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </section>
  );
}
