import React,{ Component } from "react";
var wxconfig =   require( '../../../server/wxconfig');
import {commonModule} from "../publicModule/publicModule";
import {LoadMore} from 'react-weui';

{/*请求微信授权*/}
export class RequestWxAuth extends Component{
    componentDidMount(){
        //将请求微信授权的控件保存到localStorage
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);

        const comeFromRouter = searchParams.get('comeFromRouter');
        //localStorage.setItem("comeFromRouter",comeFromRouter);
        commonModule.setCookie("comeFromRouter",comeFromRouter,1);
        commonModule.setCookie("searchParams",searchParams,1);
        var wxAuthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wxconfig.appid+"&redirect_uri="+wxconfig.wxcalbackurl+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
        window.location.href=wxAuthUrl;
    }
    render(){
        return(
            <div></div>
        )
    }
};

{/*登录控件*/}
export class AutoLogin extends Component{
    componentDidMount(){
        {/*解析微信返回的code和state*/}
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if(code == null){
            if (confirm("微信授权失败，是否重新授权?")) {
                window.location.href = "/requestWxAuth";
            } else {
                window.location.href = "/"
            }
            return
        }
        //获取微信用户信息
        fetch(wxconfig.ui_domain+'/public/wxUserLogin/getWxUserInfoFromWx?code='+code+'&state='+state, {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                  if(responseJson.status == 200){
                      //console.log(commonModule.getCookie("comeFromRouter")+"?"+commonModule.getCookie("searchParams"));

                      //获取localstoreage保存token
                        //window.localStorage.setItem("token",responseJson.token);
                        //跳转到请求的控件
                     window.location.href = commonModule.getCookie("comeFromRouter")+"?"+commonModule.getCookie("searchParams");

                  }else{
                      console.log(responseJson.message);
                      if (confirm("微信授权失败，是否重新授权?")) {
                          window.location.href = "/requestWxAuth";
                      } else {
                          window.location.href = "/"
                      }
                  }
                }
            ).catch(function(error){
                console.log("微信授权异常"+error);
                if(confirm("微信授权异常，是否重新授权?")){
                    window.location.href = "/requestWxAuth";
                }else {
                    window.location.href = "/"
                }
        });
    }
    render(){
        return (
            <div>
                <LoadMore  style={{marginTop:'50vh'}} loading>自动登陆中...</LoadMore>
            </div>
        )
    }
};