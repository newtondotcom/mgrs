<script setup lang="ts">

</script>

<template>
  <UPopover>
  <UButton label="Button" color="gray">
    <template #leading>
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
      <div class="p-4">
        <Placeholder class="h-20 w-48" />
      </div>
    </template>
  </UPopover>
</template>