import { createSign, createVerify } from 'crypto';

/**
 * Firma un mensaje usando una llave privada ECC en formato PEM
 * @param {string} privateKey - La llave privada ECC en formato PEM
 * @param {string} data - El contenido a firmar
 * @returns {string} - Firma en base64
 */
export const signECC = (privateKey, data) => {
  const sign = createSign('sha256');
  sign.update(data);
  sign.end();
  const signature = sign.sign(privateKey);  // Firma con la clave privada ECC
  return signature.toString('base64');
};

/**
 * Verifica la firma de un mensaje usando una llave pública ECC en formato PEM
 * @param {string} publicKey - La llave pública ECC en formato PEM
 * @param {string} data - El contenido cuyo mensaje se desea verificar
 * @param {string} signatureBase64 - Firma en base64
 * @returns {boolean} - `true` si la firma es válida, `false` si no lo es
 */
export const verifyECC = (publicKey, data, signatureBase64) => {
  const verify = createVerify('sha256');
  verify.update(data);
  verify.end();
  const signature = Buffer.from(signatureBase64, 'base64');
  return verify.verify(publicKey, signature);
};

