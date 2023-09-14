import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Partenaire from '~/models/partenaireModel';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';


export const createPartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const image = req.file;

        if (!image) {
            return res.status(400).send("Missing 'images' field");
        }

        const imageStream = streamifier.createReadStream(image.buffer);

        const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'partenaires', format: 'webp' }, async (error, result) => {
            if (error) {
                return res.status(500).send("Error uploading to Cloudinary");
            }

            const { nom, url, telephone } = req.body;
            try {
                const partenaire = new Partenaire({
                    nom: nom,
                    url: url,
                    telephone: telephone,
                    image: result?.url,
                    image_public_id: result?.public_id
                });
                await partenaire.save();
                res.status(201).send({
                    message: "Partenaire Créé"
                });
            } catch (error) {
                if (result?.public_id) {
                    cloudinary.v2.uploader.destroy(result?.public_id, (destroyError) => {
                        if (destroyError) {
                            console.error("Error deleting image from Cloudinary:", destroyError);
                        }
                    });
                }
                res.status(500).send({
                    message: "Impossible de créer le partenaire"
                });
            }
        });

        imageStream.pipe(uploadStream);
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const getAllPartenaire = async (req: Request, res: Response) => {
    try {
        const partenaire = await Partenaire.find()
        res.status(200).send({
            partenaires: partenaire,
        })
    }
    catch (error) {

        res.status(500).send({
            message: error || "Erreur dans la récupération des partenaires"
        })

    }
}
export const deletePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await Partenaire.exists({ _id: req.params.id })
            if (exist) {
                const partenaire = await Partenaire.findByIdAndDelete(req.params.id)
                res.status(200).send({
                    message: "Partenaire Deleted",
                })
                if (partenaire?.image_public_id) {
                    await cloudinary.v2.uploader.destroy(partenaire?.image_public_id as string, (destroyError) => {
                        if (destroyError) {
                            console.error("Error deleting image from Cloudinary:", destroyError);
                        }
                    });
                }

            } else {
                res.status(404).send({
                    message: "Aucun partenaire trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la suppression du partenaire"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const updatePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const partenaireId = req.params.id;

        const existingPartenaire = await Partenaire.findById(partenaireId);
        if (!existingPartenaire) {
            return res.status(404).send("Partenaire non trouvé");
        }


        let newImageUrl: string | undefined = undefined;
        let newImageId: string | undefined = undefined;
        const image = req.file;
        if (image) {
            try {
                const result = await new Promise<{ url: string, public_id: string }>((resolve, reject) => {
                    const imageStream = streamifier.createReadStream(image.buffer);
                    const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'partenaires', format: 'webp' }, (error, result) => {
                        if (error) reject(error);
                        else {
                            if (result) {
                                resolve({
                                    url: result.url,
                                    public_id: result.public_id
                                });
                            } else {
                                reject(new Error("Result is undefined"));
                            }

                        }
                    });
                    imageStream.pipe(uploadStream);
                });

                newImageUrl = result.url;
                newImageId = result.public_id;

                if (existingPartenaire.image_public_id) {
                    cloudinary.v2.uploader.destroy(existingPartenaire.image_public_id, (destroyError) => {
                        if (destroyError) {
                            console.error("Error deleting old image from Cloudinary:", destroyError);
                        }
                    });
                }
            } catch (error) {
                return res.status(500).send({
                    message: "Impossible de mettre à jour l'image du partenaire"
                });
            }
        }

        await Partenaire.findByIdAndUpdate(partenaireId, {
            telephone: req.body.telephone,
            nom: req.body.nom,
            url: req.body.url,
            image: newImageUrl,
            image_public_id: newImageId
        }, { omitUndefined: true });

        return res.status(200).send({
            message: "Partenaire mis a jour"
        });

    } else {
        return res.status(403).send({
            message: "Not admin"
        });
    }
}