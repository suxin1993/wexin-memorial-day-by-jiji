const app = getApp()
import { cityInfo } from '../../utils/util'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        cityList: [],
        inPlace: '',
        place: '衡阳',
        hotPlace: [
            {
                Name: '衡阳',
            },
            {
                Name: '广州',
            },
            {
                Name: '深圳',
            },
            {
                Name: '北京',
            },
            {
                Name: '上海',
            },
            {
                Name: '天津',
            },
            {
                Name: '重庆',
            },
            {
                Name: '郑州',
            },
            {
                Name: '西安',
            },
            {
                Name: '南京',
            },
            {
                Name: '杭州',
            },
            {
                Name: '武汉',
            },
            {
                Name: '成都',
            },
            {
                Name: '沈阳',
            },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (option) {
        wx.setNavigationBarTitle({
            title: '城市搜索',
        })
        var self = this
        self.setData({
            place: option.place,
        })
    },

    toNewCity: function (e) {
        getApp().globalData.nowPlace = e.currentTarget.dataset.text
        getApp().globalData.locationArea = ''
        wx.switchTab({
            url: '../weather/index',
        })
    },
    // 输入框输入事件
    exitPlace: function (e) {
        let inPlace = e.detail.value
        this.setData({
            inPlace: inPlace,
        })
        this.search(e)
        if (!inPlace) {
            this.setData({
                cityList: [
                    {
                        location: '请输入正确的城市名',
                    },
                ],
            })
        }
    },
    // 做一个防抖
    debounceExit: function (e) {
        let self = this
        let timer = null
        clearTimeout(timer)
        timer = null
        timer = setTimeout(() => {
            self.exitPlace(e)
        }, 260)
    },

    // 请求数据  搜索事件
    search: function (e) {
        let self = this
        for (const key in cityInfo) {
            if (Object.hasOwnProperty.call(cityInfo, key)) {
                const element = cityInfo[key]
                for (const key in element) {
                    if (Object.hasOwnProperty.call(element, key)) {
                        const city = element[key]
                        // console.error(key)
                        if (key == e.detail.value) {
                            this.setData({
                                cityList: [
                                    {
                                        location: e.detail.value,
                                    },
                                ],
                            })
                            return
                        }
                    }
                }
            }
        }

        let data = self.setData({
            cityList: [
                {
                    location: '请输入正确的城市名',
                },
            ],
        })
    },
    // 提交搜索地名
    submitCity: function (e) {
        getApp().globalData.nowPlace = e.currentTarget.dataset.text
        getApp().globalData.nowLat = e.currentTarget.dataset.lat
        getApp().globalData.nowLon = e.currentTarget.dataset.lon
        getApp().globalData.nowPlace = getApp().globalData.nowPlace.replace('市', '') || getApp().globalData.nowPlace.replace('区', '')
        wx.switchTab({
            url: '../weather/index',
        })
        this.cancel()
    },
    // 取消事件
    cancel: function (e) {
        this.setData({
            inPlace: '',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
})
