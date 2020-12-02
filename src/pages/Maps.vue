<template>
  <div class="content">
    <div class="md-layout"> 
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <md-card>
            <md-card-content>
                      <md-field>
                        <label>Informe o imei</label>
                        <md-input v-model="search" />
                      </md-field>
                      <md-button @click="searchDevice" class="md-info md-round">Consultar</md-button>
                      <md-button @click="allDevice" class="md-info md-round">Consultar todos</md-button>
                      <md-button @click="clearDevice" class="md-info md-round">Limpar</md-button>
                       <div v-if="$store.state.loading" class="lds-ring">
                                <div></div><div></div><div></div><div></div>
                      </div>
            </md-card-content>
        </md-card>
      </div>
        <gmap-map
            v-if="!$store.state.loading"
            :center="map.center"
            :zoom="map.zoom"
            map-type-id="terrain"
            style="width: 100%; height: 100vh">
          <gmap-cluster
              :zoomOnClick="true"> 
                  <gmap-marker
                      v-for="(m, index) in markers"
                      :key="index"
                      :position="m.position"
                      :icon="m.marker"
                      :label="m.title"
                      :clickable="true"
                      :draggable="true"
                      @click="showInfo(m.imei)">
                      <gmap-info-window class="info" :key="index" :options="infoOptions" :position="m.position" :opened="m.opened" @closeclick="hideInfo(m.imei)">
                        <div class="info-container">
                          <h1>{{m.title}}</h1>
                          <h1>{{m.data}}</h1>
                          <span>Endereço:</span>
                          <span><strong>{{m.address}}</strong></span>
                          <div class="speed">
                            <h3>{{m.speed}}</h3>
                            <small>KM/H</small>
                          </div>
                        </div>
                      </gmap-info-window>
                  </gmap-marker> 
          </gmap-cluster>

        </gmap-map>
  </div>
</div>
</template>

<script>
import { firestore, auth, coordatual } from '@/config/firebase_conf'

window.xy = 0;

