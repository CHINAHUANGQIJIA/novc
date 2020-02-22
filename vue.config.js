//模拟数据
const express = require('express')
const app = express()
//省份数据
var areaList = require('./src/date/DXYArea.json')
//总数据数据
var overallList = require('./src/date/DXYOverall.json')
var newsList = require('./src/date/DXYNews.json')
var rumorsList = require('./src/date/DXYRumors.json')
//模拟数据
//模拟数据
//API路径
var apiRoutes = express.Router()
app.use('/api', apiRoutes)
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8000,
    https: false,
    open: true,
    hotOnly: true,
    before(app) {
      app.get('/api/date/DXYArea.json', (req, res) => {
        res.json({
          code: 1,
          msg: '成功',
          data: areaList
        })
      })
      app.get('/api/date/DXYOverall.json', (req, res) => {
        res.json({
          code: 1,
          msg: '成功',
          data: overallList
        })
      })
      app.get('/api/date/DXYNews.json', (req, res) => {
        res.json({
          code: 1,
          msg: '成功',
          data: newsList
        })
      })
      app.get('/api/date/DXYRumors.json', (req, res) => {
        res.json({
          code: 1,
          msg: '成功',
          data: rumorsList
        })
      })
    }
  }
}
