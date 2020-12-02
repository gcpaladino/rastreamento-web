// =========================================================
// * Vue Material Dashboard - v1.4.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import * as VueGoogleMaps from "vue2-google-maps"
import GmapCluster from 'vue2-google-maps/src/components/cluster'

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

//Firebase Auth
import { auth } from '@/config/firebase_conf';

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

//Stores from vuex
import { store } from '@/store/store';

window.eventBus = new Vue()

Vue.config.productionTip = false
Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCDo2oRPAu6jMudbZEWjN27ly1YIZ-6_hQ",
    v: '3.',
  },
  installComponents: false
});
Vue.component('gmap-map', VueGoogleMaps.Map);
Vue.component('gmap-cluster', GmapCluster);
Vue.component('gmap-marker', VueGoogleMaps.Marker);
Vue.component('gmap-autocomplete', VueGoogleMaps.Autocomplete);
Vue.component('gmap-info-window', VueGoogleMaps.InfoWindow);

auth.onAuthStateChanged(function (user) {
  /* eslint-disable no-new */
  let vm = new Vue({
      el: "#app",
      render: h => h(App),
      router,
      store: store,
      data: {
        Chartist: Chartist
      }
  })
  global.vm = vm
})
