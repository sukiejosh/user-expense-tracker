<template>
    <header class="relative h-16 px-4 shadow z-40 bg-white">
        <nav class="container mx-auto flex h-full justify-between items-center">
            <a class="font-thin text-grey hover:text-grey-dark block h-6 w-6 cursor-pointer" title="Go Back" @click.prevent="$router.back()">
                <svg class="w-6 h-6 fill-current hover:text-grey-dark text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"/>
                </svg>
            </a>

            <router-link to="/" class="hidden sm:flex flex-1 justify-center">
                <img src="@/assets/expense-tracker-logo.svg" class="h-8" alt="Expense Tracker">
            </router-link>

            <div class="flex items-center">
                <a v-if="$route.name !== 'Home'" class="font-thin text-grey hover:text-grey-dark block h-6 w-6 cursor-pointer mr-4 sm:hidden" title="Go Home" @click.prevent="$router.push({name: 'Home'})">
                    <svg class="w-6 h-6 fill-current hover:text-grey-dark text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M13 20v-5h-2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.59l-.3.3a1 1 0 1 1-1.4-1.42l9-9a1 1 0 0 1 1.4 0l9 9a1 1 0 0 1-1.4 1.42l-.3-.3V20a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2zm5 0v-9.59l-6-6-6 6V20h3v-5c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v5h3z"/>
                    </svg>
                </a>

                <div class="font-thin text-grey hover:text-grey-dark block h-6 w-6 mr-4 sm:hidden" v-else>
                    <svg class="w-6 h-6 fill-current hover:text-grey-dark text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="m12 8.0036a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z"/>
                    </svg>
                </div>

                <router-link to="/settings" class="block cursor-pointer flex items-center">
                    <svg class="w-6 h-6 fill-current hover:text-grey-dark text-grey" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"/>
                    </svg>
                </router-link>
            </div>

        </nav>
    </header>
</template>

<script>
    export default {}
</script>