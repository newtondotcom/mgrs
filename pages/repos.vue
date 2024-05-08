<script setup lang="ts">
const user = useSupabaseUser()
if (!user.value) {
  navigateTo('/')
}
const toast = useToast()

const links = [{
  label: 'Home',
  icon: 'i-heroicons-home',
  to: '/'
}, {
  label: 'Repositories',
  icon: 'i-heroicons-square-3-stack-3d',
  to: '/repos'
}]

const page = ref(1)
const pagecount = ref(20)
const datas = ref<{ name: string; id: number }[]>([]);
const printedDatas = ref<{ name: string; id: number }[]>([]);
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

async function getReposListitoriesList() {
  try {
    const tempRepos = await $fetch('/api/repos')
    datas.value = tempRepos.map((data) => {
      return {
        name: data.name,
        id: data.id
      }
    })
    printedDatas.value = datas.value.slice(0, pagecount.value)
    length.value = datas.value.length
    loading.value = false
  } catch (error) {
    console.error('Error fetching repositories:', error)
    toast.add({ title: 'Fail', description: 'Failed to recover your repos' })
    navigateTo('/github')
  }
}

onMounted(async () => {
  await getReposListitoriesList();
})
</script>

<template>
  <div class="text-center">
    <UBreadcrumb :links="links" class="mb-6 ml-6 lg:px-[100px]" />
    <div class="flex flex-row justify-center w-min-screen w-full">
      <UInput v-model="search" class="align-end" color="gray" variant="outline" placeholder="Search..." />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:py-[40px] lg:px-[100px]">
      <template v-if="loading">
        <div v-for="n in pagecount" :key="n"
          class="border border-gray-300 bg-gray-100 p-4 rounded-md dark:bg-gray-600 dark:border-gray-800">
          <div class="flex items-center space-x-4 ">
            <USkeleton class="h-4 w-full" />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="data in printedDatas" :key="data.id"
          class="border border-gray-300 text-gray-900 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer dark:text-white dark:bg-gray-600 dark:border-gray-800"
          @click="navigateTo('/repo/' + data.name)">
          <div class="flex items-center space-x-4">
            <div class="text-left">
              <div class="font-medium">{{ data.name }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="flex justify-center mt-2 mb-6">
      <UPagination v-model="page" :page-count="pagecount" :total="length"
        :ui="{ rounded: 'first-of-type:rounded-s-md last-of-type:rounded-e-md' }" />
    </div>
  </div>
</template>
