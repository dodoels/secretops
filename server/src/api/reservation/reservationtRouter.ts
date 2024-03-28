import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetReservationSchema, ReservationSchema } from '@/api/reservation/reservationModel';
import { reservationService } from '@/api/reservation/reservationService';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

export const reservationRegistry = new OpenAPIRegistry();

reservationRegistry.register('Reservations', ReservationSchema);

export const reservationRouter: Router = (() => {
    const router = express.Router();

    reservationRegistry.registerPath({
        method: 'get',
        path: '/reservations',
        tags: ['Reservations'],
        responses: createApiResponse(z.array(ReservationSchema), 'Success'),
    });

    router.get('/', validateRequest(GetReservationSchema), async (req: Request, res: Response) => {
        const limit = parseInt(req.query.limit as string, 10);
        const offset = parseInt(req.query.offset as string, 10);
        const serviceResponse = await reservationService.findAll(limit, offset);
        handleServiceResponse(serviceResponse, res);
    });

    return router;

})();
