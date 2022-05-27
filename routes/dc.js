const { Client, Intents } = require('discord.js');
const express = require("express")
const dcRouter = express.Router()
const config = require("../config.json")
const qweatherToken = config['qweatherToken']
const allIntent = new Intents(98303)
const client = new Client({intents:allIntent})
dcRouter.get("/run",(req,res)=>{
    dcBotRun()
})

let defaultCity = ['state college','高雄']

function dcBotRun(){
    client.on('messageCreate', msg => {
        if (msg.content.startsWith('/w3d')) {
            sendWeather3d('state college',msg)
            sendWeather3d('高雄',msg)
        }else if (msg.content.startsWith('/查城市id')) {
            cityName = msg.content.toString().slice(7)
            cityIDCheck(cityName).then(IDJson=>{
                console.log(IDJson)
                msg.channel.send(IDJson['city']+"的id是"+IDJson['id'])
            })    
        }else if (msg.content.startsWith('/查天气')) {
            cityName = msg.content.toString().slice(5)
            cityIDCheck(cityName).then(IDJson=>{
                console.log(IDJson)
                if (!IDJson){
                    msg.channel.send("找不到相关城市 "+ cityName)
                }else{
                    msg.channel.send("找到相关城市"+ IDJson['city']).then(sendWeather3d(cityName,msg)).catch(error=>msg.channel.send("ERROR: "+error))
                }
            })
            
            
        }else if(msg.content.startsWith("/ping")){
            msg.channel.send("pong")
        }
      });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
      });
      
      //make sure this line is the last line
    client.login(config['dcToken']); //login bot using token  
}

async function sendDefaultCityWeathers(cityList,msg){
    for(city in cityList){
        await sendWeather3d(city,msg)
    }
}

async function sendWeather3d(cityName,msg){
    cityIDCheck(cityName).then(IDJson=>{
        return IDJson['id']
    })
    .then(cityID=>{return weatherGet(cityID)})
    .then(weatherInfo => {
        msg.channel.send(cityName+'\n')
        msg.channel.send(weatherInfo['day1'])
        msg.channel.send(weatherInfo['day2'])
        msg.channel.send(weatherInfo['day3']+'\n----------\n')
    }).catch(error=>msg.channel.send("ERROR: "+error))
}

async function cityIDCheck(cityCheck){
    fetchResult = fetch('https://geoapi.qweather.com/v2/city/lookup?' + new URLSearchParams({
    location:cityCheck,
    key:qweatherToken,
    number:1
}))
    .then(res =>{
        return res.json()
    })
    .then(data => {
        result = {
            result:"查询到的城市： "+data["location"][0]['country']+data["location"][0]['adm1']+data["location"][0]['name']+"--对应城市ID： "+data["location"][0]['id'],
            id:data["location"][0]['id'],
            city:data["location"][0]['name']
        }
        return result
    })
    .catch(error => console.log(error))

    return fetchResult
}

async function weatherGet(cityID){
    function weatherDecode(date,data){
        return data['daily'][date]['fxDate']+"  日间"+data['daily'][date]['textDay']+", 夜间"+data['daily'][date]['textNight']+", 最低气温 "+data['daily'][date]['tempMin']+"度, 最高气温 "+data['daily'][date]['tempMax']+"度。"
    }
    return fetch('https://devapi.qweather.com/v7/weather/3d?' + new URLSearchParams({
    location:cityID,
    key:qweatherToken,
}))
    .then(res =>{
        return res.json()
    })
    .then(data => {

        return {
            day1:weatherDecode(0,data),
            day2:weatherDecode(1,data),
            day3:weatherDecode(2,data)
        }
    })
    .catch(error => console.log(error))
}

  module.exports = dcRouter