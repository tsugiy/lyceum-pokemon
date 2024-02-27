<script setup>
  import {useRoute} from "vue-router";

  const route = useRoute();

  const router = useRouter();
  const config = useRuntimeConfig();
  const { data: trainer, refresh } = await useFetch(
    () => `/api/trainer/${route.params.name}`,
    {
      default: () => [],
      server: false,
      baseUrl: config.public.backendOrigin,
    },
  );
  
  const nickname = ref("");
  const onNickname = async (pokemon) => {
    const newTrainer = trainer.value;
    const index = newTrainer.pokemons.findIndex(({ id }) => id === pokemon.id);
    newTrainer.pokemons[index].nickname = trimAvoidCharacters(nickname.value);
    nickname.value = "";
    const response = await $fetch(`/api/trainer/${route.params.name}`, {
      baseURL: config.public.backendOrigin,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrainer),
    }).catch((e) => e);
    if (response instanceof Error) return;
    await refresh();
    onCloseNickname();
  };
  const {
    dialog: nicknameDialog,
    onOpen: onOpenNickname,
    onClose: onCloseNickname,
  } = useDialog();
</script>

<template>
  <div>
    <h1>トレーナー情報</h1>
    <div class="trainer-info">
      <img src="/avatar.png" />
      <span>{{ trainer.name }}</span>
    </div>
    <h2>てもちポケモン</h2>
    <CatchButton :to="`/trainer/${route.params.name}/catch`">ポケモンをつかまえる</CatchButton>
    <GamifyList>
      <GamifyItem v-for="pokemon in trainer.pokemons" :key="pokemon.id">
        <span class="pokemon-name">{{ pokemon.nickname || pokemon.name }}</span>
        <GamifyButton @click="onOpenNickname(pokemon)">ニックネームをつける</GamifyButton>
        <GamifyButton @click="onOpenRelease(pokemon)">はかせにおくる</GamifyButton>
      </GamifyItem>
    </GamifyList>
    <GamifyDialog
      v-if="nicknameDialog"
      id="confirm-nickname"
      title="ニックネーム"
      :description="`${nicknameDialog.name}　の　ニックネームは？`"
      @close="onCloseNickname"
    >
      <div class="item">
        <label for="name">ニックネーム</label>
        <input
          id="name"
          v-model="nickname"
          @keydown.enter="onNickname(nicknameDialog)"
        />
      </div>
      <GamifyList :border="false" direction="horizon">
        <GamifyItem>
          <GamifyButton @click="onCloseNickname">キャンセル</GamifyButton>
        </GamifyItem>
        <GamifyItem>
          <GamifyButton @click="onNickname(nicknameDialog)"
            >けってい</GamifyButton
          >
        </GamifyItem>
      </GamifyList>
    </GamifyDialog>
  </div>
</template>


<style scoped>
.item > label {
  display: block;
  margin-bottom: 0.25rem;
}

.gamify-item:hover img {
  animation: bounce;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
}

.trainer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.trainer-info > img {
  width: 3rem;
  height: 3rem;
}
</style>