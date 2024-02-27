import { Router } from "express";
import { findTrainers, upsertTrainer, findTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});


// トレーナー名の一覧の取得
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
  
    // TODO: 期待するレスポンスボディに変更する
    const trainerNames = trainers.map(({Key}) => Key.replace(/\.json$/, ""));
    console.log(trainerNames)
    
    res.send(trainerNames);
  } catch (err) {
    next(err);
  }
});

/*
// トレーナー名の一覧の取得 ダミー
router.get("/trainers", (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    //const trainers = ["trainer001","trainer002","trainer003","trainer004"];
    res.send(trainers);
  } catch (err) {
    next(err);
  }
});
*/


// トレーナーの追加
router.post("/trainer", async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    if(!("name" in req.body) && req.body.name.length<=0)
      res.status(400).send('No trainer name.');
    
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const trainers = await findTrainers();
    const trainerNames = trainers.map(({Key}) => Key.replace(/\.json$/, ""));
    if(trainerNames.includes(req.body.name))
      res.status(409).send('Already exist.');

    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});



// トレーナーの追加 ダミー
/*
router.post("/trainer", async (req, res, next) => {
  try {
    res.status(200).send('Success!!');
  } catch (err) {
    next(err);
  }
});
*/

// トレーナーの取得
// TODO: トレーナーを取得する API エンドポイントの実装
router.get("/trainer/:trainerName", async (_req, res, next) => {
  try {
    const trainer = await findTrainer(_req.params.trainerName);
    res.send(trainer);
  } catch (err) {
    next(err);
  }
});


// トレーナーの更新
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;

    // TODO: トレーナーが存在していなければ404を返す
    const trainers = await findTrainers();
    const trainerNames = trainers.map(({Key}) => Key.replace(/\.json$/, ""));
    if(!(trainerNames.includes(req.params.trainerName)))
      res.status(404).send('Not exist.');

      const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

// トレーナーの削除
// TODO: トレーナーを削除する API エンドポイントの実装

// ポケモンの追加
router.post("/trainer/:trainerName/pokemon", async (req, res, next) => {
  try {
    const { trainerName } = req.params;

    // TODO: リクエストボディにポケモン名が含まれていなければ400を返す
    if(!("name" in req.body) && req.body.name.length<=0)
      res.status(400).send('No pokemon name.');

    const pokemon = await findPokemon(req.body.name);
    const {order, name, sprites: {front_default},} = pokemon;
    const trainer = findTrainer(trainerName);
    trainer.pokemons.push({id:(trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1, nickname:"", order, name, sprites: {front_default},});

    // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
    const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

// ポケモンの削除
// TODO: ポケモンを削除する API エンドポイントの実装

export default router;
