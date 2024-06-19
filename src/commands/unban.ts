import {
    APIEmbed,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
import {strToMs} from "../src/functions/strToMs";
const embeds = require('../../embeds/commands/unban.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)
        .addStringOption(
            user => user
                .setName('member')
                .setDescription('member to unban')
                .setAutocomplete(true)
                .setRequired(true)
        ),
    async autocomplete(client: DBMClient, plugin: Plugin, interaction: AutocompleteInteraction) {
        const bans = await interaction.guild.bans.fetch();
        const focused = interaction.options.getFocused();

        return interaction.respond(
            bans
                .map(x => ({ name: `${x.user.username}`, value: x.user.id}))
                .filter(x => x.name.includes(focused))
                .slice(25)
        );
    },
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const memberId = interaction.options.getString('member');

        return interaction.guild.bans.remove(memberId)
            .then((m) => {
                return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.unbanned, ['{member}'], [m.username]) ]
                });
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.error ]
                });
            });
    }
}