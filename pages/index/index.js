//index.js
//获取应用实例
import {
    formatTimeTwo
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
        // 先判断本地是否有
        if (!wx.getStorageSync('userInfo')) {
            app.getUserInfo(function(data) {
                wx.setStorageSync('userInfo', data)
            })
        } else {
            getApp().globalData.userInfo = wx.getStorageSync('userInfo')
        }
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
                var longitude = res.longitude
                var latitude = res.latitude
                app.getLocationInfo(latitude, longitude, that.getBadiu)
            }
        })
    },
    async getBadiu(res, _this) {
        // 是在app页面调用，直接用this
        // 非app页面调用，用getApp() 
        let today = formatTimeTwo(new Date())
        // 获取城市
        this.setData({
            city: res.city,
        })
        // 获取设备信息
        const modelInfo = wx.getSystemInfoSync()
        const { networkType } = await wx.getNetworkType()
        _this.mtj.trackEvent('event_location', {
            location_address: `[${today}]time-[${_this.globalData.userInfo.nickName||'未知用户信息'}]user-[${modelInfo.system||'未知系统'}]system-[${modelInfo.model||'未知机型'}]model-[${networkType||'未知信号'}]networkType-${res.location_address}`,
            nick_name: _this.globalData.userInfo.nickName || '未知用户信息',
        });
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