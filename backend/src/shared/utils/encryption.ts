import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = Buffer.from(
    process.env.CONFIG_ENCRYPTION_KEY!,
    "hex"
);

const IV_LENGTH = 16;
const TAG_LENGTH = 16;

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([
        iv,
        tag,
        encrypted,
    ]).toString("base64");
}

export function decrypt(cipherText: string): string {
    const buffer = Buffer.from(cipherText, "base64");

    const iv = buffer.subarray(0, IV_LENGTH);
    const tag = buffer.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + TAG_LENGTH);

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        ENCRYPTION_KEY,
        iv
    );

    decipher.setAuthTag(tag);

    return (
        decipher.update(encrypted, undefined, "utf8") +
        decipher.final("utf8")
    );
}