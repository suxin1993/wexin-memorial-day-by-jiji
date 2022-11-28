/*
 * @Author: subin 18565641627@163.com
 * @Date: 2022-05-28 19:58:17
 * @LastEditors: subin 18565641627@163.com
 * @LastEditTime: 2022-05-30 19:52:28
 * @FilePath: /wexin-memorial-day-by-jiji/pages/myVideo/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp()
Page({
    data: {
        'memorialDay': {
            "meetDay": 0,
            "loveDay": 0,
        },
        'throttleTime': null,
        'photo': [{
            videouri: 'http://imghunan.jijiandsu.store/xiejiaoli/521xiejiaoli.mp4',
            time: '2022年05月21日【求婚】'
        }, ],
        scrollindex: 0, //当前页面的索引值
        totalnum: 4, //总共页面数
        starty: 0, //开始的位置x
        endy: 0, //结束的位置y
        critical: 100, //触发翻页的临界值
        margintop: 0, //滑动下拉距离
    },
    onLoad: function() {
        // 获取我们的纪念日
        this.getNowDate()
    },
    onShareTimeline() {
        return {
            title: '浪漫因你而起，我要向你求婚啦',
            imageUrl: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg'
        }
    },
    onShareAppMessage() {
        return {
            title: '浪漫因你而起，我要向你求婚啦',
            imageUrl: 'http://imghunan.jijiandsu.store/jijiWexin/2021.02.14-dinghunri.jpg'
        }
    },
    playVideo() {

    },
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