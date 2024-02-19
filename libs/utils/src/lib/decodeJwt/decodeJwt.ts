import { User } from './types';
import * as jwt from 'jsonwebtoken';

// TODO: Add method to retrieve jwt secret
const jwtSecret =
  '06e0qKAcM43QQHJwE+Xx+W/m7ykygrZpEXz4SqOGk983lcS04Yjd1iPo0ubxax5vRjrPCHdxQhdAnRpnsoZRSQ==';

export const decodeJwt = async (accessToken: string): Promise<User> => {
  return await new Promise<User>((resolve, reject) => {
    jwt.verify(accessToken, jwtSecret, (err, decoded) => {
      if (!err) {
        // Check if object contains all required keys
        const requiredKeys = ['id', 'firstName', 'lastName', 'emailAddress', 'organisation'];
        const decodedKeys = Object.keys(decoded as jwt.JwtPayload);

        const containsAllKeys = requiredKeys.every(key => decodedKeys.includes(key));

        if (!containsAllKeys) {
          reject('Access token provided is invalid');
        }
      }

      if (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            reject('Access token provided is expired');
            break;
          default:
            reject('Access token provided is invalid');
            break;
        }
      }

      resolve(decoded as User);
    });
  });
};
