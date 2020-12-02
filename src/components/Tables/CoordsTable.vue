<template>

<div>
        <md-card>
            <md-card-content>
              <div class="md-layout">
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-datepicker :md-model-type="Date" md-immediately v-model="fromDate" />
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                    <md-datepicker :md-model-type="Date" md-immediately v-model="toDate" />
                </div>
                <div class="md-layout-item md-small-size-100 md-size-33">
                  <md-field>
                    <label>Procure pelo imei...</label>
                    <md-input type="text" v-model="search"  />
                  </md-field>
                </div>
                  <md-button @click="searchCalendar" class="md-info md-round">Filtrar</md-button>
                  <md-button @click="searchToday" class="md-info md-round">Consultar imei com data atual</md-button>
                  <md-button @click="searchOciosidade" class="md-info md-round">Consultar ociosidade</md-button>
                  <md-button @click="cleanSearch" class="md-info md-round">Limpar consulta</md-button>
              </div>
            </md-card-content>
        </md-card>

    <md-table v-if="!$store.state.loading" v-model="listCoords" :table-header-color="tableHeaderColor">

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Cliente">{{ item.cliente }}</md-table-cell>
        <md-table-cell md-label="Placa">{{ item.placa }}</md-table-cell>
        <md-table-cell md-label="Imei">{{ item.imei }}</md-table-cell>
        <md-table-cell md-label="Linha">{{ item.linha }}</md-table-cell>
        <md-table-cell v-if="item.daysOciosidade == null" md-label="Endereço">{{ item.address }}</md-table-cell>
        <md-table-cell v-if="item.daysOciosidade == null" md-label="Lat">{{ item.position.lat }}</md-table-cell>
        <md-table-cell v-if="item.daysOciosidade == null" md-label="Long">{{ item.position.lng }}</md-table-cell>
        <md-table-cell md-label="Data">{{ item.data }}</md-table-cell>
        <md-table-cell md-label="Hora">{{ item.hora }}</md-table-cell>
        <md-table-cell v-if="item.daysOciosidade == null" md-label="Velocidade">{{ item.speed }} km/hrs</md-table-cell>
        <md-table-cell v-if="item.daysOciosidade != null" md-label="Dias sem Comunicação">{{ item.daysOciosidade }}</md-table-cell>
      </md-table-row>
    </md-table>

    <!-- <md-table-pagination md-label="Páginas" 
          :md-size="limit"
          :md-page="offset + 1" 
          md-separator="de" 
          :md-total="listCoords.length"
          :md-page-options="[5, 10, 25, 50]" 
          @pagination="onPagination">
    </md-table-pagination> -->

  </div>
</template>

<script>
let dateFormat = 'dd-MM-yyyy'
export default {
  name: "coords-table",
  props: {
    tableHeaderColor: {
      type: String,
      default: ""
    }
  },
  data: () => ({
      limit: 50,
      offset: null,
      search: null,
      fromDate: null,
      toDate: new Date(),
  }),
  created() {
    this.$store.dispatch('clearCoords');
  },
  computed: {
    listCoords() {
      return this.$store.getters.listCoords;
    }
  },
  methods: {
    onPagination(pagination) {
        this.limit = pagination.size;
        this.offset = (pagination.page - 1) * this.limit;
        this.find()
    },
    searchCalendar () {
      if (this.fromDate != null && this.toDate != null && this.search != ""){
          this.$store.dispatch('reportCoordsFromDate', { 'type': 1,'fromDate': this.fromDate, 'toDate': this.toDate, 'imei': this.search});
      } else {
         this.$store.dispatch('clearCoords');
      }
    },
    searchToday () {
      if (this.search != ""){
          this.$store.dispatch('reportCoordsFromDate', { 'type': 2, 'now': this.toDate, 'imei': this.search});
      } else {
         this.$store.dispatch('clearCoords');
      }
    },
    searchOciosidade() {
       this.$store.dispatch('reportCoordsOciosidade');
    },
    cleanSearch () {
      this.fromDate = null;
      this.toDate = null;
      this.search = null;
      this.$store.dispatch('clearCoords');
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clearDevices');
    next();
  }
}
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