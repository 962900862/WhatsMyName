import Header from "@/components/admin/layouts/dashboard/header";
import { Form as FormSlotType } from "@/types/slots/form";

export default function ({ ...form }: FormSlotType) {
  return (
    <div className="space-y-6">
      {form.crumb && <Header crumb={form.crumb} />}
      <div>
        <h3 className="text-lg font-medium">{form.title}</h3>
        <p className="text-sm text-muted-foreground">{form.description}</p>
      </div>
      {form.tip && (
        <p className="text-sm text-muted-foreground">
          {form.tip.description || form.tip.title}
        </p>
      )}
    </div>
  );
}
