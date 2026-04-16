import { Check } from "lucide-react";

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all duration-300 ${
              isCompleted ? "bg-accent text-white" :
              isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
              "bg-muted text-muted-foreground"
            }`}>
              {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden sm:block text-sm font-medium ${
              isCurrent ? "text-foreground" : "text-muted-foreground"
            }`}>
              {step}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 rounded-full transition-colors ${
                isCompleted ? "bg-accent" : "bg-muted"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}