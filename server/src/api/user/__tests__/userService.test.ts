import { StatusCodes } from 'http-status-codes';
import { Mock } from 'vitest';

import { User } from '@/api/user/userModel';
import { userRepository } from '@/api/user/userRepository';
import { userService } from '@/api/user/userService';

vi.mock('@/api/user/userRepository');
vi.mock('@/server', () => ({
    ...vi.importActual('@/server'),
    logger: {
        error: vi.fn(),
    },
}));

describe('userService', () => {
    const mockUsers: User[] = [
        { id: 1, name: 'Alice', email: 'alice@example.com', age: 42, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Bob', email: 'bob@example.com', age: 21, createdAt: new Date(), updatedAt: new Date() },
    ];

    describe('findAll', () => {
        it('return all users', async () => {
            (userRepository.findAllAsync as Mock).mockReturnValue(mockUsers);
            const result = await userService.findAll();
            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.success).toBeTruthy();
            expect(result.message).toContain('Users found');
            expect(result.responseObject).toEqual(mockUsers);
        });

        it('returns a not found error for no users found', async () => {
            (userRepository.findAllAsync as Mock).mockReturnValue(null);
            const result = await userService.findAll();
            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('No Users found');
            expect(result.responseObject).toBeNull();
        });

        it('handles errors for findAllAsync', async () => {
            (userRepository.findAllAsync as Mock).mockRejectedValue(new Error('Database error'));
            const result = await userService.findAll();
            expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('Error finding all users');
            expect(result.responseObject).toBeNull();
        });
    });

    describe('findById', () => {
        it('returns a user for a valid ID', async () => {
            const testId = 1;
            const mockUser = mockUsers.find((user) => user.id === testId);
            (userRepository.findByIdAsync as Mock).mockReturnValue(mockUser);
            const result = await userService.findById(testId);
            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.success).toBeTruthy();
            expect(result.message).toContain('User found');
            expect(result.responseObject).toEqual(mockUser);
        });

        it('handles errors for findByIdAsync', async () => {
            const testId = 1;
            (userRepository.findByIdAsync as Mock).mockRejectedValue(new Error('Database error'));
            const result = await userService.findById(testId);
            expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain(`Error finding user with id ${testId}`);
            expect(result.responseObject).toBeNull();
        });

        it('returns a not found error for non-existent ID', async () => {
            const testId = 1;
            (userRepository.findByIdAsync as Mock).mockReturnValue(null);
            const result: any = await userService.findById(testId);
            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.success).toBeFalsy();
            expect(result.message).toContain('User not found');
            expect(result.responseObject).toBeNull();
        });
    });
});
