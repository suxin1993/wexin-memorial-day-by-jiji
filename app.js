/*
 * @Author: your name
 * @Date: 2021-09-13 18:53:38
 * @LastEditTime: 2023-05-07 19:13:07
 * @LastEditors: suxin 18565641627@.163com
 * @Description: In User Settings Edit
 * @FilePath: /wexin-memorial-day-by-jiji/app.js
 */
//app.js定义页面启动入口
// 引入百度统计
if (wx.getSystemInfoSync().brand == 'devtools') {
    wx.dev = true
}
if (!wx.dev) {
    var mtjwxsdk = require('./utils/mtj-wx-sdk.js')
}
import { formatTimeTwo } from './utils/util'
App({
    onLaunch: function () {},
    //地图定位精确方法
    /**
     * WGS84转GCj02 腾讯地图
     * @param lng
     * @param lat
     * @returns {*[]}
     */

    wgs84togcj02: function (lng, lat) {
        var that = this
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0
        var PI = 3.1415926535897932384626
        var a = 6378245.0
        var ee = 0.00669342162296594323
        if (that.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = that.transformlat(lng - 105.0, lat - 35.0)
            var dlng = that.transformlng(lng - 105.0, lat - 35.0)
            var radlat = (lat / 180.0) * PI
            var magic = Math.sin(radlat)
            magic = 1 - ee * magic * magic
            var sqrtmagic = Math.sqrt(magic)
            dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
            dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
            var mglat = lat + dlat
            var mglng = lng + dlng
            return [mglng, mglat]
        }
    },
    /**
     * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
     * 即谷歌、高德 转 百度
     * @param lng
     * @param lat
     * @returns {*[]}
     */
    gcj02tobd09: function (lng, lat) {
        var that = this
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0
        var PI = 3.1415926535897932384626
        var a = 6378245.0
        var ee = 0.00669342162296594323
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI)
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI)
        var bd_lng = z * Math.cos(theta) + 0.0065
        var bd_lat = z * Math.sin(theta) + 0.006
        return [bd_lng, bd_lat]
    },
    transformlat: function (lng, lat) {
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0
        var PI = 3.1415926535897932384626
        var a = 6378245.0
        var ee = 0.00669342162296594323
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
        ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
        ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0
        ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0
        return ret
    },
    transformlng: function (lng, lat) {
        var x_PI = (3.14159265358979324 * 3000.0) / 180.0
        var PI = 3.1415926535897932384626
        var a = 6378245.0
        var ee = 0.00669342162296594323
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
        ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0
        ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0
        ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0
        return ret
    },

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    out_of_china: function (lng, lat) {
        return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    },
    getLocationInfo: function (latitude, longitude, cb, wgs) {
        var _this = this
        // 引入 qq地图
        var QQMapWX = require('./utils/qqmap-wx-jssdk.min.js')
        var qqmapsdk
        qqmapsdk = new QQMapWX({
            key: 'HEPBZ-V7UHK-YHBJ2-A7WUD-6O6DK-MPBNQ',
        })
        let lat = latitude
        let log = longitude
        if (wgs && wgs == 'WGS84') {
            let location = _this.wgs84togcj02(+longitude, +latitude)
            lat = location[1]
            log = location[0]
        }
        this.globalData.lonlat = `${lat},${log}`
        qqmapsdk.reverseGeocoder({
            //位置坐标，默认获取当前位置，非必须参数
            /**
             *
             //String格式
              location: '39.984060,116.307520',
            */
            location: `${lat},${log}` || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
            //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
            success: function (res) {
                //成功后的回调
                console.log(res)
                // wx.showModal({
                //     title: '提示',
                //     content: res.result.address,
                //     success(res) {
                //         if (res.confirm) {
                //         } else if (res.cancel) {
                //         }
                //     }
                // })
                // setTimeout(() => {
                //     wx.openLocation({
                //         latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
                //         longitude: longitude, // 经度，范围为-180~180，负数表示西经
                //         scale: 28, // 缩放比例
                //         name: "名字",
                //         address: "地点"
                //     })
                // }, 1000)
                setTimeout(() => {
                    cb(
                        {
                            res: res,
                            location_address: `${res.result.address}${res.result.formatted_addresses && res.result.formatted_addresses.recommend}`,
                            city: res.result.address_component.city,
                        },
                        _this
                    )
                }, 2000)
            },
            fail: function (error) {
                setTimeout(() => {
                    cb(
                        {
                            location_address: '腾讯位置服务获取位置失败',
                            city: '',
                        },
                        _this
                    )
                }, 2000)
                console.error(error)
            },
            complete: function (res) {},
        })
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == 'function' && cb(this.globalData.userInfo)
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '正在请求您的个人信息',
                success(res) {
                    if (res.confirm) {
                        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
                        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
                        // wx.getUserProfile({
                        //     desc: '获取您的昵称',
                        //     // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                        //     success: (res) => {
                        //         that.globalData.userInfo = res.userInfo
                        //         typeof cb == 'function' && cb(that.globalData.userInfo)
                        //         // 百度统计的上传需要上传机型，屏幕信息以及其他的信息
                        //     },
                        //     fail: (res) => {
                        //         //拒绝授权
                        //         wx.showModal({
                        //             title: '您拒绝了请求',
                        //             content: '您拒绝了请求',
                        //         })
                        //         return
                        //     },
                        // })
                    } else if (res.cancel) {
                        //拒绝授权 showErrorModal是自定义的提示
                        // wx.showModal({
                        //     title: '您拒绝了请求',
                        //     content: '您拒绝了请求',
                        // })
                        return
                    }
                },
            })
        }
    },
    async getBadiu(res, _this) {
        // 非app页面调用，用getApp()
        let today = formatTimeTwo(new Date())
        // 获取设备信息
        const modelInfo = wx.getSystemInfoSync()
        const { networkType } = await wx.getNetworkType()
        try {
            //百度已经停止了
            // _this.mtj.trackEvent('event_location', {
            //     location_address: `[${today}]time-[${_this.globalData.userInfo.nickName || '未知用户信息'}]user-[${
            //         modelInfo.system || '未知系统'
            //     }]system-[${modelInfo.model || '未知机型'}]model-[${networkType || '未知信号'}]networkType-${res.location_address}`,
            //     nick_name: _this.globalData.userInfo.nickName || '未知用户信息',
            // })
            wx.request({
                url: `https://jijiandsu.store/severcollectip/address?userName=suxin&nick_name=${
                    (_this.globalData.userInfo && _this.globalData.userInfo.nickName) || '未知用户信息'
                }&dosomething=wexin小程序&model=${modelInfo.model || '未知机型'}&time=${today}&location=${res.location_address}&lonlat=${
                    _this.globalData.lonlat || '未知经纬度'
                }`,
                success: function (res) {
                    console.error(res.data)
                },
                fail: function () {},
            })
        } catch (e) {
            console.error(e)
        }
    },
    getWeatherInfo: function (city, fc) {
        wx.request({
            url: 'https://free-api.heweather.com/s6/weather/forecast?location=' + city + '&key=5a27e7497fb849729ced5631fe9260cd',
            success: function (res) {
                fc(res.data)
                console.error(res.data)
            },
            fail: function () {},
        })
    },
    getLifestyleInfo: function (city, fc) {
        wx.request({
            url: 'https://free-api.heweather.com/s6/weather/lifestyle?location=' + city + '&key=5a27e7497fb849729ced5631fe9260cd',
            success: function (res) {
                fc(res.data)
            },
        })
    },
    getCurWeatherInfo: function (city, fc) {
        wx.request({
            url: 'https://free-api.heweather.com/s6/weather/now?location=' + city + '&key=5a27e7497fb849729ced5631fe9260cd',
            success: function (res) {
                fc(res.data)
            },
        })
    },
    globalData: {
        userInfo: null,
        nowPlace: undefined,
        nowLat: undefined,
        nowLon: undefined,
        locationArea: '',
        lonlat: '',
    },
})
