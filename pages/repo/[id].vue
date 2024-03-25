<script setup lang="ts">
import { Octokit } from "@octokit/core";
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
  label: 'Repository',
  icon: 'i-heroicons-link'
}]

const access_token_cookie = useCookie('access_token')

const octokit = new Octokit({
  auth: access_token_cookie.value
})

await octokit.request('GET /repos/{owner}/{repo}/environments/{environment_name}/secrets', {
  owner: "newtondotcom",
  repo: name,
  environment_name: "",
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold">Repositories</h1>
  <UBreadcrumb :links="links" />
  </div>
</template>