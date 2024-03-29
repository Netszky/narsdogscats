import { Router } from "express";
import { deleteAbandon, getAllAbandon } from "~/controllers/admin/adminAbandonController";
import { verifyToken } from "~/middlewares/verifyToken";

const router = Router()

/**
 * @swagger
 * /api/v1/abandon:
 *   get:
 *     tags: [ "Abandon" ]
 *     summary: Recupère les demandes d'abandons (token)
 *     description: Cette API permet à un super administrateur récupérer toutes les demandes d'abandons.
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération des abandons réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 abandons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       race:
 *                         type: string
 *                       espece: 
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
 *                       age: 
 *                         type: integer
 *                       prenom:
 *                         type: string
 *                       createdAt:
 *                         type: string
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
 *         description: L'utilisateur ne dispose pas des droits nécessaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans la récupération des abandons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", verifyToken, getAllAbandon)
/**
 * @swagger
 * /api/v1/abandon/{id}:
 *   delete:
 *     tags:
 *       - Abandon
 *     summary: Supprime une entrée d'abandon (token)
 *     description: Cette API permet à un super administrateur de supprimer une entrée d'abandon par ID. L'entrée n'est pas réellement supprimée, mais marquée comme fermée.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de l'entrée d'abandon à supprimer.
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
 *         description: Erreur dans la suppression de la demande d'abandon.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deleteAbandon)

export default router;