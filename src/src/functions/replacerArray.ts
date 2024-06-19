import {APIEmbed} from "discord.js";

export function replaceArray(s: string, search: string[], replacer: any[])
{
    for (let i = 0; i < search.length; i++) {
        s = s.split(search[i]).join(replacer[i]);
    }
    return s
}

export function replaceEmbed(e: APIEmbed, search: string[], replace: any[]): APIEmbed
{
    return JSON.parse(replaceArray(JSON.stringify(e), search, replace)) as APIEmbed
}