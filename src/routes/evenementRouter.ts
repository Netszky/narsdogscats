import { Router } from 'express';
import { createEvenement, deleteEvenement, getAllEvenement, updateEvenement } from '~/controllers/evenementController';
import { verifyToken } from '~/middlewares/verifyToken';

const router = Router();
/**
 * @swagger
 * /api/v1/evenement:
 *   post:
 *     tags: [ "Evenement" ]
 *     summary: Créé un nouvel evènement
 *     description: Un SuperUtilisateur créé un nouvel evènement.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               url:
 *                 type: string
 *               date:
 *                 type: string
 *               localisation:
 *                 type: string
 *             example:
 *               nom: EvenementTest,
 *               url: https://mon-evenement.com,
 *               date: 2023-03-24T12:32:28.000+00:00
 *               localisation: Ville,
 *     responses:
 *       201:
 *         description: Nouvel Evenement créé
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
 *       500:
 *         description: Erreur dans la création de l'évenement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/", verifyToken, createEvenement)
/**
 * @swagger
 * /api/v1/evenement:
 *   get:
 *     tags: [ "Evenement" ]
 *     summary: Récupère tout les évènements
 *     description: Récupération de tout les évenements.
 *     responses:
 *       200:
 *         description: Récupération des évènements réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 evenement:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nom:
 *                         type: string 
 *                       url:
 *                         type: string 
 *                       localisation:
 *                         type: string 
 *                       date:
 *                         type: string 
 *       500:
 *         description: Erreur lors de la récupération des évènements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", getAllEvenement)
/**
 * @swagger
 * /api/v1/evenement/{id}:
 *   put:
 *     tags: [ "Evenement" ]
 *     summary: Modifie un evenement en fonction de son ID
 *     description: Un superutilisateur modifie un evenement
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de l'evènement à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               url:
 *                 type: string
 *               date:
 *                 type: integer
 *               localisation:
 *             example:
 *               nom: EvenementTest,
 *               url: https://mon-evenement.com,
 *               date: 2023-03-24T12:32:28.000+00:00
 *               localisation: Ville,
 *     responses:
 *       200:
 *         description: Entrée modifiée avec succès.
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
 *         description: Erreur dans la modification de l'evènement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/:id", verifyToken, updateEvenement)
/**
 * @swagger
 * /api/v1/evenement/{id}:
 *   delete:
 *     tags:
 *       - Evenement
 *     summary: Supprime une entrée d'evenement (token)
 *     description: Cette API permet à un super administrateur de supprimer une entrée d'evenement par ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID de l'entrée de l'evènement à supprimer.
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
 *         description: Erreur dans la suppression de l'evènement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deleteEvenement)




export default router;