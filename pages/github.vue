<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const route = useRoute().query
const code = route.code
const link = "https://github.com/login/oauth/access_token" 

const params = {
  client_id: config.public.GITHUB_CLIENT_ID,
  client_secret: config.public.GITHUB_CLIENT_SECRET,
  code: code
}

const tokenResponse = ref(null)

const { data, pending, error, refresh } = await useFetch("oauth/access_token", 
{query: params, method: 'POST'})
console.log(data)
</script>

<template>
  <div>
    <h1>GitHub Token</h1>
    <div v-if="tokenResponse">
      <!-- Display tokenResponse data here -->
    </div>
  </div>
</template>
