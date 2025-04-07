import {
  DataTypes,
  Model,
  Sequelize,
  type CreationAttributes,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare logo: string;
}

export type CategoryAttributes = CreationAttributes<Category>;

const init = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: true,
      version: true,
    },
  );
};

export default {
  init,
  associate: () => {},
};
