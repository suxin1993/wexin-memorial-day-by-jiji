
const Buffer = require('./buffer/buffer.js');
const CryptoJS = require('./copyto/hmac-sha1.js');
const base64 = require('./copyto/enc-base64.js');

function base64ToUrlSafe(v) {
  return v.replace(/\//g, '_').replace(/\+/g, '-');
};

function delet(e,cb) {
  var secretkey = e.sk;  //你的sk
  var accessKey = e.ak;  //你的ak
  var bucket = e.bkt //你的空间名
  var cdn = e.cdn //CDN 测试域名
  var filename = e.filename//要删除的文件名
  var str = bucket + ':' + filename.split( cdn + '/')[1];
  var encoded = Buffer.from(str).toString('base64'); //字符串64编码
  var encodedEntryURI = base64ToUrlSafe(encoded);  //安全编码就是替换掉一些符号看
  console.log('encodedEntryURI', str, encodedEntryURI)

  var signingStr = '/delete/' + encodedEntryURI + '\n'
  var sign = CryptoJS.HmacSHA1(signingStr, secretkey); //HmacSHA1签名
  var cod = base64.stringify(sign);  //HmacSHA1的64编码
  var encodedSign = base64ToUrlSafe(cod);
  //拼接accessToken
  var accessToken = accessKey + ":" + encodedSign
  //请求接口
  wx.request({
    url: "http://rs.qbox.me/delete/" + encodedEntryURI,
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": 'QBox ' + accessToken
    },
    success: function (res) {
      return typeof cb == "function" && cb(res.data) //更具返回数据判断
      console.log(res.data);
      wx.showToast({
        title: '删除成功！',
        icon: 'success',
        duration: 2000
      })
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
};

module.exports = {
  delet: delet
}