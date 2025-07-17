import Header from "@/components/admin/layouts/dashboard/header";
import { Table as TableSlotType } from "@/types/slots/table";

export default function ({ ...table }: TableSlotType) {
  return (
    <>
      <Header crumb={table.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{table.title}</h1>
        {table.description && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.description}
          </p>
        )}
        {table.tip && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.tip.description || table.tip.title}
          </p>
        )}
        {/* 工具条与表格渲染已移除 */}
      </div>
    </>
  );
}
