import { StatusCodes } from 'http-status-codes';

import { Reservation } from '@/api/reservation/reservationModel';
import { reservationRepository } from '@/api/reservation/reservationRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const reservationService = {

    findAll: async (limit: number, offset: number): Promise<ServiceResponse<Reservation[] | null>> => {
        try {
            const reservations = await reservationRepository.findAllAsync(limit, offset);
            if (!reservations) {
                return new ServiceResponse(ResponseStatus.Failed, 'No Reservations found', null, StatusCodes.NOT_FOUND);
            }
            return new ServiceResponse<Reservation[]>(ResponseStatus.Success, 'Reservation found', reservations, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error finding all reservations: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },

    findById: async (uuid: string): Promise<ServiceResponse<Reservation[] | null>> => {
        try {
            const reservations = await reservationRepository.findByIdAsync(uuid);
            if (!reservations) {
                return new ServiceResponse(ResponseStatus.Failed, 'No Reservations found', null, StatusCodes.NOT_FOUND);
            }
            return new ServiceResponse<Reservation[]>(ResponseStatus.Success, 'Reservation found', reservations, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error finding all reservations: $${(ex as Error).message}`;
            logger.error(errorMessage);
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

};
