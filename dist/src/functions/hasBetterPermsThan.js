"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBetterPermsThan = void 0;
function hasBetterPermsThan(mod, target) {
    if (target.guild.ownerId === mod.id)
        return true;
    if (target.guild.ownerId === target.id)
        return false;
    if (target.permissions.has(mod.permissions.bitfield))
        return false;
    if (target.roles.highest.position >= mod.roles.highest.position)
        return false;
    return true;
}
exports.hasBetterPermsThan = hasBetterPermsThan;
