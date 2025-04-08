import { Category } from "@db/models";
import { Expense } from "@db/models/Expense";
import { schemaValidator } from "@utils/validator";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../middlewares/jwt";

const createExpenseSchema = z.object({
  description: z.string().nonempty(),
  amount: z.number().nonnegative(),
  categoryId: z.string().nonempty().uuid(),
});

const r = new Hono().basePath("/expense");

r.post("/", authMiddleware, schemaValidator(createExpenseSchema), async (c) => {
  const data = c.req.valid("json");
  const user = c.get("user");

  const category = await Category.findOne({ where: { id: data.categoryId } });
  if (!category) {
    return c.json({ message: "Category not found" }, 404);
  }

  await Expense.create({
    amount: data.amount,
    categoryId: category.id,
    description: data.description,
    userId: user.userId,
  });

  return c.json({ message: "Expense successfully saved" }, 200);
});

r.get("/", authMiddleware, async (c) => {
  const user = c.get("user");

  const expenses = await Expense.findAll({
    where: { userId: user.userId },
    include: "category",
  });
  if (expenses.length === 0) {
    return c.json({ message: "Expenses not found" }, 404);
  }

  return c.json(expenses, 200);
});

export default r;
