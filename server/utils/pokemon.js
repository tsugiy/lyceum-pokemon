import { ProxyAgent } from "proxy-agent";
 
const agent = new ProxyAgent();

/** ポケモンの取得 */
export const findPokemon = async (name) => {
  try{
    console.log("start findPokemon");
    console.log(name);
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`,{agent});
    const pokemon = await response.json();
    return pokemon;
  } catch (error) {
    console.log("err findPokemon");
    console.log(error);
  }
};
