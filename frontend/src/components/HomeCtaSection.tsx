import "./HomeCtaSection.css";
import HomeInfoSection from "./HomeInfoSection";

type HomeCtaSectionProps = {
  onNavigateLogin: () => void;
};

export default function HomeCtaSection({
  onNavigateLogin,
}: HomeCtaSectionProps) {
  return (
    <section className="help-section" aria-label="Call to action">
      <h2 className="help-title">Want to help out?</h2>
      <button
        type="button"
        className="atlas-button atlas-button-variant-1 join-button"
        onClick={onNavigateLogin}
      >
        Join Now!
      </button>
      <HomeInfoSection />
    </section>
  );
}
