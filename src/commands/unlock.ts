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

const embeds = require('../../embeds/commands/unlock.json');

export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('unlock a channel')
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

        if (channel.permissionsFor(role.id).has(PermissionsBitField.Flags.SendMessages))return interaction.reply({
            embeds: [ this.embeds.already_unlock ]
        });

        return channel.permissionOverwrites.edit(role.id, { SendMessages: true })
            .then(() => {
                if (interaction.options.getChannel('role'))return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.unlocked_role, ['{channel}', '{role}'], [channel.toString(), role.toString()]) ]
                });
                else return interaction.reply({
                    embeds: [ replaceEmbed(this.embeds.unlocked_everyone, ['{channel}'], [channel.toString()]) ]
                });
            })
            .catch(() => {
                return interaction.reply({
                    embeds: [ this.embeds.error ]
                });
            })
    }
}