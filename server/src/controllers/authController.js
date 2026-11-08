import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';
import { findUserByEmail, findUserById, createUser } from '../repositories/usersRepository.js';

function signToken(user) {
  // The JWT standard expects "sub" (subject = who the token belongs to) to be a string
  return jwt.sign({ sub: String(user.id) }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function register(req, res) {
  const { name, email, password, registrationCode } = req.body;

  if (registrationCode !== env.registrationCode) {
    throw new HttpError(403, 'קוד ההזמנה שגוי');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new HttpError(409, 'כתובת האימייל כבר רשומה');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash);

  res.status(201).json({ user, token: signToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  const passwordMatches = user && (await bcrypt.compare(password, user.password_hash));

  // Same message for unknown email and wrong password, so nobody can probe which emails exist
  if (!passwordMatches) {
    throw new HttpError(401, 'אימייל או סיסמה שגויים');
  }

  const { password_hash: _, ...safeUser } = user;
  res.json({ user: safeUser, token: signToken(user) });
}

export async function me(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    throw new HttpError(401, 'המשתמשת לא נמצאה, יש להתחבר מחדש');
  }

  res.json({ user });
}
