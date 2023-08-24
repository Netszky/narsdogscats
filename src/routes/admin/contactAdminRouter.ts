import { Router } from 'express';
import { deleteContact, getAllContact } from '~/controllers/admin/adminContactController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router()
router.get("/", verifyToken, getAllContact)
/**
 * @swagger
 * /api/v1/admin/contact/{id}:
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