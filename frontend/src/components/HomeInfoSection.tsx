import "./HomeInfoSection.css";

export default function HomeInfoSection() {
  return (
    <section className="info-section" aria-label="Information links">
      <div className="info-box">
        <div className="info-headings">
          <h3 className="info-heading features-heading">Our Features</h3>
          <h3 className="info-heading privacy-heading">Our Privacy Policy</h3>
        </div>
      </div>
    </section>
  );
}
