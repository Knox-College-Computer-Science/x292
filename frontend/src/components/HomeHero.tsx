import owlFull from "../assets/owl-full.png";
import bearFull from "../assets/bear-full.png";
import "./HomeHero.css";

type HomeHeroProps = {
  selectedExperience: "clinics" | "participants";
};

export default function HomeHero({ selectedExperience }: HomeHeroProps) {
  const heroImage = selectedExperience === "clinics" ? owlFull : bearFull;

  return (
    <section className="home-hero-stage" aria-label="Welcome section">
      <div className="hero-box" aria-hidden="true">
        <img className="hero-image" src={heroImage} alt="" aria-hidden="true" />
      </div>
      <h1 className="hero-title">Welcome to Atlas</h1>
    </section>
  );
}
