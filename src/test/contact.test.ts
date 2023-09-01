import request from 'supertest';
import app from '~/services/express';

describe('CreateContact', () => {
    let newContactId: string
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


    it('should create contact', async () => {
        const contactData = {
            type: 'TypeTest',
            telephone: '0123456789',
            email: 'testcontact@gmail.com',
            content: 'This is a test content',
            nom: 'TestName',
            prenom: 'TestPrenom'
        };

        const res = await request(app)
            .post('/api/v1/contact/')
            .send(contactData)
        expect(res.status).toBe(201);
        newContactId = res.body.contact
    });

    it('should return a 500 error if there is a problem creating the contact', async () => {
        const res = await request(app)
            .post(`/api/v1/contact`)
        expect(res.status).toBe(500);
    });

    it('should return unauthorized to delete', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/contact/${newContactId}`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });
    it('should delete contact', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/contact/${newContactId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Contact Closed');

    });
    it('should return 404 no contact', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/contact/64f1d1e8d306ded4c33556da`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(404);

    });

});