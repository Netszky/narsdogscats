import { Router } from 'express';
import { createContact, deleteContact, getAllContact } from '~/controllers/contactController';
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
/**
 * @swagger
 * /api/v1/contact:
 *   get:
 *     tags: [ "Contact" ]
 *     summary: Récupère l'ensemble des demandes de contact de l'Association (token)
 *     description: Récupère l'ensemble des demandes de contact de l'Association
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération des demandes de contacts réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contacts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       telephone: 
 *                         type: integer
 *                       email: 
 *                         type: string
 *                       content:
 *                         type: string
 *                       closed: 
 *                         type: boolean
 *                       nom: 
 *                         type: string
 *                       prenom:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Le token est expiré ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: L'utilisateur ne dispose pas des droits requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans lors de la récupération des demandes de contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", verifyToken, getAllContact)
/**
 * @swagger
 * /api/v1/contact/{id}:
 *   delete:
 *     tags:
 *       - Contact
 *     summary: Supprime une entrée de demande de contact (token)
 *     description: Cette API permet à un super administrateur de supprimer une entrée de contact par ID. L'entrée n'est pas réellement supprimée, mais marquée comme fermée.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de la demande de contact à supprimer.
 *     responses:
 *       200:
 *         description: Entrée supprimée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Le token est invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: L'utilisateur ne dispose pas des droits nécessaires.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Aucun enregistrement trouvé pour l'ID spécifié.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans la suppresion de la demande de contact
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deleteContact)

export default router;