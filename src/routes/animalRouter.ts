import { Router } from 'express';
import {
    changeAnimalStatus,
    createAnimal,
    getAllAnimals,
    getAllAnimalsID,
    getAllAnimalsValidated,
    getAnimal,
    getAnimalByFamille,
    getAnimalsCount,
    getLatestAnimal,
    updateAnimal
} from '~/controllers/animalController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()

const router = Router();
router.get("/famille", verifyToken, getAnimalByFamille)

/**
 * @swagger
 * /api/v1/animal:
 *   post:
 *     tags:
 *       - Animal
 *     summary: Upload d'une image
 *     description: Cette API permet d'uploader une image.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         description: L'image à uploader.
 *         required: true
 *     responses:
 *       200:
 *         description: Image uploadée avec succès.
 *       400:
 *         description: Erreur lors de l'upload de l'image.
 */
router.post("/", verifyToken, upload.fields([{ name: 'images' }]), createAnimal)

router.get("/count", getAnimalsCount);
/**
 * @swagger
 * /api/v1/animal:
 *   get:
 *     tags: [ "Animal" ]
 *     summary: Récupère tout les animaux activé
 *     description: Cette API permet de récupérer tout les animaux actifs et de les filtrer si nécessaire
 *     parameters:
 *      - in: query
 *        name: age
 *        required: false
 *        type: string
 *        description: "junior ou adulte"
 *      - in: query
 *        name: espece
 *        required: false
 *        type: string
 *        description: "Chien, chat"
 *      - in: query
 *        name: race
 *        required: false
 *        type: string
 *        description: "Chien, chat"
 *      - in: query
 *        name: taille
 *        required: false
 *        type: string
 *        description: "Petit, Moyen, Grand"
 *      - in: query
 *        name: entente
 *        required: false
 *        type: string
 *        description: "chien, chat, enfant"
 *      - in: query
 *        name: sexe
 *        required: false
 *        type: string
 *        description: "M, F"
 *      - in: query
 *        name: adoption
 *        required: false
 *        type: string
 *        description: "normal, sos, retraite"
 *     responses:
 *       200:
 *         description: Récupération des animaux réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 nbChien:
 *                   type: integer
 *                 nbChat:
 *                   type: integer
 *                 animals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nom:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       espece:
 *                         type: string
 *                       race:
 *                         type: string
 *                       sexe:
 *                         type: string
 *                       caractere:
 *                         type: string
 *                       entente:
 *                         type: array
 *                         items:
 *                           type: string
 *                       typeAdoption:
 *                         type: string
 *                       taille:
 *                         type: string
 *                       birthdate:
 *                         type: string
 *                       contact:
 *                         type: array
 *                         items:
 *                           type: string
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                       validate:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *       500:
 *         description: Erreur dans la récupération des animaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", getAllAnimalsValidated);
/**
 * @swagger
 * /api/v1/animal/animals:
 *   get:
 *     tags: [ "Animal" ]
 *     summary: Récupère tout les animaux
 *     description: Cette API permet de récupérer tout les animaux 
 *     responses:
 *       200:
 *         description: Récupération des animaux réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nom:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       espece:
 *                         type: string
 *                       race:
 *                         type: string
 *                       sexe:
 *                         type: string
 *                       caractere:
 *                         type: string
 *                       entente:
 *                         type: array
 *                         items:
 *                           type: string
 *                       typeAdoption:
 *                         type: string
 *                       taille:
 *                         type: string
 *                       birthdate:
 *                         type: string
 *                       contact:
 *                         type: array
 *                         items:
 *                           type: string
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                       validate:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *       500:
 *         description: Erreur dans la récupération des animaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/animals", getAllAnimals)
/**
 * @swagger
 * /api/v1/animal/first:
 *   get:
 *     tags: [ "Animal" ]
 *     summary: Récupère les 3 derniers animaux actifs
 *     description: Cette API permet de récupérer les 3 animaux actifs les plus récents
 *     responses:
 *       200:
 *         description: Récupération des animaux réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nom:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       espece:
 *                         type: string
 *                       race:
 *                         type: string
 *                       sexe:
 *                         type: string
 *                       caractere:
 *                         type: string
 *                       entente:
 *                         type: array
 *                         items:
 *                           type: string
 *                       typeAdoption:
 *                         type: string
 *                       taille:
 *                         type: string
 *                       birthdate:
 *                         type: string
 *                       contact:
 *                         type: array
 *                         items:
 *                           type: string
 *                       image:
 *                         type: array
 *                         items:
 *                           type: string
 *                       validate:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *       500:
 *         description: Erreur dans la récupération des animaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/first", getLatestAnimal);
/**
 * @swagger
 * /api/v1/animal/ids:
 *   get:
 *     tags: [ "Animal" ]
 *     summary: Récupère seulement les ids de tout les animaux
 *     description: Cette API permet de récupérer les id de tout les animaux
 *     responses:
 *       200:
 *         description: Récupération des ids réussies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *       500:
 *         description: Erreur dans la récupération des animaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/ids", getAllAnimalsID)
/**
 * @swagger
 * /api/v1/animal/{id}:
 *   get:
 *     tags: [ "Animal" ]
 *     summary: Récupère un animal en fonction de son id
 *     description: Cette API permet de récupérer un animal en fonction de son id
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: "ID de l'animal"
 *     responses:
 *       200:
 *         description: Récupération de l'animal réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animal:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     age:
 *                       type: integer
 *                     espece:
 *                       type: string
 *                     race:
 *                       type: string
 *                     sexe:
 *                       type: string
 *                     caractere:
 *                       type: string
 *                     entente:
 *                       type: array
 *                       items:
 *                         type: string
 *                     typeAdoption:
 *                       type: string
 *                     taille:
 *                       type: string
 *                     birthdate:
 *                       type: string
 *                     contact:
 *                       type: array
 *                       items:
 *                         type: string
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                     validate:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *       500:
 *         description: Erreur dans la récupération de l'animal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/:id", getAnimal);


/**
 * @swagger
 * /api/v1/animal/status/{id}:
 *   put:
 *     tags: [ "Animal" ]
 *     summary: Active un animal
 *     description: Cette API permet à un super utilisateur d'activer' un animal
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        type: string
 *        description: "ID de l'animal"
 *     responses:
 *       200:
 *         description: Activation de l'animal réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé, l'utilisateur doit être administrateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403: 
 *         description: L'utilisateur ne dispose pas des droits nécessaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description:  Aucun animal correspondant à l'id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans l'activation de l'animal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
*/
router.put("/status/:id", verifyToken, changeAnimalStatus)
router.put("/:id", verifyToken, updateAnimal);



export default router;
