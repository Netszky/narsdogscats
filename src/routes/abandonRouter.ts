import { Router } from 'express';
import { createAbandon } from '~/controllers/abandonAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';


const router = Router();
/**
 * @swagger
 * /api/v1/abandon:
 *   post:
 *     tags: [ "Abandon" ]
 *     summary: Créé une demande d'abandon
 *     description: Cette API permet à un utilisateur non authentifié de créer une demande d'abandon.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               espece:
 *                 type: string
 *               race:
 *                 type: string
 *               age:
 *                 type: integer
 *               telephone:
 *                 type: integer
 *               email:
 *                 type: string
 *               content:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *             example:
 *               espece: Chien,
 *               race: Labrador,
 *               age: 2
 *               telephone: 0666666666,
 *               email: john.doe@example.com,
 *               content: content,
 *               nom: Doe,
 *               prenom: John,
 *     responses:
 *       201:
 *         description: Abandon créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans la création de la demande d'abandon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/", createAbandon)


export default router;