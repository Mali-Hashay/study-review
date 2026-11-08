import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string('חובה למלא שם').trim().min(1, 'השם ריק'),
  email: z.string('חובה למלא אימייל').trim().toLowerCase().email('כתובת האימייל אינה תקינה'),
  password: z
    .string('חובה למלא סיסמה')
    .min(8, 'הסיסמה צריכה להכיל לפחות 8 תווים')
    .max(72, 'הסיסמה יכולה להכיל לכל היותר 72 תווים'), // bcrypt ignores anything past 72 bytes
  registrationCode: z.string('חובה למלא קוד הזמנה').trim().min(1, 'קוד ההזמנה ריק'),
});

export const loginSchema = z.object({
  email: z.string('חובה למלא אימייל').trim().toLowerCase().email('כתובת האימייל אינה תקינה'),
  password: z.string('חובה למלא סיסמה').min(1, 'חובה למלא סיסמה'),
});
