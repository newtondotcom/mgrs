<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute().query;
const code = route.code;

const access_token_cookie = useCookie('access_token', "");

const {access_token} = await useFetch({
    URL: '/api/github2',
    params: { code : code },
});

</script>

<template>
  <div>
    <h1>GitHub access_token Token</h1>
  </div>
</template>
