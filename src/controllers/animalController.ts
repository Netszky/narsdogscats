import { Request, Response } from 'express';
import Animal from '~/models/animalModel';
import { CustomRequest } from '~/middlewares/verifyToken';

import { filterAnimals } from '~/utils/filterAnimal';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import { deleteImageFromCloudinary, getPublicIdFromUrl } from '~/utils/cloudinary';
import FamAccueil from '~/models/famAccueil';
import { mailjet } from '~/services/express';
import Informations from '~/models/infoAssociation';

interface UploadResult {
    url: string;
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

            const { caractere, nom, race, sexe, typeAdoption, espece, taille, birthdate, gabarit, ententeChat, ententeChien, ententeEnfant, ententeEtranger, affectueux, calme, joueur, bruit } = req.body

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
                famille: idFamily
            });
            if (idFamily) {
                await animal.save()
                    .then(async (data) => {
                        const infos = await Informations.findOne()
                        mailjet.post("send", { 'version': 'v3.1' })
                            .request({
                                "Messages": [
                                    {
                                        "From": {
                                            "Email": infos?.email,
                                            "Name": "Les Animaux du 27"
                                        },
                                        "To": [
                                            {
                                                "Email": infos?.email
                                            }
                                        ],
                                        "TemplateID": 4745777,
                                        "TemplateLanguage": true,
                                        "Subject": "Validation Animal en attente !",
                                        "Variables": {
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
                    })
                    .catch((err) => {
                        console.log(err);

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

    try {
        if (Object.keys(req.query).length > 0) {
            const query = filterAnimals(req.query)
            const animals = await Animal.find(query)
            res.status(200).send({
                status: 200,
                animals: animals,


            })
        } else {
            const animals = await Animal.find({ status: 1 })
            res.status(200).send({
                status: 200,
                animals: animals,

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




export const changeAnimalStatus = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const animal = await Animal.findById(req.params.id)
        if (animal?.famille.toString() === (req as CustomRequest).user.fam) {
            try {
                await Animal.findByIdAndUpdate(req.params.id, {
                    status: req.body.status
                }, { omitUndefined: true })
                res.status(200).send({ message: "Animal Modifié" })

            } catch (error) {
                res.status(500).send({ message: error || "Erreur lors de l'activation de l'animal" })
            }
        } else {
            res.status(403).send({
                message: "Forbidden"
            })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}

export const getAnimalsCount = async (req: Request, res: Response) => {
    try {
        const animals = await Animal.find({ status: 1 }, { espece: 1 })

        res.status(200).send({
            total: animals
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la récupération des animaux"
        })
    }
};

export const getAnimalByFamille = async (req: Request, res: Response) => {
    const user = (req as CustomRequest).user
    if (user.isAdmin) {
        try {
            const animals = await Animal.find({ famille: user.fam }).populate('contact')
            res.status(200).send({ animals: animals })
        } catch (error) {
            res.status(500).send({ message: "Erreur lors de la récupération" })
        }
    } else {
        res.status(403).send({ message: "Unauthorized" })
    }
}



