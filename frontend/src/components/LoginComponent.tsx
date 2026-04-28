import "./LoginComponent.css";

type LoginComponentProps = {
  labelText: string;
  secondaryLabelText?: string;
  onCreateAccount?: () => void;
  onNext?: () => void;
};

export default function LoginComponent({
  labelText,
  secondaryLabelText,
  onCreateAccount,
  onNext,
}: LoginComponentProps) {
  return (
    <section className="login-component" aria-label="Log in">
      <div className="login-logo-placeholder" aria-hidden="true" />

      <form className="login-form" aria-label={`${labelText} form`}>
        <div className="login-field-group">
          <label className="login-field-label" htmlFor="login-email">
            {labelText}
          </label>
          <input id="login-email" className="login-input" type="email" />
          <button type="button" className="login-forgot-email">
            forgot email?
          </button>
        </div>

        {secondaryLabelText ? (
          <div className="login-field-group login-field-group-secondary">
            <label className="login-field-label" htmlFor="login-secondary">
              {secondaryLabelText}
            </label>
            <input id="login-secondary" className="login-input" type="text" />
          </div>
        ) : null}
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
