import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
const embeds = require('../../embeds/commands/deafen.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('deafen')
        .setDescription('deafen guild member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to deafen')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the deafened')
                .setRequired(false)
                .setMaxLength(512)
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        const modMember = await interaction.guild.members.fetch(interaction.user.id);
        const reason = interaction.options.getString('reason');

        if (!targetMember.voice.channel)return interaction.reply({
            embeds: [ this.embeds.not_in_voice ]
        });
        if (targetMember.voice.deaf)return interaction.reply({
            embeds: [ this.embeds.already_deaf ]
        });
        if (!hasBetterPermsThan(modMember, targetMember))return interaction.reply({
            embeds: [ this.embeds.has_lower_perms ]
        });

        await targetMember.voice.setDeaf(true, reason);

        return interaction.reply({
            embeds: [ replaceEmbed(this.embeds.deafened, ['{member}', '{reason}'], [targetMember.toString(), reason ?? 'No reason provided']) ]
        });
    }
}