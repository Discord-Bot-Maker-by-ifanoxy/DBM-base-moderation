import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
import {strToMs} from "../src/functions/strToMs";
const embeds = require('../../embeds/commands/softban.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('v a guild member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to softban')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the softban')
                .setRequired(false)
                .setMaxLength(512)
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        const modMember = await interaction.guild.members.fetch(interaction.user.id);
        const reason = interaction.options.getString('reason');


        if (!hasBetterPermsThan(modMember, targetMember))return interaction.reply({
            embeds: [ this.embeds.has_lower_perms ]
        });


        return targetMember.ban({reason, deleteMessageSeconds: 14 * 24 * 60 * 60})
            .then((m) => {
                return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.banned, ['{member}', '{reason}'], [targetMember.toString(), reason ?? 'No reason provided']) ]
                });
                interaction.guild.bans.remove(m.id);
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.cannot_ban ]
                });
            });
    }
}