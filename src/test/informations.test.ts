import mongoose from 'mongoose';
import request from 'supertest';
import Informations from '~/models/infoAssociation';
import app from '~/services/express';


describe('get Informations', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });


    it('should retrieve informations', async () => {

        const res = await request(app)
            .get(`/api/v1/info`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('informations');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        jest.spyOn(Informations, 'findOne').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .get(`/api/v1/info`)
        expect(res.status).toBe(500);
    });


})

describe('create Informations', () => {

    let adminUserToken: string;
    let superAdminUserToken: string

    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const superAdminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'superadmin@gmail.com', password: 'Azerty123!'
            });
        superAdminUserToken = superAdminUserResponse.body.token;
        expect(superAdminUserResponse.status).toBe(200);

    });

    it('should update informations', async () => {

        const infoData = {
            telephone: "0000000000"
        }

        const res = await request(app)
            .put(`/api/v1/info`)
            .set('Content-Type', 'application/json')
            .send(infoData)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Updated");
    });
    it('should return 403 unauthorized', async () => {

        const infoData = {
            telephone: "0000000000"
        }

        const res = await request(app)
            .put(`/api/v1/info`)
            .set('Content-Type', 'application/json')
            .send(infoData)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);
        expect(res.body.message).toBe("Unauthorized");
    });

    it('should return 500 db error', async () => {
        jest.spyOn(Informations, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .put(`/api/v1/info`)
            .set('Content-Type', 'application/json')
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });



})