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
const idToUser_1 = require("../src/functions/idToUser");
const pagination_1 = require("../src/functions/pagination");
const replacerArray_1 = require("../src/functions/replacerArray");
const embeds = require('../../embeds/commands/warns.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('warns')
        .setDescription('Manager warns in your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand(sub => sub
        .setName('remove')
        .setDescription('Remove member\'s warn')
        .addStringOption(opt => opt
        .setName('member')
        .setDescription('Select member')
        .setRequired(true)
        .setAutocomplete(true))
        .addNumberOption(opt => opt
        .setName('warning')
        .setDescription('Select the warn to remove')
        .setRequired(true)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub
        .setName('remove-all')
        .setDescription('Remove member\'s warn')
        .addStringOption(opt => opt
        .setName('member')
        .setDescription('Select member')
        .setRequired(true)
        .setAutocomplete(true)))
        .addSubcommand(sub => sub
        .setName('list')
        .setDescription('List of all warnings of a member')
        .addUserOption(opt => opt
        .setName('member')
        .setDescription('Select member')
        .setRequired(true))),
    autocomplete(client, interaction, plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            const focused = interaction.options.getFocused(true);
            switch (focused.name) {
                case "member": {
                    const warnsData = yield plugin.warns.findAll({
                        where: { guild_id: interaction.guildId }
                    });
                    const filtered = (yield Promise.all(warnsData
                        .map((x) => __awaiter(this, void 0, void 0, function* () {
                        return ({
                            name: `${(yield (0, idToUser_1.idToUser)(client, x.target_id)).username}`,
                            value: x.target_id
                        });
                    }))))
                        .filter(x => x.name.includes(focused.value));
                    return interaction.respond(filtered.slice(0, 25));
                }
                case "warning": {
                    const target_id = interaction.options.getString('member');
                    const warnsData = yield plugin.warns.findAll({
                        where: target_id ? { guild_id: interaction.guildId, target_id: target_id } : { guild_id: interaction.guildId }
                    });
                    const filtered = (yield Promise.all(warnsData
                        .map((x) => __awaiter(this, void 0, void 0, function* () {
                        return ({
                            name: `${(yield (0, idToUser_1.idToUser)(client, x.target_id)).username} (${x.created_date.toUTCString()}) - ${x.reason}`.slice(100),
                            value: x.id
                        });
                    }))))
                        .filter(x => x.name.includes(focused.value));
                    return interaction.respond(filtered.slice(0, 25));
                }
            }
        });
    },
    execute(client, interaction, plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (interaction.options.getSubcommand()) {
                case 'remove': {
                    const warnId = interaction.options.getNumber('warning');
                    const res = yield plugin.warns.destroy({ where: { id: warnId } });
                    if (res === 0)
                        return interaction.reply({ embeds: [this.embeds.remove_failed] });
                    else
                        return interaction.reply({ embeds: [this.embeds.deleted_successfully] });
                }
                case 'remove-all': {
                    const memberId = interaction.options.getString('member');
                    const res = yield plugin.warns.destroy({ where: { target_id: memberId } });
                    if (res === 0)
                        return interaction.reply({ embeds: [this.embeds.user_dont_have_warn] });
                    else
                        return interaction.reply({ embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.deleted_all_successfully, ['{number}'], [res])] });
                }
                case 'list': {
                    const user = interaction.options.getUser('member');
                    const warnsData = yield plugin.warns.findAll({ where: { target_id: user.id } });
                    const warnsFields = warnsData.map((x, i) => ({
                        name: `${i + 1}. ${x.created_date.toDateString()}`,
                        value: `> **Moderator:** <@${x.moderator_id}>\n> **Reason:** ${x.reason}`
                    }));
                    if (warnsData.length === 0)
                        return interaction.reply({ embeds: [this.embeds.user_dont_have_warn] });
                    else
                        return (0, pagination_1.pagination)(client, warnsFields, interaction, new discord_js_1.EmbedBuilder((0, replacerArray_1.replaceEmbed)(this.embeds.warn_list, ['{number}', '{username}'], [warnsData.length, user.username])));
                }
            }
        });
    }
};
