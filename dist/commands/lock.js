"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const replacerArray_1 = require("../src/functions/replacerArray");
const embeds = require('../../embeds/commands/lock.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('lock')
        .setDescription('lock a channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.ManageChannels)
        .addRoleOption(opt => opt
        .setName('role')
        .setDescription('define a specific role')
        .setRequired(false))
        .addChannelOption(opt => opt
        .setName('channel')
        .setDescription('define a specific channel')
        .setRequired(false)
        .addChannelTypes(discord_js_1.ChannelType.GuildText)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const channel = yield client.channels.fetch((_a = interaction.options.getChannel('channel').id) !== null && _a !== void 0 ? _a : interaction.channelId);
            const role = (_b = interaction.options.getChannel('role')) !== null && _b !== void 0 ? _b : interaction.guild.roles.everyone;
            if (!channel.permissionsFor(role.id).has(discord_js_1.PermissionsBitField.Flags.SendMessages))
                return interaction.reply({
                    embeds: [this.embeds.already_lock]
                });
            return channel.permissionOverwrites.edit(role.id, { SendMessages: false })
                .then(() => {
                if (interaction.options.getChannel('role'))
                    return interaction.reply({
                        embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.locked_role, ['{channel}', '{role}'], [channel.toString(), role.toString()])]
                    });
                else
                    return interaction.reply({
                        embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.locked_everyone, ['{channel}'], [channel.toString()])]
                    });
            })
                .catch(() => {
                return interaction.reply({
                    embeds: [this.embeds.error]
                });
            });
        });
    }
};
