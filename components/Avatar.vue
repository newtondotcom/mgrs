<script setup lang="ts">
const user = useSupabaseUser();
const supabase = useSupabaseClient()
const username_cookie = useCookie('username');
const avatar_url_cookie = useCookie('avatar_url');
const access_token_cookie = useCookie('access_token');

const userConnected = ref(false);

watch(user, () => {
  if (user.value) {
    userConnected.value = true;
  } else {
    userConnected.value = false;
  }
}, { immediate: true });

console.log(avatar_url_cookie.value)

async function logout() {
  await supabase.auth.signOut()
  username_cookie.value = '';
  avatar_url_cookie.value = '';
  navigateTo('/');
}

async function revokePermissions() {
  access_token_cookie.value = '';
  navigateTo('/');
}
</script>

<template>
  <div v-if="userConnected">
    <UPopover>
      <UButton color="gray">
        <template #leading>
          <div class="pl-4">{{ username_cookie }}</div>
          <UAvatar chip-color="primary" chip-text="" chip-position="top-right" size="sm" :src="avatar_url_cookie"
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
</template>