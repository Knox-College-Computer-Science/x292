type TrialModeButtonProps = {
  mode: "all" | "swipe";
  onClick: () => void;
};

import Tooltip from "./Tooltip";

export default function TrialModeButton({
  mode,
  onClick,
}: TrialModeButtonProps) {
  const label = mode === "all" ? "All Trials" : "Swipe Trials";

  return (
    <Tooltip
      label={
        mode === "all"
          ? "Browse all trials"
          : "Switch to swipe mode for one trial at a time"
      }
    >
      <button
        type="button"
        className="atlas-button atlas-button-variant-3 trial-mode-button"
        onClick={onClick}
      >
        {label}
      </button>
    </Tooltip>
  );
}
