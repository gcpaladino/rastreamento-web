import Vue from 'vue'
import Vuex from 'vuex'
//import Geocoder from "@pderas/vue2-geocoder"
import { firestore, coordatual } from '@/config/firebase_conf'

Vue.use(Vuex)
// Vue.use(Geocoder, {
//   defaultCountryCode: null, // e.g. 'CA'
//   defaultLanguage:    null, // e.g. 'en'
//   defaultMode:        "lat-lng", // or 'address'
//   googleMapsApiKey:   "AIzaSyB0kNaF0Pwq3AD0r8LLKU5g0ABSzAxOKjg"
// });

var toLower = function(text) {
  return text.toString().toLowerCase()
}

const store = new Vuex.Store({
  state: {
    loading: false,
    filter: 'all',
    selectedDevice: null,
    coords: [],
    devices: [],
    devicesMapa: [],
    markers: [],
    dashboardData: null
  },
  getters: {
    remaining(state) {
      return state.coords.length
    },
    anyRemaining(state, getters) {
      return getters.remaining != 0
    },
    listCoords(state) {
      return state.coords
    },
    listDevices(state) {
      return state.devices
    },
    listDevicesMapa(state) {
      return state.devicesMapa
    },
    getDashboadInfos(state) {
      return state.dashboardData
    }
  },
  mutations: {
    retrieveCoords(state, coords) {
      state.coords = coords
    },
    retrieveDevices(state, devices) {
      state.devices = devices
    },
    retrieveDevicesMapa(state, devicesMapa) {
      state.devicesMapa = devicesMapa
    },
    reportDeviceMap(state, deviceFind){
      state.selectedDevice = deviceFind
    },
    updateLoading(state, loading) {
      state.loading = loading
    },
    devicesFilter(state, search) {
      state.devices = state.devices.filter(function(doc) {
         return toLower(doc.name) == toLower(search)
      });
    },
    coordFilter(state, search) {
      state.coords = state.coords.filter(function(doc) {
         return toLower(doc.imei) == toLower(search)
      });
    },
    updateDevice(state, device) {
      const index = state.devices.findIndex(item => item.id == device.id)
      state.devices.splice(index, 1, {
        'id': device.id,
        'liberado': device.liberado,
        'placa': device.placa,
        'linha': device.linha,
        'imei': device.imei,
        'modelo': device.modelo,
        'cliente': device.cliente,
      })
    },
    deleteDevice(state, id) {
      const index = state.devices.findIndex(item => item.id == id)
      if (index >= 0) {
        state.devices.splice(index, 1)
      }
    },
    addDevice(state, device) {
      state.devices.push({
        id: device.id,
        liberado: device.liberado,
        placa: device.placa,
        linha: device.linha,
        imei: device.imei,
        modelo: device.modelo,
        cliente: device.cliente,
      })
    },
    updateLoading(state, loading) {
      state.loading = loading
    },
    dashboardInfos(state, dashboardInfos){
      state.dashboardData = dashboardInfos
    }
  },
  actions: {
    updateLoading(context, isUpdate) {
      context.commit("updateLoading", isUpdate)
    },
    retrieveCoords(context) {
      context.commit("updateLoading", true)

      let aparelhos = []
      firestore.collection('aparelhos').get()
      .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let info = doc.data();
                if (info) {
                  aparelhos.push({
                    imei: info.imei,
                    placa: info.placa,
                    modelo: info.modelo,
                    cliente: info.cliente,
                    linha: info.linha
                  })
                }
            });
      });

      firestore.collection("coordinates").orderBy("imei").limit(100).get()
      .then(querySnapshot => {
        let tempCoords = []
        querySnapshot.forEach(doc => {

            for (var i = 0; i < aparelhos.length; i++) {
              if (aparelhos[i]['imei'] == doc.data().imei) {
                  var latLngObj = {
                    lat: doc.data().latitudeDecimalDegrees,
                    lng: doc.data().longitudeDecimalDegrees
                  }

                  const data = {
                      id: doc.id,
                      placa: aparelhos[i]['placa'],
                      cliente: aparelhos[i]['cliente'],
                      modelo: aparelhos[i]['modelo'],
                      linha: aparelhos[i]['linha'],
                      imei: doc.data().imei,
                      position: latLngObj,
                      address: "Informação sendo melhorada no backend.",
                      speed: doc.data().speed,
                      completed: aparelhos[i]['liberado'],
                      dataTime: doc.data().timestamp.seconds * 1000,
                      data: Intl.DateTimeFormat('pt-br',{
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit'}).format(new Date(doc.data().timestamp.seconds * 1000)),
                      hora: Intl.DateTimeFormat('pt-br',{
                          hour: "numeric",
                          minute: "2-digit",
                          second: "2-digit"}).format(new Date(doc.data().timestamp.seconds * 1000)),
                      daysOciosidade: null,
                  }
                  tempCoords.push(data);
                 break;
              }
            }
        })

        const tempCoodsSorted = tempCoords.sort((a, b) => {
          return b.dataTime - a.dataTime
        });

        context.commit("updateLoading", false)
        context.commit("retrieveCoords", tempCoodsSorted);
      })
    },
    reportCoordsFromDate(context, params) {
      context.commit("updateLoading", true)

      let aparelhos = []
      firestore.collection('aparelhos').where('imei', '==', params.imei).limit(1).get()
      .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let info = doc.data();
                if (info) {
                  aparelhos.push({
                    imei: info.imei,
                    placa: info.placa,
                    modelo: info.modelo,
                    cliente: info.cliente,
                    linha: info.linha
                  })
                }
            });

            let coordinates = firestore.collection("coordinates")
            var conditional = null
            if (params.type == 1){
              conditional = coordinates.where('timestamp', '>=', params.fromDate).where('timestamp', '<=', params.toDate).where('imei', '==', params.imei).get()
            } else if (params.type == 2){
              conditional = coordinates.where('timestamp', '>=', params.now).where('imei', '==', params.imei).get()
            }
            
            conditional.then(querySnapshot => {
                  let tempCoords = []
                  querySnapshot.forEach(doc => {

                    for (var i = 0; i < aparelhos.length; i++) {
                      if (aparelhos[i]['imei'] == params.imei) {
                          var latLngObj = {
                            lat: doc.data().latitudeDecimalDegrees,
                            lng: doc.data().longitudeDecimalDegrees
                          }

                          const data = {
                              id: doc.id,
                              placa: aparelhos[i]['placa'],
                              cliente: aparelhos[i]['cliente'],
                              modelo: aparelhos[i]['modelo'],
                              linha: aparelhos[i]['linha'],
                              imei: doc.data().imei,
                              position: latLngObj,
                              address: "Informação sendo melhorada no backend.",
                              speed: doc.data().speed,
                              completed: aparelhos[i]['liberado'],
                              dataTime: doc.data().timestamp.seconds * 1000,
                              data: Intl.DateTimeFormat('pt-br',{
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit'}).format(new Date(doc.data().timestamp.seconds * 1000)),
                              hora: Intl.DateTimeFormat('pt-br',{
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit"}).format(new Date(doc.data().timestamp.seconds * 1000)),
                                daysOciosidade: null,
                          }
                          
                          tempCoords.push(data);
                        
                          break;
                      }
                    } 
                });

                const tempCoodsSorted = tempCoords.sort((a, b) => {
                  return b.dataTime - a.dataTime
                });

                context.commit("updateLoading", false)
                context.commit("retrieveCoords", tempCoodsSorted);
            });
      });
    },
    reportCoordsOciosidade(context) {
      context.commit("updateLoading", true)

      let aparelhos = []
      firestore.collection('aparelhos').get()
      .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                let info = doc.data();
                if (info) {
                  aparelhos.push({
                    imei: info.imei,
                    placa: info.placa,
                    modelo: info.modelo,
                    cliente: info.cliente,
                    linha: info.linha
                  })
                }
            });

            coordatual.once('value', function(snapshot) {
              let data = snapshot.val(); 
              let tempCoords = []
              Object.keys(data).forEach(key => {
                let coord = data[key];
                for (var i = 0; i < aparelhos.length; i++) {
                  if (aparelhos[i]['imei'] == coord.imei) {
                      var latLngObj = {
                        lat: coord.latitudeDecimalDegrees,
                        lng: coord.longitudeDecimalDegrees
                      }

                      let t2 = new Date().getTime();
                      let t1 = new Date(coord.time).getTime();
                      let difference = parseInt((t2-t1)/(24*3600*1000));

                      const data = {
                          id: coord.id,
                          placa: aparelhos[i]['placa'],
                          cliente: aparelhos[i]['cliente'],
                          modelo: aparelhos[i]['modelo'],
                          linha: aparelhos[i]['linha'],
                          imei: coord.imei,
                          position: latLngObj,
                          address: "Informação sendo melhorada no backend.",
                          speed: coord.speed,
                          completed: aparelhos[i]['liberado'],
                          dataTime: coord.time,
                          data: Intl.DateTimeFormat('pt-br',{
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit'}).format(new Date(coord.time)),
                          hora: Intl.DateTimeFormat('pt-br',{
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit"}).format(new Date(coord.time)),
                          daysOciosidade: difference,
                      }
                      
                      tempCoords.push(data);
                    
                      break;
                  }
                } 
              });

              const tempCoodsSorted = tempCoords.sort((a, b) => {
                return b.daysOciosidade - a.daysOciosidade
              });

              const placas = aparelhos.filter(function(device) {
                return device.placa != null && device.placa != ""
              });

              const devicesOn = tempCoodsSorted.filter(function(coord) {
                return coord.daysOciosidade == 0
              });

              const devicesOff = tempCoodsSorted.filter(function(coord) {
                return coord.daysOciosidade > 0
              });

              const dataDashboard = {
                sizeCoord: tempCoodsSorted.length,
                sizeDevices: aparelhos.length,
                sizePlacas: placas.length,
                deviceOn: devicesOn.length,
                deviceOff: devicesOff.length
              }

              context.commit("updateLoading", false);
              context.commit("dashboardInfos", dataDashboard);
              context.commit("retrieveCoords", tempCoodsSorted);

          });
      });
    },
    reportDevice(context, imei) {
      context.commit("updateLoading", true)
      firestore.collection("aparelhos").where('imei', '==', imei).get()
      .then(querySnapshot => {
        let tempDevices = []
        querySnapshot.forEach(doc => {
            const data = {
                id: doc.id,
                liberado: doc.data().liberado,
                placa: doc.data().placa,
                linha: doc.data().linha,
                imei: doc.data().imei,
                modelo: doc.data().modelo,
                cliente: doc.data().cliente
            };
            tempDevices.push(data);
        });

        context.commit("updateLoading", false)
        context.commit("retrieveDevices", tempDevices);
      });
    },
    reportDeviceMap(context, imei) {
      context.commit("updateLoading", true)
      firestore.collection("aparelhos").where('imei', '==', imei).get()
      .then(querySnapshot => {
        let deviceFind = null
        querySnapshot.forEach(doc => {
          deviceFind = {
                id: doc.id,
                liberado: doc.data().liberado,
                placa: doc.data().placa,
                linha: doc.data().linha,
                imei: doc.data().imei,
                modelo: doc.data().modelo,
                cliente: doc.data().cliente
            };
        });

        context.commit("updateLoading", false)
        context.commit("reportDeviceMap", deviceFind);
      });
    },
    retrieveDevices(context) {
      context.commit("updateLoading", true)
      firestore.collection("aparelhos").get()
      .then(querySnapshot => {
        let tempDevices = []
        querySnapshot.forEach(doc => {
            const data = {
                id: doc.id,
                liberado: doc.data().liberado,
                placa: doc.data().placa,
                linha: doc.data().linha,
                imei: doc.data().imei,
                modelo: doc.data().modelo,
                cliente: doc.data().cliente
            };
            tempDevices.push(data);
        });

        context.commit("updateLoading", false)
        context.commit("retrieveDevices", tempDevices);
      });
    },
    retrieveDevicesMapa(context) {
      context.commit("updateLoading", true)
      firestore.collection("aparelhos").get()
      .then(querySnapshot => {
        let tempDevices = []
        querySnapshot.forEach(doc => {
            const data = {
                id: doc.id,
                liberado: doc.data().liberado,
                placa: doc.data().placa,
                linha: doc.data().linha,
                imei: doc.data().imei,
                modelo: doc.data().modelo,
                cliente: doc.data().cliente,
            };
            tempDevices.push(data);
        });

        context.commit("updateLoading", false)
        context.commit("retrieveDevicesMapa", tempDevices);
      });
    },
    devicesFilter(context, filter) {
      context.commit("devicesFilter", filter);
    },
    coordFilter(context, filter) {
      context.commit("coordFilter", filter);
    },
    updateDevice(context, device) {
      firestore.collection('aparelhos').doc(device.id).set({
          liberado: device.liberado,
          placa: device.placa,
          linha: device.linha,
          imei: device.imei,
          modelo: device.modelo,
          cliente: device.cliente,
          timestamp: new Date()
      }, { merge: true })
      .then(() => {
        context.commit('updateDevice', device)
      })
    },
    deleteDevice(context, id) {
      firestore.collection('aparelhos').doc(id).delete()
      .then(() => {
        context.commit('deleteDevice', id)
      })
    },
    addDevice(context, device) {
      firestore.collection('aparelhos').add({
        liberado: device.liberado,
        placa: device.placa,
        linha: device.linha,
        imei: device.imei,
        modelo: device.modelo,
        cliente: device.cliente,
        timestamp: new Date()
      })
      .then(docRef => {
        context.commit('addDevice', {
          id: docRef.id,
          liberado: device.liberado,
          placa: device.placa,
          linha: device.linha,
          imei: device.imei,
          modelo: device.modelo,
          cliente: device.cliente,
          timestamp: new Date()
        })
      })

    },
    clearCoords(context) {
      context.commit("retrieveCoords", []);
    },
    clearDevices(context) {
      context.commit("retrieveDevices", []);
    },
    clearDevicesMapa(context) {
      context.commit("retrieveDevicesMapa", []);
    },
    clearDeviceFind(context) {
      context.commit("reportDeviceMap", null);
    },
    clearCoordsOciosidade(context) {
      context.commit("updateLoading", false);
      context.commit("dashboardInfos", null);
      context.commit("retrieveCoords", []);
    },
  }
});

export { store }