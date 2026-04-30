import RegistrationButton from "./button";
import ExperienceSelect from "./experienceSelect";
import "./navBar.css";

export default function RegistrationNavBar({ experienceValue, onExperienceChange }) {
  return (
    <nav className="registration-nav-bar" aria-label="Primary navigation">
      <RegistrationButton className="registration-nav-home" variant={1}>
        Home
      </RegistrationButton>

      <div className="registration-nav-experience">
        <ExperienceSelect value={experienceValue} onChange={onExperienceChange} />
      </div>

      <RegistrationButton className="registration-nav-analytics" variant={1}>
        Analytics
      </RegistrationButton>

      <RegistrationButton className="registration-nav-trials" variant={1}>
        Trials
      </RegistrationButton>

      <RegistrationButton className="registration-nav-profile" variant={1}>
        Profile
      </RegistrationButton>
    </nav>
  );
}