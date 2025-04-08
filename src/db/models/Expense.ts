import {
  DataTypes,
  Model,
  Sequelize,
  type CreationAttributes,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";
import { User } from "./User";
import { Category } from "./Category";

export class Expense extends Model<
  InferAttributes<Expense>,
  InferCreationAttributes<Expense>
> {
  declare id: CreationOptional<string>;
  declare amount: number;
  declare description: string;
  declare userId: string;
  declare categoryId: string;
}

export type ExpenseAttributes = CreationAttributes<Expense>;

const init = (sequelize: Sequelize) => {
  Expense.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "expenses",
      timestamps: true,
      version: true,
    },
  );
};

export default {
  init,
  associate: () => {
    User.hasMany(Expense, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "expenses",
      onDelete: "CASCADE",
    });
    Expense.belongsTo(User, {
      foreignKey: "userId",
      as: "user",
      targetKey: "id",
    });
    Category.hasMany(Expense, {
      foreignKey: "categoryId",
      sourceKey: "id",
      as: "expenses",
      onDelete: "CASCADE",
    });
    Expense.belongsTo(Category, {
      foreignKey: "categoryId",
      as: "category",
      targetKey: "id",
    });
  },
};
