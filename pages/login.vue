<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
        redirectTo: 'http://localhost:3000/auth'
    }
    })
    if (error) console.log(error)
}
</script>
<template>  
<div class="text-center align-middle justify-center h-full w-full">
    <UButton @click="signInWithGithub">Sign In with Github</UButton>
</div>
</template>
