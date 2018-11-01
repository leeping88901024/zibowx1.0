import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    //HashRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import Regist from '../weui-components/user/Login'
import {RequestWxAuth,AutoLogin} from '../weui-components/user/autoLogin'
import AppointLocation from '../weui-components/donAppoint/donLocation';
import {DonBldConsult,DonBldDetailInfo,AppointSucess,MyAppointRecord} from '../weui-components/donAppoint/donBldAppoint';
import {DonBldAuth} from '../weui-components/BldRepay/BldRepay';
import {QueryTestResult,TestResult} from '../weui-components/testResult/testResult';
import {QueryDonRecord,DonRecord} from '../weui-components/donRecord/donRecord';
import {WxArticleLook} from "../weui-components/articleLook/articlesLook"
import {AdminUploadMaterial,AdminArticlesList,AdminWxArticlesEdit,AdminWxArticlesLook,AdminPerMaterialsList}  from "../weui-components/admin/upload_material"
import {commonModule} from "../weui-components/publicModule/publicModule";
import {AdminLocationSetting,AdminLocationList} from "../weui-components/admin/sysSetting"
{/*志愿者*/}
import Home from '../weui-components/Home';
import Login from '../weui-components/Login';
import Location from '../weui-components/Volunteer/Location';
import Apply from '../weui-components/Volunteer/Apply';
import Msg from '../weui-components/components/Msg';
import Examination  from '../weui-components/Volunteer/Examination';
import Reservation from '../weui-components/Volunteer/Reservation';
import Locations from '../weui-components/Volunteer/Locations';
import ReservationSuccessMsg from '../weui-components/components/MsgReservation';
import ReactionSuccessMsg from '../weui-components/components/MsgReaction';
import MyMap from '../weui-components/components/MyMap';
import MyApply from '../weui-components/Volunteer/MyApply';
import MyReserv from '../weui-components/Volunteer/MyReserv';
import Reaction from '../weui-components/Reaction/Reaction';
import Reimburse from '../weui-components/Reimburse/Reimburse';
import MyReaction from '../weui-components/Reaction/MyReaction';
import ReimburseForm from '../weui-components/Reimburse/ReimburseForm';
import ReimburseSuccessMsg from '../weui-components/components/MsgReimburse';
import MyReimburse from '../weui-components/Reimburse/MyReimburse';
import Learntoknow from '../weui-components/Reimburse/Learntoknow';
import EditReimburse from '../weui-components/Reimburse/EditReimburse';
import EditReimburseSuccessMsg from '../weui-components/components/MsgEditReimburse';
import UpdatePeriod from '../weui-components/Volunteer/UpdatePeriod';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import TestHome2 from '../weui-components/Volunteer/TestHome2';
import TestHome3 from '../weui-components/Volunteer/TestHome3';
import User from '../weui-components/LocalUser/User';


