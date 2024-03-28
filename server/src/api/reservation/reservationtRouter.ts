import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { GetReservationByIdSchema, GetReservationSchema, ReservationSchema } from '@/api/reservation/reservationModel';
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

    reservationRegistry.registerPath({
        method: 'get',
        path: '/reservations/{uuid}',
        tags: ['Reservations'],
        request: { params: GetReservationByIdSchema.shape.params },
        responses: createApiResponse(z.array(ReservationSchema), 'Success'),
    });

    router.get('/:uuid', validateRequest(GetReservationByIdSchema), async (req: Request, res: Response) => {
        const uuid = req.params.uuid as string;
        const serviceResponse = await reservationService.findById(uuid);
        handleServiceResponse(serviceResponse, res);
    });

    return router;

})();
