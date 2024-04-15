<script setup lang="ts">
const toast = useToast()
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
  label: name,
  icon: 'i-heroicons-link'
}]

const noSecret = ref(false)
const isOpen = ref(false)
const modalDelete = ref(false)

let modalValue = ""
let modalName = ""

let repoPublicKey = ""
let repoKeyId = ""

const datas = ref([]);
const secrets = ref([]);

async function getSecretsList() {
  try {
    const tempSecrets = await $fetch(`/api/secrets/get?name=${name}`)
    datas.value = tempSecrets.map((data) => {
      return {
        name: data.name,
        visibility: "password",
        value: ""
      }
    })
    if (datas.value.length === 0) {
      noSecret.value = true
    }
  } catch (error) {
    console.error('Error fetching secrets:', error)
  }
}

async function upsertSecret() {
  const response = await $fetch('/api/secrets/post', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: modalName,
      value: modalValue,
      repo: name
    })
  })
  if (response.status === 201) {
    console.log('Secret added')
  }
}

async function removeSecret() {
  await $fetch(`/api/secrets/delete?name=${name}&secret=${modalName}`)
  datas.value = datas.value.filter((data) => data.name !== modalName)
  modalDelete.value = false
  toast.add({ title: 'Success', description: 'Secret deleted', status: 'success' })
}

async function openDeleteModal(data) {
  modalDelete.value = true;
  modalName = data.name;
}

async function addSecret() {
  if (modalName === "" || modalValue === "") {
    toast.add({ title: 'Error', description: 'Name and value are required'});
    return;
  }
  try {
    await upsertSecret();
    // check if secret already exists
    const existingSecret = datas.value.find((data) => data.name === modalName.toUpperCase());
    if (existingSecret) {
      toast.add({ title: 'Error', description: 'Secret already exists'});
      return;
    }
    // add secret to datas array
    datas.value.push({
      name: modalName,
      visibility: "password",
      value: ""
    });
    toast.add({ title: 'Success', description: 'Secret added'});
  } catch (error) {
    console.error('Error adding secret:', error);
  }
  isOpen.value = false;
  modalName = "";
  modalValue = "";
}

function changeVisibility(dataf) {
  const secret = datas.value.find((data) => data.name === dataf.name);
  if (secret) {
    secret.visibility = secret.visibility === "password" ? "text" : "password";
  }
}

async function updateValueToGithub(data) {
    modalValue = data.value;
    modalName = data.name;
    try {
    await upsertSecret();
    toast.add({ title: 'Success', description: 'Secret updated'});
    } catch (error) {
    console.error('Error updating secret:', error);
    }
}

onMounted(async () => {
  await getSecretsList();
})

watch([datas], () => {
  if (datas.value.length === 0) {
    noSecret.value = true
  } else {
    noSecret.value = false
  }
})

</script>

<template>
  <div class="text-center">
    <div class="px-4 flex flex-row justify-between items-center lg:px-[100px]">
      <UBreadcrumb :links="links" class="flex" />
      <div class="flex">
        <UButton class="mr-2" color="white" variant="solid">
          <span class="text-gray-500">
            <UIcon name="i-heroicons-arrow-down-tray-16-solid" />
            .env
          </span>
        </UButton>
        <UButton class="mr-2" color="white" variant="solid">
          <span class="text-gray-500">
            <UIcon name="i-heroicons-arrow-up-tray-16-solid" />
            .env
          </span>
        </UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:py-[60px] lg:px-[100px]">
      <div v-if="noSecret" class="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4">
        This repo has no secrets
      </div>
      <template v-if="datas.length === 0 && !noSecret">
        <div v-for="n in 6" :key="n" class="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="data in datas" :key="data.name"
          class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4">
          {{ data.name }}
          <div class="flex flex-row justify-center mt-2">
            <UButton @click="changeVisibility(data)" class="mx-1" icon="i-heroicons-eye-16-solid" size="sm" color="primary" square variant="solid" />
            <UInput :key="data.name" v-model="data.value" :type="data.visibility" color="primary" variant="outline" placeholder="Search..." />
            <UButton @click="updateValueToGithub(data)" class="ml-1" icon="i-heroicons-check-16-solid" size="sm" color="primary" square variant="solid" />
            <UButton @click="openDeleteModal(data)" class="ml-1" icon="i-heroicons-trash-solid" size="sm" color="primary" square variant="solid"/>
          </div>
        </div>
      </template>
      <div
        class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4 flex justify-center items-center">
        <UButton class="flex" @click="isOpen = true" icon="i-heroicons-plus-16-solid" size="sm" color="primary" square
          variant="solid" />
      </div>
    </div>
  </div>

  <UModal v-model="isOpen">
    <div class="px-10 py-8">
      <UInput class="my-2" color="primary" variant="outline" placeholder="Name" v-model="modalName" />
      <UInput class="my-2" type="password" color="primary" variant="outline" placeholder="Value" v-model="modalValue" />
      <div class="flex justify-end">
        <UButton @click="addSecret">
          <template #leading>
            <div >Yes</div>
          </template>
        </UButton>
        <UButton @click="isOpen = false" label="No" class="mx-2 px-4 py-2" />
      </div>
    </div>
  </UModal>

  <UModal v-model="modalDelete">
    <div class="px-10 py-8">
      Do you want to delete this secret?
      <div class="flex justify-end">
        <UButton @click="removeSecret" class="mx-2 px-4 py-2">
          <template #leading>
            <div>Yes</div>
          </template>
        </UButton>
        <UButton @click="modalDelete = false" label="No" class="mx-2 px-4 py-2" />
      </div>
    </div>
  </UModal>
</template>
