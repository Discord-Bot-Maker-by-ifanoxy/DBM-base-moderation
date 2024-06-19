import {APIEmbed, ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import {hasBetterPermsThan} from "../src/functions/hasBetterPermsThan";
import {replaceEmbed} from "../src/functions/replacerArray";
const embeds = require('../../embeds/commands/deafen.json');
export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('undeafen')
        .setDescription('undeafen guild member')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.DeafenMembers)
        .setDMPermission(false)
        .addUserOption(
            user => user
                .setName('member')
                .setDescription('member to undeafen')
                .setRequired(true)
        ),
    async execute(client: DBMClient, interaction: ChatInputCommandInteraction)
    {
        const targetMember = await interaction.guild.members.fetch(interaction.options.getUser('member'));

        if (!targetMember.voice.channel)return interaction.reply({
            embeds: [ this.embeds.not_in_voice ]
        });
        if (!targetMember.voice.deaf)return interaction.reply({
            embeds: [ this.embeds.already_deaf ]
        });

        await targetMember.voice.setDeaf(false);

        return interaction.reply({
            embeds: [ replaceEmbed(this.embeds.deafened, ['{member}'], [targetMember.toString()]) ]
        });
    }
}