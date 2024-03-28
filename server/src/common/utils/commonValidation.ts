import { z } from 'zod';

export const commonValidations = {
    number: z
        .string()
        .refine((data) => !isNaN(Number(data)), 'must be a numeric value')
        .transform(Number)
        .refine((num) => num >= 0, 'must be a positive number'),
    uuid: z
        .string()
        .refine((uuid) => uuid.length > 0, 'must be a valid uuid')
};
