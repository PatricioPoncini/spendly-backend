import { zValidator } from "@hono/zod-validator";
import { ZodObject, type ZodRawShape } from "zod";

export const schemaValidator = <T extends ZodRawShape>(
  schema: ZodObject<T>,
) => {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: "One or more fields are invalid. Please check your input" },
        400,
      );
    }
  });
};

export const paramIdValidator = <T extends ZodRawShape>(
  schema: ZodObject<T>,
) => {
  return zValidator("param", schema, (result, c) => {
    if (!result.success) {
      return c.json(
        { message: "The parameter is invalid. Please check it" },
        400,
      );
    }
  });
};
