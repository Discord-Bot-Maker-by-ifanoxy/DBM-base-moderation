import {
    APIEmbed,
    ChannelType,
    ChatInputCommandInteraction,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {replaceEmbed} from "../src/functions/replacerArray";

const embeds = require('../../embeds/commands/lock.json');

export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('lock a channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels)
        .addRoleOption(
            opt => opt
                .setName('role')
                .setDescription('define a specific role')
                .setRequired(false)
        )
        .addChannelOption(
            opt => opt
                .setName('channel')
                .setDescription('define a specific channel')
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const channel = await client.channels.fetch(interaction.options.getChannel('channel').id ?? interaction.channelId) as TextChannel;
        const role = interaction.options.getChannel('role') ?? interaction.guild.roles.everyone;

        if (!channel.permissionsFor(role.id).has(PermissionsBitField.Flags.SendMessages))return interaction.reply({
            embeds: [ this.embeds.already_lock ]
        });

        return channel.permissionOverwrites.edit(role.id, { SendMessages: false })
            .then(() => {
                if (interaction.options.getChannel('role'))return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.locked_role, ['{channel}', '{role}'], [channel.toString(), role.toString()]) ]
                });
                else return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.locked_everyone, ['{channel}'], [channel.toString()]) ]
                });
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.error ]
                });
            })
    }
}