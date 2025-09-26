"use strict";
const nodeCrypto = require("crypto");
function hashToken(token) {
    return nodeCrypto.createHash("sha256").update(token).digest("hex");
}
module.exports = { hashToken };
