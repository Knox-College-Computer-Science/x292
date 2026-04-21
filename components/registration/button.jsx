import "./button.css";

const variantClassNames = {
  1: "registration-button--variant-1",
  2: "registration-button--variant-2",
  3: "registration-button--variant-3",
};

export default function RegistrationButton({
  variant = 1,
  children = "Button",
  className = "",
  type = "button",
  ...props
}) {
  const variantClassName = variantClassNames[variant] ?? variantClassNames[1];

  return (
    <button
      type={type}
      className={`registration-button ${variantClassName} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}