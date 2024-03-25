<script setup lang="ts">
import { Octokit } from "@octokit/core";
import { ref } from 'vue'

const toast = useToast()

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Repositories',
  icon: 'i-heroicons-square-3-stack-3d'
}]

const access_token_cookie = useCookie('access_token')

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    toast.error('Error signing out')
  } else {
    navigateTo('/')
  }
}

const octokit = new Octokit({
  auth: access_token_cookie.value
})

const datas = ref([]);

async function getRepositoriesList(number: number) {
  try {
    const response = await octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      per_page: 30,
      page: number
    })
    datas.value = response.data
  } catch (error) {
    console.error('Error fetching repositories:', error)
    toast.error('Error fetching repositories')
  }
}

onMounted(async () => {
  await getRepositoriesList(1);
})
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold">Repos</h1>
    <UBreadcrumb :links="links" />
    <div class="flex flex-col items-center">
      <div v-if="datas.length === 0">
      <div v-for="n in 30" :key="n">
        <div class="flex items-center space-x-4">
          <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
          </div>
        </div>
        </div>
      </div>
      <div v-else>
        <div v-for="data in datas" :key="data.id">
          {{ data.name }}
        </div>
      </div>
    </div>
    <div class="mt-4">
      <UButton @click="signOut" class="bg-red-500">
        Sign Out
      </UButton>
    </div>
  </div>
</template>
