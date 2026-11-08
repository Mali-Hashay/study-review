import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'יש להתחבר כדי לגשת לתוכן הזה');
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.userId = Number(payload.sub);
  } catch {
    throw new HttpError(401, 'פג תוקף ההתחברות, יש להתחבר מחדש');
  }

  next();
}
