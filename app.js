/*
 * @Author: your name
 * @Date: 2021-09-13 18:53:38
 * @LastEditTime: 2021-09-28 20:56:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /wexin-memorial-day-by-jiji/app.js
 */
//app.js定义页面启动入口
// 引入百度统计
const mtjwxsdk = require('./utils/mtj-wx-sdk.js');
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    //地图定位精确方法
    /**
     * WGS84转GCj02 腾讯地图
     * @param lng
     * @param lat
     * @returns {*[]}
     */

    wgs84togcj02: function(lng, lat) {
        var that = this
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        if (that.out_of_china(lng, lat)) {
            return [lng, lat]
        } else {
            var dlat = that.transformlat(lng - 105.0, lat - 35.0);
            var dlng = that.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * PI;
            var magic = Math.sin(radlat);
            magic = 1 - ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
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
    gcj02tobd09: function(lng, lat) {
        var that = this
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
        var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat]
    },
    transformlat: function(lng, lat) {
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    },
    transformlng: function(lng, lat) {
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        var PI = 3.1415926535897932384626;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    },

    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    out_of_china: function(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    },
    getLocationInfo: function(latitude, longitude, cb) {
        var _this = this;
        // 引入 qq地图
        var QQMapWX = require('./utils/qqmap-wx-jssdk.min.js');
        var qqmapsdk;
        qqmapsdk = new QQMapWX({
            key: 'HEPBZ-V7UHK-YHBJ2-A7WUD-6O6DK-MPBNQ'
        });
        // let location = _this.wgs84togcj02(latitude, longitude)
        qqmapsdk.reverseGeocoder({
            //位置坐标，默认获取当前位置，非必须参数
            /**
             *
             //String格式
              location: '39.984060,116.307520',
            */
            location: `${latitude},${longitude}` || '', //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
            //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
            success: function(res) { //成功后的回调
                console.log(res);
                // wx.showModal({
                //     title: '提示',
                //     content: res.result.address,
                //     success(res) {
                //         if (res.confirm) {
                //             console.log('用户点击确定')
                //         } else if (res.cancel) {
                //             console.log('用户点击取消')
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
                    cb({
                        location_address: res.result.address,
                        city: res.result.address_component.city,
                        nick_name: _this.globalData.userInfo.nickName,
                    }, _this)
                }, 2000)
            },
            fail: function(error) {
                console.error(error);
            },
            complete: function(res) {
                // console.log(res);
            }
        })
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    getWeatherInfo: function(city, fc) {
        wx.request({
            url: "https://free-api.heweather.com/s6/weather/forecast?location=" + city + "&key=5a27e7497fb849729ced5631fe9260cd",
            success: function(res) {
                fc(res.data)
            },
            fail: function() {
                console.log("fail")
            }
        })
    },
    getLifestyleInfo: function(city, fc) {
        wx.request({
            url: "https://free-api.heweather.com/s6/weather/lifestyle?location=" + city + "&key=5a27e7497fb849729ced5631fe9260cd",
            success: function(res) {
                console.log(res)
                fc(res.data)
            }
        })
    },
    getCurWeatherInfo: function(city, fc) {
        wx.request({
            url: "https://free-api.heweather.com/s6/weather/now?location=" + city + "&key=5a27e7497fb849729ced5631fe9260cd",
            success: function(res) {
                console.log(res)
                fc(res.data)
            }
        })
    },
    globalData: {
        userInfo: null,
    }
})