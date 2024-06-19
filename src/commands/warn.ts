import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import Plugin from "../index";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
const embeds = require('../../embeds/commands/warn.json');

export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed},
    builder: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addUserOption(
            opt => opt
                .setName('member')
                .setDescription('The member to warn')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the warning')
                .setRequired(true)
                .setMaxLength(512)
        ),
    async execute(client: DBMClient, plugin: Plugin, interaction: ChatInputCommandInteraction)
    {
        const modMember = await interaction.guild.members.fetch(interaction.user.id);
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        const reason = interaction.options.getString('reason');

        if (!hasBetterPermsThan(modMember, targetMember))return interaction.reply({
            embeds: [ this.embeds.has_lower_perms ]
        });

        await plugin.warns.create({
            moderator_id: modMember.id,
            target_id: targetMember.id,
            reason: reason,
            guild_id: interaction.guildId
        });

        return interaction.reply({
            embeds: [ replaceEmbed(this.embeds.warned, ['{member}', '{reason}'], [targetMember.toString(), reason]) ]
        });
    }
}