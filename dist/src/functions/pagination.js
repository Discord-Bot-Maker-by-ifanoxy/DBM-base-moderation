"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const discord_js_1 = require("discord.js");
function pagination(client_1, data_1, interaction_1, embed_1) {
    return __awaiter(this, arguments, void 0, function* (client, data, interaction, embed, actual_page = 1) {
        const max_page = Math.ceil(data.length / 25);
        const createComponents = (d = false) => [new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder()
                    .setEmoji('◀️')
                    .setDisabled(d || actual_page <= 2)
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId('[no-check]left'),
                new discord_js_1.ButtonBuilder()
                    .setLabel(`${actual_page}/${max_page}`)
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId('[no-check]disabled')
                    .setDisabled(true),
                new discord_js_1.ButtonBuilder()
                    .setEmoji('▶️')
                    .setDisabled(d || actual_page == max_page - 1)
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setCustomId('[no-check]right')
            ])];
        const opt = {
            embeds: [embed.setFields(data.slice((actual_page - 1) * 25, actual_page * 25))],
            components: createComponents()
        };
        const message = yield (interaction instanceof discord_js_1.ChatInputCommandInteraction ? interaction.reply(opt) : interaction.update(opt));
        const res = message.awaitMessageComponent({
            time: 120 * 60 * 1000,
        });
        res.then(i => {
            pagination(client, data, interaction, embed, actual_page + (i.customId === '[no-check]left' ? -1 : 1));
        });
        res.catch(() => {
            message.edit({ components: createComponents(true) });
        });
    });
}
exports.pagination = pagination;
