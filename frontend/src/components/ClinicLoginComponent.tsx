import { AuthSession } from "../api";
import LoginComponent from "./LoginComponent";

type ClinicLoginComponentProps = {
  initialEmail?: string;
  onAuthSuccess?: (session: AuthSession, isSignUp: boolean) => void;
};

export default function ClinicLoginComponent({
  initialEmail,
  onAuthSuccess,
}: ClinicLoginComponentProps) {
  return (
    <LoginComponent
      role="clinic"
      initialEmail={initialEmail}
      secondaryLabelText="Organization"
      onAuthSuccess={onAuthSuccess}
    />
  );
}
