export const runtime = 'edge';
import Empty from "@/components/content/empty";
import TableSlot from "@/components/admin/layouts/console/slots/table";
import { Table as TableSlotType } from "@/types/slots/table";
import { getTranslations } from "next-intl/server";
import { getUserApikeys } from "@/models/apikey";
import { getUserUuid } from "@/services/user";
import moment from "moment";
import { Apikey } from "@/types/apikey";
import { headers } from "next/headers";

export default async function ApiKeysPage() {
  const t = await getTranslations();
  const h = headers();
  const auth = h.get("Authorization");
  const token = auth ? auth.replace("Bearer ", "") : "";
  const user_uuid = await getUserUuid(token);
  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const data = await getUserApikeys(user_uuid);

  const table: TableSlotType = {
    title: t("api_keys.title"),
    tip: {
      title: t("api_keys.tip"),
    },
    toolbar: {
      items: [
        {
          title: t("api_keys.create_api_key"),
          url: "/api-keys/create",
          icon: "RiAddLine",
        },
      ],
    },
    columns: [
      {
        title: t("api_keys.table.name"),
        name: "title",
      },
      {
        title: t("api_keys.table.key"),
        name: "api_key",
        type: "copy",
        callback: (item: Apikey) => {
          return item.api_key.slice(0, 4) + "..." + item.api_key.slice(-4);
        },
      },
      {
        title: t("api_keys.table.created_at"),
        name: "created_at",
        callback: (item: Apikey) => {
          return moment(item.created_at).fromNow();
        },
      },
    ],
    data,
    empty_message: t("api_keys.no_api_keys"),
  };

  return <TableSlot {...table} />;
}
