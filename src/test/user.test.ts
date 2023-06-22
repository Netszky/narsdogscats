import { resetPassword } from '../controllers/userController';
import User from '~/models/userModel'; // Ajustez le chemin
import jwt from 'jsonwebtoken';
import { mailjet } from '../services/express';
import { Request, Response } from 'express';
import { MockResponse } from './auth.test';

jest.mock('jsonwebtoken');
jest.mock('../models/userModel');
jest.mock('~/services/express', () => ({
    mailjet: {
        post: jest.fn().mockImplementation(() => {
            return { request: () => Promise.resolve({}) };
        }),
    },
}));

let mockResponse: MockResponse;

describe('resetPassword', () => {
    type MockRequest = {
        body: {
            email: string;
        };
    };

    let mockRequest: MockRequest;
    beforeEach(() => {
        mockRequest = {
            body: {
                email: 'test@example.com',
            },
        };
        mockResponse = {
            status: jest.fn().mockImplementation((code: number) => mockResponse),
            send: jest.fn(),
        };
    });

    test('should send reset email if user found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example/com' });
        (jwt.sign as jest.Mock).mockReturnValue('fakeResetToken');
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            _id: 'fakeUserId',
            email: 'test@example.com',
            resetToken: 'fakeResetToken',
            firstname: "John"
        });
        (mailjet.post as jest.Mock).mockImplementation(() => {
            return { request: () => Promise.resolve({}) };
        });

        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "mail de reset envoyé" })
    });

    test('should respond with error if user not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "utilisateur non trouvé" });
    });

    test('should respond with error if email sending fails', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ _id: 'fakeUserId' });
        (jwt.sign as jest.Mock).mockReturnValue('fakeResetToken');
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            _id: 'fakeUserId',
            email: 'test@example.com',
            resetToken: 'fakeResetToken',
        });
        (mailjet.post as jest.Mock).mockReturnValue({
            request: jest.fn().mockRejectedValue(new Error('Email sending failed'))
        });
        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "Mail non envoyé" });
    });
});

describe('resetPassword', () => {
    type MockRequest = {
        body: {
            email: string;
        };
    };

    let mockRequest: MockRequest;
    beforeEach(() => {
        mockRequest = {
            body: {
                email: 'test@example.com',
            },
        };
        mockResponse = {
            status: jest.fn().mockImplementation((code: number) => mockResponse),
            send: jest.fn(),
        };
    });

    test('should send reset email if user found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example/com' });
        (jwt.sign as jest.Mock).mockReturnValue('fakeResetToken');
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            _id: 'fakeUserId',
            email: 'test@example.com',
            resetToken: 'fakeResetToken',
            firstname: "John"
        });
        (mailjet.post as jest.Mock).mockImplementation(() => {
            return { request: () => Promise.resolve({}) };
        });

        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "mail de reset envoyé" })
    });

    test('should respond with error if user not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);

        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "utilisateur non trouvé" });
    });

    test('should respond with error if email sending fails', async () => {
        (User.findOne as jest.Mock).mockResolvedValue({ _id: 'fakeUserId' });
        (jwt.sign as jest.Mock).mockReturnValue('fakeResetToken');
        (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({
            _id: 'fakeUserId',
            email: 'test@example.com',
            resetToken: 'fakeResetToken',
        });
        (mailjet.post as jest.Mock).mockReturnValue({
            request: jest.fn().mockRejectedValue(new Error('Email sending failed'))
        });
        await resetPassword(mockRequest as unknown as Request, mockResponse as unknown as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.send).toHaveBeenCalledWith({ message: "Mail non envoyé" });
    });
});


