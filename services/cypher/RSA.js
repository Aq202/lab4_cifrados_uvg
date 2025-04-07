import crypto from 'crypto';

// Firma
const signRSA = (privateKey, content) => {
  const signature = crypto.sign("sha256", Buffer.from(content), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING, // <- Debe ser el mismo en ambos
  });

  return signature.toString('base64');
};

// Verificación
const verifyRSA = (publicKey, content, signatureBase64) => {
  return crypto.verify(
    "sha256",
    Buffer.from(content),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING, // <- Igual que arriba
    },
    Buffer.from(signatureBase64, 'base64')
  );
};


export { signRSA, verifyRSA };
