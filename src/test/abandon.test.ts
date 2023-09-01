import mongoose from 'mongoose';
import request from 'supertest';
import AbandonAnimal from '~/models/abandonAnimal';
import app from '~/services/express';

describe('Create Abandon', () => {
    let newAbandonId: string
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

    it('should create abandon', async () => {
        const abandonData = {
            espece: "chien",
            race: "Inconnu",
            telephone: '0123456789',
            email: 'testcontact@gmail.com',
            content: 'This is a test content',
            nom: 'TestName',
            prenom: 'TestPrenom',
            age: "2"
        };
        const res = await request(app)
            .post('/api/v1/abandon')
            .set('Content-Type', 'application/json')
            .send(abandonData)
        expect(res.status).toBe(201);
        newAbandonId = res.body.abandon
    });

    it('should return a 500 error if there is a problem creating the abandon', async () => {
        const res = await request(app)
            .post(`/api/v1/abandon`)
        expect(res.status).toBe(500);
    });

    it('should return unauthorized to delete', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/contact/${newAbandonId}`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });
    it('should delete contact', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/abandon/${newAbandonId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);

    });
    it('should return 404 no contact', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/abandon/64f1d1e8d306ded4c33556da`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(404);

    });

});
describe('get All abandon', () => {

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


    afterEach(() => {
        jest.restoreAllMocks();
    });



    it('should get all abandons', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/abandon`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('abandons');
    });
    it('should return unauthorized', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/abandon`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);
    });
});

describe('get capacity', () => {


    afterAll(async () => {
        await mongoose.connection.close();
    });


    it('should get capacity', async () => {
        const res = await request(app)
            .get(`/api/v1/abandon/capacity`)
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('abandonChien');
        expect(res.body).toHaveProperty('abandonChat');
    });




});