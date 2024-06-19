import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
const embeds = require('../../embeds/commands/kick.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick guild member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to kick')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the kick')
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

        await targetMember.kick(reason);

        return interaction.reply({
            embeds: [ replaceEmbed(this.embeds.kicked, ['{member}', '{reason}'], [targetMember.toString(), reason ?? 'No reason provided']) ]
        });
    }
}