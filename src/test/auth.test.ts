
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login } from '../controllers/authController';
import FamAccueil from '../models/famAccueil';
import User from '../models/userModel';

jest.mock('../models/userModel');
jest.mock('..//models/famAccueil');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('..//config/config');

type MockResponse = {
    status: jest.MockedFunction<(code: number) => any>;
    send: jest.MockedFunction<(body: any) => void>;
};

let mockResponse: MockResponse;

type MockRequest = {
    body: {
        email: string;
        password: string;
    };
};

let mockRequest: MockRequest;


describe('login', () => {
    const SECRET_JWT = 'secret';

    beforeEach(() => {
        mockRequest = {
            body: {
                email: 'test@example.com',
                password: 'password123'
            }
        };
        mockResponse = {
            status: jest.fn().mockImplementation((code: number) => mockResponse),
            send: jest.fn()
        };
    });

    test('should login successfully as normal user', async () => {
        const mockUserData = {
            _id: 'userId',
            password: 'hashedPassword',
            isAdmin: false,
            isSuperAdmin: false,
            firstname: 'John'
        };
        const mockFamAccueilData = {
            id: 'famId',
            actif: true
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
        (FamAccueil.findOne as jest.Mock).mockResolvedValue(mockFamAccueilData);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');


        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.send).toHaveBeenCalledWith({
            token: 'fakeToken',
            auth: true,
            firstname: 'John',
            isAdmin: false,
            isSuperAdmin: false,
            isFamille: true
        });
    });

    test('should login successfully as admin user', async () => {
        const mockUserData = {
            _id: 'userId',
            password: 'hashedPassword',
            isAdmin: true,
            isSuperAdmin: false,
            firstname: 'John'
        };
        const mockFamAccueilData = {
            id: 'famId',
            actif: true
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
        (FamAccueil.findOne as jest.Mock).mockResolvedValue(mockFamAccueilData);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.send).toHaveBeenCalledWith({
            token: 'fakeToken',
            auth: true,
            firstname: 'John',
            isAdmin: true,
            isSuperAdmin: false,
            isFamille: true
        });
    });

    test('should login successfully as super admin user', async () => {
        const mockUserData = {
            _id: 'userId',
            password: 'hashedPassword',
            isAdmin: false,
            isSuperAdmin: true,
            firstname: 'John'
        };
        const mockFamAccueilData = {
            id: 'famId',
            actif: true
        };

        (User.findOne as jest.Mock).mockResolvedValue(mockUserData);
        (FamAccueil.findOne as jest.Mock).mockResolvedValue(mockFamAccueilData);
        (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');

        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.send).toHaveBeenCalledWith({
            token: 'fakeToken',
            auth: true,
            firstname: 'John',
            isAdmin: false,
            isSuperAdmin: true,
            isFamille: true
        });
    });

    test('should fail to login with incorrect password', async () => {
        // Setup mocks so that bcrypt.compareSync returns false
        // ...
        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });

    test('should fail to login with non-existing email', async () => {
        // Setup mocks so that User.findOne returns null
        // ...
        (User.findOne as jest.Mock).mockResolvedValue(null);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });

    test('should fail when there is an error retrieving the user', async () => {
        // Setup mocks so that User.findOne throws an error
        // ...
        (User.findOne as jest.Mock).mockResolvedValue(null);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });
});