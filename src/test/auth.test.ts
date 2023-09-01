import request from 'supertest';
import app from '~/services/express';
import User from '~/models/userModel';
import mongoose from 'mongoose';

describe('Authentication Test', () => {

    beforeEach(async () => {
        await User.findOneAndDelete({ email: "testuser@gmail.com" });

        // Enregistrez l'utilisateur
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({
                email: 'testuser@gmail.com',
                password: 'Azerty123!',
                firstname: "test",
                lastname: "test"
            });

        expect(res.status).toBe(201);
        expect(res.body.auth).toBe(true);
        expect(res.body.token).not.toBeNull();
    });

    afterEach(async () => {
        await User.findOneAndDelete({ email: "testuser@gmail.com" });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });


    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'testuser@gmail.com',
                password: 'Azerty123!'
            });

        expect(res.status).toBe(200);
        expect(res.body.auth).toBe(true);
        expect(res.body.token).not.toBeNull();
    });

    it('should fail login with incorrect credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'testuser@gmail.com',
                password: 'WrongPassword'
            });

        expect(res.status).toBe(401);
        expect(res.body.auth).toBe(false);
        expect(res.body.token).toBeNull();
    });
});
