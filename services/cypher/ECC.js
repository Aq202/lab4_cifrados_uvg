import crypto from 'crypto';


const signECC = (privateKeyPem, data) => {

    const sign = crypto.createSign('SHA256');
    sign.update(typeof data === 'string' ? Buffer.from(data) : data);
    
    const signOptions = {
      key: privateKeyPem,
      dsaEncoding: 'der'
    };
    
    return sign.sign(signOptions);
};

const verifyECC = (publicKeyPem, data, signature) => {

    const verify = crypto.createVerify('SHA256');
    verify.update(typeof data === 'string' ? Buffer.from(data) : data);
    
    const verifyOptions = {
      key: publicKeyPem,
      dsaEncoding: 'der'
    };
    
    return verify.verify(verifyOptions, signature);
};


export { signECC, verifyECC };