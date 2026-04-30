import "./TextBox.css";

type TextBoxProps = {
  heading?: string;
  body?: string;
};

export default function TextBox({
  heading = "Heading Placeholder",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
}: TextBoxProps) {
  return (
    <section className="text-box" aria-label="Clinic ended info">
      <h2 className="text-box-heading">{heading}</h2>
      <div className="text-box-body">{body}</div>
    </section>
  );
}
