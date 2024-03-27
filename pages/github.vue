<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute().query;
const code = route.code;

const access_token_cookie = useCookie('access_token');
const username_cookie = useCookie('username');

const {data} = await useFetch('/api/github',{
    params: { code : code },
});
access_token_cookie.value = data.value.access_token;
username_cookie.value = data.value.username;
navigateTo('/repos');
</script>

<template>
<div id="loading-screen" class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
  <span class="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
    <i class="fas fa-circle-notch fa-spin fa-5x"></i>
  </span>
</div>
</template>