export default {
  data: () => ({
      markers: [],
      search: null,
      selectedDevice: null,
      timer: null,
      allImeis: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -60
        }
      },
      map: {
        center: {lat: -23.533773, lng: -46.625290},
        zoom: 8
      },
  }),
  methods: {
    setupMapCoorde: function(){
      let that = this
      coordatual.once('value', function(snapshot) {
        let data = snapshot.val();
        that.markers = [];
        Object.keys(data).forEach(key => {
          that.setMarkers(data[key]);
        });
        that.updateZoomMap();
      });
    },
    showInfo: function(a, b) {
      this.setupOpenInfo(a, true)
    },
    hideInfo: function(a, b) {
      this.setupOpenInfo(a, false)
    },
    setupOpenInfo: function(imei, openedBool){
      for (var i = 0; i < this.markers.length; i++) {                          
          if (this.markers[i]['imei'] == imei) {
              this.markers[i]['opened'] = openedBool;
              break;
          }
      }
    },
    setMarkers: function(coord) {
        var id = coord.id; 
        var status, marker, signal
        if (coord.speed > 0) {
            status = "Em movimento";
            marker = "/static/marker-online.svg"
            signal = {
              percent: 100,
              status: "success"
            }
        } else {
            status = "Parado"
            marker = "/static/marker-offline.svg"
            signal = {
              percent: 20,
              status: "exception"
            }
        }  

        var timeSplit = coord.time.split('T')
        var dataSplit = timeSplit[0].split('-')
        var hourSplit = timeSplit[1].split(':')

        let coordMarker = {
            position: {
              lat: coord.latitudeDecimalDegrees,
              lng: coord.longitudeDecimalDegrees
            },
            speed: coord.speed,
            title: coord.imei,
            address: coord.address,
            data: dataSplit[2] + "/" + dataSplit[1] + "/" + dataSplit[0] + " - " + hourSplit[0] + ":" + hourSplit[1],
            type: coord.imei,
            imei: coord.imei,
            status: status,
            marker: marker,
            signal: signal,
            show: true,
            opened: false
        };

        this.markers.push(coordMarker);
    },
    resetZoomMap: function(){
      this.map.center = {lat: -23.533773, lng: -46.625290}
      this.map.zoom = 8
    },
    listAllDevice: function() {
        let that = this
        coordatual.once('value', function(snapshot) {
            let data = snapshot.val(); 
            that.markers = [];
            that.$store.dispatch('updateLoading', true);
            Object.keys(data).forEach(key => {
              that.setMarkers(data[key]);
            });
            that.$store.dispatch('updateLoading', false);
            that.resetZoomMap()
        });
    },
    getDevice: function() { 
        let that = this
        coordatual.orderByChild("imei").equalTo(this.search).once('value', function(snapshot) {
            let data = snapshot.val(); 
            that.markers = [];
            Object.keys(data).forEach(key => {
                that.setMarkers(data[key]);
                if (that.markers.length > 0) { 
                    that.map.center = that.markers[0].position
                    that.map.zoom = 16
                }
            });
        });
    },
    allDevice: function() {
      this.listAllDevice();
    },
    searchDevice: function(){
      if (this.search != null){
          let that = this
          this.getDevice();
          this.timer = setInterval(function() {
              this.getDevice();
          }.bind(this), 30000);
      }else{
        clearInterval(this.timer);
        this.resetZoomMap();
      }
    },
    clearDevice: function(){
        if (this.timer != null) {
           clearInterval(this.timer)
        } 
        this.timer = null
        this.search = null
        this.markers = [];
        this.$store.dispatch('updateLoading', false);
        this.resetZoomMap()
    },
  },
  beforeRouteEnter(to, from, next) {
        auth.onAuthStateChanged((user) => {
            if (user) {
                next();
            } else {
                next('/');
            }
        });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('updateLoading', false);
    if (this.timer != null) {
        clearInterval(this.timer)
    } 
    next();
  }
};
</script>
<style>
.vue-map-container div div div div div:first-child div div div {
  font-size: 12px !important;
  color: #FFF !important;
  font-weight: 500;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translate3d(-50%, 0, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes fadeOutRight {
  from {
    opacity: 1;
    transform: none;
  }

  to {
    opacity: .5;
    transform: translate3d(-150%, 0, 0);
  }
}


.show {
  animation-name: fadeInLeft;
}

.hide {
  animation-name: fadeOutRight;
}

.info {
  margin-top: 0 !important;
  font-size: 12px !important;
  color: #000 !important;
  font-weight: 500;
}

.info-container {
  font-family: 'Montserrat', sans-serif;
  margin-top: 20px !important;
  width: 200px;
  position: relative;
  top: 0;
}
.info-container h1 {
  color: #243E71 !important;
  font-size: 10px !important;
  font-weight: 750;
  margin: -10px 0 10px 0;
  float: left;
  width: 100%;
  text-align: left;
}

.info-container span {
  color: #9B9B9B;
  font-size: 11px;
  float: left;
  width: 100%;
  display: block;
  text-align: left;
  text-transform: uppercase;
  margin: 0 0 1px 0;
}

.info-container span strong {
  color: #243E71;
  font-weight: normal;
  margin-bottom: 5px;
  float: left;
}

.info-container div.speed {
  width: 50px;
  height: 50px;
  border-radius: 100px;
  position: absolute;
  top: -11px;
  left: 148px;
  border: 1px solid #9B9B9B;
}

.info-container div.speed h3 {
  margin: 9px 0 -2px 0;
  font-size: 16px;
  color: #404040;
  display: block;
  width: 100%;
  text-align: center;
}

.info-container div.speed small {
  font-size: 9px;
  color: #404040;
  display: block;
  width: 100%;
  text-align: center;
}


@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");
  .md-switch {
    display: flex;
  }

.lds-ring {
  display: block;
  position: relative;
  width: 24px;
  height: 24px;
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
  border: 6px solid #243E71;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #243E71 transparent transparent transparent;
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