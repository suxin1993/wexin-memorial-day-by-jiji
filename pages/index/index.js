//index.js
//获取应用实例
import { formatTimeTwo, ToDigital, reBackTime } from '../../utils/util.js'
const myexif = require('../../utils/myexif.js')
const app = getApp()
Page({
    data: {
        memorialDay: {
            meetDay: 0,
            loveDay: 0,
            marryDay: 0,
        },
        webmap: false,
        nowlongitude: undefined,
        nowlatitude: undefined,
        city: '',
        websrc: '',
        throttleTime: null,
        //改成通过接口获取
        photo: [
            {
                img: 'https://jijiandsu.store/suben/picture/photo/2021.02.14-18%E6%97%B621%E5%88%8637%E7%A7%92-pe[%E8%B0%A2%E5%A7%A3%E4%B8%BD-%E7%B2%9F%E6%96%8C-%E8%AE%A2%E5%A9%9A-%E6%83%85%E4%BA%BA%E8%8A%82]-ad[%E6%B9%96%E5%8D%97%E7%9C%81%E8%A1%A1%E9%98%B3%E5%B8%82%E8%92%B8%E6%B9%98%E5%8C%BA%E8%88%B9%E5%B1%B1%E5%A4%A7%E9%81%93%E8%9E%8D%E5%86%A0%E5%BD%B1%E5%9F%8E]-[noDevice].jpg',
                time: '2021年02月14日【订婚】',
            },
        ],
        scrollindex: 0, //当前页面的索引值
        totalnum: 4, //总共页面数
        starty: 0, //开始的位置x
        endy: 0, //结束的位置y
        critical: 100, //触发翻页的临界值
        margintop: 0, //滑动下拉距离
    },
    onLoad: function () {
        // 分享朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline'],
        })
        // 获取我们的纪念日
        this.getNowDate()
        // 先判断本地是否有
        if (!wx.getStorageSync('userInfo')) {
            // app.getUserInfo(function (data) {
            //     wx.setStorageSync('userInfo', data)
            // })
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
        //     this.throttleTime = setTimeout(() => { app.getLocationInfo(res.latitude, res.longitude, this.getCityOnShow) }, 2000);
        // }
        // wx.onLocationChange(_locationChangeFn);
    },
    onShow: function () {
        // 获取位置
        setTimeout(() => {
            this.getLocation()
            let that = this
            //获取照片
            wx.request({
                url: `https://jijiandsu.store/severmycompany/ocr/photo/getAll`,
                success: function (res) {
                    console.error(res.data)
                    that.setData({
                        photo: res.data,
                    })
                },
                fail: function () {},
            })
        }, 1000)
    },
    onHide() {
        this.setData({
            websrc: '',
        }) // 小程序退出时，将变量置为初始值
    },
    onShareTimeline() {
        return {
            title: '我们的纪念日',
            imageUrl:
                'https://jijiandsu.store/suben/picture/photo/2021.02.14-18%E6%97%B621%E5%88%8637%E7%A7%92-pe[%E8%B0%A2%E5%A7%A3%E4%B8%BD-%E7%B2%9F%E6%96%8C-%E8%AE%A2%E5%A9%9A-%E6%83%85%E4%BA%BA%E8%8A%82]-ad[%E6%B9%96%E5%8D%97%E7%9C%81%E8%A1%A1%E9%98%B3%E5%B8%82%E8%92%B8%E6%B9%98%E5%8C%BA%E8%88%B9%E5%B1%B1%E5%A4%A7%E9%81%93%E8%9E%8D%E5%86%A0%E5%BD%B1%E5%9F%8E]-[noDevice].jpg',
        }
    },
    onShareAppMessage() {
        return {
            title: '我们的纪念日',
            imageUrl:
                'https://jijiandsu.store/suben/picture/photo/2021.02.14-18%E6%97%B621%E5%88%8637%E7%A7%92-pe[%E8%B0%A2%E5%A7%A3%E4%B8%BD-%E7%B2%9F%E6%96%8C-%E8%AE%A2%E5%A9%9A-%E6%83%85%E4%BA%BA%E8%8A%82]-ad[%E6%B9%96%E5%8D%97%E7%9C%81%E8%A1%A1%E9%98%B3%E5%B8%82%E8%92%B8%E6%B9%98%E5%8C%BA%E8%88%B9%E5%B1%B1%E5%A4%A7%E9%81%93%E8%9E%8D%E5%86%A0%E5%BD%B1%E5%9F%8E]-[noDevice].jpg',
        }
    },
    getUserLocation: function () {
        const that = this
        // wx.getSetting({
        //     success(res) {
        //         if (res.authSetting['scope.userLocationBackground']) {
        //             wx.startLocationUpdateBackground({
        //                 success: (res) => {
        //                     console.log('startLocationUpdate-res', res)
        //                 },
        //                 fail: (err) => {
        //                     console.log('startLocationUpdate-err', err)
        //                 },
        //             })
        //         } else {
        //             if (res.authSetting['scope.userLocation'] == false) {
        //                 // 获取位置
        //                 wx.startLocationUpdateBackground({
        //                     success: (res) => {
        //                         console.log('startLocationUpdate-res', res)
        //                     },
        //                     fail: (err) => {
        //                         console.log('startLocationUpdate-err', err)
        //                     },
        //                 })
        //                 that.getLocation()
        //             } else {
        //                 wx.startLocationUpdateBackground({
        //                     success: (res) => {
        //                         console.log('startLocationUpdate-res', res)
        //                     },
        //                     fail: (err) => {
        //                         console.log('startLocationUpdate-err', err)
        //                     },
        //                 })
        //                 that.getLocation()
        //             }
        //         }
        //     },
        // })
    },
    getLocation: function (e) {
        let that = this
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var longitude = res.longitude
                var latitude = res.latitude
                app.getLocationInfo(latitude, longitude, that.getCityOnShow)
                if (e && e.currentTarget.dataset.from == 'tap') {
                    wx.openLocation({
                        latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
                        longitude: longitude, // 经度，范围为-180~180，负数表示西经
                        scale: 28, // 缩放比例
                    })
                }
            },
        })
    },
    getMyInfo: function () {
        // this.setData({
        //     "websrc": "https://www.jijiandsu.store/"
        // })
        // 去我的简历页面
    },
    getCityOnShow(res, _this) {
        // 获取城市
        this.setData({
            city: res.city,
        })
        app.getBadiu(res, _this)
    },
    getMap: function (e) {
        if (e.currentTarget.dataset) {
            if (this.webmap) {
                this.setData({
                    webmap: false,
                })
            } else {
                this.setData({
                    webmap: true,
                })
            }
            this.setData({
                nowlongitude: e.currentTarget.dataset.lon,
                nowlatitude: e.currentTarget.dataset.lat,
            })
        }
    },
    getPhotoAdress(res) {
        console.error(res.location_address)
        this.setData({
            city: res.location_address,
        })
    },
    getButton: function (e) {
        let self = this
        wx.getImageInfo({
            src: e.currentTarget.id,
            success: function (res) {
                console.log(res.width)
                console.log(res.height)
                console.log(res.path)
                const fs = wx.getFileSystemManager()
                fs.readFile({
                    filePath: res.path,
                    success(resq) {
                        let fileInfo = resq.data
                        var exifInfo = myexif.handleBinaryFile(fileInfo)
                        console.log('打印exif信息')
                        console.log(exifInfo)
                        let { GPSLatitude, GPSLongitude } = exifInfo.data
                        console.log(GPSLatitude)
                        console.log(GPSLongitude)
                        //上报信息，不需要
                        // app.getLocationInfo(
                        //     ToDigital(
                        //         GPSLatitude[0].numerator / GPSLatitude[0].denominator,
                        //         GPSLatitude[1].numerator / GPSLatitude[1].denominator,
                        //         GPSLatitude[2].numerator / GPSLatitude[2].denominator
                        //     ),
                        //     ToDigital(
                        //         GPSLongitude[0].numerator / GPSLongitude[0].denominator,
                        //         GPSLongitude[1].numerator / GPSLongitude[1].denominator,
                        //         GPSLongitude[2].numerator / GPSLongitude[2].denominator
                        //     ),
                        //     self.getPhotoAdress,
                        //     'WGS84'
                        // ) //GPS坐标
                        // let PhotoDate = formatTimeTwo(new Date(reBackTime(exifInfo.data.DateTimeOriginal)).valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
                        // console.error(PhotoDate)
                    },
                    fail(res) {
                        console.error(res)
                    },
                })
            },
        })
    },
    bindChange: function (e) {},
    getNowDate: function (e) {
        let todayDate = new Date().valueOf()
        let loveDay = new Date('2017-10-21').valueOf()
        let meetDay = new Date('2020-07-26').valueOf()
        let marryDay = new Date('2022-10-04').valueOf()
        meetDay = Math.floor((todayDate - meetDay) / 86400000)
        loveDay = Math.floor((todayDate - loveDay) / 86400000)
        marryDay = Math.floor((todayDate - marryDay) / 86400000)
        this.setData({
            memorialDay: {
                meetDay: meetDay,
                loveDay: loveDay,
                marryDay: marryDay,
            },
        })
    },
    //滑动加载start
    scrollTouchstart: function (e) {
        let py = e.touches[0].pageY
        this.setData({
            starty: py,
        })
    },
    scrollTouchmove: function (e) {
        let py = e.touches[0].pageY
        let d = this.data
        this.setData({
            endy: py,
        })
        if (py - d.starty < 100 && py - d.starty > -100) {
            this.setData({
                margintop: py - d.starty,
            })
        }
    },
    scrollTouchend: function (e) {
        let d = this.data
        if (d.endy - d.starty > 100 && d.scrollindex > 0) {
            this.setData({
                scrollindex: d.scrollindex - 1,
            })
        } else if (d.endy - d.starty < -100 && d.scrollindex < this.data.photo.length - 1) {
            //this.data.photo.length //总共页面数
            this.setData({
                scrollindex: d.scrollindex + 1,
            })
        }
        this.setData({
            starty: 0,
            endy: 0,
            margintop: 0,
        })
    },
    //滑动加载end
})
