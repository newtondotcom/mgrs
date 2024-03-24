<script setup lang="ts">
const route = useRoute()
const { id } = route.params.id
const links = [{
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/'
        }, {
        label: 'Repositories',
        icon: 'i-heroicons-square-3-stack-3d',
        to: '/repos'
        }, {
  label: 'Repository',
  icon: 'i-heroicons-link'
}]
</script>

<template>
  <h1 class="text-4xl font-bold">Repo</h1>
  <UBreadcrumb :links="links" />
</template>