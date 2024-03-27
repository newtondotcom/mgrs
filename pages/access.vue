<script setup lang="ts">
const config = useRuntimeConfig()
const useGithubApp = async () => {
    let link = "https://github.com/login/oauth/authorize"
    window.location.href = `${link}?client_id=${config.public.GITHUB_CLIENT_ID}&response_type=code&scope=repo,admin:org`
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <UButton @click="useGithubApp">Allow us to manage your Github secrets</UButton>
  </div>
</template>
