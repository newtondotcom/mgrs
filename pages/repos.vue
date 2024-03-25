<script setup lang="ts">
import { Octokit } from "@octokit/core";
import { ref } from 'vue'

const toast = useToast()

const page = ref(1)
const pagecount = ref(20)

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Repositories',
  icon: 'i-heroicons-square-3-stack-3d'
}]

const access_token_cookie = useCookie('access_token')

const octokit = new Octokit({
  auth: access_token_cookie.value
})

const datas = ref([]);
const printedDatas = ref([]);

watch([page], () => {
  printedDatas.value = datas.value.slice((page.value - 1) * pagecount.value, page.value * pagecount.value)
})

async function getRepositoriesList() {
  try {
    const response = await octokit.request('GET /user/repos', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      per_page: 1000,
      visibility: 'all',
    })
    datas.value = response.data
    printedDatas.value = datas.value.slice(0, pagecount.value)
  } catch (error) {
    console.error('Error fetching repositories:', error)
    toast.error('Error fetching repositories')
  }
}

onMounted(async () => {
  await getRepositoriesList();
})
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold">Repositories</h1>
    <UBreadcrumb :links="links" class="mb-6 ml-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
      <template v-if="datas.length === 0">
        <div v-for="n in 6" :key="n" class="border border-gray-300 bg-gray-100 p-4 rounded-md">
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
        <div v-for="data in printedDatas" 
          :key="data.id" 
          @click="navigateTo('/repo/' + data.name)"
          class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer">
          {{ data.name }}
        </div>
      </template>
    </div>
    <div class="flex justify-center mt-6">
      <UPagination v-model="page" :page-count="pagecount" :total="datas.length" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }"/>
    </div>
  </div>
</template>
