export const runtime = 'edge';
import { ApikeyStatus, insertApikey } from "@/models/apikey";

import { Apikey } from "@/types/apikey";
import Empty from "@/components/content/empty";
import FormSlot from "@/components/admin/layouts/console/slots/form";
import { Form as FormSlotType } from "@/types/slots/form";
import { getIsoTimestr } from "@/lib/time";
import { getNonceStr } from "@/lib/hash";
import { getTranslations } from "next-intl/server";
import { getUserUuid } from "@/services/user";
import { headers } from "next/headers";

export default async function CreateApiKeyPage() {
  const t = await getTranslations();
  const h = headers();
  const auth = h.get("Authorization");
  const token = auth ? auth.replace("Bearer ", "") : "";
  const user_uuid = await getUserUuid(token);
  if (!user_uuid) {
    return <Empty message="no auth" />;
  }

  const form: FormSlotType = {
    title: t("api_keys.create_api_key"),
    crumb: {
      items: [
        {
          title: t("api_keys.title"),
          url: "/api-keys",
        },
        {
          title: t("api_keys.create_api_key"),
          is_active: true,
        },
      ],
    },
    fields: [
      {
        title: t("api_keys.form.name"),
        name: "title",
        type: "text",
        placeholder: t("api_keys.form.name_placeholder"),
        validation: {
          required: true,
        },
      },
    ],
    passby: {
      user_uuid,
    },
    submit: {
      button: {
        title: t("api_keys.form.submit"),
      },
      handler: async (
        data: FormData,
        passby: { user_uuid: string }
      ) => {

        const { user_uuid } = passby;
        if (!user_uuid) {
          throw new Error("no auth");
        }

        const title = data.get("title") as string;
        if (!title || !title.trim()) {
          throw new Error("invalid params");
        }

        const key = `sk-${getNonceStr(32)}`;

        const apikey: Apikey = {
          user_uuid,
          api_key: key,
          title,
          created_at: getIsoTimestr(),
          status: ApikeyStatus.Created,
        };

        try {
          await insertApikey(apikey);

          return {
            status: "success",
            message: "apikey created",
            redirect_url: "/api-keys",
          };
        } catch (e: unknown) {
          console.error(e);
          if (e instanceof Error) {
            throw new Error("create api key failed: " + e.message);
          }
          throw new Error("An unknown error occurred while creating api key");
        }
      },
    },
  };

  return <FormSlot {...form} />;
}
