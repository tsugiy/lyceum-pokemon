<script setup>
import { ref } from 'vue';
const router = useRouter();
const config = useRuntimeConfig();
const trainerName = ref('');
const trainers = ref({data:[]})
const safeTrainerName = computed(() => trimAvoidCharacters(trainerName.value));
const valid = computed(() => safeTrainerName.value.length > 0);
const onSubmit = async () => {
  const response = await $fetch("/api/trainer", {
    baseURL: config.public.backendOrigin,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: safeTrainerName.value,
    }),
  }).catch((e) => e);
  if (response instanceof Error) return;
  trainers.value.data.push({"name":safeTrainerName.value})
  router.push(`/trainer/${safeTrainerName.value}`);
};
</script>

<template>
  <div>
    <h1>あたらしくはじめる</h1>
    <form @submit.prevent>
      <div class="form-example">
        <label for="name">トレーナー名を入力する: </label>
        <input id="name" v-model="trainerName" type="text" name="name" required />
      </div>
      <div class="add-button-example">
        <input type="button" value="トレーナーを追加する" :disabled="!valid" @click="onSubmit" />
      </div>
    </form>
    <p>{{ safeTrainerName }}</p>
    <ul>
      <li v-for="trainer in trainers.data" :key="trainer">
        {{ trainer }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
form {
  border-radius: 0.5rem;
  border: solid 4px #555;
  padding: 1.5rem 3rem;
}

form > :not(:last-child) {
  display: block;
  margin-bottom: 1rem;
}

.item > label,
.item > span {
  display: block;
  margin-bottom: 0.25rem;
}
.item > span {
  font-size: 0.875rem;
}
</style>
