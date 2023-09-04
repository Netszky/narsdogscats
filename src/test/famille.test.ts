import mongoose from 'mongoose';
import request from 'supertest';
import FamAccueil from '~/models/famAccueil';
import User from '~/models/userModel';
import app from '~/services/express';
let newFamilleId: string
describe('Get my famille', () => {
    let adminUserToken: string;
    let UserToken: string

    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const UserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'normaluser@gmail.com', password: 'Azerty123!'
            });
        UserToken = UserResponse.body.token;
        expect(UserResponse.status).toBe(200);



    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve famille', async () => {

        const res = await request(app)
            .get('/api/v1/famille/me')
            .set('Content-Type', 'application/json')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('famille');
    });

    it('should return a 500 error if there is no famille', async () => {
        jest.spyOn(FamAccueil, 'findById').mockImplementation(() => {
            throw new Error('No Famille');
        });
        const res = await request(app)
            .get(`/api/v1/famille/me`)
            .set('Authorization', adminUserToken)
            .set('Content-Type', 'application/json')
        expect(res.status).toBe(500);
        expect(res.body.message).toBe("No Famille");
    });
    it('should return a 403 error if not admin', async () => {
        const res = await request(app)
            .get(`/api/v1/famille/me`)
            .set('Authorization', UserToken)
            .set('Content-Type', 'application/json')
        expect(res.status).toBe(403);
    });

});
describe('update my famille', () => {
    let adminUserToken: string;
    let UserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const UserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'normaluser@gmail.com', password: 'Azerty123!'
            });
        UserToken = UserResponse.body.token;
        expect(UserResponse.status).toBe(200);

    });

    it('should update famille', async () => {

        const res = await request(app)
            .put('/api/v1/famille/')
            .send({ email: "testchange@gmail.com" })
            .set('Content-Type', 'application/json')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Famille modifiée");
    });

    it('should return a 500 error if there is a problem during update', async () => {
        jest.spyOn(FamAccueil, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error('No Famille');
        });
        const res = await request(app)
            .put(`/api/v1/famille/`)
            .set('Authorization', adminUserToken)
            .set('Content-Type', 'application/json')
        expect(res.status).toBe(500);
    });

    it('should return a 403 error if not admin', async () => {
        const res = await request(app)
            .put(`/api/v1/famille/`)
            .set('Authorization', UserToken)
            .set('Content-Type', 'application/json')
        expect(res.status).toBe(403);
    });

});
describe('Create Famille', () => {
    let adminUserToken: string;
    let UserToken: string


    const familleData = {
        telephone: '0600000000',
        email: 'test@gmail.com',
        adresse: 'test adresse',
        capaciteChien: '10',
        capaciteChat: '5',
        showPhone: false,
        actif: false,
        nom: "Famille Test",
    };


    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const UserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'normaluser@gmail.com', password: 'Azerty123!'
            });
        UserToken = UserResponse.body.token;
        expect(UserResponse.status).toBe(200);

    });

    it('should create famille', async () => {

        const res = await request(app)
            .post('/api/v1/famille')
            .send(familleData)
            .set('Content-Type', 'application/json')
            .set('Authorization', UserToken);
        expect(res.status).toBe(201);
        newFamilleId = res.body.id

    });

    it('should return a 500 error if there is a problem creating the famille', async () => {
        const res = await request(app)
            .post(`/api/v1/famille`)
            .send({ test: "no data" })
            .set('Authorization', UserToken)
            .set('Content-Type', 'application/json')
        expect(res.status).toBe(500);
    });



});

describe('Find Famille Status', () => {
    let adminUserToken: string;
    let UserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const UserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'normaluser@gmail.com', password: 'Azerty123!'
            });
        UserToken = UserResponse.body.token;
        expect(UserResponse.status).toBe(200);

    });

    it('should return CA', async () => {

        const res = await request(app)
            .get('/api/v1/famille/status')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("CA");

    });

    it('should return CU', async () => {
        const res = await request(app)
            .get(`/api/v1/famille/status`)
            .set('Authorization', UserToken)
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("CU");
    });


});

describe('Verify Famille', () => {
    let adminUserToken: string;
    let UserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });

    beforeAll(async () => {

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(adminUserResponse.status).toBe(200);
        const UserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'normaluser@gmail.com', password: 'Azerty123!'
            });
        UserToken = UserResponse.body.token;
        expect(UserResponse.status).toBe(200);

    });

    it('should return 200', async () => {

        const res = await request(app)
            .get('/api/v1/famille/verify-famille')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('isAdmin');
        expect(res.body).toHaveProperty('actif');

    });
    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'findOne').mockImplementation(() => {
            throw new Error('No Famille');
        });
        const res = await request(app)
            .get(`/api/v1/famille/verify-famille`)
            .set('Authorization', UserToken);
        expect(res.status).toBe(500);
    });

    it('should return 401', async () => {
        const res = await request(app)
            .get(`/api/v1/famille/verify-famille`)
        expect(res.status).toBe(401);
    });


});

describe('change Famille Status', () => {
    let adminUserToken: string;
    let superAdminUserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
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
    it('should return 200 actif', async () => {
        const res = await request(app)
            .put(`/api/v1/admin/famille/status/${newFamilleId}`)
            .send({ actif: true })
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Famille activée")

    });
    it('should return 200 inactif', async () => {
        const res = await request(app)
            .put(`/api/v1/admin/famille/status/${newFamilleId}`)
            .send({ actif: false })
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Famille desactivée")

    });

    it('should return 403', async () => {
        const res = await request(app)
            .put(`/api/v1/admin/famille/status/${newFamilleId}`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });

    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'findByIdAndUpdate').mockImplementation(() => {
            throw new Error();
        });
        const res = await request(app)
            .put(`/api/v1/admin/famille/status/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });
});
describe('get Famille by id', () => {
    let adminUserToken: string;
    let superAdminUserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
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

    it('should return 200 ', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("famille")

    });

    it('should return 403', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });

    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'findById').mockImplementation(() => {
            throw new Error();
        });
        const res = await request(app)
            .get(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });
});

describe('delete Famille', () => {
    let adminUserToken: string;
    let superAdminUserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
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
    it('should return 200', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Famille supprimée");

    });

    it('should return 403', async () => {
        const res = await request(app)
            .delete(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });
    it('should return 404', async () => {

        const res = await request(app)
            .delete(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(404);
    });

    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'exists').mockImplementation(() => {
            throw new Error('No Famille');
        });
        const res = await request(app)
            .delete(`/api/v1/admin/famille/${newFamilleId}`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });


});

describe('get Famille options', () => {
    let adminUserToken: string;
    let superAdminUserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
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
    it('should return 200', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille/options`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('familles');

    });

    it('should return 403', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille/options`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });

    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'find').mockImplementation(() => {
            throw new Error();
        });
        const res = await request(app)
            .get(`/api/v1/admin/famille/options`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });




});

describe('get all Famille', () => {
    let adminUserToken: string;
    let superAdminUserToken: string
    afterEach(() => {
        jest.restoreAllMocks();
    });
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
    it('should return 200', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('familles');

    });

    it('should return 403', async () => {
        const res = await request(app)
            .get(`/api/v1/admin/famille`)
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(403);

    });

    it('should return 500', async () => {
        jest.spyOn(FamAccueil, 'find').mockImplementation(() => {
            throw new Error();
        });
        const res = await request(app)
            .get(`/api/v1/admin/famille`)
            .set('Authorization', superAdminUserToken);
        expect(res.status).toBe(500);
    });


    afterAll(async () => {
        await mongoose.connection.close();
    });

});






