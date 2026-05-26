import LoginComponent from "./LoginComponent";

type ClinicLoginComponentProps = {
  rememberedEmail?: string;
  onAuthenticate: (payload: {
    mode: "sign-in" | "create" | "reset-password";
    email: string;
    password: string;
    organization?: string;
    rememberEmail: boolean;
  }) => void | Promise<void>;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function ClinicLoginComponent(props: ClinicLoginComponentProps) {
  return <LoginComponent role="clinic" {...props} />;
}
