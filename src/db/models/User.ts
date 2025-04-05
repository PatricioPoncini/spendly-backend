import { DataTypes, Model, Sequelize, type CreationAttributes, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare firstName: string;
    declare lastName: string;
    declare userName: string;
    declare password: string;
}

export type UserAttributes = CreationAttributes<User>;

const init = (sequelize: Sequelize) => {
    User.init({
        id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "users", 
        timestamps: true,
        version: true
    })
}

export default {
    init,
    associate: () => {}
};