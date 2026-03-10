import type { Request, Response } from "express";
import crypto from "crypto";
import { User } from "#models/User.js";

export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const { id, token } = req.query as { id?: string; token?: string };

    const frontend = process.env.FRONTEND_BASE_URL ?? "http://localhost:3000";

    if (!id || !token) {
      return res.redirect(`${frontend}/verify-email/error?reason=missing`);
    }

    const user = await User.findOne({ emailVerifyTokenId: id }).select("+password");
    if (!user) {
      return res.redirect(`${frontend}/verify-email/error?reason=not_found`);
    }

    if (user.isVerified) {
      return res.redirect(`${frontend}/verify-email/success?status=already_verified`);
    }

    if (!user.emailVerifyExpiresAt || user.emailVerifyExpiresAt.getTime() < Date.now()) {
      return res.redirect(`${frontend}/verify-email/error?reason=expired`);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (!user.emailVerifyTokenHash || tokenHash !== user.emailVerifyTokenHash) {
      return res.redirect(`${frontend}/verify-email/error?reason=invalid`);
    }

    user.isVerified = true;
    user.verifiedAt = new Date();

    // One-time use: clear token data
    user.emailVerifyTokenId = undefined;
    user.emailVerifyTokenHash = undefined;
    user.emailVerifyExpiresAt = undefined;

    await user.save();

    return res.redirect(`${frontend}/verify-email/success?status=verified`);
  } catch {
    const frontend = process.env.FRONTEND_BASE_URL ?? "http://localhost:3000";
    return res.redirect(`${frontend}/verify-email/error?reason=server`);
  }
}
