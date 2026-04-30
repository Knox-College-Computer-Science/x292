import "./TrialRating.css";

type TrialRatingProps = {
  value: string;
};

export default function TrialRating({ value }: TrialRatingProps) {
  return (
    <div className="trial-rating" aria-label="Trial rating">
      {value}
    </div>
  );
}