import {LoadMore} from "react-weui";
// import AdminLogin from '../weui-components/admin/admin_login'
import MyProgress from '../weui-components/Reimburse/MyProgress';
class WeuiRoute extends React.Component {
    render() {
        return (
            <Router>
                <switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path ='/regist' component={Regist} />
                    <Route path="/autoLogin" component={AutoLogin}/>
                    <Route path="/requestWxAuth" component={RequestWxAuth}/>
                    <Route path="/locationNavigation" component={AppointLocation}/>
                    <Route path="/donBldAppoint" component={DonBldConsult}/>
                    <Route path="/myAppointRecord" component={Private(MyAppointRecord)}/>
                    <Route path="/donBldDetailInfo" component={DonBldDetailInfo}/>
                    <Route path="/appointSucess" component={AppointSucess} />
                    <Route path="/donBldAuth" component={DonBldAuth} />
                    <Route path="/queryTestResult" component={Private(QueryTestResult)} />
                    <Route path="/testResult" component={Private(TestResult)} />
                    <Route path="/queryDonRecord" component={Private(QueryDonRecord)} />
                    <Route path="/donRecord" component={Private(DonRecord)} />
                    <Route path="/wxArticleLook" component={WxArticleLook} />
                    {/*后台管理 */}
                    <Route path="/admin_uploadMaterial" component={AdminUploadMaterial} ></Route>
                    <Route path="/admin_articlesList" component={AdminArticlesList} ></Route>
                    <Route path="/admin_wxArticlesEdit" component={AdminWxArticlesEdit} ></Route>
                    <Route path="/admin_wxArticlesLook" component={AdminWxArticlesLook} ></Route>
                    <Route path="/admin_perMaterialsList" component={AdminPerMaterialsList} ></Route>
                    <Route path="/admin_locationSetting" component={AdminLocationSetting} ></Route>
                    <Route path="/admin_locationList" component={AdminLocationList} ></Route>
                    {/* <Route path="/admin_login" component={AdminLogin} ></Route> */}

                    {/*志愿者*/}
                    <Route path='/updateperiod' render={
                        () => (
                            <LocaleProvider locale={zh_CN}>
                                <UpdatePeriod />
                            </LocaleProvider>
                        )
                    } />
                    <Route path='/localusers' component={ User } />
                    <Route path='/my/reimburseprogress' component={ MyProgress } />
                    <Route path='/testhome2' component={ TestHome2 } />
                    <Route path='/testhome3' component={ TestHome3 } />
                    <Route path='/reimburseform/:psnseq' component={ ReimburseForm } />
                    <Route path='/reimburseedit/:form_id' component={ EditReimburse } />
                    <Route path='/home' component={ Home } />
                    <Route path='/login' component={Login} />
                    <Route path='/locations/:location_id' component={ Location }/>
                    <Route exact path='/nvgtt/:location_id' component={ MyMap } />
                    <Route path='/volunteer/apply' component={Apply} />
                    <Route path='/volunteer/success' component={Msg} />
                    <Route path='/volunteer/reservation/success' component={ ReservationSuccessMsg } />
                    <Route path='/reaction/success' component={ ReactionSuccessMsg } />
                    <Route path='/volunteer/examination' component={ Examination } />
                    <Route path='/volunteer/reservation/:location_id/:peroid_id' component={ Reservation } />
                    <Route path='/my/volunteer/apply' component={ MyApply } />
                    <Route path='/my/volunteer/reserv' component={ MyReserv } />
                    <Route path='/my/reaction' component={ MyReaction } />
                    <Route path='/reaction' component={ Reaction } />
                    <Route path='/learntoknow' component={ Learntoknow } />
                    <Route path='/reimburse' component={ Reimburse } />
                    <Route path='/reimbursesuccess' component={ ReimburseSuccessMsg } />
                    <Route path='/editreimbursesuccess' component={ EditReimburseSuccessMsg } />
                    <Route path='/my/reimburse' component={ MyReimburse } />
                    <Route exact path='/' render={() => (
                        <Redirect to='/home' />
                    )} />
                    <Route exact path='/locations' component={Locations} />
                </switch>
            </Router>
        )
    }
}

//献血者身份验证高阶组件
function Private(Component){
    return class Private extends Component {
        constructor(props) {
            super(props);
            this.state = {
                isAuth:''
            }
        }
        componentDidMount() {
            //请求服务器验证此献血这时候进行献血者认证
            fetch('/private/donor/isDonorAuth', {credentials: "include"})
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.status == 10024) {
                        window.location.href = '/requestWxAuth?comeFromRouter=' + this.props.location.pathname;
                        return;
                    } else if (responseJson.status == 10025) {
                        //说明未献血者认证,跳转到献血者认证
                        //保存认证后访问的控件
                        commonModule.setCookie("afterAuthTo",this.props.location.pathname,1)
                        window.location.href = '/regist';
                    } else if (responseJson.status == 200) {
                        //显示控件
                        this.setState({
                            isAuth: true
                        })
                    } else {
                        alert(responseJson.message);
                    }
                }).catch((err) => {
                console.log(err);
            })
        }

        render() {
            return  this.state.isAuth == true  ?   <div><Component {...this.props}/></div> : <div>
                <LoadMore  style={{marginTop:'50vh'}} loading>正在请求身份验证...</LoadMore>
            </div>
        }
    }
}

//测试
{/*请求微信授权*/}
export class Test extends Component{
    componentDidMount(){
        commonModule.setCookie("test",comeFromRouter,1);
    }
    render(){
        return(
            <div></div>
        )
    }
};



export default WeuiRoute;
