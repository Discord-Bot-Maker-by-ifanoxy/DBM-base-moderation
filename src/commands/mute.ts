import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
import {strToMs} from "../src/functions/strToMs";
const embeds = require('../../embeds/commands/mute.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute a guild member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to mute')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('duration')
                .setDescription('duration of the mute')
                .setRequired(true)
                .setMaxLength(64)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the mute')
                .setRequired(false)
                .setMaxLength(512)
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        const modMember = await interaction.guild.members.fetch(interaction.user.id);
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason');

        try {
            const convertTime = strToMs(duration);
            if (convertTime === 0)return interaction.reply({
                embeds: [ this.embeds.unresolved_time ]
            });
        } catch {
            return interaction.reply({
                embeds: [ this.embeds.unresolved_time ]
            });
        }

        if (!hasBetterPermsThan(modMember, targetMember))return interaction.reply({
            embeds: [ this.embeds.has_lower_perms ]
        });

        const duration_ms = strToMs(duration)

        return targetMember.timeout(duration_ms, reason)
            .then(() => {
                return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.kicked, ['{member}', '{time}', '{reason}'], [targetMember.toString(), `<t:${Math.round((Date.now() + duration_ms)/1000)}:R>`, reason ?? 'No reason provided']) ]
                });
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.cannot_mute ]
                });
            });
    }
}