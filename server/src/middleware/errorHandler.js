import { HttpError } from '../utils/HttpError.js';
import { env } from '../config/env.js';

// Express recognizes an error handler only by its 4 parameters, so `next` must stay.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, ...(err.details && { details: err.details }) },
    });
  }

  // Thrown by express.json() when the body is not valid JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'גוף הבקשה אינו JSON תקין' } });
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: 'שגיאה פנימית בשרת',
      ...(env.isProduction ? {} : { details: err.message }),
    },
  });
}
