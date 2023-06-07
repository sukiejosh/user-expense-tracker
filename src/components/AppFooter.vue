<template>
    <div class="circle_nav__wrapper">
            <button class="circle_nav__toggle" :class="{'open': menuOpen }" @click.prevent="toggleMenu">
                <svg v-if="!menuOpen" class="circle_nav__toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M4 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 2a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 2a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                </svg>
                <svg v-if="menuOpen" class="circle_nav__toggle-icon open" viewBox="0 0 24 24"
                     preserverAspectRatio="true"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>

            </button>

            <div class="circle_nav__links" :class="{'open': menuOpen}">
                <ul>
                    <router-link to="/add" tag="li" class="circle_nav__links-element" @click.native="closeMenu">
                        <a href="#" :title="__('Add Entry')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"/>
                            </svg>
                        </a>
                    </router-link>

                    <router-link to="/" tag="li" class="circle_nav__links-element" @click.native="closeMenu">
                        <a href="#" :title="__('Home')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM5.68 7.1A7.96 7.96 0 0 0 4.06 11H5a1 1 0 0 1 0 2h-.94a7.95 7.95 0 0 0 1.32 3.5A9.96 9.96 0 0 1 11 14.05V9a1 1 0 0 1 2 0v5.05a9.96 9.96 0 0 1 5.62 2.45 7.95 7.95 0 0 0 1.32-3.5H19a1 1 0 0 1 0-2h.94a7.96 7.96 0 0 0-1.62-3.9l-.66.66a1 1 0 1 1-1.42-1.42l.67-.66A7.96 7.96 0 0 0 13 4.06V5a1 1 0 0 1-2 0v-.94c-1.46.18-2.8.76-3.9 1.62l.66.66a1 1 0 0 1-1.42 1.42l-.66-.67zM6.71 18a7.97 7.97 0 0 0 10.58 0 7.97 7.97 0 0 0-10.58 0z"/>
                            </svg>
                        </a>
                    </router-link>

                    <router-link to="/overviews" tag="li" class="circle_nav__links-element" @click.native="closeMenu">
                        <a href="#" :title="__('Overview')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20 22H4a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h4V8c0-1.1.9-2 2-2h4V4c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2zM14 8h-4v12h4V8zm-6 4H4v8h4v-8zm8-8v16h4V4h-4z"/>
                            </svg>
                        </a>
                    </router-link>
                </ul>
            </div>
        </div>
</template>

<script>
    export default {
        components: {},

        data: () => ({
            menuOpen: false
        }),

        methods: {
            toggleMenu() {
                this.menuOpen = !this.menuOpen;
            },

            openMenu() {
                this.menuOpen = true;
            },

            closeMenu() {
                this.menuOpen = false;
            }
        }
    }
</script>