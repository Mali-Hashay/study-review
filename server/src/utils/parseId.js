import { HttpError } from './HttpError.js';

export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new HttpError(400, 'מזהה לא תקין');
  }
  return id;
}
