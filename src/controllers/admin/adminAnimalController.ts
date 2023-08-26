import { Request, Response } from "express"
import { CustomRequest } from "~/middlewares/verifyToken"
import Animal from "~/models/animalModel"
import { deleteImageFromCloudinary, getPublicIdFromUrl } from "~/utils/cloudinary"
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import FamAccueil from "~/models/famAccueil";

interface UploadResult {
    url: string;
}

export const getAnimalByFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const animals = await Animal.find({ famille: req.params.id }).populate('contact')
            res.status(200).send({ animals: animals })
        } catch {
            res.status(500).send({ message: "Erreur lors de la récupération" })
        }
    }
}

export const createAnimalAdmin = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        if (!('images' in req.files!)) {
            return res.status(400).send("Missing 'images' field");
        }
        const images = req.files['images'] as Express.Multer.File[];

        const uploadPromises = images.map((image: Express.Multer.File) => {
            const imageStream = streamifier.createReadStream(image.buffer);
            return new Promise<UploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'animaux', format: 'webp' }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as UploadResult);
                    }
                });
                imageStream.pipe(uploadStream);
            });
        });

        try {
            const uploadResults = await Promise.all(uploadPromises);
            const imagesUrls = uploadResults.map(result => result.url);

            const { caractere, nom, race, sexe, typeAdoption, espece, taille, birthdate, gabarit, ententeChat, ententeChien, ententeEnfant, ententeEtranger, affectueux, calme, joueur, bruit, familleId } = req.body

            const animal = new Animal({
                nom: nom,
                race: race.toLowerCase(),
                sexe: sexe,
                caractere: caractere,
                typeAdoption: typeAdoption,
                espece: espece,
                taille: taille.toLowerCase(),
                gabarit: gabarit,
                birthdate: birthdate,
                image: imagesUrls,
                ententeChat: ententeChat,
                ententeChien: ententeChien,
                ententeEnfant: ententeEnfant,
                ententeEtranger: ententeEtranger,
                affectueux: affectueux,
                calme: calme,
                joueur: joueur,
                bruit: bruit,
                famille: familleId
            });
            await animal.save()
                .then((data) => {
                    res.status(201).send({ message: "Created" })
                })
                .catch((err) => {
                    const deletePromises = imagesUrls.map((url) => {
                        return new Promise<void>((resolve, reject) => {
                            const publicId = getPublicIdFromUrl(url);
                            if (publicId) {
                                deleteImageFromCloudinary(publicId)
                                    .then(() => resolve())
                                    .catch((error) => reject(error));
                            } else {
                                reject(new Error('Invalid image URL'));
                            }
                        });
                    });
                    Promise.all(deletePromises)
                        .then(() => res.status(500).send({ message: err }))
                        .catch((error) => res.status(500).send({ message: err }));

                })
        } catch (error) {
            res.status(500).send({ status: 500 });
        }

    } else {
        res.status(403).send({
            status: 403
        })
    }
}

export const getAllAnimals = async (req: Request, res: Response) => {
    try {
        const animals = await Animal.find({}).populate('contact')
        res.status(200).send({
            animals: animals
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }

}
export const changeAnimalStatus = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        try {
            if (exist) {
                await Animal.findByIdAndUpdate(req.params.id, {
                    status: req.body.status
                }, { omitUndefined: true })
                res.status(200).send({ message: "Animal Modifié" })
            } else {
                res.status(404).send({
                    message: "Aucun animal correspondant à l'id"
                })
            }
        } catch (error) {
            res.status(500).send({ message: error || "Erreur lors de l'activation de l'animal" })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}
