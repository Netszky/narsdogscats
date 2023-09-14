import { Router } from 'express';
import { createPartenaire, deletePartenaire, getAllPartenaire, updatePartenaire } from '~/controllers/partenaireController';
import { verifyToken } from '~/middlewares/verifyToken';
import multer from 'multer';

const upload = multer()

const router = Router();
/**
 * @swagger
 * /api/v1/partenaire:
 *   post:
 *     tags: [ "Partenaire" ]
 *     summary: Créé un nouveau partenaire
 *     description: Un SuperUtilisateur créé un nouveau partenaire.
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
 *             example:
 *               nom: PartenaireTest,
 *               url: https://mon-partenaire.com,
 *     responses:
 *       201:
 *         description: Nouveau Partenaire créé
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
router.post("/", verifyToken, upload.single('image'), createPartenaire)
/**
 * @swagger
 * /api/v1/partenaire:
 *   get:
 *     tags: [ "Partenaire" ]
 *     summary: Récupère tout les partenaires
 *     description: Récupération de tout les partenaires.
 *     responses:
 *       200:
 *         description: Récupération des partenaires réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partenaire:
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
 *       500:
 *         description: Erreur dans la récupération des partenaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", getAllPartenaire)
/**
 * @swagger
 * /api/v1/partenaire/{id}:
 *   put:
 *     tags: [ "Partenaire" ]
 *     summary: Modifie un partenaire en fonction de son ID
 *     description: Un superutilisateur modifie un partenaire
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID du partenaire à modifier
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
 *             example:
 *               nom: PartenaireTest,
 *               url: https://mon-partenaire.com,
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
 *         description: Erreur dans la modification du partenaire.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/:id", verifyToken, upload.single('image'), updatePartenaire)
/**
 * @swagger
 * /api/v1/partenaire/{id}:
 *   delete:
 *     tags:
 *       - Partenaire
 *     summary: Supprime une entrée de partenaire (token)
 *     description: Cette API permet à un super administrateur de supprimer une entrée de partenaire par ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: L'ID du partenaire à supprimer.
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
 *         description: Erreur dans la suppression du partenaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", verifyToken, deletePartenaire)




export default router;