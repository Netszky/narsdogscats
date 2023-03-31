import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Animal from '~/models/animalModel';
import Contact from '~/models/contactModel';


export const createContact = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body

    const contact = new Contact({
        type: type,
        telephone: telephone,
        email: email,
        content: content,
        nom: nom,
        prenom: prenom
    });
    await contact.save()
        .then((data) => {
            res.status(201).send({
                status: 201
            })
        }).catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                status: 500
            })
        })
}


export const createContactBenevole = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body

    const contact = new Contact({
        type: "Demande de validation famille d'accueil",
        telephone: telephone,
        email: email,
        content: content,
        nom: nom,
        prenom: prenom
    });
    await contact.save()
        .then((data) => {
            res.status(201).send({
                status: 201,
            })
        }).catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                status: 500
            })
        })
}


export const createContactAnimal = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body

    const contact = new Contact({
        type: type,
        telephone: telephone,
        email: email,
        content: content,
        nom: nom,
        prenom: prenom
    });
    await contact.save()
        .then((data) => {
            Animal.findByIdAndUpdate(req.params.id, {
                contact: data._id
            }, { new: true, omitUndefined: true })
                .then((newAnimal) => {
                    console.log(newAnimal);
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
            res.status(500).send({
                message: "Impossible de créer l'evenement"
            })
        })
}
export const getAllContact = async (req: Request, res: Response) => {
    if (req.body.animal) {
        try {
            await Contact.find({ animal: req.body.animal }).then((data) => {
                res.status(200).send({
                    message: "OK",
                    contact: data,

                })
            })
        }
        catch (error) {
            res.status(404).send({
                message: "Aucun Contact trouvé"
            })

        }
    } else {
        try {
            await Contact.find().then((data) => {
                res.status(200).send({
                    message: "OK",
                    contact: data,

                })
            })
        }
        catch (error) {
            res.status(404).send({
                message: "Aucun Contact trouvé"
            })

        }
    }
}



export const getContact = async (req: Request, res: Response) => {

    try {
        await Contact.findById(req.params.id)
            .then((data) => res.status(200).send({
                message: "OK",
                contact: data
            }))
    } catch (error) {
        res.status(404).send({
            message: "Aucun evenement trouvé"
        })
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Contact.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Contact.findByIdAndDelete(req.params.id).then((data) => {
                    res.status(200).send({
                        message: "Evenement Deleted",
                    })
                })
            } catch (error) {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } else {
            res.status(404).send({
                message: "Aucun evenement trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

export const updateContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const { nom, url, telephone, mail, image, date, localisation } = req.body
        const exist = await Contact.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Contact.findByIdAndUpdate(req.params.id, {
                    nom: nom,
                    url: url,
                    telephone: telephone,
                    mail: mail,
                    image: image,
                    date: date,
                    loacalisation: localisation
                }, { new: true, omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            message: "Evenement Update",
                            contact: data
                        })
                    })
            } catch (error) {
                res.status(500).send({ status: "NOK" })
            }
        } else {
            res.status(404).send({
                message: "Aucun evenement trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

