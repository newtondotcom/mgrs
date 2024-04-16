<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient()
let avatar_url = ref('');
let username = ref('');

async function refreshInfos() {
  const { data } = await useFetch("/api/infos");
  avatar_url.value = data.value?.avatar_url;
  username.value = data.value?.username;
}

const userConnected = ref(false);

watch(user, async () => {
  if (user.value) {
    userConnected.value = true;
    await refreshInfos();
  } else {
    userConnected.value = false;
  }
}, { immediate: true });

async function logout() {
  await supabase.auth.signOut()
  navigateTo('/');
}

async function revokePermissions() {
  navigateTo('/');
}

async function goSignIn() {
  navigateTo('/login');
}

const items = [
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/repos'
  }], [{
    label: 'Revoke Permissions',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: revokePermissions
  }, {
    label: 'Log out',
    icon: 'i-heroicons-pencil-square-20-solid',
    shortcuts: ['E'],
    click: logout
  }]
  /*
  {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid',
    shortcuts: ['D'],
    disabled: true
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    shortcuts: ['⌘', 'D']
  }]
  */
]
</script>

<template>
  <UDropdown v-if="userConnected" :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton color="gray">
      <template #leading>
        <div class="pl-4">{{ username }}</div>
        <UAvatar chip-color="green" chip-text="" chip-position="top-right" size="sm" :src="avatar_url" alt="Avatar" />
      </template>
    </UButton>
  </UDropdown>
  <UButton v-else @click="goSignIn">Sign in</UButton>
</template>
