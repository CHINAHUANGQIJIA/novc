var that, map

var app = new Vue({
  el: '#app',
  data: {
    sum: 0,
    epidemicArray: [],
    epidemicData: {},
    colorMap: [
      {
        label: '≥10000',
        color: '#660208'
      },
      {
        label: '1000-9999',
        color: '#8c0d0d'
      },
      {
        label: '100-999',
        color: '#cc2929'
      },
      {
        label: '10-99',
        color: '#ff7b69'
      },
      {
        label: '1-9',
        color: '#ffaa85'
      }
    ],
    vector: null,
    overlay: null,
    selected: null
  },
  mounted() {
    that = this
    that.init()
  },
  computed: {
    getStatics() {
      let diagnosed = 0
      let cure = 0
      let death = 0
      for (var i = 0; i < this.epidemicArray.length; i++) {
        const d = this.epidemicArray[i]
        diagnosed += d.diagnosed
        cure += d.cure
        death += d.death
      }
      return {
        diagnosed: diagnosed,
        cure: cure,
        death: death
      }
    }
  },
  methods: {
    init() {
      $.get('data/data.json', res => {
        that.epidemicArray = res
        for (var i = 0; i < res.length; i++) {
          var r = res[i]
          that.sum += r.diagnosed
          that.epidemicData[r.zone] = r
        }
        $.get('data/capital.json', _res => {
          for (var j = 0; j < res.length; j++) {
            var _r = _res[j]
            if (that.epidemicData[_r.name]) that.epidemicData[_r.name].center = [_r.lon, _r.lat]
          }
          that.initMap()
        })
      })
    },
    initMap() {
      var vectorSource = new ol.source.Vector({
        url: 'data/china.json',
        format: new ol.format.GeoJSON()
      })
      that.vector = new ol.layer.Vector({
        source: vectorSource,
        style: that.styleFunction
      })
      map = new ol.Map({
        controls: ol.control.defaults({
          attribution: false
        }),
        target: 'map',
        layers: [that.vector],
        view: new ol.View({
          minZoom: 3,
          maxZoom: 12,
          center: [11760366.56, 4662347.84],
          zoom: 5
        })
      })
      that.addMapEvent()
      that.addOverlay()
    },
    addMapEvent() {
      map.on('pointermove', evt => {
        map.getTargetElement().style.cursor = ''
        that.selected = null
        that.overlay.setPosition(null)
        if (map.hasFeatureAtPixel(evt.pixel)) {
          map.getTargetElement().style.cursor = 'pointer'
          const feature = map.getFeaturesAtPixel(evt.pixel)[0]
          const name = feature.get('name')
          that.selected = that.epidemicData[name]
          that.selected.name = name
          const data = that.epidemicData[name]
          const center = data.center
          that.overlay.setPosition(ol.proj.fromLonLat(center))
        }
        that.vector.setStyle(that.styleFunction)
      })
    },
    addOverlay() {
      const container = document.getElementById('overlay')
      that.overlay = new ol.Overlay({
        element: container,
        position: null,
        positioning: 'bottom-center',
        offset: [0, -20]
      })
      map.addOverlay(that.overlay)
    },
    styleFunction(feat) {
      const name = feat.get('name')
      const data = that.epidemicData[name]
      const num = data.diagnosed
      const center = data.center
      const color = that.getColor(num)
      const selected = that.selected && name === that.selected.name
      let styles = []
      styles.push(
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: new ol.style.Stroke({
            color: selected ? '#00ffff' : '#eeeeee',
            width: selected ? 3 : 1
          })
        })
      )
      styles.push(
        new ol.style.Style({
          geometry: new ol.geom.Point(ol.proj.fromLonLat(center)),
          text: new ol.style.Text({
            text: name,
            fill: new ol.style.Fill({
              color: '#ffffff'
            })
          })
        })
      )
      return styles
    },
    getColor(num) {
      for (var i = 0; i < that.colorMap.length; i++) {
        var c = that.colorMap[i]
        if (c.label.indexOf('-') !== -1) {
          var nums = c.label.split('-').map(Number)
          if (num >= nums[0] && num <= nums[1]) {
            return c.color
          }
        } else {
          var nums = c.label.split('≥').map(Number)
          if (num >= nums[1]) {
            return c.color
          }
        }
      }
    }
  }
})
