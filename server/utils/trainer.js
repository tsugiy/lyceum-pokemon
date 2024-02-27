import { ListObjectsCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

const config = useRuntimeConfig();


const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });


/** トレーナーの一覧の取得 */
export const findTrainers = async () => {
  const objects = await s3Client.send(
    new ListObjectsCommand({ Bucket: config.bucketName }),
  );
  return objects.Contents ?? [];
};


/** トレーナーの一覧の取得 ダミー */
/*
export const findTrainers = async () => {
  const trainers = ["trainer001","trainer002","trainer003","trainer004"];
  return trainers;   
};
*/

/** トレーナーの取得 */
// TODO: トレーナーを取得する S3 クライアント処理の実装
export const findTrainer = async (name) => {
  const object = await s3Client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
    }),
  );
  const trainer = JSON.parse(await streamToString(object.Body));
  return trainer;
};


/** トレーナーの取得 ダミー */
/*
export const findTrainer = async (name) => {
  console.log("findTrainer")
  console.log(name)
  const trainer = {"name":name, "pokemons":[{"name":"pokemon1","nickname":""}, {"name":"pokemon2","nickname":"222"}, {"name":"pokemon3","nickname":"333"}]};
  console.log(trainer)
  return trainer;
};
*/

/** トレーナーの追加更新 */
export const upsertTrainer = async (name, trainer) => {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
      Body: JSON.stringify({ name: "", pokemons: [], ...trainer }),
    }),
  );
  return result;
};

/** トレーナーの削除 */
// TODO: トレーナーを削除する S3 クライアント処理の実装
