import { zValidator } from "@hono/zod-validator";
import { ZodObject, type ZodRawShape } from "zod";

export const schemaValidator = <T extends ZodRawShape>(
  schema: ZodObject<T>,
) => {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: "One or more fields are invalid. Please check your input." },
        400,
      );
    }
  });
};
