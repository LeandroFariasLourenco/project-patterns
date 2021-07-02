import createDatabase from "./database";
import { Pokemon } from "./models";
import pokemons from "./pokemons";

const PokemonDB = createDatabase<Pokemon>().instance;
const unsubscribe = PokemonDB.onAfterAdd(({
  value
}) => { console.log(value); });

pokemons.forEach((pokemon) => {
  PokemonDB.set(pokemon);
});

PokemonDB.visit(({ id }) => {
  console.log('Pokemon: ', id);
});

const bestDefensive = PokemonDB.selectBest(({ defense }) => defense);
const bestAttacking = PokemonDB.selectBest(({ attack }) => attack);

console.log('Best attack:', bestAttacking?.id);
console.log('Best defense:', bestDefensive?.id);

unsubscribe();
