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
        'city': "",

        'photo': []
    },
    onLoad: function() {
        // 分享朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
        // 获取我们的纪念日
        this.getNowDate()
        app.getUserInfo(function(data) {
            console.error(data)
        })
    },
    onShow: function() {
        // 获取位置
        this.getLocation()
    },
    onShareTimeline() {},
    onShareAppMessage() {},
    getLocation: function() {
        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                console.log(res)
                var longitude = res.longitude
                var latitude = res.latitude
                app.getLocationInfo(latitude, longitude, that.getBadiu)
            }
        })
    },
    getBadiu(res, _this) {
        // 是在app页面调用，直接用this
        // 非app页面调用，用getApp() 
        let today = formatTime(new Date())
        // 获取城市
        this.setData({
            city: res.city,
        })
        // _this.mtj.trackEvent('event_location', {
        //     location_address: `[${today}]time-[${res.nick_name}]user-${res.location_address}`,
        //     nick_name: res.nick_name,
        // });
        // getApp().mtj.trackEvent('event_location', {
        //     location_address: '',
        //     nick_name: '',
        // })
        // app.getWeatherInfo(that.data.city, function(data) {
        //     that.setData({
        //         weatherInfo: data.HeWeather6[0].daily_forecast
        //     })
        // })
        // app.getLifestyleInfo(that.data.city, function(data) {
        //     that.setData({
        //         lifestyle: data.HeWeather6[0].lifestyle
        //     })
        // })
        // app.getCurWeatherInfo(that.data.city, function(data) {
        //     that.setData({
        //         curWeather: data.HeWeather6[0].now
        //     })
        // })
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