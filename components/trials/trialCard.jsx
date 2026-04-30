import { MapPin, Clock, DollarSign, Wifi, FlaskConical, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TrialCard({ trial, onClick }) {
  const statusColor = trial.recruitment_status === "Recruiting"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-yellow-100 text-yellow-800 border-yellow-200";

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl border border-border shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Top accent bar */}
      <div className="h-2 bg-gradient-to-r from-primary to-accent" />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2">{trial.title}</h3>
            <p className="text-accent font-medium text-sm mt-1">{trial.condition}</p>
          </div>
          {trial.remote_eligible && (
            <Badge variant="outline" className="flex-shrink-0 gap-1 text-xs border-blue-200 text-blue-700 bg-blue-50">
              <Wifi className="h-3 w-3" /> Remote
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-2.5">
          {trial.study_type && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FlaskConical className="h-4 w-4 flex-shrink-0" />
              <span>{trial.study_type}{trial.study_phase && trial.study_phase !== "N/A" ? ` • ${trial.study_phase}` : ""}</span>
            </div>
          )}
          {trial.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{trial.location}</span>
            </div>
          )}
          {trial.compensation ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>{trial.compensation}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground/50 italic">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <span>Compensation info not available</span>
            </div>
          )}
          {trial.time_commitment && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{trial.time_commitment}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <Badge className={`text-xs ${statusColor}`}>
            {trial.recruitment_status || "Unknown"}
          </Badge>
          {trial.start_date && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {trial.start_date}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}