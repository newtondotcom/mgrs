<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

const signInWithOtp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
        redirectTo: 'http://localhost:3000/confirm'
    }
    })
    if (error) console.log(error)
}
</script>
<template>
  <div>
    <button @click="signInWithOtp">
      Sign In with E-Mail
    </button>
    <input
      v-model="email"
      type="email"
    />
  </div>
</template>
