import { createSubjects } from "@openauthjs/openauth";
import { z } from "zod";

export const subjects = createSubjects({
  user: z.object({
    userId: z.string(),
    identifer: z.string(),
    role: z.enum(["user", "admin", "root"]),
    scopes: z.array(z.string()),
    approved: z.boolean(),
  }),
});
