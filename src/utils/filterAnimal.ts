export const filterAnimals = (query: any): object => {
    const {espece, gabarit, sexe, adoption, ententechat,ententechien, ententenfant } = query;
    let filter: any = {}
    if (espece) {
        const especeArray = espece.split(',').map(Number);
        filter.espece = { $in: especeArray };
    }
    if (gabarit) {
        const gabaritArray = gabarit.split(',').map(Number);
        filter.gabarit = { $in: gabaritArray }
    }
    if (sexe) {
        const genreArray = sexe.split(',').map(Number);
        filter.sexe = { $in: genreArray}
    }
    if (adoption) {
        const adoptionArray = adoption.split(',').map(Number);
        filter.typeAdoption = {$in: adoptionArray}
    }
    filter.status = 1

    return filter
}