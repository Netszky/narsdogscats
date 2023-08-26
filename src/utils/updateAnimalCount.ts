import { IAnimal } from "~/models/animalModel";

export default const updateAnimalCount = (animals: IAnimal[]) => {
    return animals.filter(f => f.status === 1 || f.status === 2 || f.status === 3);
}
