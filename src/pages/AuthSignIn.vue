<template>
  <div>
    <div class="login-container">
      <div class="fields-column">
        <!-- <img src="/static/lookapp_logo_mascot.png" /> -->
        <h4>Acesse sua conta</h4>
        <div class="fields">
          <md-field>
            <md-input placeholder="Insira seu e-mail" v-model="email"></md-input>
          </md-field>
          <md-field>
            <md-input type="password" placeholder="Insira sua senha" v-model="password"></md-input>
          </md-field>
        </div>
        <div class="bottom-buttons">
           <md-button class="full-button outline" @click="signInWithEmail">Acessar minha conta</md-button>
        </div>
      </div>
      <div class="image-column">
        <div id="anima"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '@/config/firebase_conf'
export default {
  name: 'authSignIn',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    signInWithEmail () {
      auth.signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          this.$router.push('/admin')
        })
        .catch((error) => {
          alert(error.message)
        })
    },
    signInWithProvider (selectedProvider) {
      let provider
      if (selectedProvider === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      } else {
        provider = new firebase.auth.GoogleAuthProvider()
      }
      auth.signInWithPopup(provider)
        .then((user) => {
          this.$router.push('/admin')
        })
        .catch((error) => {
          alert(error.message)
        })
    }
  }
}
</script>
<style>
.fields-column {
  float: left;
  width: 355px;
  padding: 50px;
}

.image-column {
  float: right;
  width: 475px;
}
.login-container {
  width: 850px;
  height: 600px;
  background: #FFF;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  box-shadow: 0px 0px 30px 0px #00000015;
  border-radius: 5px;
}

#anima {
  width: 478px;
  height: 600px;
  background: url(/static/bg.png) no-repeat;
}

h4 {
  text-align: center;
  color: #204370;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 700;
  margin: 12px 0 0 0;
}

span.description {
  margin: 10px 0 20px 0;
  float: left;
  color: #4A4A4A;
  font-size: 14px;
  padding: 0 30px;
  clear: both;
}

hr.small,
hr.full {
  width: 60px;
  height: 1px;
  background: #FFF;
  border: transparent;
  border-top: 1px solid #DEDEDE;
  margin: 20px auto;
}

hr.full {
  width: 100%;
  margin: 80px 0 30px 0;
}

input[type='text'] {
  margin-bottom: 14px;
}

input[type='password'] {
  margin-bottom: 20px;
}



.login-container .md-button {
  display: block;
  float: right;
  background: #204370;
  color: #FFF;
  font-weight: 800;
  border-color: #204370;
}

.ico-button {
  width: 45px;
  height: 36px;
  display: block;
  float: left;
  margin-right: 5px;
  border-radius: 3px;
  color: transparent;
  font-size: 0;
}

.ico-button.small {
  width: 45px !important;
  height: 36px !important;
}

.ico-button:hover {
  opacity: .8;
}

.ico-button.facebook {
  background: url(/static/ico_facebook.png) #4266B2 no-repeat center center;
}

.ico-button.google {
  background: url(/static/ico_google.png) #EFEFEF no-repeat center center;
}
#anima div {
  border-radius: 0px 5px 5px 0px;
}

.full-button {
  width: 100%;
  display: block;
  margin: 5px 0;
  border-radius: 3px;
  height: 34px;
  line-height: 36px;
  text-decoration: none;
  font-size: 14px;
  border: 1px solid;
}

.full-button:hover {
  opacity: .8;
}

.full-button.primary {
  border-color: #204370;
  color: #204370;
  font-weight: 800;
}

.full-button.outline {
  border-color: #9B9B9B;
  color: #9B9B9B;
}

</style>
