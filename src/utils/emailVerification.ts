import crypto from "crypto";

export function generateEmailVerifyToken() {
  const tokenId = crypto.randomBytes(16).toString("hex");   // lookup id (store plain)
  const token = crypto.randomBytes(32).toString("hex");     // secret (send to user)

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return { tokenId, token, tokenHash };
}
