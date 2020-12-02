<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
          <form>
          <md-card>
            <md-card-header :data-background-color="dataBackgroundColor">
              <h4 class="title">Cadastro de aparelhos</h4>
            </md-card-header>

            <md-card-content>
                  <div class="md-layout">
                    <div class="md-layout-item md-small-size-100 md-size-33">
                      <md-field>
                        <label>Nome do cliente</label>
                        <md-input v-model="cliente" type="text"></md-input>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                      <md-field :class="linhaClass">
                        <label>Número do chip</label>
                        <md-input v-model="linha" type="text" required></md-input>
                        <span class="md-error">Por favor, informe o número do chip.</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                      <md-field>
                        <label>Placa do veículo</label>
                        <md-input v-model="placa" type="text"></md-input>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                      <md-field :class="imeiClass">
                        <label>Imei</label>
                        <md-input v-model="imei" type="text" required></md-input>
                        <span class="md-error">Por favor, informe o imei do GPS.</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100 md-size-33">
                      <md-field :class="modeloClass">
                        <label>Modelo GPS</label>
                        <md-select v-model="modelo" name="modelo" id="modelo" required>
                          <md-optgroup label="Carros">
                            <md-option value="GT02">GT 02</md-option>
                            <md-option value="E3+">E3+</md-option>
                          </md-optgroup>

                          <md-optgroup label="Motos">
                            <md-option value="apples">Mini gps x</md-option>
                            <md-option value="bananas">Mini gps y</md-option>
                            <md-option value="oranges">Mini gps z</md-option>
                            <md-option value="peaches">Mini gps 0</md-option>
                          </md-optgroup>

                          <md-optgroup label="Caminhão">
                            <md-option value="broccoli">Brutus GPS power 1</md-option>
                            <md-option value="carrots">Brutus GPS power 2</md-option>
                            <md-option value="cucumbers">Brutus GPS power 3</md-option>
                          </md-optgroup>
                        </md-select>
                        <span class="md-error">Selecione pelo menos 1 modelo de GPS.</span>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-33">
                      <label>Liberado?</label>
                      <md-switch v-model="liberado" class="md-primary"></md-switch>
                    </div>
                    <div class="md-layout-item md-size-100 text-right">
                      <md-button @click="saveDevice" class="md-raised md-success">Salvar</md-button>
                    </div>
                  </div>
              </md-card-content>
            </md-card>
        </form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card> </user-card>
      </div>

      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
          <md-card>
            <md-card-content>

              <div v-if="$store.state.loading" class="lds-ring">
                <div></div><div></div><div></div><div></div>
              </div>

              <md-table v-if="!$store.state.loading" v-model="listDevices" :table-header-color="tableHeaderColor">

                <md-table-toolbar>
                  <md-field md-clearable class="md-toolbar-section-start">
                    <md-input placeholder="Pesquisar pelo imei do aparelho" v-model="search" />
                  </md-field>
                    <md-button @click="searchDevice" class="md-info md-round">Consultar</md-button>
                </md-table-toolbar>

                  <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="ID">{{ item.id }}</md-table-cell>
                    <md-table-cell md-label="Cliente">{{ item.cliente }}</md-table-cell>
                    <md-table-cell md-label="Imei">{{ item.imei }}</md-table-cell>
                    <md-table-cell md-label="Modelo">{{ item.modelo }}</md-table-cell>
                    <md-table-cell md-label="N. chip">{{ item.linha }}</md-table-cell>
                    <md-table-cell md-label="Bloqueado">{{ item.liberado ? 'Sim' : 'Não' }}</md-table-cell>
                    <md-table-cell>
                      <md-button class="md-just-icon md-simple md-primary" @click="loadEditDevice(item)">
                        <md-icon>edit</md-icon>
                        <md-tooltip md-direction="top">Editar</md-tooltip>
                      </md-button>
                      <md-button class="md-just-icon md-simple md-danger" @click="removeDevice(item.id)">
                        <md-icon>close</md-icon>
                        <md-tooltip md-direction="top">Excluir</md-tooltip>
                      </md-button>
                    </md-table-cell>
                  </md-table-row>

                  <!-- <md-table-pagination md-label="Páginas" 
                    :md-size="limit"
                    :md-page="offset + 1"
                    :md-total="listDevices.length" 
                    md-separator="de" 
                    :md-page-options="[5, 10, 25, 50]" 
                    @pagination="onPagination">
                  </md-table-pagination> -->

                </md-table>
            </md-card-content>
          </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { UserCard } from "@/pages";

export default {
  components: {
    UserCard
  },
  props: {
    dataBackgroundColor: {
      type: String,
      default: "green"
    },
    tableHeaderColor: {
      type: String,
      default: "green"
    }
  },
  data() {
    return {
      id: null,
      linha: null,
      cliente: null,
      placa: null,
      imei: null,
      modelo: null,
      liberado: false,
      hasLinha: false,
      hasImei: false,
      hasModelo: false,
      limit: 5,
      offset: 0,
      search: null,
      searched: [],
    };
  },
  created() {
    //this.$store.dispatch('retrieveDevices');
  },
  computed: {
      linhaClass () {
        return {
          'md-invalid': this.hasLinha
        }
      },
      imeiClass () {
        return {
          'md-invalid': this.hasImei
        }
      },
      modeloClass () {
        return {
          'md-invalid': this.hasModelo
        }
      },
      listDevices() {
       return this.$store.getters.listDevices;
      }
  },
  methods: {
    saveDevice () {
      if (this.linha == null || this.linha == ""){
          this.hasLinha = true
      } else {
          this.hasLinha = false
      }

      if (this.imei == null || this.imei == ""){
          this.hasImei = true
      } else {
          this.hasImei = false
      }

      if (this.modelo == null || this.modelo == ""){
          this.hasModelo = true
      } else {
          this.hasModelo = false
      }

      if (this.linha && this.imei && this.modelo) {
          if (this.id != null && this.id != "") {
              this.$store.dispatch('updateDevice', {
                  'id': this.id,
                  'liberado': this.liberado,
                  'placa': this.placa,
                  'linha': this.linha,
                  'imei': this.imei,
                  'modelo': this.modelo,
                  'cliente': this.cliente,
              });
          } else {
              this.$store.dispatch('addDevice', {
                  'liberado': this.liberado,
                  'placa': this.placa,
                  'linha': this.linha,
                  'imei': this.imei,
                  'modelo': this.modelo,
                  'cliente': this.cliente,
              });
          }

          this.id = null
          this.liberado = false
          this.placa = null
          this.linha = null
          this.imei = null
          this.modelo = null
          this.cliente = null
      }
    },
    removeDevice(id) {
      this.$store.dispatch('deleteDevice', id)
    },
    loadEditDevice(device){
      this.id = device.id
      this.linha = device.linha
      this.cliente = device.cliente
      this.placa = device.placa
      this.imei = device.imei
      this.modelo = device.modelo
      this.liberado = device.liberado
    },
    onPagination(pagination) {
      if (pagination) {
        this.limit = pagination.size;
        this.offset = (pagination.page - 1) * this.limit;
      }
      this.find();
    },
    searchDevice () {
      if (this.search != null){
          this.$store.dispatch('reportDevice', this.search);
      }else{
        this.$store.dispatch('clearDevices');
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clearDevices');
    next();
  }
};
</script>
<style lang="scss" scoped>
  @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
  .md-switch {
    display: flex;
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
