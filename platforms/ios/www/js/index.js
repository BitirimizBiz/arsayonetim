//const { default: Axios } = require("axios");

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function () {
        var vm = new Vue({
            el: "#app",
            data: {
                allData: [],
                detayData: [],
                url: "https://project.ihy.me/",
                detayUrl: "?i=detay&id=",
                silUrl: "?i=sil&id=",
                yukleUrl: "?i=ekle",
                cekUrl: "?i=kamera",
                isDetay: false,
                dataParsel: null,
                dataMahalle: null,
                dataDetayId: null,
                dataIl: null,
                cameraUrl: null,
                isGallery: true,
                searchAdaParsel: ""
            },
            created() {
                axios.get(this.url + '?i=liste')
                    .then(resp => {
                        this.allData = resp.data
                    })
            },            computed:{
              searchFilter(){
                  return this.allData.filter(data=>{
                      return data.adaParsel.match(this.searchAdaParsel)
                  })
              }
            },
            methods: {
                detaylar(e) {
                    this.isDetay = !this.isDetay;
                    axios.get(this.url + this.detayUrl + e.target.dataset.id)
                        .then(resp => {
                            this.detayData = resp.data
                        });
                    this.dataParsel = e.target.dataset.adaparsel;
                    this.dataMahalle = e.target.dataset.mahalle;
                    this.dataIl = e.target.dataset.il;
                    this.dataDetayId = e.target.dataset.id;
                }
                ,
                resimSil(e) {
                    if (confirm("Resim Silinecek.")) {
                        axios.get(this.url + this.silUrl + e.target.dataset.id).then(resp => {
                            this.isDetay = !this.isDetay;
                            var e = {
                                target: {
                                    dataset:{
                                        adaparsel: this.dataParsel,
                                        mahalle: this.dataMahalle,
                                        il:this.dataIl,
                                        id:this.dataDetayId

                                    }
                                }
                            };
                            this.detaylar(e)
                        })
                    }
                }
                ,
                resimCek() {
                    var self = this;
                    navigator.camera.getPicture(dataURI => {
                            var fd = new FormData();
                            var arsaId = self.$refs.arsaId.value;
                            var adaParsel = self.$refs.adaParsel.value.replace(' ', '-');
                            fd.append("resim", "data:image/jpeg;base64,"+dataURI);
                            fd.append("arsaId", arsaId);
                            fd.append("adaParsel", adaParsel);
                            axios.post(self.url + self.cekUrl, fd, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(resp => {
                                self.isDetay = !self.isDetay;
                                var e = {
                                    target: {
                                        dataset:{
                                            adaparsel: self.dataParsel,
                                            mahalle: self.dataMahalle,
                                            il:self.dataIl,
                                            id:self.dataDetayId

                                        }
                                    }
                                };
                                self.detaylar(e)
                            }).catch(err => {
                                alert(err)
                            })

                        },
                        err => {
                            alert(err)
                        }, {
                            quality: 20,
                            destinationType: Camera.DestinationType.DATA_URL,
                            correctOrientation: true
                        })
                }
                ,
                onBackButton(){
                   location.reload();
                },
                resimYukle() {
                    var fd = new FormData();
                    var file = this.$refs.uploadFile.files[0];
                    var arsaId = this.$refs.arsaId.value;
                    var adaParsel = this.$refs.adaParsel.value.replace(' ', '-');
                    fd.append("resim", file);
                    fd.append("arsaId", arsaId);
                    fd.append("adaParsel", adaParsel);
                    axios.post(this.url + this.yukleUrl, fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(resp => {
                        this.isDetay = !this.isDetay;
                        var e = {
                            target: {
                                dataset:{
                                    adaparsel: this.dataParsel,
                                    mahalle: this.dataMahalle,
                                    il:this.dataIl,
                                    id:this.dataDetayId

                                }
                            }
                        };
                        this.detaylar(e)
                    }).catch(err => {
                        alert(err)
                    })
                }
            }
        })

    }
};

app.initialize();
