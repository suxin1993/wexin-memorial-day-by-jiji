//index.js
//获取应用实例
import {
    formatTime
} from "../../utils/util.js"
const app = getApp()
Page({
    data: {
        'memorialDay': {
            "meetDay": 0,
            "loveDay": 0,
        },
        'photo': [{
                img: 'http://ga-album-cdnqn.52tt.com/FjphMcAMH1KNnLlwFFUUxpC7ds25?imageView2/0/format/webp'
            }, {
                img: 'http://ga-album-cdnqn.52tt.com/FpP-noZhtAQY94Ho2xwugxdNwae3?imageView2/0/format/webp'
            },
            {
                img: 'http://ga-album-cdnqn.52tt.com/FpJUmp1SLP3RkKRDL6p50-HTmjKq?imageView2/0/format/webp'
            },
            {
                img: 'http://ga-album-cdnqn.52tt.com/FhbkRYrOCRbcW7lJYPi4D267HE4H?imageView2/0/format/webp'
            },
        ]
    },
    onLoad: function() {
        // 获取位置
        this.getLocation()
        // 分享朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // 获取我们的纪念日
        this.getNowDate()
    },
    onShareTimeline() {},
    onShareAppMessage() {},
    getLocation: function() {
        var that = this
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                console.log(res)
                var longitude = res.longitude
                var latitude = res.latitude
                that.getCityInfo(latitude, longitude)
            }
        })
    },
    getCityInfo: function(latitude, longitude) {
        var that = this
        wx.request({
            url: "https://api.map.baidu.com/geocoder/v2/?ak=GsY2E5cPeYz4ZkQtmNTG4ULwZH2WZkex&location=" + latitude + ',' + longitude + '&output=json',
            success: function(res) {
                //console.log(res)
                var currentCity = res.data.result.addressComponent.district
                var curProvince = res.data.result.addressComponent.province
                that.setData({
                    city: currentCity,
                    province: curProvince
                })
                app.getWeatherInfo(that.data.city, function(data) {
                    that.setData({
                        weatherInfo: data.HeWeather6[0].daily_forecast
                    })
                })
                app.getLifestyleInfo(that.data.city, function(data) {
                    that.setData({
                        lifestyle: data.HeWeather6[0].lifestyle
                    })
                })
                app.getCurWeatherInfo(that.data.city, function(data) {
                    that.setData({
                        curWeather: data.HeWeather6[0].now
                    })
                })
            },
            fail: function() {
                console.log("定位失败")
            }
        })
    },
    bindChange: function(e) {},
    getNowDate: function(e) {
        let todayDate = new Date().valueOf()
        let loveDay = new Date('2017-10-21').valueOf()
        let meetDay = new Date("2020-07-26").valueOf()
        meetDay = Math.floor((todayDate - meetDay) / 86400000)
        loveDay = Math.floor((todayDate - loveDay) / 86400000)
        this.setData({
            "memorialDay": {
                "meetDay": meetDay,
                "loveDay": loveDay,
            }
        })
    },
})