<script setup lang="ts">
const route = useRoute().query;
const code = route.code;

const access_token_cookie = useCookie('access_token');
const avatar_url_cookie = useCookie('avatar_url');
const username_cookie = useCookie('username');

const user = useSupabaseUser();

if (code) {
    const { data } = await useFetch('/api/github', {
    params: { code: code },
    });
    access_token_cookie.value = data.value.access_token;
    navigateTo('/repos');
} else if (access_token_cookie.value) {
    navigateTo('/github');
}

watch(user, () => {
  if (user.value) {
    avatar_url_cookie.value = user.value.user_metadata.avatar_url;
    username_cookie.value = user.value.user_metadata.user_name;
  }
}, { immediate: true });
</script>

<template>
  <div id="loading-screen" class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
    <span class="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
      <i class="fas fa-circle-notch fa-spin fa-5x"></i>
    </span>
  </div>
</template>
