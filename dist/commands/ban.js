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
const hasBetterPermsThan_1 = require("../src/functions/hasBetterPermsThan");
const replacerArray_1 = require("../src/functions/replacerArray");
const embeds = require('../../embeds/commands/ban.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('tban')
        .setDescription('ban a member')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(user => user
        .setName('member')
        .setDescription('member to ban')
        .setRequired(true))
        .addStringOption(opt => opt
        .setName('reason')
        .setDescription('the reason for the ban')
        .setRequired(false)
        .setMaxLength(512))
        .addNumberOption(opt => opt
        .setName('delete-message')
        .setDescription('the reason for the ban')
        .setRequired(false)
        .addChoices({ name: 'Previous Hour', value: 3600 }, { name: 'Previous 6 Hours', value: 6 * 3600 }, { name: 'Previous 12 Hours', value: 12 * 3600 }, { name: 'Previous 24 Hours', value: 24 * 3600 }, { name: 'Previous 3 days', value: 3 * 24 * 3600 }, { name: 'Previous 7 days', value: 7 * 24 * 3600 })),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const targetMember = yield interaction.guild.members.fetch(interaction.options.getUser('member'));
            const modMember = yield interaction.guild.members.fetch(interaction.user.id);
            const reason = interaction.options.getString('reason');
            const deleteMessage = (_a = interaction.options.getNumber('delete-message')) !== null && _a !== void 0 ? _a : 0;
            if (!(0, hasBetterPermsThan_1.hasBetterPermsThan)(modMember, targetMember))
                return interaction.reply({
                    embeds: [this.embeds.has_lower_perms]
                });
            return targetMember.ban({ reason, deleteMessageSeconds: deleteMessage })
                .then((m) => {
                return interaction.reply({
                    embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.banned, ['{member}', '{reason}'], [targetMember.toString(), reason !== null && reason !== void 0 ? reason : 'No reason provided'])]
                });
            })
                .catch(() => {
                return interaction.reply({
                    embeds: [this.embeds.cannot_ban]
                });
            });
        });
    }
};
