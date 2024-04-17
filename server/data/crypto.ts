import crypto from 'crypto';
import sodium from "libsodium-wrappers";

export function encryptSecretGhPrisma(plaintext: string, key: string): string {
    const keyBuffer = Buffer.from(key, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('hex') + ':' + encrypted;
}

export function decryptSecretGhPrisma(ciphertext: string, key: string): string {
    const keyBuffer = Buffer.from(key, 'hex');
    const parts = ciphertext.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export async function cryptSecretGh(value: string, repoPublicKey: string) {
    await sodium.ready;
    const binkey = sodium.from_base64(repoPublicKey, sodium.base64_variants.ORIGINAL)
    const binsec = sodium.from_string(value)
    const encBytes = sodium.crypto_box_seal(binsec, binkey)
    const encryptSecretGhPrismaedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
    return encryptSecretGhPrismaedValue
}