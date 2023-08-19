import { Request, Response } from 'express';
import Animal from '~/models/animalModel';
import { CustomRequest } from '~/middlewares/verifyToken';

import { filterAnimals } from '~/utils/filterAnimal';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import { deleteImageFromCloudinary, getPublicIdFromUrl } from '~/utils/cloudinary';
import FamAccueil from '~/models/famAccueil';
import { mailjet } from '~/services/express';

interface UploadResult {
    url: string;
}

export const createAnimalAdmin = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const idFamily = (req as CustomRequest).user.fam
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

export const createAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const idFamily = (req as CustomRequest).user.fam
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

            const { caractere, nom, race, sexe, typeAdoption, espece, taille, birthdate, gabarit, ententeChat, ententeChien, ententeEnfant, ententeEtranger, affectueux, calme, protecteur, aboiement } = req.body

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
                protecteur: protecteur,
                aboiement: aboiement
            });
            if (idFamily) {
                await animal.save()
                    .then((data) => {
                        FamAccueil.findByIdAndUpdate(idFamily, {
                            $push: {
                                animals: animal._id
                            }
                        }, { omitUndefined: true, new: true })
                            .then((update) => {
                                mailjet.post("send", { 'version': 'v3.1' })
                                    .request({
                                        "Messages": [
                                            {
                                                "From": {
                                                    "Email": "lesanimauxdu27.web@gmail.com",
                                                    "Name": "Les Animaux du 27"
                                                },
                                                "To": [
                                                    {
                                                        "Email": "lesanimauxdu27.web@gmail.com"
                                                    }
                                                ],
                                                "TemplateID": 4745777,
                                                "TemplateLanguage": true,
                                                "Subject": "Validation Animal en attente !",
                                                "Variables": {
                                                    "famille": update?.nom,
                                                    "nom": data.nom,
                                                    "Espece": data.espece,
                                                    "Race": data.race,
                                                    "TypeA": data.typeAdoption === 0 ? "Normal" : data.typeAdoption === 1 ? "Retraite" : "Sos",
                                                    "url": `${process.env.FRONT_URL}admin/animal/`
                                                }
                                            }
                                        ]
                                    })
                                    .then((mail) => {
                                        res.status(201).send({})
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        res.status(500).send({})
                                    })
                            }).catch((err) => {
                                res.status(500).send({
                                    status: 500
                                })
                            })
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
                            .then(() => res.status(500).send({ status: 500 }))
                            .catch((error) => res.status(500).send({ status: 500 }));

                    })
            }
        } catch (error) {
            console.error('Failed to upload images:', error);
            res.status(500).send({ status: 500 });
        }

    } else {
        res.status(403).send({
            status: 403
        })
    }
}
export const updateAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        try {
            if (exist) {
                Animal.findByIdAndUpdate(req.params.id, {
                    ...req.body
                })
            } else {
                res.status(404).send({
                    message: 'Animal Introuvable'
                })
            }
        } catch (error) {
            res.status(500).send({ message: "Une erreur est survenue" })
        }
    }
}

export const getAllAnimalsValidated = async (req: Request, res: Response) => {
    console.log(req.query)

    try {
        if (Object.keys(req.query).length > 0) {
            const query = filterAnimals(req.query)
            const animals = await Animal.find(query)
            res.status(200).send({
                status: 200,
                animals: animals,
                nbChien: animals.filter(i => i.espece === 2).length,
                nbChat: animals.filter(i => i.espece === 1).length

            })
        } else {
            const animals = await Animal.find({ status: 1 })
            res.status(200).send({
                status: 200,
                animals: animals,
                nbChien: animals.filter(i => i.espece === 2).length,
                nbChat: animals.filter(i => i.espece === 1).length
            })
        }

    }
    catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }

}
export const getAllAnimalsID = async (req: Request, res: Response) => {
    try {
        const animals = await Animal.find({}, { _id: 1 })
        res.status(200).send({
            animals: animals
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }

}
export const getAllAnimals = async (req: Request, res: Response) => {
    try {
        const animals = await Animal.find({})
        res.status(200).send({
            animals: animals
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }

}


export const getLatestAnimal = async (req: Request, res: Response) => {
    try {
        const animals = await Animal.find({ status: 1 }).sort({ createdAt: -1 }).limit(3)
        res.status(200).send({
            animals: animals
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }
};



export const getAnimal = async (req: Request, res: Response) => {
    try {
        const animal = await Animal.findById(req.params.id)
        res.status(200).send({
            animal: animal
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération de l'animal"
        })
    }
};
export const getAnimalWithContact = async (req: Request, res: Response) => {
    try {
        const animal = await Animal.findById(req.params.id).populate('contact')
        res.status(200).send({
            animal: animal
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération de l'animal"
        })
    }
};


export const deleteAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        try {
            if (exist) {
                await Animal.findOneAndDelete({ _id: req.params.id }).then((data) => {
                    if (data?.image) {
                        const deletePromises = data?.image?.map((url) => {
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
                            .then(() => res.status(200).send({ message: "Animal supprimé" }))
                            .catch((error) => res.status(500).send({ message: error || "Erreur dans la suppression de l'animal" }));
                    } else {
                        res.status(200).send({
                            message: "Animal supprimé"
                        })
                    }
                })
            } else {
                res.status(404).send({
                    message: "Aucun animal correspondant à l'id"
                })
            }
        } catch (error) {

            res.status(500).send({
                message: error || "Erreur dans la suppression de l'animal"
            })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
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



