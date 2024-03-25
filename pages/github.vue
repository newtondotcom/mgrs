<script setup lang="ts">
import { ref,onMounted } from 'vue';

const config = useRuntimeConfig();
const route = useRoute().query;
const code = route.code;

const access_token_cookie = useCookie('access_token', "");

const {access_token} = await useFetch({
    url: '/api/github',
    method: 'POST',
    headers: {
        'Cache-Control': 'no-cache',
    },
    data: { code }
});
access_token_cookie.value = access_token;

</script>

<template>
  <div>
    <h1>GitHub access_token Token</h1>
  </div>
</template>
