/*
 * @Author: your name
 * @Date: 2021-09-13 18:53:38
 * @LastEditTime: 2021-09-29 15:35:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /wexin-memorial-day-by-jiji/utils/util.js
 */
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    //const hour = date.getHours()
    // const minute = date.getMinutes()
    //const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') //+ ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const formatTimeTwo = (value, type) => {
    let time = value ? new Date(parseInt(+value)) : new Date()
    if (value.toString().length == 13) {
        time = value ? new Date(parseInt(+value)) : new Date()
    }
    let formatTime = type ? type : 'yyyy-MM-dd hh:mm:ss'
    let date = {
        // "Y+": time.getFullYear(),
        "M+": time.getMonth() + 1,
        "d+": time.getDate(),
        "h+": time.getHours(),
        "m+": time.getMinutes(),
        "s+": time.getSeconds(),
        "q+": Math.floor((time.getMonth() + 3) / 3),
        "S+": time.getMilliseconds()
    };
    if (/(y+)/i.test(formatTime)) {
        formatTime = formatTime.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in date) {
        if (new RegExp("(" + k + ")").test(formatTime)) {
            formatTime = formatTime.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return formatTime;
}

module.exports = {
    formatTime: formatTime,
    formatTimeTwo: formatTimeTwo,
}