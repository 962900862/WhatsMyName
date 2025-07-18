export const runtime = 'edge';
import { getOrdersByPaidEmail, getOrdersByUserUuid } from "@/models/order";
import { getUserEmail, getUserUuid } from "@/services/user";
import { headers } from "next/headers";

import { Order } from "@/types/order";
import { TableColumn } from "@/types/blocks/table";
import TableSlot from "@/components/admin/layouts/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getTranslations } from "next-intl/server";
import moment from "moment";
import { redirect } from "next/navigation";

export default async function MyOrdersPage() {
  const t = await getTranslations();
  const h = headers();
  const auth = h.get("Authorization");
  const token = auth ? auth.replace("Bearer ", "") : "";
  const user_uuid = await getUserUuid(token);
  const user_email = await getUserEmail();

  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/my-orders`;
  if (!user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let orders = await getOrdersByUserUuid(user_uuid);
  if (!orders || orders.length === 0) {
    orders = await getOrdersByPaidEmail(user_email);
  }

  const columns: TableColumn[] = [
    { name: "order_no", title: t("my_orders.table.order_no") },
    { name: "paid_email", title: t("my_orders.table.email") },
    { name: "product_name", title: t("my_orders.table.product_name") },
    {
      name: "amount",
      title: t("my_orders.table.amount"),
      callback: (item: Order) =>
        `${item.currency.toUpperCase() === "CNY" ? "¥" : "$"} ${
          item.amount / 100
        }`,
    },
    {
      name: "paid_at",
      title: t("my_orders.table.paid_at"),
      callback: (item: Order) =>
        moment(item.paid_at).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  const table: TableSlotType = {
    title: t("my_orders.title"),
    description: t("my_orders.description"),
    toolbar: {
      items: [
        {
          title: t("my_orders.read_docs"),
          icon: "RiBookOpenLine",
        },
        {
          title: t("my_orders.join_discord"),
          icon: "RiDiscordFill",
          url: "https://discord.gg/HQNnrzjZQS",
          target: "_blank",
        },
      ],
    },
    columns: columns,
    data: orders,
    empty_message: t("my_orders.no_orders"),
  };

  return <TableSlot {...table} />;
}
