import { executeQuery } from "../../db/connection.js";

const savePublicKey = async({ userId, publicKey, algorithm }) => {
    const query = `
      INSERT INTO public_key (user_id, public_key, algorithm) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        public_key = VALUES(public_key),
        algorithm = VALUES(algorithm)
    `;
    const [result] = await executeQuery(query, [userId, publicKey, algorithm]);
    return result.insertId;
};

export { savePublicKey };