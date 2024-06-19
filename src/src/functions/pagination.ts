import {DBMClient} from "../../../lib/structures/DBMClient";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    EmbedBuilder,
    InteractionReplyOptions,
    InteractionUpdateOptions
} from "discord.js";

export async function pagination(
    client: DBMClient,
    data: { name: string, value: string}[],
    interaction: ChatInputCommandInteraction | ButtonInteraction,
    embed: EmbedBuilder,
    actual_page: number = 1,
) {
    const max_page = Math.ceil(data.length / 25);
    const createComponents = (d: boolean = false) => [new ActionRowBuilder<ButtonBuilder>().addComponents([
        new ButtonBuilder()
            .setEmoji('◀️')
            .setDisabled(d || actual_page <= 2)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('[no-check]left'),
        new ButtonBuilder()
            .setLabel(`${actual_page}/${max_page}`)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('[no-check]disabled')
            .setDisabled(true),
        new ButtonBuilder()
            .setEmoji('▶️')
            .setDisabled(d || actual_page >= max_page - 1)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('[no-check]right')
    ])];
    const opt: InteractionUpdateOptions & InteractionReplyOptions = {
        embeds: [ embed.setFields(data.slice((actual_page - 1) * 25,  actual_page * 25)) ],
        components: createComponents()
    };

    const message = await (interaction instanceof ChatInputCommandInteraction ? interaction.reply(opt) : interaction.update(opt));

    const res = message.awaitMessageComponent({
        time: 120 * 60 * 1000,
        componentType: ComponentType.Button
    });

    res.then(i => {
        pagination(client, data, i, embed, actual_page + (i.customId === '[no-check]left' ? -1 : 1));
    });

    res.catch(() => {
        message.edit({ components: createComponents(true)})
    });
}