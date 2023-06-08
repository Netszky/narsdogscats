import { Router } from 'express';
import { refreshToken, resetPassword, updateResetPassword, verifyAdmin, verifyResetToken } from '~/controllers/userController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router()

/**
 * @swagger
 * /api/v1/user/reset-password:
 *   post:
 *     tags: [ "User" ]
 *     summary: Permet à un utilisateur d'obtenir un token de réinitialisation de mot passe par email
 *     description: Permet à un utilisateur d'obtenir un token de réinitialisation de mot passe par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *     responses:
 *       200:
 *         description: Mail de réinitialisation envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *       500:
 *         description: Erreur dans la demande de réinitialisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 */
router.post("/reset-password", resetPassword)
/**
 * @swagger
 * /api/v1/user/update-password:
 *   post:
 *     tags: [ "User" ]
 *     summary: Permet à un utilisateur de mettre à jour son mot de passe (reset token)
 *     description: Permet à un utilisateur d'obtenir un token de réinitialisation de mot passe par email
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *       401:
 *         description: Le token est incorrect ou expiré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Mauvais mot de passe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 */
router.post("/update-password", verifyToken, updateResetPassword);
/**
 * @swagger
 * /api/v1/user/admin:
 *   get:
 *     tags: [ "User" ]
 *     summary: Verifie les droit super utilisateur d'un utilisateur via son token (token)
 *     description: Verifie les droit super utilisateur d'un utilisateur via son token (token)
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: L'utilisateur est superAdministrateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuperAdmin:
 *                   type: boolean
 *       401:
 *         description: L'utilisateur n'est pas authentifié ou le token est incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: L'utilisateur n'est pas superAdministrateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuperAdmin:
 *                   type: boolean
 */
router.get("/admin", verifyToken, verifyAdmin);
/**
 * @swagger
 * /api/v1/user/reset-token:
 *   get:
 *     tags: [ "User" ]
 *     summary: Verifie le reset token d'un utilisateur
 *     description: Verifie si le reset token d'une demande de réinitialisation de mot de passe est valide et correspond à l'utilisateur en question
 *     security:
 *       - ApiKeyAuth: []

 *     responses:
 *       200:
 *         description: Le reset token correspond à l'utilisateur et est valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *       401:
 *         description: L'utilisateur n'est pas authentifié ou le token est incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Le token de réinitialisation ne correspond pas 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *       500:
 *         description: L'utilisateur n'existe pas ou plus 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 */
router.get("/reset-token", verifyToken, verifyResetToken)
/**
 * @swagger
 * /api/v1/user/refresh:
 *   get:
 *     tags: [ "User" ]
 *     summary: Rafraichie les informations d'un utilisateur avec son token
 *     description: Rafraichie les informations d'un utilisateur avec son token
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Renvoie les droits de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin: 
 *                   type: boolean
 *                 isSuperAdmin:
 *                   type: boolean
 *                 auth:
 *                   type: boolean
 *                 isFamille:
 *                   type: boolean
 *       401:
 *         description: Le token est expiré ou incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/refresh', verifyToken, refreshToken)


export default router;