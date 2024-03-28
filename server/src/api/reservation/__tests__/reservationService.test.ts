import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { reservationRepository } from '@/api/reservation/reservationRepository';
import { reservationService } from '@/api/reservation/reservationService'

vi.mock('@/api/reservation/reservationRepository');

vi.mock('@/server', () => ({
    ...vi.importActual('@/server'),
    logger: {
        error: vi.fn(),
    },
}));

describe('reservationService', () => {

    describe('findAll', () => {

        it('return all reservations', async () => {
            const limit = 10, offset = 0;
            (reservationRepository.findAllAsync as Mock).mockReturnValue([]);
            const result = await reservationService.findAll(limit, offset);
            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.message).toContain('Reservation found');
            expect(result.responseObject).toEqual([]);
        });

        it('returns a not found error for no reservations found', async () => {
            const limit = 10, offset = 0;
            (reservationRepository.findAllAsync as Mock).mockReturnValue(null);
            const result = await reservationService.findAll(limit, offset);
            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('No Reservations found');
            expect(result.responseObject).toBeNull();
        });

        it('handles errors for findAllAsync', async () => {
            const limit = 10, offset = 0;
            (reservationRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));
            const result = await reservationService.findAll(limit, offset);
            expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('Error finding all reservations');
            expect(result.responseObject).toBeNull();
        });
    });

    describe('findById', () => {

        it('return reservation', async () => {
            (reservationRepository.findByIdAsync as Mock).mockReturnValue([]);
            const result = await reservationService.findById('uuid');
            console.log(result);
            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.message).toContain('Reservation found');
            expect(result.responseObject).toEqual([]);
        });

        it('returns a not found error for no reservations found', async () => {
            (reservationRepository.findByIdAsync as Mock).mockReturnValue(null);
            const result = await reservationService.findById('uuid');
            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('No Reservations found');
            expect(result.responseObject).toBeNull();
        });

        it('handles errors for findAllAsync', async () => {
            (reservationRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));
            const result = await reservationService.findById('uuid');
            expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('Error finding all reservations');
            expect(result.responseObject).toBeNull();
        });
    });

});
