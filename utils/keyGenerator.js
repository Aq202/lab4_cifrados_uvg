import { generateKeyPair } from 'crypto';


const generateKeyPairAsync = (algorithm) => {
    return new Promise((resolve, reject) => {
        if (algorithm == 'RSA') {
            generateKeyPair(
                'rsa',
                {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                },
                (err, publicKey, privateKey) => {
                    if (err) return reject(err);
                    resolve({ publicKey, privateKey }); 
                }
            );

        } else if (algorithm === 'ECC') {
            generateKeyPair(
              'ec',
              {
                namedCurve: 'secp256k1',
                publicKeyEncoding: {
                  type: 'spki',
                  format: 'pem',
                },
                privateKeyEncoding: {
                  type: 'pkcs8',
                  format: 'pem',
                },
              },
              (err, publicKey, privateKey) => {
                if (err) return reject(err);
                resolve({ publicKey, privateKey });
              }
            );
            
        } else {
            reject(new Error('Algoritmo no soportado. Selecciona "RSA" o "ECC".'));
        }

    });
}

export { generateKeyPairAsync };
        