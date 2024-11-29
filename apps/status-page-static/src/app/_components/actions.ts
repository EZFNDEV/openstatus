import { z } from "zod";

import { trackAnalytics } from "@openstatus/analytics";
import { and, eq, sql } from "@openstatus/db";
import { page, pageSubscriber } from "@openstatus/db/src/schema";
import { SubscribeEmail, sendEmail } from "@openstatus/emails";

const subscribeSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid Email",
    })
    .email(),
  slug: z.string(),
});

export async function handleSubscribe(formData: FormData) {
  alert('Not implemented');
}

const passwordSchema = z.object({
  password: z.string(),
  slug: z.string(),
});

export async function handleValidatePassword(formData: FormData) {
  alert('Not implemented');
}
