<script setup lang="ts">
import { Octokit } from "@octokit/core";
const toast = useToast()
const route = useRoute()
import sodium from "libsodium-wrappers";
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
  label: name,
  icon: 'i-heroicons-link'
}]

const noSecret = ref(false)
const isOpen = ref(false)

let modalValue = ""
let modalName = ""
let modalLoading = false

let repoPublicKey = ""
let repoKeyId = ""

const access_token_cookie = useCookie('access_token')
const username_cookie = useCookie('username');

const octokit = new Octokit({
  auth: access_token_cookie.value
})

const datas = ref([]);
const secrets = ref([]);

async function getSecretsList() {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
      owner: username_cookie.value,
      repo: name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    datas.value = response.data.secrets
    if (datas.value.length === 0) {
      noSecret.value = true
    }
  } catch (error) {
    console.error('Error fetching secrets:', error)
  }
}

async function getPublicKey() {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      owner: username_cookie.value,
      repo: name,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const key = response.data
    repoPublicKey = key.key
    repoKeyId = key.key_id
  } catch (error) {
    console.error('Error fetching public key:', error)
  }
}

async function convertUsingSodiumAndPush() {
  await sodium.ready;
  let binkey = sodium.from_base64(repoPublicKey, sodium.base64_variants.ORIGINAL)
  let binsec = sodium.from_string(modalValue)
  let encBytes = sodium.crypto_box_seal(binsec, binkey)
  let encryptedValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL)
  const response = await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner: "newtondotcom",
    repo: name,
    secret_name: modalName,
    encrypted_value: encryptedValue,
    key_id: repoKeyId,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  if (response.status === 201) {
    console.log('Secret added')
  }
}

async function addSecret() {
  modalLoading = true
  if (modalName === "" || modalValue === "") {
    toast.add({ title: 'Error', description: 'Name and value are required', status: 'error' })
    modalLoading.value = false
    return
  }
  try {
    if (repoPublicKey === "") {
      await getPublicKey()
    }
    const encryptedValue = await convertUsingSodiumAndPush()
      // ad supabase
      datas.value.push({
        name: modalName,
      })
    } catch (error) {
      console.error('Error adding secret:', error)
    }
    toast.add({ title: 'Success', description: 'Secret added', status: 'success' })
    modalLoading = false
    isOpen.value = false
  }

onMounted(async () => {
  await getSecretsList();
})
</script>

<template>
  <div class="text-center">
    <UBreadcrumb :links="links" class="flex ml-6" />
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:py-[60px] lg:px-[100px]">
      <div v-if="noSecret" class="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4">
        This repo has no secrets
      </div>
      <template v-if="datas.length === 0 && !noSecret">
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
        <div v-for="data in datas" :key="data.id" class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4">
          {{ data.name }}
          <div class="flex flex-row justify-center mt-2">
            <UInput color="primary" variant="outline" placeholder="Search..." />
            <UButton icon="i-heroicons-eye-16-solid" size="sm" color="primary" square variant="solid" />
            <UButton icon="i-heroicons-check-16-solid" size="sm" color="primary" square variant="solid" />
          </div>
        </div>
      </template>
    <div class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4 flex justify-center items-center">
        <UButton class="flex" @click="isOpen=true" icon="i-heroicons-plus-16-solid" size="sm" color="primary" square variant="solid" />
    </div>
    </div>
  </div>

  <UModal v-model="isOpen">
    <div class="px-10 py-8">
      <UInput class="my-2" color="primary" variant="outline" placeholder="Name" v-model="modalName"/>
      <UInput class="my-2" type="password" color="primary" variant="outline" placeholder="Value" v-model="modalValue"/>
      <div class="flex justify-end">
        <UButton @click="addSecret">
    <template #leading>
    <div v-if="!modalLoading" class="">Add</div>
    <div v-else>
      <div role="status">
          <svg aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span class="sr-only">Loading...</span>
      </div>
    </div>
    </template>
  </UButton>
      </div>
    </div>
  </UModal>
</template>

