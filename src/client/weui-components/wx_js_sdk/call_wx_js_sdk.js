import wxconfig from  "../../../server/wxconfig";

var wx_js_sdk = {
    //加载服务
    getLocation:function(url){
        return new Promise(async function(resolve, reject) {
            try {
                var data = {
                    url:url
                }
                //从服务段获取配置参数
                fetch('/public/donAppoint/getWxJsSdkCfgParms?url='+url, {credentials: "include", method: "POST",
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                            if (responseJson.status == 200) {
                                wx.config({
                                    debug: true,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                    appId: wxconfig.appid,
                                    timestamp: responseJson.data.timestamp,
                                    nonceStr: responseJson.data.noncestr,
                                    signature: responseJson.data.signature,
                                    jsApiList: ['openLocation', 'checkJsApi', 'startRecord', 'stopRecord', 'translateVoice', 'scanQRCode', 'openCard', 'getLocation']
                                });
                                wx.ready(function () {
                                    //获取经纬度
                                    wx.getLocation({
                                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                        success: function (res) {
                                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                            var speed = res.speed; // 速度，以米/每秒计
                                            var accuracy = res.accuracy; // 位置精度

                                            resolve(res);
                                        }
                                    });
                                });
                                //错误处理
                                wx.error(function (res) {
                                    //reject(res);
                                    console.log("我是错误信息 我很讨厌" + res.errMsg);
                                });
                            } else {
                                console.log(responseJson.message);
                            }
                        }
                    ).catch(function (error) {
                    console.log("更新地点出错！"+error)
                });

            } catch (err) { // catches errors in getConnection and the query
                reject(err);
            }
        });
    }
}

export default wx_js_sdk;