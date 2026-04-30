import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = ["English", "Spanish", "French", "Mandarin", "Arabic", "Portuguese", "Other"];

export default function BasicInfoStep({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Basic Information</h2>
        <p className="text-muted-foreground text-sm mt-1">Tell us a bit about yourself to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="text-sm font-medium">Full Name *</Label>
          <Input
            id="full_name"
            placeholder="John Doe"
            value={data.full_name || ""}
            onChange={(e) => update("full_name", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={data.email || ""}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={data.phone || ""}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
          <Input
            id="location"
            placeholder="City, State"
            value={data.location || ""}
            onChange={(e) => update("location", e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Preferred Language</Label>
          <Select value={data.preferred_language || ""} onValueChange={(v) => update("preferred_language", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}