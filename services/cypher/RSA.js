import { privateEncrypt, publicDecrypt } from 'crypto';

/**
 * Cifra un mensaje largo usando una llave privada en formato PEM, dividiendo en bloques pequeños
 * @param {string} privateKey - La llave privada en formato PEM
 * @param {string} data - El contenido a cifrar
 * @returns {string} - Texto cifrado en base64
 */
export const encryptWithPrivateKeyRSA = (privateKey, data) => {
  const buffer = Buffer.from(data, 'utf8');
  const maxChunkSize = 245; // Para RSA 2048 bits con PKCS#1 v1.5

  const encryptedChunks = [];
  for (let i = 0; i < buffer.length; i += maxChunkSize) {
    const chunk = buffer.subarray(i, i + maxChunkSize);
    const encrypted = privateEncrypt(privateKey, chunk);
    encryptedChunks.push(encrypted);
  }

  return Buffer.concat(encryptedChunks).toString('base64');
};

/**
 * Descifra un mensaje largo usando una llave pública en formato PEM, dividiendo en bloques
 * @param {string} publicKey - La llave pública en formato PEM
 * @param {string} encryptedBase64 - El texto cifrado en base64
 * @returns {string} - Texto descifrado en UTF-8
 */
export const decryptWithPublicKeyRSA = (publicKey, encryptedBase64) => {
  const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');
  const chunkSize = 256; // 2048 bits = 256 bytes por bloque

  const decryptedChunks = [];
  for (let i = 0; i < encryptedBuffer.length; i += chunkSize) {
    const chunk = encryptedBuffer.subarray(i, i + chunkSize);
    const decrypted = publicDecrypt(publicKey, chunk);
    decryptedChunks.push(decrypted);
  }

  return Buffer.concat(decryptedChunks).toString('utf8');
};
