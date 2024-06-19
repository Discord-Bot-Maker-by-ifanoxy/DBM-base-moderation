import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
import {strToMs} from "../src/functions/strToMs";
const embeds = require('../../embeds/commands/ban.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('tban')
        .setDescription('ban a member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to ban')
                .setRequired(true)
        )
        .addStringOption(
            opt => opt
                .setName('reason')
                .setDescription('the reason for the ban')
                .setRequired(false)
                .setMaxLength(512)
        )
        .addNumberOption(
            opt => opt
                .setName('delete-message')
                .setDescription('the reason for the ban')
                .setRequired(false)
                .addChoices(
                    { name: 'Previous Hour', value: 3600 },
                    { name: 'Previous 6 Hours', value: 6 * 3600 },
                    { name: 'Previous 12 Hours', value: 12 * 3600 },
                    { name: 'Previous 24 Hours', value: 24 * 3600 },
                    { name: 'Previous 3 days', value: 3 * 24 * 3600 },
                    { name: 'Previous 7 days', value: 7 * 24 * 3600 },
                )
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));
        const modMember = await interaction.guild.members.fetch(interaction.user.id);
        const reason = interaction.options.getString('reason');
        const deleteMessage = interaction.options.getNumber('delete-message') ?? 0;


        if (!hasBetterPermsThan(modMember, targetMember))return interaction.reply({
            embeds: [ this.embeds.has_lower_perms ]
        });


        return targetMember.ban({reason, deleteMessageSeconds: deleteMessage})
            .then((m) => {
                return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.baned, ['{member}', '{reason}'], [targetMember.toString(), reason ?? 'No reason provided']) ]
                });
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.cannot_ban ]
                });
            });
    }
}