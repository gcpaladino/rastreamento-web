<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
      <img class="img" v-bind:src="currentUser.photoURL" />
    </div>

    <md-card-content>
      <h4 class="card-title">{{currentUser.displayName}}</h4>
      <h6 class="category text-gray">{{currentUser.email}}</h6>
    </md-card-content>
  </md-card>
</template>
<script>
import { auth } from '@/config/firebase_conf'

export default {
  name: "user-card",
  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/marc.jpg")
    }
  },
  data() {
    return {
      currentUser: auth.currentUser
    };
  }
};
</script>
<style></style>
