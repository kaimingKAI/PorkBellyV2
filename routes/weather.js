const express = require("express")
const weatherRouter = express.Router()
const config = require('../config.json')
const fetch = require('node-fetch')
const qweatherToken = config['qweatherToken']
weatherRouter.get("/cityID",(req,res) => {
    var cityCheck = req.query.cityCheck
    if(!cityCheck){
        res.json({result:"cityCheck is None!"})
    }
    fetch('https://geoapi.qweather.com/v2/city/lookup?' + new URLSearchParams({
    location:cityCheck,
    key:qweatherToken,
    number:1
}))
    .then(res =>{
        return res.json()
    })
    .then(data => {
        res.json({
            result:"查询到的城市： "+data["location"][0]['country']+data["location"][0]['adm1']+data["location"][0]['name']+"--对应城市ID： "+data["location"][0]['id']
        })
    })
    .catch(error => console.log(error))
})


weatherRouter.get("/3d",(req,res) => {
    const cityID = req.query.cityID
    function weatherDecode(date,data){
        return data['daily'][date]['fxDate']+"  日间"+data['daily'][date]['textDay']+", 夜间"+data['daily'][date]['textNight']+", 最低气温 "+data['daily'][date]['tempMin']+"度, 最高气温 "+data['daily'][date]['tempMax']+"度。"
    }
    fetch('https://devapi.qweather.com/v7/weather/3d?' + new URLSearchParams({
    location:cityID,
    key:qweatherToken,

}))
    .then(res =>{
        return res.json()
    })
    .then(data => {

        res.json({
            day1:weatherDecode(0,data),
            day2:weatherDecode(1,data),
            day3:weatherDecode(2,data)
        })
    })
    .catch(error => console.log(error))
})

module.exports = weatherRouter