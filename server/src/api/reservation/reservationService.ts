import { StatusCodes } from 'http-status-codes';

import { Reservation } from '@/api/reservation/reservationModel';
import { reservationRepository } from '@/api/reservation/reservationRepository';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export const reservationService = {

    findAll: async (): Promise<ServiceResponse<Reservation[] | null>> => {
        try {
            const reservations = await reservationRepository.findAllAsync();
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

    // findById: async (id: number): Promise<ServiceResponse<User | null>> => {
    //     try {
    //         const user = await userRepository.findByIdAsync(id);
    //         if (!user) {
    //             return new ServiceResponse(ResponseStatus.Failed, 'User not found', null, StatusCodes.NOT_FOUND);
    //         }
    //         return new ServiceResponse<User>(ResponseStatus.Success, 'User found', user, StatusCodes.OK);
    //     } catch (ex) {
    //         const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
    //         logger.error(errorMessage);
    //         return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    //     }
    // },

};
