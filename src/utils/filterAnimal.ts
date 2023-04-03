export const filterAnimals = (query: any): object => {
    const { age, espece, race, taille, entente, sexe, adoption } = query;
    let filter: any = {}
    if (age) {
        filter.age = age.toLowerCase() === "junior" ? { $lt: 2 } : age.toLowerCase() === "adulte" ? { $gt: 2 } : { $gt: 0 }
    }
    if (espece) {
        // filter.espece = { $regex: new RegExp(espece, 'i') }
        const especeValues = espece.split(',');
        filter.espece = { $in: especeValues.map((val: string) => new RegExp(val, 'i')) };
    }
    if (race) {
        filter.race = { $regex: new RegExp(race, 'i') }
    }
    if (taille) {
        filter.taille = { $regex: new RegExp(taille, 'i') }
    }
    if (entente) {
        let values = entente.split(',');
        filter.entente = {
            $all: values.map((value: string) => ({
                $elemMatch: {
                    $regex: value,
                    $options: "i"
                }
            }))
        };
    }
    if (sexe) {
        const sexeValues = sexe.split(',');
        filter.sexe = { $in: sexeValues.map((val: string) => new RegExp(val, 'i')) };
    }
    if (adoption) {
        const adoptionValues = adoption.split(',');
        filter.typeAdoption = { $in: adoptionValues.map((val: string) => new RegExp(val, 'i')) };
    }
    filter.validated = true

    return filter
}