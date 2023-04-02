import { Request, Response } from 'express';
import Animal from '~/models/animalModel';
import { CustomRequest } from '~/middlewares/verifyToken';

import { filterAnimals } from '~/utils/filterAnimal';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import { deleteImageFromCloudinary, getPublicIdFromUrl } from '~/utils/cloudinary';
import FamAccueil from '~/models/famAccueil';
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

            const { caractere, nom, race, sexe, entente, typeAdoption, espece, taille, birthdate } = req.body

            const date = new Date(birthdate);
            const ageDifMs = Date.now() - date.getTime();
            const ageDate = new Date(ageDifMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            const animal = new Animal({
                nom: nom,
                age: age,
                race: race.toLowerCase(),
                sexe: sexe.toUpperCase(),
                caractere: caractere,
                entente: JSON.parse(entente.toLowerCase()),
                typeAdoption: typeAdoption.toLowerCase(),
                espece: espece.toLowerCase(),
                taille: taille.toLowerCase(),
                birthdate: birthdate,
                image: imagesUrls
            });
            await animal.save()
                .then((data) => {
                    FamAccueil.findByIdAndUpdate(idFamily, {
                        $push: {
                            animals: animal._id
                        }
                    }, { omitUndefined: true })
                        .then((update) => {
                            res.status(201).send({
                                status: 201
                            })
                        }).catch((err) => {
                            res.status(500).send({
                                status: 500
                            })
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

export const getAllAnimals = async (req: Request, res: Response) => {

    if (Object.keys(req.query).length > 0) {
        const query = filterAnimals(req.query)
        await Animal.find(query).then((data) => {
            res.status(200).send({
                status: 200,
                animals: data,
                nbChien: data.filter(i => i.espece === "chien").length,
                nbChat: data.filter(i => i.espece === "chat").length

            })
        })
    } else {
        try {
            await Animal.find({}).then((data) => {
                res.status(200).send({
                    status: 200,
                    animals: data,
                    nbChien: data.filter(i => i.espece === "chien").length,
                    nbChat: data.filter(i => i.espece === "chat").length
                })
            })
        } catch (error) {
            res.status(500).send({
                status: 500
            })
        }
    }

}


export const getLatestAnimal = async (req: Request, res: Response) => {
    try {
        await Animal.find({}).sort({ createdAt: -1 }).limit(3)
            .then((data) => res.status(200).send({
                status: 200,
                animals: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};



export const getAnimal = async (req: Request, res: Response) => {

    try {
        await Animal.findById(req.params.id)
            .then((data) => res.status(200).send({
                status: 200,
                animal: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};
export const getAnimalContact = async (req: Request, res: Response) => {

    try {
        await Animal.findById(req.params.id).populate("contact")
            .then((data) => res.status(200).send({
                status: 200,
                animal: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};

export const deleteAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Animal.findByIdAndDelete(req.params.id).then((data) => {
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
                            .then(() => res.status(200).send({ status: 200 }))
                            .catch((error) => res.status(500).send({ status: 500 }));
                    } else {
                        res.status(200).send({
                            status: 200
                        })
                    }
                })
            } catch (error) {
                res.status(500).send({
                    status: 500
                })
            }
        } else {
            res.status(500).send({
                status: 500
            })
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
        const date = new Date(req.body.birthdate);
        const ageDifMs = Date.now() - date.getTime();
        const ageDate = new Date(ageDifMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (exist) {
            try {
                await Animal.findByIdAndUpdate(req.params.id, {
                    nom: req.body.nom,
                    age: age,
                    espece: req.body.espece,
                    race: req.body.race,
                    sexe: req.body.sexe,
                    entente: req.body.entente,
                    caractere: req.body.caractere,
                    typeAdoption: req.body.adoption,
                    taille: req.body.taille,
                    birthdate: req.body.birthdate
                }, { new: true, omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            status: 200
                        })
                    })
            } catch (error) {
                res.status(500).send({ status: 500 })
            }
        } else {
            res.status(500).send({
                status: 500
            })
        }
    } else {
        res.status(403).send({
            status: 403
        })
    }
}

