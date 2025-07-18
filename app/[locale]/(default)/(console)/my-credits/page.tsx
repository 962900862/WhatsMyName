export const runtime = 'edge';
import Empty from "@/components/content/empty";
import TableSlot from "@/components/admin/layouts/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { Credit } from "@/types/credit";
import { getCreditsByUserUuid } from "@/models/credit";
import { getTranslations } from "next-intl/server";
import { getUserCredits } from "@/services/credit";
import { getUserUuid } from "@/services/user";
import moment from "moment";
import { headers } from "next/headers";

export default async function MyCreditsPage() {
  const t = await getTranslations();
  const h = headers();
  const auth = h.get("Authorization");
  const token = auth ? auth.replace("Bearer ", "") : "";
  const user_uuid = await getUserUuid(token);

  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const data = await getCreditsByUserUuid(user_uuid, 1, 100);

  const userCredits = await getUserCredits(user_uuid);

  const table: TableSlotType = {
    title: t("my_credits.title"),
    tip: {
      title: t("my_credits.left_tip", {
        left_credits: userCredits?.left_credits || 0,
      }),
    },
    toolbar: {
      items: [
        {
          title: t("my_credits.recharge"),
          url: "/#pricing",
          target: "_blank",
        },
      ],
    },
    columns: [
      {
        title: t("my_credits.table.trans_no"),
        name: "trans_no",
      },
      {
        title: t("my_credits.table.trans_type"),
        name: "trans_type",
      },
      {
        title: t("my_credits.table.credits"),
        name: "credits",
      },
      {
        title: t("my_credits.table.updated_at"),
        name: "created_at",
        callback: (v: Credit) => {
          return moment(v.created_at).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    ],
    data,
    empty_message: t("my_credits.no_credits"),
  };

  return <TableSlot {...table} />;
}
