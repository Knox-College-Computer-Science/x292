import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const genders = ["Male", "Female", "Non-binary", "Prefer not to say"];
const insuranceOptions = ["Insured", "Uninsured", "Student", "Other"];

export default function HealthInfoStep({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Health Information</h2>
        <p className="text-muted-foreground text-sm mt-1">This helps us match you with relevant trials</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              value={data.age || ""}
              onChange={(e) => update("age", parseInt(e.target.value) || "")}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Gender</Label>
            <Select value={data.gender || ""} onValueChange={(v) => update("gender", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="ethnicity" className="text-sm font-medium">Ethnicity</Label>
          <Input
            id="ethnicity"
            placeholder="e.g., Hispanic, Asian, Caucasian"
            value={data.ethnicity || ""}
            onChange={(e) => update("ethnicity", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="health_conditions" className="text-sm font-medium">Any Health Issues?</Label>
          <Textarea
            id="health_conditions"
            placeholder="Describe any current health conditions, medications, or relevant medical history..."
            value={data.health_conditions || ""}
            onChange={(e) => update("health_conditions", e.target.value)}
            className="mt-1.5 min-h-[100px]"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Insurance or Student Status</Label>
          <Select value={data.insurance_status || ""} onValueChange={(v) => update("insurance_status", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {insuranceOptions.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={data.consent_given || false}
              onCheckedChange={(v) => update("consent_given", v)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                Consent to Data Usage *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                I consent to having my health information used for matching with clinical trials. 
                I understand I can withdraw consent and control matching fields in Privacy Settings at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}