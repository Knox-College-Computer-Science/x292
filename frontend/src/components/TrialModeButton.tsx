type TrialModeButtonProps = {
  mode: "all" | "swipe";
  onClick: () => void;
};

export default function TrialModeButton({ mode, onClick }: TrialModeButtonProps) {
  const label = mode === "all" ? "All Trials" : "Swipe Trials";

  return (
    <button
      type="button"
      className="atlas-button atlas-button-variant-3 trial-mode-button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}