const app = getApp()
const token = require('../../utils/qiniu/qntoken.js')
const qiniuUploader = require("../../utils/qiniu/qiniuUploader.js");
const qiniudelete = require('../../utils/qiniu/qianniudelete.js')
const myexif = require('../../utils/myexif.js');
Page({
    data: {
        url: 'http://q3hsi9s02.bkt.clouddn.com/tmp/touristappid.o6zAJs9PGSG4t0J-RnpDxkuKxbWw.8xVI1cVSSOmD9a7323c4f2e3b204e02d6aede131281a.png',
        tokendata: [], //建议云函数获取处理、、测试时可直接写
        uptoken: '', //上传凭证
        time: Date.parse(new Date()) //时间截
    },
    onLoad: function() {

    },

    //测试获取token按钮
    testgettoken() {
        var tokendata = []
        tokendata.ak = '6QXeue86xkRy2CPH1bySeDInVnxYsWqNOfWOGkoX'
        tokendata.sk = 'NIE5lSmFuleFm1dgST2axhJD9CbBrvlfemE0hZ-s'
        tokendata.bkt = 'subentest'
        tokendata.cdn = 'r0885pi7y.hn-bkt.clouddn.com'
        this.data.tokendata = tokendata
        var uptoken = token.token(tokendata)
        this.setData({
            uptoken: uptoken
        })
        console.log('uptoken', uptoken, this.data.tokendata)
    },

    //测试删除按钮
    dele() {
        var sendtokendata = this.data.tokendata //提前配置
        sendtokendata.filename = this.data.url; //删除用的
        console.log('sendtokendata')

        qiniudelete.delet(sendtokendata) //调用删除
        this.setData({
            url: this.data.url,
            time: Date.parse(new Date())
        })
    },

    //测试批量删除
    batchdele() {
        var file_Name = ['http://s02.bkt.clouddn.com/tmp/wx9eakuKxbWw.85Ic4XUa06103e01320.jpg', 'http://02.bkt.clouddn.com/tmp/wx9ea6e64enpDxkuKxbWw.8BwWCdMtm6hj4d8d0e47ff1de050c814f7.jpg'] //数据删除了写填你的

        this.data.tokendata.fileName = file_Name
        console.log('传输tokendata', this.data.tokendata)

        batchdelete.delet(this.data.tokendata) //调用批量删除
    },















    //上传图片
    upload(upFile) {
        // await this.gettoken()//获取token需要用到 不用await记得吧async取消

        console.log(upFile) //传入的地址
        wx.showLoading({
            title: '上传中',
        })
        var that = this

        var qiniuTask = wx.uploadFile({
            url: "https://upload-z2.qiniup.com",
            filePath: upFile, //chooseImage上传的图片,是一个临时路径
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                key: `image/suben/${upFile}`,
                token: that.data.uptoken,
            },
            success(res) {
                // 这里返回key 与 hash
                console.log(res)
                wx.hideLoading()
            },
            file: res => {
                console.log(res)
            }
        })
        qiniuTask.onProgressUpdate((progress) => {
            console.error(progress)
            console.log('上传进度', progress.progress)
            console.log('已经上传的数据长度', progress.totalBytesSent)
            console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        })
        // qiniuUploader.upload(
        //     e, //上传的图片
        //     (res) => { //回调 success
        //         let url = 'http://' + res.imageURL;
        //         that.setData({
        //             url: url,
        //         })
        //         console.log(res, url);
        //     },
        //     (error) => { //回调 fail
        //         console.log('error: ' + error);
        //         console.log(error);
        //     }, {
        //         // 参数设置  地区代码 token domain 和直传的链接 注意七牛四个不同地域的链接不一样，我使用的是华南地区
        //         region: 'ASG',
        //         // ECN, SCN, NCN, NA, ASG，分别对应七牛的：华东，华南，华北，北美，新加坡 5 个区域
        //         uptoken: that.data.uptoken, //上传凭证自己生成
        //         // uploadURL: 'https://upload-z2.qiniup.com', //下面选你的区z2是华南的
        //         // case 'ECN': uploadURL = 'https://up.qiniup.com'; break;
        //         // case 'NCN': uploadURL = 'https://up-z1.qiniup.com'; break;
        //         // case 'SCN': uploadURL = 'https://up-z2.qiniup.com'; break;
        //         // case 'NA': uploadURL = 'https://up-na0.qiniup.com'; break;
        //         uploadURL: 'https://up-as0.qiniup.com', //东南亚
        //         domain: that.data.tokendata.cdn, //cdn域名建议直接写出来不然容易出异步问题如domain:‘你的cdn’
        //     },
        //     (progress) => {
        //         if (progress.progress == 100) {
        //             wx.hideLoading()
        //         }
        //         console.log('上传进度', progress.progress)
        //         console.log('已经上传的数据长度', progress.totalBytesSent)
        //         console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
        //     },
        // )
    },



    //生成token
    async gettoken() {
        var nowtime = Date.parse(new Date()) //当前时间截
        var mistime = nowtime - wx.getStorageSync('tokentime')
        console.log('mistime', mistime) //一个小时时间问题
        if (mistime > 3500000) {
            await this.query_qiniudata() //云端获取云端数据库记得加_openid,权限仅创建者可读 、测试时把这个数据注释掉在data里面放入你的ak、sk、btk、cdn啥的
            var sendtokendata = this.data.tokendata
            var uptoken = token.token(sendtokendata) //获取tonken核心代码这一句就够了
            wx.setStorageSync('uptoken') //存到本地建议云端
        } else {
            var uptoken = wx.getStorageSync('uptoken')
            console.log('本地储存的token')
        }
        return new Promise((resolve, reject) => {
            this.setData({
                uptoken: uptoken
            })
            resolve('ok')
            console.log('uptoken', uptoken)
        })
    },
    //更换图片
    changeimage(e) {
        let that = this
        if (this.data.uptoken == '') {
            wx.showToast({
                title: '先获取token',
            })
            return
        }
        var sendtokendata = this.data.tokendata
        sendtokendata.filename = that.data.url; //删除用
        console.log('sendtokendata')

        qiniudelete.delet(sendtokendata) //调用删除

        var tempimageurl = ''
        wx.chooseImage({
            count: 1, //选一个图
            sizeType: ['original'], //原图压缩图
            sourceType: ['album', 'camera'], //相机相册
            success: function(photo) {
                console.log(photo)
                tempimageurl = photo.tempFilePaths[0];
                const fs = wx.getFileSystemManager()
                fs.readFile({
                    filePath: photo.tempFilePaths[0],
                    success(res) {
                        // console.log(res.data)
                        let fileInfo = res.data
                        // console.error(fileInfo)
                        var exifInfo = myexif.handleBinaryFile(fileInfo);
                        console.log(exifInfo);
                        console.log(tempimageurl)
                        // that.upload(tempimageurl) //调用上传
                    },
                    fail(res) {
                        console.error(res)
                    }
                })
                // console.log(tempimageurl)
                // that.upload(tempimageurl)

            }
        })
    },
})