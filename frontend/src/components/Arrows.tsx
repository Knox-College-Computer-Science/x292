import "./Arrows.css";
import Tooltip from "./Tooltip";

type ArrowsProps = {
  className?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
};

export default function Arrows({
  className,
  onPrevious,
  onNext,
  previousLabel = "Previous",
  nextLabel = "Next",
}: ArrowsProps) {
  const rootClassName = className ? `arrows ${className}` : "arrows";

  return (
    <div className={rootClassName} aria-label="Navigation arrows">
      <Tooltip label={previousLabel}>
        <button
          type="button"
          className="arrows-button"
          onClick={onPrevious}
          aria-label={previousLabel}
        >
          <span className="arrows-shape arrows-shape-left" aria-hidden="true" />
        </button>
      </Tooltip>

      <Tooltip label={nextLabel}>
        <button
          type="button"
          className="arrows-button"
          onClick={onNext}
          aria-label={nextLabel}
        >
          <span
            className="arrows-shape arrows-shape-right"
            aria-hidden="true"
          />
        </button>
      </Tooltip>
    </div>
  );
}
