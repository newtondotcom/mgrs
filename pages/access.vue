<script setup lang="ts">
const config = useRuntimeConfig()
const useGithubApp = async () => {
    let link = "https://github.com/login/oauth/authorize"
    window.location.href = `${link}?client_id=${config.public.GITHUB_CLIENT_ID}`
}
</script>

<template>
<UButton @click="useGithubApp">Allow us to manage your Github secrets</UButton>
</template>