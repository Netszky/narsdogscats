
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, register } from '../controllers/authController';
import FamAccueil from '../models/famAccueil';
import User from '../models/userModel';

jest.mock('../models/userModel');
jest.mock('../models/famAccueil');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

export type MockResponse = {
    status: jest.MockedFunction<(code: number) => any>;
    send: jest.MockedFunction<(body: any) => void>;
};

let mockResponse: MockResponse;

describe('login', () => {
    type MockRequest = {
        body: {
            email: string;
            password: string;
        };
    };

    let mockRequest: MockRequest;


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

        (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });

    test('should fail to login with non-existing email', async () => {

        (User.findOne as jest.Mock).mockResolvedValue(null);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });

    test('should fail when there is an error retrieving the user', async () => {

        (User.findOne as jest.Mock).mockResolvedValue(null);
        await login(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.send).toHaveBeenCalledWith({
            auth: false,
            token: null
        });
    });
});

describe('register', () => {
    const SECRET_JWT = 'secret';
    type MockRequest = {
        body: {
            firstname: string
            lastname: string
            email: string
            password: string
        };
    };

    let mockRequest: MockRequest;


    beforeEach(() => {
        mockRequest = {
            body: {
                firstname: "John",
                lastname: "Doe",
                email: "johndoe@gmail.com",
                password: "Azerty123!"
            }
        };
        mockResponse = {
            status: jest.fn().mockImplementation((code: number) => mockResponse),
            send: jest.fn()
        };
    });

    test('should register a new user successfully', async () => {
        const mockUserData = {
            _id: 'userId',
            isAdmin: false,
            isSuperAdmin: false,
            firstname: 'John'
        };

        (User.prototype.save as jest.Mock).mockResolvedValue(mockUserData);
        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');
        (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');

        await register(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith({
            token: 'fakeToken',
            auth: true,
            firstname: 'John',
            isAdmin: false,
            isSuperAdmin: false,
        });
    });

    test('should send an arror missing field', async () => {

        (User.prototype.save as jest.Mock).mockRejectedValue(new Error());
        (jwt.sign as jest.Mock).mockReturnValue('fakeToken');
        (bcrypt.hashSync as jest.Mock).mockReturnValue('hashedPassword');

        await register(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({
            message: "Erreur dans la création de l'utilisateur"
        });
    });

})