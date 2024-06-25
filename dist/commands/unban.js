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
const embeds = require('../../embeds/commands/unban.json');
exports.default = {
    embeds: embeds,
    builder: new discord_js_1.SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a member')
        .setDefaultMemberPermissions(discord_js_1.PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)
        .addStringOption(user => user
        .setName('member')
        .setDescription('member to unban')
        .setAutocomplete(true)
        .setRequired(true)),
    autocomplete(client, interaction, plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            const bans = yield interaction.guild.bans.fetch();
            const focused = interaction.options.getFocused();
            return interaction.respond(bans
                .map(x => ({ name: `${x.user.username}`, value: x.user.id }))
                .filter(x => x.name.includes(focused))
                .slice(0, 25));
        });
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const memberId = interaction.options.getString('member');
            return interaction.guild.bans.remove(memberId)
                .then((m) => {
                return interaction.reply({
                    embeds: [(0, replacerArray_1.replaceEmbed)(this.embeds.unbanned, ['{member}'], [m.username])]
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
