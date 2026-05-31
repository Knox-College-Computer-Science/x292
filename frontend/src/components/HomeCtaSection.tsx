import "./HomeCtaSection.css";
import HomeInfoSection from "./HomeInfoSection";

type HomeCtaSectionProps = {
  onJoin: () => void;
};

export default function HomeCtaSection({ onJoin }: HomeCtaSectionProps) {
  return (
    <section className="help-section" aria-label="Call to action">
      <h2 className="help-title">Want to help out?</h2>
      <button
        type="button"
        className="atlas-button atlas-button-variant-1 join-button"
        onClick={onJoin}
      >
        Join us now!
      </button>
      <HomeInfoSection />
    </section>
  );
}
