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
        },
        city: '',
        websrc: '',
        throttleTime: null,
        // TODO: 需要删除的
        selfTest: [
            {
                img: 'https://jijiandsu.store/suben/picture/photo/suben-avatar.jpg',
                time: '2022年10月04日 结婚',
            },
        ],
        photo: [
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg',
                time: '2020年07月26日【我们在一起了】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.10.03-shenzhenzijiayou.jpg',
                time: '2020年09月27日【第一次旅游】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.10.03-shenzhenzijiayou.jpg',
                time: '2020年11月27日【在一起的第100天】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg',
                time: '2021年02月14日【订婚】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.05.30-hunshazhao.jpg',
                time: '2021年05月30日【婚纱照】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.05.30-hunshazhao.jpg',
                time: '2021年09月29日【婚纱照】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.07.26-zhounianjinianri.jpg',
                time: '2021年07月26日【周年纪念日】',
            },
            {
                img: 'http://imghunan.jijiandsu.store/jijiWexin/2021.10.03-shenzhenzijiayou.jpg',
                time: '2021年10月03日【深圳自驾游】',
            },
            {
                img: 'https://jijiandsu.store/suben/picture/photo/2022.05.21-11%E6%97%B658%E5%88%8603%E7%A7%92-pe[%E8%87%AA%E6%8B%8D-%E7%B2%9F%E6%96%8C]-ad[%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%BD%97%E6%B9%96%E5%8C%BA%E5%8D%97%E6%B9%96%E8%A1%97%E9%81%93%E7%BD%97%E6%B9%96(%E5%9C%B0%E9%93%81%E7%AB%99)%E6%B7%B1%E5%9C%B3%E7%AB%99%E4%B8%9C%E5%B9%BF%E5%9C%BA]-[OPPO-OPPOReno45G].jpg',
                time: '2022年05月21日 求婚',
            },
            {
                img: 'https://jijiandsu.store/suben/picture/photo/2022.05.21-11%E6%97%B658%E5%88%8603%E7%A7%92-pe[%E8%87%AA%E6%8B%8D-%E7%B2%9F%E6%96%8C]-ad[%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%BD%97%E6%B9%96%E5%8C%BA%E5%8D%97%E6%B9%96%E8%A1%97%E9%81%93%E7%BD%97%E6%B9%96(%E5%9C%B0%E9%93%81%E7%AB%99)%E6%B7%B1%E5%9C%B3%E7%AB%99%E4%B8%9C%E5%B9%BF%E5%9C%BA]-[OPPO-OPPOReno45G].jpg',
                time: '2022年09月28日 领婚纱照',
            },
            {
                img: 'https://jijiandsu.store/suben/picture/photo/2022.05.21-11%E6%97%B658%E5%88%8603%E7%A7%92-pe[%E8%87%AA%E6%8B%8D-%E7%B2%9F%E6%96%8C]-ad[%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%B7%B1%E5%9C%B3%E5%B8%82%E7%BD%97%E6%B9%96%E5%8C%BA%E5%8D%97%E6%B9%96%E8%A1%97%E9%81%93%E7%BD%97%E6%B9%96(%E5%9C%B0%E9%93%81%E7%AB%99)%E6%B7%B1%E5%9C%B3%E7%AB%99%E4%B8%9C%E5%B9%BF%E5%9C%BA]-[OPPO-OPPOReno45G].jpg',
                time: '2022年10月04日 结婚',
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
            imageUrl: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg',
        }
    },
    onShareAppMessage() {
        return {
            title: '我们的纪念日',
            imageUrl: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg',
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
    getPhotoAdress(res) {
        console.error(res.location_address)
        this.setData({
            city: res.location_address,
        })
    },
    getButton: function (e) {
        let self = this
        console.error(self.data.selfTest[0].img)
        wx.getImageInfo({
            src: self.data.selfTest[0].img,
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
                        app.getLocationInfo(
                            ToDigital(
                                GPSLatitude[0].numerator / GPSLatitude[0].denominator,
                                GPSLatitude[1].numerator / GPSLatitude[1].denominator,
                                GPSLatitude[2].numerator / GPSLatitude[2].denominator
                            ),
                            ToDigital(
                                GPSLongitude[0].numerator / GPSLongitude[0].denominator,
                                GPSLongitude[1].numerator / GPSLongitude[1].denominator,
                                GPSLongitude[2].numerator / GPSLongitude[2].denominator
                            ),
                            self.getPhotoAdress,
                            'WGS84'
                        ) //GPS坐标
                        let PhotoDate = formatTimeTwo(new Date(reBackTime(exifInfo.data.DateTimeOriginal)).valueOf(), 'yyyy.MM.dd-hh时mm分ss秒')
                        console.error(PhotoDate)
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
        meetDay = Math.floor((todayDate - meetDay) / 86400000)
        loveDay = Math.floor((todayDate - loveDay) / 86400000)
        this.setData({
            memorialDay: {
                meetDay: meetDay,
                loveDay: loveDay,
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
