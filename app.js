//app.js定义页面启动入口
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
         // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
          // 缓存到store中
        }
      })
        }
      })
    }
  },
  getWeatherInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/forecast?location="+city+"&key=5a27e7497fb849729ced5631fe9260cd",
      success:function(res){
        fc(res.data)
      },
      fail:function(){
        console.log("fail")
      }
    })
  },
  getLifestyleInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/lifestyle?location=" + city +"&key=5a27e7497fb849729ced5631fe9260cd",
      success:function(res){
        console.log(res)
        fc(res.data)
      }
    })
  },
  getCurWeatherInfo:function(city,fc){
    wx.request({
      url: "https://free-api.heweather.com/s6/weather/now?location=" + city + "&key=5a27e7497fb849729ced5631fe9260cd",
      success: function (res) {
        console.log(res)
        fc(res.data)
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})
