<template>
  <div class="content">
    <div class="md-layout">
      <!-- <div class="md-layout-item md-small-size-100">
          <label>Período de:</label>
          <md-datepicker v-model="fromDate" />
      </div>
      <div class="md-layout-item md-small-size-50">
          <label>Até:</label>
          <md-datepicker v-model="toDate" />
      </div>
      <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-info md-round">Gerar PDF</md-button>
      </div> -->
      <!-- <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Registro de Aparelhos</h4>
            <p class="category">Selecione um aparelho para filtrar a lista de coordenadas</p>
          </md-card-header>
          <md-card-content>
            <devices-table table-header-color="green"></devices-table>
          </md-card-content>
        </md-card>
      </div> -->

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <div v-if="$store.state.loading" class="lds-ring">
          <div></div><div></div><div></div><div></div>
        </div>
        <md-card>
          <md-card-content>
            <coords-table table-header-color="green"></coords-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { CoordsTable } from "@/components";
import { auth } from '@/config/firebase_conf'

export default {
  data: () => ({
      fromDate: null,
      toDate: null
  }),
  components: {
    CoordsTable
  },
  beforeRouteEnter(to, from, next) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                next()
            } else {
                next('/')
            }
        })
  }
};
</script>
<style lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

.completed {
  text-decoration: line-through;
  color: grey;
}

// CSS Spinning Loader
.lds-ring {
  display: block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: auto;
  margin-bottom: 16px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid grey;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: grey transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
