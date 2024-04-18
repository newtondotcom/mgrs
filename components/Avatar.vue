<script setup lang="ts">
import getRedirectUrl from './redirectUri';

const user = useSupabaseUser();
const supabase = useSupabaseClient()
const avatar_url = ref('');
const username = ref('');

async function refreshInfos() {
  const { data } = await useFetch("/api/infos");
  avatar_url.value = data.value?.avatar_url || '';
  username.value = data.value?.username || '';
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

const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: getRedirectUrl() }
  })
  if (error) console.log(error)
}
async function goSignIn() {
  await signInWithGithub();
}

const items = [
  [{
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/repos'
  }], [{
    label: 'Revoke Permissions',
    icon: 'i-heroicons-trash-solid',
    shortcuts: ['⌘', 'F4'],
    click: revokePermissions
  }, {
    label: 'Log out',
    icon: 'i-heroicons-arrow-left-end-on-rectangle-16-solid',
    click: logout
  }]
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
  <UButton v-else @click="goSignIn">
    <svg role="img" class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>GitHub</title>
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
    Sign In with Github
  </UButton>
</template>
