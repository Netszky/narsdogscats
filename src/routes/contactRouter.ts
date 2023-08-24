import { Router } from 'express';
import { createContact } from '~/controllers/contactController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
/**
 * @swagger
 * /api/v1/contact/:
 *   post:
 *     tags: [ "Contact" ]
 *     summary: Créé une demande de contact pour l'association
 *     description: Un utilisateur authentifié ou non crée une demande de contact pour l'association 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
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
 *               type: type
 *               telephone: 0000000000
 *               email: JohnDoe@gmail.com
 *               content: content
 *               nom: Doe
 *               prenom: John
 *     responses:
 *       201:
 *         description: Demande créée avec succès et email envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans la création de la demande de contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.post("/", createContact)


export default router;