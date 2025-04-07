import { Category } from "@db/models";
import { schemaValidator } from "@utils/validator";
import { Hono } from "hono";
import { z } from "zod";

// TODO: Seguramente estos endpoints sean de prueba (al menos los POST y PUT), luego se
// pueden reemplazar con un seeder

const createCategorySchema = z.object({
  title: z.string().nonempty(),
  logo: z.string().nonempty(),
});

const r = new Hono().basePath("/category");

r.post("/", schemaValidator(createCategorySchema), async (c) => {
  const data = c.req.valid("json");

  await Category.create(data);

  return c.body(null, 204);
});

r.get("/", async (c) => {
  const categories = await Category.findAll();

  if (categories.length === 0) {
    return c.json({ message: "Categories not found" }, 404);
  }

  return c.json(categories, 200);
});

export default r;
