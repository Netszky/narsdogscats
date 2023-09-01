import request from 'supertest';
import Animal from '~/models/animalModel';
import app from '~/services/express';

describe('getAnimalByFamille', () => {

    let normalUserToken: string;
    let adminUserToken: string;

    beforeAll(async () => {
        const normalUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'normaluser@gmail.com', password: 'Azerty123!' });
        normalUserToken = normalUserResponse.body.token;

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
        expect(normalUserResponse.status).toBe(200);
        expect(adminUserResponse.status).toBe(200);

    });


    it('should reject access for users with insufficient roles', async () => {
        const res = await request(app)
            .get('/api/v1/animal/famille')
            .set('Authorization', normalUserToken);
        expect(res.status).toBe(403);
    });

    it('should grant access for users with appropriate roles', async () => {
        const res = await request(app)
            .get('/api/v1/animal/famille')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

});

describe('Animals Count Test', () => {

    let normalUserToken: string;
    let adminUserToken: string;

    beforeAll(async () => {
        const normalUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'normaluser@gmail.com', password: 'Azerty123!' });
        normalUserToken = normalUserResponse.body.token;

        expect(normalUserResponse.status).toBe(200);

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;

        expect(adminUserResponse.status).toBe(200);
    });

    it('should allow a normal user to access animal count', async () => {
        const res = await request(app)
            .get('/api/v1/animal/count')
            .set('Authorization', normalUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('total');
    });

    it('should allow an admin user to access animal count', async () => {
        const res = await request(app)
            .get('/api/v1/animal/count')
            .set('Authorization', adminUserToken);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('total');
    });

});

describe('Animal Status Change Test', () => {

    let normalUserToken: string;
    let adminUserToken: string;
    let validAnimalId: string = '64e2322813010ddeecf5ea21'; // À remplacer par un identifiant réel ou généré.

    beforeAll(async () => {
        const normalUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'normaluser@gmail.com', password: 'Azerty123!' });
        normalUserToken = normalUserResponse.body.token;

        const adminUserResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'adminuser@gmail.com', password: 'Azerty123!'
            });
        adminUserToken = adminUserResponse.body.token;
    });

    it('should reject access for users with insufficient roles', async () => {
        const res = await request(app)
            .put(`/api/v1/animal/status/${validAnimalId}`)
            .set('Authorization', normalUserToken)
            .send({ status: 1 });
        expect(res.status).toBe(403);
    });
    it('Erreor in query', async () => {
        const res = await request(app)
            .put(`/api/v1/animal/status/${validAnimalId}`)
            .set('Authorization', adminUserToken)
            .send({ status: "a" });
        expect(res.status).toBe(500);
    });

    it('should reject if animal family does not match user family', async () => {

        const res = await request(app)
            .put(`/api/v1/animal/status/64e1265bd4fa9c05e3b900a6`)
            .set('Authorization', adminUserToken)
            .send({ status: 1 });
        expect(res.status).toBe(403);
    });

    it('should update animal status for valid users and animals', async () => {
        const res = await request(app)
            .put(`/api/v1/animal/status/${validAnimalId}`)
            .set('Authorization', adminUserToken)
            .send({ status: 1 });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Animal Modifié");
    });


});

describe('GET /api/v1/animal/:id', () => {


    it('should retrieve an animal by ID', async () => {

        const res = await request(app)
            .get(`/api/v1/animal/64e2322813010ddeecf5ea21`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animal');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        const fakeId = 'someInvalidMongoId';

        const res = await request(app)
            .get(`/api/v1/animal/true`)

        expect(res.status).toBe(500);
    });

});
describe('GET /api/v1/animal/first', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve last 3 animals', async () => {

        const res = await request(app)
            .get(`/api/v1/animal/first`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        jest.spyOn(Animal, 'find').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .get(`/api/v1/animal/first`)
        expect(res.status).toBe(500);
    });

});

describe('GET /api/v1/animal/animals', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve all animals', async () => {

        const res = await request(app)
            .get(`/api/v1/animal/animals`)


        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        jest.spyOn(Animal, 'find').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .get(`/api/v1/animal/animals`)
        expect(res.status).toBe(500);
    });

});

describe('GET /api/v1/animal/ids', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve all animals ids', async () => {

        const res = await request(app)
            .get(`/api/v1/animal/ids`)


        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        jest.spyOn(Animal, 'find').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .get(`/api/v1/animal/ids`)
        expect(res.status).toBe(500);
    });

});

describe('GET /api/v1/animal', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should retrieve all animals', async () => {

        const res = await request(app)
            .get(`/api/v1/animal`)


        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

    it('should retrieve all animals filtered', async () => {

        const res = await request(app)
            .get(`/api/v1/animal?espece=1`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('animals');
    });

    it('should return a 500 error if there is a problem retrieving the animal', async () => {
        jest.spyOn(Animal, 'find').mockImplementation(() => {
            throw new Error('Some database error');
        });

        const res = await request(app)
            .get(`/api/v1/animal/ids`)
        expect(res.status).toBe(500);
    });

});






