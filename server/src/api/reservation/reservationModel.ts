import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

// DTOs

export type Reservation = z.infer<typeof ReservationSchema>;
export type ProductDetail = z.infer<typeof ProductDetailSchema>;

export const ProductDetailSchema = z.object({
    name: z.string(),
    status: z.string(),
    charge: z.number()
});

export const ReservationSchema = z.object({
    uuid: z.string(),
    sum: z.number(),
    products: z.array(ProductDetailSchema)
});

export const GetReservationSchema = z.object({
    params: z.object({ 
        uuid: commonValidations.number,
        limit: commonValidations.number,
        page: commonValidations.number
    }),
});

// database scheme

export interface ProductAssignment {
    id: number,
    reservation_uuid: string,
    name: string
};

export interface ProductCharges {
    special_product_assignment_id: number,
    active: boolean,
    amount: number
}
