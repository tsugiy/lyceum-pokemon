/** ポケモンの取得 */
export const findPokemon = async (name) => {
  /*
  await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        console.error('サーバーエラー');
      }
      const pokemon = response.json();
      return pokemon;
    })
    .catch(error => {
      console.error('通信に失敗しました', error);
  });
  */

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const pokemon = await response.json();
  return pokemon;
};
