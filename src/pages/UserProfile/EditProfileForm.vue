<template>
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
</template>
<script>
export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      linha: null,
      cliente: null,
      placa: null,
      imei: null,
      modelo: null,
      liberado: false,
      hasLinha: false,
      hasImei: false,
      hasModelo: false
    };
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

      if (this.linha && this.imei && this.modelo){
          //this.$store.dispatch('saveDevice', this.linha);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  .md-switch {
    display: flex;
  }
</style>
