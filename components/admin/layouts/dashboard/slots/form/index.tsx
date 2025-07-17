import { Form as FormSlotType } from "@/types/slots/form";
import Header from "@/components/admin/layouts/dashboard/header";

export default function ({ ...form }: FormSlotType) {
  return (
    <>
      <Header crumb={form.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{form.title}</h1>
        {/* 表单渲染已移除 */}
      </div>
    </>
  );
}
