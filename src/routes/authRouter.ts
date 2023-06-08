import { Router } from 'express';
import { login, register } from '~/controllers/authController';

const router = Router()
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [ "Auth" ]
 *     summary: Permet à un utilisateur de s'authentifier
 *     description: Permet à un utilisateur de s'authentifier via son email et son mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Authentifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 auth:
 *                   type: boolean
 *                 firstname:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 isSuperAdmin:
 *                   type: boolean
 *                 isFamille:
 *                   type: boolean
 *       401:
 *         description: Erreur Authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: boolean
 *                 token:
 *                   type: string
 */
router.post("/login", login)
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [ "Auth" ]
 *     summary: Permet à un utilisateur de créer son compte et de s'authentifier par la même occasion
 *     description: Inscription et authentification d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *             example:
 *               firstname: Doe,
 *               lastname: John,
 *               email: john.doe@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Inscription et authentification avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 auth:
 *                   type: boolean
 *                 firstname:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 isSuperAdmin:
 *                   type: boolean
 *       500:
 *         description: Erreur dans la création de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/register", register)

export default router;