<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient()
let avatar_url = ref('');
let username = ref('');

async function refresInfos(){
  const {data} = await useFetch("/api/infos");
  avatar_url.value = data.value?.avatar_url;
  username.value = data.value?.username;
}

const userConnected = ref(false);

await refresInfos();

watch(user, async () => {
  if (user.value) {
    userConnected.value = true;
  } else {
    userConnected.value = false;
  }
  await refresInfos();
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
</script>

<template>
  <div v-if="userConnected">
    <UPopover>
      <UButton color="gray">
        <template #leading>
          <div class="pl-4">{{ username }}</div>
          <UAvatar chip-color="green" chip-text="" chip-position="top-right" size="sm" :src="avatar_url"
            alt="Avatar" />
        </template>
      </UButton>
      <template #panel>
        <button @click="revokePermissions" class="px-3 py-2 block text-gray-500 transition hover:text-gray-500/75"> Revoke Permissions</button>
        <button @click="logout" class="px-3 py-2 block text-gray-500 transition hover:text-gray-500/75"> Log out
        </button>
      </template>
    </UPopover>
  </div>
  <UButton v-else @click="goSignIn">Sign in</UButton>
</template>