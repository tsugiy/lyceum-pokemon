<script setup>
  const {data: trainers} = await useTrainers();
  //const trainers = ["trainer001", "trainer002"];
      
</script>

<template>
  <div>
    <h1>つづきからはじめる</h1>
    <GamifyList>
      <GamifyItem v-for="trainer in trainers" :key="trainer">
        <NuxtLink :to="`/trainer/${trainer}`">{{ trainer }}</NuxtLink>
      </GamifyItem>
    </GamifyList>
    <p>{{ trainers }}</p>
  </div>
</template>
