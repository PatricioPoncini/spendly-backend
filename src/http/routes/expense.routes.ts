import { Category } from "@db/models";
import { Expense } from "@db/models/Expense";
import { paramIdValidator, schemaValidator } from "@utils/validator";
import { Hono } from "hono";
import { z } from "zod";
import { authMiddleware } from "../middlewares";
import { literal, Op } from "sequelize";

const createExpenseSchema = z.object({
  description: z.string().nonempty(),
  amount: z.number().nonnegative(),
  categoryId: z.string().nonempty().uuid(),
  spentAt: z.string().datetime(),
});

const getExpensesByMonthSchema = z.object({
  month: z.coerce.number().nonnegative().min(1).max(12),
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
    spentAt: new Date(data.spentAt),
  });

  return c.json({ message: "Expense successfully saved" }, 200);
});

r.get("/", authMiddleware, async (c) => {
  const user = c.get("user");

  const expenses = await Expense.findAll({
    where: { userId: user.userId },
    include: "category",
  });

  return c.json(expenses, 200);
});

r.get(
  "/byMonth/:month",
  authMiddleware,
  paramIdValidator(getExpensesByMonthSchema),
  async (c) => {
    const user = c.get("user");
    const { month } = c.req.valid("param");

    const expenses = await Expense.findAll({
      where: {
        userId: user.userId,
        [Op.and]: [
          literal(`EXTRACT(MONTH FROM "Expense"."spentAt") = ${month}`),
          literal(
            `EXTRACT(YEAR FROM "Expense"."spentAt") = ${new Date().getFullYear()}`,
          ),
        ],
      },
      include: "category",
    });

    return c.json(expenses, 200);
  },
);

export default r;
