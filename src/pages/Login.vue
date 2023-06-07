<template>
    <div class="flex flex-col h-full w-full justify-center content-center items-center mt-8">

        <img src="@/assets/expense-tracker-logo.svg" class="h-12 my-8" alt="Expense Tracker">

        <a class="btn-google flex flex-row content-center items-center mb-8" href="#" @click.prevent="signIn">
            <svg class="h-6 w-6" version="1.1" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-14,-14)" fill="none" fill-rule="evenodd">
                    <g transform="translate(-1,-1)">
                        <g transform="translate(15,15)">
                            <path d="m17.64 9.2045c0-0.63818-0.05727-1.2518-0.16364-1.8409h-8.4764v3.4814h4.8436c-0.20864 1.125-0.84273 2.0782-1.7959 2.7164v2.2582h2.9086c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z"
                                  fill="#4285f4"/>
                            <path d="m9 18c2.43 0 4.4673-0.80591 5.9564-2.1805l-2.9086-2.2582c-0.80591 0.54-1.8368 0.85909-3.0477 0.85909-2.3441 0-4.3282-1.5832-5.0359-3.7105h-3.0068v2.3318c1.4809 2.9414 4.5245 4.9582 8.0427 4.9582z"
                                  fill="#34a853"/>
                            <path d="m3.9641 10.71c-0.18-0.54-0.28227-1.1168-0.28227-1.71s0.10227-1.17 0.28227-1.71v-2.3318h-3.0068c-0.60955 1.215-0.95727 2.5895-0.95727 4.0418 0 1.4523 0.34773 2.8268 0.95727 4.0418z"
                                  fill="#fbbc05"/>
                            <path d="m9 3.5795c1.3214 0 2.5077 0.45409 3.4405 1.3459l2.5814-2.5814c-1.5586-1.4523-3.5959-2.3441-6.0218-2.3441-3.5182 0-6.5618 2.0168-8.0427 4.9582l3.0068 2.3318c0.70773-2.1273 2.6918-3.7105 5.0359-3.7105z"
                                  fill="#ea4335"/>
                            <path d="m0 0h18v18h-18z"/>
                        </g>
                    </g>
                </g>
            </svg>

            <span class="flex-1 ml-4">{{ text }}</span>
        </a>
    </div>
</template>

<style>
    .btn-google {
        color: #757575;
        font-weight: 600;
        text-decoration: none;
        background: #ffffff;
        padding: 1rem;
        border-radius: 0.25rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .12), 0 2px 4px 0 rgba(0, 0, 0, .08);
    }

    .btn-google:focus {
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
    }
</style>

<script>
    import {mapActions, mapGetters} from 'vuex';

    export default {
        name: 'Login',

        watch: {
            loggedIn(loggedIn) {
                if (loggedIn === true) {
                    this.$router.back();
                }
            }
        },

        data: () => ({
            loginTexts: {
                en: 'Sign in with Google',
                'ja-JP': 'Googleログイン'
            }
        }),

        computed: {
            ...mapGetters('auth', [
                'loggedIn'
            ]),
            text() {
                let lang = window.navigator.language;
                return this.loginTexts.hasOwnProperty(lang) ? this.loginTexts[lang] : this.loginTexts.en;
            },
            loginFlow() {
                if ('standalone' in window.navigator) {
                    return 'loginRequest'
                }

                return 'login';
            },
            withRedirect() {
                return this.loginFlow === 'loginRequest';
            }
        },

        async created() {
            if (this.withRedirect) {
                try {
                    await this.loginResult();
                } catch (error) {
                    console.log(error);
                }
            }
        },

        methods: {
            ...mapActions('auth', {
                login: 'LOGIN',
                loginRequest: 'LOGIN_REQUEST',
                logout: 'LOGOUT'
            }),

            async signIn() {
                return await this[this.loginFlow]();
            }
        }
    }
</script>