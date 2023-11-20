import moment from 'moment';
import jwt from 'jsonwebtoken';
import normalizeEmail from 'normalize-email';

export const addSecondsWithCurrentTime = (seconds: number) => {
    return moment().add(seconds, "seconds");
  }
export const getNormalizedEmail = (email: String) => {
    try {
      let normalizedEmail = normalizeEmail(email.toString());
      if (!normalizedEmail.includes("@")) throw "";
      return { valid: true, normalizedEmail };
    } catch (error) {
      return { valid: false, normalizedEmail: null };
    }
  }


 export const generateCustomJwtToken = (payload: object, expiresInSeconds: number) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiresInSeconds,
      algorithm: "HS256",
    });
  }

 export const verifyCustomJwtToken = (token: string) => {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  export const getRandomOtp = (email: string): string => {
    if (process.env.NODE_ENV == "local") return "1234";
    const  lockedOtp = {
      'emon.ostad@gmail.com':'123456',
    };
    if (email && Object.keys(lockedOtp).includes(email)) {
      return lockedOtp['emon.ostad@gmail.com'];
    }
    let min = Math.ceil(100000);
    let max = Math.floor(999999);
    let otp = Math.floor(Math.random() * (max - min + 1) + min);
    if (process.env.NODE_ENV == "production") return otp.toString();
    return '123456';
  }
  

