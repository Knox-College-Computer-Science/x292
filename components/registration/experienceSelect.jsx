import RegistrationButton from "./button";

export default function ExperienceSelect({
  value,
  onChange,
  clinicsLabel = "Clinics",
  participantsLabel = "Participants",
}) {
  return (
    <div className="experience-select" role="group" aria-label="Experience select">
      <RegistrationButton variant={3} aria-pressed={value === "clinics"} onClick={() => onChange?.("clinics")}>
        {clinicsLabel}
      </RegistrationButton>
      <RegistrationButton variant={3} aria-pressed={value === "participants"} onClick={() => onChange?.("participants")}>
        {participantsLabel}
      </RegistrationButton>
    </div>
  );
}