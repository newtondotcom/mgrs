<script setup lang="ts">
      const toast = useToast()
      const links = [{
        label: 'Home',
        icon: 'i-heroicons-home',
        to: '/'
        }, {
        label: 'Repositories',
        icon: 'i-heroicons-square-3-stack-3d'
        }]

        const signOut = async () => {
            const { error } = await supabase.auth.signOut()
            if (error) {
                toast.error('Error signing out')
            } else {
                navigateTo('/')
            }
        }
            
      
</script>



<template>
<div class="text-center">
  <h1 class="text-4xl font-bold">Repos</h1>
  <UBreadcrumb :links="links" />
  <div class="mt-4">
    <UButton @click="signOut" class="bg-red-500">
      Sign Out
    </UButton>
  </div>
</div>
</template>
