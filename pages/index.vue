<script setup lang="ts">
import getRedirectUrl from '~/components/redirectUri';

const user = useSupabaseUser();
const supabase = useSupabaseClient()

async function goDashoard() {
    if (user.value) {
        navigateTo('/repos')
    } else {
        await signInWithGithub();
    }
}

const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: getRedirectUrl() }
  })
  if (error) console.log(error)
}

// Reactive variable for dark mode state
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);
let imageSrc: string = isDarkMode.value ? '/secrets.png' : '/secrets_dark.png';

// Watch for changes in dark mode preference
watch(() => isDarkMode.value, (newValue) => {
  imageSrc = newValue ? '/secrets.png' : '/secrets_dark.png';
}, { immediate: true });
</script>

<template>
    <section class="overflow-hidden sm:grid sm:grid-cols-2 sm:items-center mb-[70px]">
        <div class="p-8 md:p-12 lg:px-16 lg:py-24">
            <div class="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                <h2 class="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                    A tool to manage your Github personal Repositories secrets
                </h2>

                <p class="hidden text-gray-500 md:mt-4 md:block dark:text-gray-400">
                    An open-source web app simply made to manage your Github personal Repositories secrets with no <span
                        class="italic font-semibold">fioritures</span> (from French, meaning <span
                        class="italic">frills</span>).
                </p>

                <UButton class="mt-4" @click="goDashoard">
                    Get Started
                </UButton>
            </div>
        </div>

        <img
alt="" :src="imageSrc"
            class="h-full w-full sm:self-end sm:rounded-ss-[30px] md:rounded-ss-[20px]" >
    </section>
</template>