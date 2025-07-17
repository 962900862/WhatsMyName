import { Table as TableSlotType } from "@/types/slots/table";

export default function ({ ...table }: TableSlotType) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{table.title}</h3>
        <p className="text-sm text-muted-foreground">{table.description}</p>
      </div>
      {table.tip && (
        <p className="text-sm text-muted-foreground">
          {table.tip.description || table.tip.title}
        </p>
      )}
      {/* 表格与工具条已移除 */}
    </div>
  );
}
