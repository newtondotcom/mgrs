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

const datas = ref([]);

async function getSecretsList() {
  try {
    const tempSecrets = await $fetch(`/api/secrets/get?name=${name}`)
    datas.value = tempSecrets;
    if (datas.value.length === 0) {
      noSecret.value = true
    }
  } catch (error) {
    console.error('Error fetching secrets:', error)
  }
}

async function upsertSecret(secret_name : string, secret_value : string) {
  const response = await $fetch('/api/secrets/post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo_name: name,
      secret_value: secret_value,
      secret_name: secret_name
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
  if (datas.value.length === 0) {
    noSecret.value = true
  }
  toast.add({ title: 'Success', description: 'Secret deleted', status: 'success' })
}

async function openDeleteModal(data: { name: string; }) {
  modalDelete.value = true;
  modalName = data.name;
}

async function addSecret(name?: string, value?: string) {
  // Use name and value from modal if not provided
  const modalNameToUse = (typeof name === 'string') ? name : (modalName || "");
  const modalValueToUse = (typeof value === 'string') ? value : (modalValue || "");

  if (!modalNameToUse || !modalValueToUse) {
    toast.add({ title: 'Error', description: 'Name and value are required' });
    return;
  }

  try {
    // Add secret to the database
    await upsertSecret(modalNameToUse, modalValueToUse);

    // Check if secret already exists (case-insensitive)
    const existingSecret = datas.value.find((data) => data.name.toUpperCase() === modalNameToUse.toUpperCase());
    if (existingSecret) {
      toast.add({ title: 'Error', description: 'Secret already exists but its value has been updated !' });
      datas.value = datas.value.map((data) => {
        if (data.name.toUpperCase() === modalNameToUse.toUpperCase()) {
          data.value = modalValueToUse;
        }
        return data;
      });
      return;
    }

    // Add secret to datas array (assuming datas is reactive)
    datas.value.push({
      name: modalNameToUse,
      visibility: "password",
      value: modalValueToUse
    });

    // Update noSecret flag (assuming it's reactive)
    noSecret.value = false;

    // Toast success message
    toast.add({ title: 'Success', description: 'Secret added' });
  } catch (error) {
    console.error('Error adding secret:', error);
    toast.add({ title: 'Error', description: 'Failed to add secret' });
  }

  // Reset modal state
  isOpen.value = false;
  modalName = "";
  modalValue = "";
}


function changeVisibility(dataf: { name: any; }) {
  const secret = datas.value.find((data) => data.name === dataf.name);
  if (secret) {
    secret.visibility = secret.visibility === "password" ? "text" : "password";
  }
}

async function updateValueToGithub(data: { value: string; name: string; }) {
  modalValue = data.value;
  modalName = data.name;
  try {
    await upsertSecret(name, modalValue);
    toast.add({ title: 'Success', description: 'Secret updated' });
  } catch (error) {
    console.error('Error updating secret:', error);
  }
}


async function handleFileSelection() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.env';
  input.click();
  input.onchange = (event) => {
    const file = event.target?.files[0];
    if (file) {
      readFileContents(file);
    }
  };
}

async function readFileContents(file: Blob) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target?.result;
    const secrets = contents?.split('\n').map((line:string) => {
      let [name, value] = line.split('=');
      value = value.replaceAll(`"`, ``);
      return { name, value };
    });
    secrets.forEach(async (secret: { name: string; value: string; }) => {
      console.log(secret?.name, secret?.value);
      await addSecret(secret.name, secret.value);
    });
  };
  reader.readAsText(file);
}

async function generateEnvFile() {
  // Map datas.value to generate lines for the .env file
  const envFile = datas.value.map((data) => {
    let value = data.value;

    // Check if value is not a number (contains non-numeric characters)
    if (!/^-?\d+$/.test(value)) {
      // Remove surrounding quotes from the value
      value = `"${value}"`;
    }

    // Format the line in .env file format: NAME="VALUE"
    return `${data.name}="${value}"`;
  }).join('\n');

  // Create a Blob containing the .env file content
  const blob = new Blob([envFile], { type: 'text/plain' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = '.env';

  // Append the link to the document body and simulate a click
  document.body.appendChild(a);
  a.click();

  // Cleanup: remove the link and revoke the URL to free resources
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
    <div class="flex flex-row justify-between items-center">
      <UBreadcrumb :links="links" class="mb-6 ml-6 lg:px-[100px]" />
      <div class="flex mr-6">
        <UButton class="mr-2" color="white" variant="solid" @click="handleFileSelection">
          <span class="text-gray-500">
            <UIcon name="i-heroicons-arrow-up-tray-16-solid" />
            .env
          </span>
        </UButton>
        <UButton class="mr-2" color="white" variant="solid" @click="generateEnvFile">
          <span class="text-gray-500">
            <UIcon name="i-heroicons-arrow-down-tray-16-solid" />
            .env
          </span>
        </UButton>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 lg:py-[20px] lg:px-[100px]">
      <div v-if="noSecret"
        class="border text-gray-900 border-gray-300 bg-gray-100 p-4 rounded-md mb-4 dark:text-white dark:bg-gray-600 dark:border-gray-800">
        This repo has no secrets
      </div>
      <template v-if="datas.length === 0 && !noSecret">
        <div v-for="n in 6" :key="n"
          class="border border-gray-300 bg-gray-100 p-4 rounded-md mb-4 dark:bg-gray-600 dark:border-gray-800">
          <div class="flex items-center space-x-4">
            <USkeleton class="h-12 w-full px-4" />
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="data in datas" :key="data.name"
          class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4 dark:text-white dark:bg-gray-600 dark:border-gray-800">
          {{ data.name }}
          <div class="flex flex-row justify-center mt-2">
            <UButton @click="changeVisibility(data)" class="mx-1" icon="i-heroicons-eye-16-solid" size="sm"
              color="primary" square variant="solid" />
            <UInput :key="data.name" v-model="data.value" :type="data.visibility" color="primary" variant="outline"
              placeholder="Search..." />
            <UButton @click="updateValueToGithub(data)" class="ml-1" icon="i-heroicons-check-16-solid" size="sm"
              color="primary" square variant="solid" />
            <UButton @click="openDeleteModal(data)" class="ml-1" icon="i-heroicons-trash-solid" size="sm"
              color="primary" square variant="solid" />
          </div>
        </div>
      </template>
      <div
        class="border border-gray-300 bg-gray-100 hover:bg-gray-200 hover:border-gray-400 p-4 rounded-md cursor-pointer mb-4 flex justify-center items-center dark:text-white dark:bg-gray-600 dark:border-gray-800">
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
            <div>Yes</div>
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
