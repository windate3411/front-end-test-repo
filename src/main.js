import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// import vue apollo and apollo-boost
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

// add global components
import FormAlert from './components/Shared/FormAlert.vue'

Vue.component('form-alert', FormAlert)

Vue.use(VueApollo)

// setup AplloClient
export const defaultClient = new ApolloClient({
  // uri: 'http://localhost:4000/graphql',
  uri: 'https://vinterest-danny.herokuapp.com/graphql',
  // includes token saved in localstorage with requests
  fetchOptions: {
    credentials: 'include',
  },
  request: (operation) => {
    // add token to localstroage if token key not found
    if (!localStorage.getItem('token')) localStorage.setItem('token', '')

    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token'),
      },
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) console.log('[Network error]', networkError)
    if (graphQLErrors) {
      for (let error of graphQLErrors) {
        if (error.name === 'AuthenticationError') {
          store.commit('SET_AUTH_ERROR', error)
          store.dispatch('signoutUser')
        }
        console.log('[graphqlErrors error]', error)
      }
    }
  },
})

const apolloProvider = new VueApollo({ defaultClient })

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    this.$store.dispatch('getCurrentUser')
  },
}).$mount('#app')
