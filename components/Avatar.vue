<template>
  <UPopover>
  <UButton color="gray">
    <template #leading>
      <div class="pl-4">newtondotcom</div>
      <UAvatar
        chip-color="primary"
        chip-text=""
        chip-position="top-right"
        size="sm"
        src="https://avatars.githubusercontent.com/u/739984?v=4"
        alt="Avatar"
      />
    </template>
  </UButton>
    <template #panel>
          <button class="px-3 py-2 block text-gray-500 transition hover:text-gray-500/75"> Revoke Permissions</button>
          <button class="px-3 py-2 block text-gray-500 transition hover:text-gray-500/75"> Log out </button>
    </template>
  </UPopover>
</template>