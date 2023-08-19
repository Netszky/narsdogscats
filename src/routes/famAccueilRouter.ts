import { Router } from 'express';
import { changeFamilleStatus, createFamilleAccueil, deleteFamille, findFamilleStatus, getAllFamilleAccueil, getFamilleByID, getFamilleOptions, getFamillesCapacity, updateFamille, verifyFamille } from '~/controllers/familleAccueilController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
/**
 * @swagger
 * /api/v1/famille:
 *   post:
 *     tags: [ "Famille Accueil" ]
 *     summary: Créé une famille d'accueil
 *     description: Cette API permet à un utilisateur de créer une famille d'accueil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telephone:
 *                 type: integer
 *               adresse:
 *                 type: string
 *               capaciteChien:
 *                 type: integer
 *               capaciteChat:
 *                 type: integer
 *               showPhone:
 *                 type: boolean
 *               nom:
 *                 type: string
 *             example:
 *               telephone: 0000000000,
 *               adresse: 30 rue du moulin,
 *               capaciteChien: 2
 *               capaciteChat: 1,
 *               showPhone: true,
 *               nom: Doe,
 *     responses:
 *       201:
 *         description: Famille d'Accueil créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur dans la création de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/", verifyToken, createFamilleAccueil)
/**
 * @swagger
 * /api/v1/famille/status/{id}:
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
router.get('/', verifyToken, getAllFamilleAccueil)
/**
 * @swagger
 * /api/v1/famille/informations:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Récupère Une famille d'accueil basé sur l'id dans le token
 *     description: Cette API permet à un utilisateur connecté d'accéder à sa famille d'accueil via son token
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération des données de la famille
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
 *                       animals:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             nom:
 *                               type: string
 *                             age:
 *                               type: integer
 *                             espece:
 *                               type: string
 *                             race:
 *                               type: string
 *                             sexe:
 *                               type: string
 *                             caractere:
 *                               type: string
 *                             entente:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             typeAdoption:
 *                               type: string
 *                             taille:
 *                               type: string
 *                             birthdate:
 *                               type: string
 *                             contact:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             image:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             validate:
 *                               type: boolean
 *                             createdAt:
 *                               type: string
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
 *         description: Erreur lors de la récupération de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/informations', verifyToken, getFamilleByID)
/**
 * @swagger
 * /api/v1/famille:
 *   put:
 *     tags: [ "Famille Accueil" ]
 *     summary: Modifie la famille d'accueil
 *     description: Cette API permet à un utilisateur de modifier sa famille d'accueil basé sur l'id de la famille dans son token
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telephone:
 *                 type: integer
 *               adresse:
 *                 type: string
 *               capaciteChien:
 *                 type: integer
 *               capaciteChat:
 *                 type: integer
 *               showPhone:
 *                 type: boolean
 *             example:
 *               telephone: 0000000000,
 *               adresse: 30 rue du moulin,
 *               capaciteChien: 2
 *               capaciteChat: 1,
 *               showPhone: true,
 *     responses:
 *       200:
 *         description: Famille d'Accueil modifiée
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
 *         description: Erreur dans la modification de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/', verifyToken, updateFamille)
/**
 * @swagger
 * /api/v1/famille/{id}:
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
/**
 * @swagger
 * /api/v1/famille/status:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Récupère le statut de la famille d'accueil d'un utilisateur si il existe
 *     description: Cette API permet de vérifier si un utilisateur possède une famille d'accueil et son statut
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération du statut réussi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
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
 *       500:
 *         description: Erreur lors de la récupération du statut de la famille d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
router.get("/status", verifyToken, findFamilleStatus)
/**
 * @swagger
 * /api/v1/famille/capacity:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Récupère la capacité total d'accueil de l'ensemble des familles
 *     description: Cette API permet d'effectuer des demandes d'abandons si la capacité d'accueil des familles est positive
 *     responses:
 *       200:
 *         description: Récupération de la capacité des familles réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 canReceiveChien:
 *                   type: boolean
 *                 canReceiveChat:
 *                   type: boolean
 *       500:
 *         description: Erreur lors de la récupération de la capacité d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/capacity", getFamillesCapacity)
/**
 * @swagger
 * /api/v1/famille/verify-famille:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Verifie si un utilisateur peut accéder a sa famille d'accueil
 *     description: Cette API permet de récupérer les droits d'un utilisateur pour accéder à la partie famille accueil
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération de la capacité des familles réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                 actif:
 *                   type: boolean
 *       401:
 *         description: Le token est invalide ou expiré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur lors de la récupération de la capacité d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                 actif:
 *                   type: boolean
 */
router.get("/verify-famille", verifyToken, verifyFamille)

/**
 * @swagger
 * /api/v1/famille/verify-famille:
 *   get:
 *     tags: [ "Famille Accueil" ]
 *     summary: Renvoie l'id et le nom de toutes les familles
 *     description: Cette API permet de récupérer les infos nom et id d'une famille pour la création d'un animal
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Récupération de la capacité des familles réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                 actif:
 *                   type: boolean
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
 *         description: Utilisateur non authorizé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erreur lors de la récupération de la capacité d'accueil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *                 actif:
 *                   type: boolean
 */
router.get("/options", verifyToken, getFamilleOptions)


export default router;