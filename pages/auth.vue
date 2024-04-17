<script setup lang="ts">
const route = useRoute().query;
const code = route.code;

// code of github oauth
if (code?.split('-').length > 1) {
    const {data} = await useFetch("/api/token");
    const access_token = data.value?.access_token;
    if (access_token) {
        navigateTo('/repos');
    } else {
      navigateTo('/github');
    }
// code of supabase redirectTo
} else {
    const {data} = await useFetch('/api/github', {
    params: { code: code },
    });
    navigateTo('/repos');
}
</script>

<template>
  <div id="loading-screen" class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
    <span class="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
      <i class="fas fa-circle-notch fa-spin fa-5x"/>
    </span>
  </div>
</template>
