import {CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model} from "sequelize";
import {Database} from "../../../lib/structures/Database";
import {ModelStatic} from "sequelize/types/model";

export interface WarnsModel extends Model<InferAttributes<WarnsModel>, InferCreationAttributes<WarnsModel>> {
    id: CreationOptional<number>;
    moderator_id: string;
    target_id: string;
    reason: string;
    guild_id: string;
    created_date: CreationOptional<Date>;
}

export function loadWarnsTables(database: Database): ModelStatic<WarnsModel> {
    return database.define<WarnsModel>('warns', {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false
        },
        moderator_id: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        guild_id: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        target_id: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        reason: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
}