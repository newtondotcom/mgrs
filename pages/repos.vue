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
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/repos'
}]

const access_token_cookie = useCookie('access_token')

const octokit = new Octokit({
  auth: access_token_cookie.value
})

const datas = ref([]);
const printedDatas = ref([]);
const search = ref('')
const length = ref(0)
const loading = ref(true)

watch([page], () => {
  printedDatas.value = datas.value.slice((page.value - 1) * pagecount.value, page.value * pagecount.value)
})

watch([search], () => {  
  page.value = 1
  printedDatas.value = datas.value.filter((data) => data.name.toLowerCase().includes(search.value.toLowerCase())).slice((page.value - 1) * pagecount.value, page.value * pagecount.value)
  length.value = datas.value.filter((data) => data.name.toLowerCase().includes(search.value.toLowerCase())).length
})

async function getRepositoriesList() {
  try {
    const response = await octokit.request('GET /user/repos', {
      type : "owner",
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      },
      per_page: 1000,
    })
    datas.value = response.data
    printedDatas.value = datas.value.slice(0, pagecount.value)
    length.value = datas.value.length
    loading.value = false
  } catch (error) {
    console.error('Error fetching repositories:', error)
    toast.add({ title: 'Fail', description: 'Failed to recover your repos', status: 'fail' })
  }
}

onMounted(async () => {
  await getRepositoriesList();
})
</script>

<template>
  <div class="text-center">
    <UBreadcrumb :links="links" class="mb-6 ml-6" />
    <div class="flex flex-row justify-center w-min-screen w-full">
      <UInput class="align-end" color="gray" variant="outline" placeholder="Search..." v-model="search" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:py-[60px] lg:px-[100px]">
      <template v-if="loading">
        <div v-for="n in pagecount" :key="n" class="border border-gray-300 bg-gray-100 p-4 rounded-md">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="data in printedDatas"
          :key="data.id"
          @click="navigateTo('/repo/' + data.name)"
          class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer">
          <div class="flex items-center space-x-4">
            <div class="text-left">
              <div class="font-medium text-gray-900">{{ data.name }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="flex justify-center mt-6">
      <UPagination v-model="page" :page-count="pagecount" :total="length" :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }"/>
    </div>
  </div>
</template>

