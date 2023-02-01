export const filterAnimals = (query: any): object => {
    const { age, espece, race, taille, entente, sexe, adoption } = query;
    let filter: any = {}
    if (age) {
        filter.age = age.toLowerCase() === "junior" ? { $lt: 2 } : age.toLowerCase() === "adulte" ? { $gt: 2 } : { $gt: 0 }
    }
    if (espece) {
        filter.espece = { $regex: new RegExp(espece, 'i') }
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
        filter.sexe = { $regex: new RegExp(sexe, 'i') }
    }
    if (adoption) {
        filter.adoption = { $regex: new RegExp(adoption, 'i') }
    }

    return filter
}