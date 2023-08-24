import { Router } from "express";
import { changeFamilleStatus, deleteFamille, getAllFamilleAccueil, getFamilleByID, getFamilleOptions } from "~/controllers/admin/adminFamilleController";
import { verifyToken } from "~/middlewares/verifyToken";

const router = Router()
router.get("/options", verifyToken, getFamilleOptions)

router.get("/:id", verifyToken, getFamilleByID)
/**
 * @swagger
 * /api/v1/famille/:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Récupère toutes les familles d'accueil
 *     description: Cette API permet à un superutilisateur de récupérer toutes les famille d'accueil
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération des familles d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 familles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       telephone:
 *                         type: string
 *                       adresse:
 *                         type: string
 *                       nom:
 *                         type: string
 *                       capaciteChien:
 *                         type: integer
 *                       capaciteChat:
 *                         type: integer
 *                       capaciteActuelleChien:
 *                         type: integer
 *                       capaciteActuelleChat:
 *                         type: integer
 *                       actif:
 *                         type: boolean
 *                       showPhone:
 *                         type: boolean
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           firstname:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                       animals:
 *                         type: array
 *                         items:
 *                           type: string
 *                          
 *                      
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
 *         description: Erreur lors de la récupération des familles d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @swagger
 * /api/v1/admin/famille/status/{id}:
 *   put:
 *     tags: [ "Famille Accueil" ]
 *     summary: Change le statut d'une famille
 *     description: Cette API permet à un superutilisateur de change le statut d'une famille d'accueil
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de la famille à valider.
 *     responses:
 *       201:
 *         description: Famille d'Accueil validée
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
 *         description: Aucune famille correspondante à l'id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur lors de la validation de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/status/:id", verifyToken, changeFamilleStatus)
/**
 * @swagger
 * /api/v1/admin/famille/{id}:
 *   delete:
 *     tags: [ "Famille Accueil" ]
 *     summary: Supprime une famille d'accueil et envoie un mail a son utilisateur
 *     description: Cette API permet à un superutilisateur de refuser une famille d'accueil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de la famille à supprimer
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Famille Supprimée et mail envoyé
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
 *         description: Aucune famille correspondante à l'id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur lors de la validation de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deleteFamille)
router.get('/', verifyToken, getAllFamilleAccueil)

export default router;