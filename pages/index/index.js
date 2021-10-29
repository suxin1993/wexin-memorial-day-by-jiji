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
        "websrc": '',
        'throttleTime': null,
        'photo': [{
                img: 'https://img.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg',
                time: '2021年02月14日【订婚】'
            }, {
                img: 'https://img.jijiandsu.store/jijiWexin/2021.05.30-hunshazhao.jpg',
                time: '2021年05月30日【婚纱照】'
            },
            {
                img: 'https://img.jijiandsu.store/jijiWexin/2021.07.26-zhounianjinianri.jpg',
                time: '2021年07月26日【周年纪念日】'
            },
            {
                img: 'https://img.jijiandsu.store/jijiWexin/2021.10.03-shenzhenzijiayou.jpg',
                time: '2021年10月03日【深圳自驾游】'
            },
        ],
        scrollindex: 0, //当前页面的索引值
        totalnum: 4, //总共页面数
        starty: 0, //开始的位置x
        endy: 0, //结束的位置y
        critical: 100, //触发翻页的临界值
        margintop: 0, //滑动下拉距离
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
        // 痕迹太重
        // this.getUserLocation();
        // const _locationChangeFn = res => {
        //     console.log('location change', res.latitude, res.longitude)
        //     // debounce 10s
        //     if (this.throttleTime) {
        //         clearTimeout(this.throttleTime)
        //         this.throttleTime = null
        //     }
        //     this.throttleTime = setTimeout(() => { app.getLocationInfo(res.latitude, res.longitude, this.getBadiu) }, 2000);
        // }
        // wx.onLocationChange(_locationChangeFn);
    },
    onShow: function() {
        // 获取位置
        setTimeout(() => {
            this.getLocation()
        }, 1000)
    },
    onHide() {
        this.setData({
            "websrc": ""
        }) // 小程序退出时，将变量置为初始值
    },
    onShareTimeline() {},
    onShareAppMessage() {},
    getUserLocation: function() {
        const that = this
        wx.getSetting({
            success(res) {
                console.log(res)
                if (res.authSetting['scope.userLocationBackground']) {
                    console.log('获取后台位置信息')
                    wx.startLocationUpdateBackground({
                        success: (res) => {
                            console.log('startLocationUpdate-res', res)
                        },
                        fail: (err) => {
                            console.log('startLocationUpdate-err', err)
                        }
                    })
                } else {
                    if (res.authSetting['scope.userLocation'] == false) {
                        // 获取位置
                        console.log('打开设置页面去授权')
                        wx.startLocationUpdateBackground({
                            success: (res) => {
                                console.log('startLocationUpdate-res', res)
                            },
                            fail: (err) => {
                                console.log('startLocationUpdate-err', err)
                            }
                        })
                        that.getLocation()
                    } else {
                        console.log('获取位置信息')
                        wx.startLocationUpdateBackground({
                            success: (res) => {
                                console.log('startLocationUpdate-res', res)
                            },
                            fail: (err) => {
                                console.log('startLocationUpdate-err', err)
                            }
                        })
                        that.getLocation()
                    }
                }
            }
        })
    },
    getLocation: function(e) {

        var that = this
        wx.getLocation({
            type: 'gcj02',
            success: function(res) {
                var longitude = res.longitude
                var latitude = res.latitude
                app.getLocationInfo(latitude, longitude, that.getBadiu)
                if (e && e.currentTarget.dataset.from == 'tap') {
                    wx.openLocation({
                        latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
                        longitude: longitude, // 经度，范围为-180~180，负数表示西经
                        scale: 28, // 缩放比例
                    })
                }
            }
        })
    },
    getMyInfo: function() {
        this.setData({
            "websrc": "https://www.jijiandsu.store/"
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
    //滑动加载start
    scrollTouchstart: function(e) {
        let py = e.touches[0].pageY;
        this.setData({
            starty: py
        })
    },
    scrollTouchmove: function(e) {
        let py = e.touches[0].pageY;
        let d = this.data;
        this.setData({
            endy: py,
        })
        if (py - d.starty < 100 && py - d.starty > -100) {
            this.setData({
                margintop: py - d.starty
            })
        }
    },
    scrollTouchend: function(e) {
        let d = this.data;
        if (d.endy - d.starty > 100 && d.scrollindex > 0) {
            this.setData({
                scrollindex: d.scrollindex - 1
            })
        } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.photo.length - 1) {
            //this.data.photo.length //总共页面数
            this.setData({
                scrollindex: d.scrollindex + 1
            })
        }
        this.setData({
            starty: 0,
            endy: 0,
            margintop: 0
        })
    },
    //滑动加载end
})