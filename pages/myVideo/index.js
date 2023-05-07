/*
 * @Author: subin 18565641627@163.com
 * @Date: 2022-05-28 19:58:17
 * @LastEditors: suxin 18565641627@.163com
 * @LastEditTime: 2023-05-07 20:05:21
 * @FilePath: /wexin-memorial-day-by-jiji/pages/myVideo/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const app = getApp()
Page({
    data: {
        memorialDay: {
            meetDay: 0,
            loveDay: 0,
        },
        throttleTime: null,
        photo: [
            {
                videouri: '', //不允许使用视频，就不要了，没啥
                time: '2022年05月21日【求婚】',
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
        // 获取我们的纪念日
        this.getNowDate()
    },
    onShareTimeline() {
        return {
            title: '浪漫因你而起，我要向你求婚啦',
            imageUrl:
                'https://jijiandsu.store/suben/picture/photo/2021.02.14-18%E6%97%B621%E5%88%8637%E7%A7%92-pe[%E8%B0%A2%E5%A7%A3%E4%B8%BD-%E7%B2%9F%E6%96%8C-%E8%AE%A2%E5%A9%9A-%E6%83%85%E4%BA%BA%E8%8A%82]-ad[%E6%B9%96%E5%8D%97%E7%9C%81%E8%A1%A1%E9%98%B3%E5%B8%82%E8%92%B8%E6%B9%98%E5%8C%BA%E8%88%B9%E5%B1%B1%E5%A4%A7%E9%81%93%E8%9E%8D%E5%86%A0%E5%BD%B1%E5%9F%8E]-[noDevice].jpg',
        }
    },
    onShareAppMessage() {
        return {
            title: '浪漫因你而起，我要向你求婚啦',
            imageUrl:
                'https://jijiandsu.store/suben/picture/photo/2021.02.14-18%E6%97%B621%E5%88%8637%E7%A7%92-pe[%E8%B0%A2%E5%A7%A3%E4%B8%BD-%E7%B2%9F%E6%96%8C-%E8%AE%A2%E5%A9%9A-%E6%83%85%E4%BA%BA%E8%8A%82]-ad[%E6%B9%96%E5%8D%97%E7%9C%81%E8%A1%A1%E9%98%B3%E5%B8%82%E8%92%B8%E6%B9%98%E5%8C%BA%E8%88%B9%E5%B1%B1%E5%A4%A7%E9%81%93%E8%9E%8D%E5%86%A0%E5%BD%B1%E5%9F%8E]-[noDevice].jpg',
        }
    },
    playVideo() {},
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
