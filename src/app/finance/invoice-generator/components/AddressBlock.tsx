import type { AddressBlock } from "@/lib/tools/invoice";

const fieldClass =
    "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary";

interface AddressBlockProps {
    label: string;
    value: AddressBlock;
    onChange: (value: AddressBlock) => void;
}

export default function AddressBlockComponent({ label, value, onChange }: AddressBlockProps) {
    function handleChange(field: keyof AddressBlock, newValue: string) {
        onChange({ ...value, [field]: newValue });
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">{label}</h3>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Name</span>
                    <input
                        value={value.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={fieldClass}
                        placeholder="John Doe"
                    />
                </label>
                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Company</span>
                    <input
                        value={value.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        className={fieldClass}
                        placeholder="Company Name"
                    />
                </label>
                <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">Street Address</span>
                    <input
                        value={value.address}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className={fieldClass}
                        placeholder="123 Main St"
                    />
                </label>
                <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">City, State, ZIP</span>
                    <input
                        value={value.cityStateZip}
                        onChange={(e) => handleChange("cityStateZip", e.target.value)}
                        className={fieldClass}
                        placeholder="New York, NY 10001"
                    />
                </label>
                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                    <input
                        type="email"
                        value={value.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={fieldClass}
                        placeholder="email@example.com"
                    />
                </label>
                <label className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Phone</span>
                    <input
                        type="tel"
                        value={value.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className={fieldClass}
                        placeholder="+1 (555) 123-4567"
                    />
                </label>
            </div>
        </div>
    );
}
