import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const timeCommitments = ["Less than 1 hour/week", "1-3 hours/week", "3-5 hours/week", "5+ hours/week", "Flexible"];
const travelOptions = ["Local only (< 10 miles)", "Nearby (10-50 miles)", "Regional (50-100 miles)", "Willing to travel far", "Remote only"];
const participationModes = ["In-person", "Remote", "Either"];
const notifOptions = ["Email", "SMS", "Both", "None"];

export default function PreferencesStep({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Your Preferences</h2>
        <p className="text-muted-foreground text-sm mt-1">Help us find trials that fit your lifestyle</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="trial_interests" className="text-sm font-medium">Trial Interests</Label>
          <Textarea
            id="trial_interests"
            placeholder="What types of trials are you interested in? e.g., Cancer research, Diabetes management, Vaccine studies..."
            value={data.trial_interests || ""}
            onChange={(e) => update("trial_interests", e.target.value)}
            className="mt-1.5 min-h-[80px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Time Commitment</Label>
          <Select value={data.time_commitment || ""} onValueChange={(v) => update("time_commitment", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="How much time can you commit?" />
            </SelectTrigger>
            <SelectContent>
              {timeCommitments.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Travel Willingness</Label>
          <Select value={data.travel_willingness || ""} onValueChange={(v) => update("travel_willingness", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="How far are you willing to travel?" />
            </SelectTrigger>
            <SelectContent>
              {travelOptions.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Participation Preference</Label>
          <RadioGroup
            value={data.participation_preference || ""}
            onValueChange={(v) => update("participation_preference", v)}
            className="flex flex-wrap gap-4"
          >
            {participationModes.map((m) => (
              <div key={m} className="flex items-center gap-2">
                <RadioGroupItem value={m} id={`part-${m}`} />
                <Label htmlFor={`part-${m}`} className="text-sm cursor-pointer">{m}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Notification Preferences</Label>
          <Select value={data.notification_preferences || ""} onValueChange={(v) => update("notification_preferences", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="How would you like to be notified?" />
            </SelectTrigger>
            <SelectContent>
              {notifOptions.map((n) => (
                <SelectItem key={n} value={n}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}