import { z } from 'zod';

export const commonValidations = {
    number: z
        .string()
        .refine((data) => !isNaN(Number(data)), 'ID must be a numeric value')
        .transform(Number)
        .refine((num) => num > 0, 'ID must be a positive number')
};
