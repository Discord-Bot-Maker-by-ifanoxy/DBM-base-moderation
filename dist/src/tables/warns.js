"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWarnsTables = void 0;
const sequelize_1 = require("sequelize");
function loadWarnsTables(database) {
    return database.define('warns', {
        id: {
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false
        },
        moderator_id: {
            type: sequelize_1.DataTypes.STRING(32),
            allowNull: false
        },
        guild_id: {
            type: sequelize_1.DataTypes.STRING(32),
            allowNull: false
        },
        target_id: {
            type: sequelize_1.DataTypes.STRING(32),
            allowNull: false
        },
        reason: {
            type: sequelize_1.DataTypes.STRING(512),
            allowNull: false
        },
        created_date: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW
        }
    });
}
exports.loadWarnsTables = loadWarnsTables;
