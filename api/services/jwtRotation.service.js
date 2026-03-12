import jwt from 'jsonwebtoken';
import config from '../config.js';

class JwtRotationService {
  constructor() {
    this.secret = config.jwtSecret;
    this.expire = config.jwtExpire;
  }

  generateToken(payload, options = {}) {
    return jwt.sign(payload, this.secret, {
      expiresIn: options.expiresIn || this.expire,
      ...options
    });
  }

  verifyToken(token, options = {}) {
    const secret = options.fallbackSecret || this.secret;
    return jwt.verify(token, secret);
  }

  decodeToken(token) {
    return jwt.decode(token);
  }
}

const jwtRotationService = new JwtRotationService();
export default jwtRotationService;
