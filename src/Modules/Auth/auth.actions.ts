import crypto from "crypto";
import { IAuthentication } from "./auth.interfaces";

export const getRandom = () => crypto.randomBytes(128).toString("base64");
export const getHash = (salt: string, pwd: string) =>
  crypto
    .createHmac("sha256", [salt, pwd].join("/"))
    .update(Bun.env.SECRET_AUTH || "")
    .digest("hex");

export const isValidHash = (auth: IAuthentication, pwd: string) =>
  auth.password === getHash(auth.salt, pwd);
