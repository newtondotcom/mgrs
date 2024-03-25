<script setup lang="ts">
import { Octokit } from "@octokit/core";
const route = useRoute()
const name = route.params.id
const links = [{
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/'
        }, {
        label: 'Repositories',
        icon: 'i-heroicons-square-3-stack-3d',
        to: '/repos'
        }, {
  label: 'Repository',
  icon: 'i-heroicons-link'
}]

const access_token_cookie = useCookie('access_token')

const octokit = new Octokit({
  auth: access_token_cookie.value
})

const datas = ref([]);

async function getSecretsList() {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
      owner: "newtondotcom",
      repo: name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    datas.value = response.data.secrets
  } catch (error) {
    console.error('Error fetching secrets:', error)
    toast.error('Error fetching secrets')
  }
}

onMounted(async () => {
  await getSecretsList();
})



/* 
await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
  owner: "newtondotcom",
  repo: name,
  secret_name: "test",
  encrypted_value: 'c2VjcmV0',
  key_id: '012345678912345678',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})
*/
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold">Repositories</h1>
    <UBreadcrumb :links="links" class="mb-6 ml-6" />
    <div class="px-6">
      <template v-if="datas.length === 0">
        <div v-for="n in 6" :key="n" class="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
            <div class="space-y-2">
              <USkeleton class="h-4 w-[250px]" />
              <USkeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="data in datas" 
          :key="data.id" 
          @click="navigateTo('/repo/' + data.name)"
          class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4">
          {{ data.name }}
          <div class="flex flex-row justify-center">
            <UInput color="primary" variant="outline" placeholder="Search..." />
            <UButton
              icon="i-heroicons-pencil-square"
              size="sm"
              color="primary"
              square
              variant="solid"
            />

            <UButton
              icon="i-heroicons-check-16-solid"
              size="sm"
              color="primary"
              square
              variant="solid"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
