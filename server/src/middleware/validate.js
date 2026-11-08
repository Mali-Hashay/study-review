import { HttpError } from '../utils/HttpError.js';

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new HttpError(400, 'הנתונים שנשלחו אינם תקינים', details);
    }

    // Replace the body with the cleaned data (trimmed, unknown fields removed)
    req.body = result.data;
    next();
  };
}
