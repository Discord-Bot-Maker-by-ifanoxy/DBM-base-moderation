import {
    APIEmbed,
    AutocompleteInteraction,
    ChatInputCommandInteraction, EmbedBuilder,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import {DBMClient} from "../../lib/structures/DBMClient";
import Plugin from "../index";
import {idToUser} from "../src/functions/idToUser";
import {pagination} from "../src/functions/pagination";
import {replaceEmbed} from "../src/functions/replacerArray";
const embeds = require('../../embeds/commands/warns.json');

export default {
    embeds: embeds as { [k in keyof typeof embeds]: APIEmbed },
    builder: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Manager warns in your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand(
            sub => sub
                .setName('remove')
                .setDescription('Remove member\'s warn')
                .addStringOption(
                    opt => opt
                        .setName('member')
                        .setDescription('Select member')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addNumberOption(
                    opt => opt
                        .setName('warning')
                        .setDescription('Select the warn to remove')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(
            sub => sub
                .setName('list')
                .setDescription('List of all warnings of a member')
                .addUserOption(
                    opt => opt
                        .setName('member')
                        .setDescription('Select member')
                        .setRequired(true)
                )
        ),
    async autocomplete(client: DBMClient, plugin: Plugin, interaction: AutocompleteInteraction)
    {
        const focused = interaction.options.getFocused(true);
        switch (focused.name)
        {
            case "member" : {
                const warnsData = await plugin.warns.findAll({
                    where: { guild_id: interaction.guildId }
                });
                const filtered = (await Promise.all(
                    warnsData
                        .map(async x => ({
                            name: `${(await idToUser(client, x.target_id)).username}`,
                            value: x.target_id
                        }))
                ))
                    .filter(x => x.name.includes(focused.value));

                return interaction.respond(filtered.slice(25));
            }
            case "warning" : {
                const target_id = interaction.options.getString('member');

                const warnsData = await plugin.warns.findAll({
                    where: target_id ? { guild_id: interaction.guildId, target_id: target_id } : { guild_id: interaction.guildId }
                });

                const filtered = (await Promise.all(
                    warnsData
                        .map(async x => ({
                            name: `${(await idToUser(client, x.target_id)).username} (${x.created_date.toUTCString()}) - ${x.reason}`.slice(100),
                            value: x.id
                        }))
                ))
                    .filter(x => x.name.includes(focused.value));

                return interaction.respond(filtered.slice(25));
            }
        }
    },
    async execute(client: DBMClient, plugin: Plugin, interaction: ChatInputCommandInteraction)
    {
        switch (interaction.options.getSubcommand())
        {
            case 'remove' : {
                const warnId = interaction.options.getNumber('warning');

                const res = await plugin.warns.destroy({ where: { id: warnId }});

                if (res === 0)return interaction.reply({ embeds: [ this.embeds.remove_failed ]});
                else return interaction.reply({ embeds: [ this.embeds.deleted_successfully ]});
            }
            case 'list' : {
                const user = interaction.options.getUser('member');
                const warnsData = await plugin.warns.findAll({ where: { target_id: user.id }});
                const warnsFields = warnsData.map((x, i) => ({
                    name: `${i + 1}. ${x.created_date.toDateString()}`,
                    value: `> **Moderator:** <@${x.moderator_id}>\n> **Reason:** ${x.reason}`
                }));

                if (warnsData.length === 0)return interaction.reply({ embeds: [ this.embeds.user_dont_have_warn ]});
                else return pagination(
                    client,
                    warnsFields,
                    interaction,
                    new EmbedBuilder(replaceEmbed(this.embeds.warn_list, ['{number}', '{username}'], [warnsData.length, user.username]))
                );
            }
        }
    }
}