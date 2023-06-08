import { Router } from 'express';
import { createContactAnimal, deleteAnimalContact } from '~/controllers/contactAnimalController';
import { verifyToken } from '~/middlewares/verifyToken';


const router = Router();
/**
 * @swagger
 * /api/v1/animal-contact/{id}:
 *   post:
 *     tags: [ "Animal Contact" ]
 *     summary: Créé une demande de contact pour un animal et envoie un mail à sa famille d'accueil
 *     description: Créé une demande de contact pour un animal et envoie un mail à sa famille d'accueil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de l'animal.
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
router.post("/:id", createContactAnimal)
/**
 * @swagger
 * /api/v1/animal-contact/{id}:
 *   delete:
 *     tags:
 *       - Animal Contact
 *     summary: Supprime une entrée de demande contact d'un animal(token)
 *     description: Cette API permet à un super administrateur de supprimer une entrée d'abandon par ID. L'entrée n'est pas réellement supprimée, mais marquée comme fermée.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de la demande de contact a supprimer.
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
 *         description: Aucun enregistrement trouvé pour l'ID spécifié.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Une erreur est survenue dans la suppression.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deleteAnimalContact)

export default router;