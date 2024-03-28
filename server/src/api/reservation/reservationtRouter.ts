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

    router.get('/', async (_req: Request, res: Response) => {
        const serviceResponse = await reservationService.findAll();
        handleServiceResponse(serviceResponse, res);
    });

    // userRegistry.registerPath({
    //     method: 'get',
    //     path: '/users/{id}',
    //     tags: ['User'],
    //     request: { params: GetUserSchema.shape.params },
    //     responses: createApiResponse(UserSchema, 'Success'),
    // });

    // router.get('/:id', validateRequest(GetUserSchema), async (req: Request, res: Response) => {
    //     const id = parseInt(req.params.id as string, 10);
    //     const serviceResponse = await userService.findById(id);
    //     handleServiceResponse(serviceResponse, res);
    // });

    return router;
})();
