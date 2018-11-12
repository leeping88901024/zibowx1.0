import React,{ Component }  from 'react';
import ReactDOM from 'react-dom';
import {
    Button,Tab,NavBarItem,ActionSheet,Select,Flex,FlexItem,Panel,PanelBody,MediaBox,
    MediaBoxInfo,MediaBoxInfoMeta,PanelHeader,MediaBoxTitle,MediaBoxDescription
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';
import './donLocation.css';
import config from '../clientConfig'


class AppointLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map_sec_show: false,
            //目标地点经纬度
            lng:'',//经度
            lat:'',//纬度,
            EXACT_ADDRESS : '',
            menus: [{
                label: '百度地图',
                onClick: ()=> {
                    //调用百度uri接口
                    //window.location.href = 'http://api.map.baidu.com/geocoder?location='+this.state.lat+','+this.state.lng+'&coord_type=gcj02&output=html&src=webapp.kmsp.zibowx';
                    window.location.href = 'http://api.map.baidu.com/geocoder?address='+this.state.EXACT_ADDRESS+'&output=html&src=webapp.baidu.openAPIdemo'
                }
            }, {
                label: '腾讯地图',
                onClick: ()=> {
                    //调用腾讯uri接口
                    //window.location.href ='https://apis.map.qq.com/uri/v1/marker?marker=coord:'+this.state.lat+','+this.state.lng+'&referer=zibowx'
                    window.location.href='https://apis.map.qq.com/uri/v1/search?keyword='+this.state.EXACT_ADDRESS+'&region='+config.map_seach_range+'&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77'
                }
            },
            {
                label: '高德地图',
                onClick: ()=> {
                    //吊起高德地图URL:
                   // window.location.href = 'https://uri.amap.com/marker?position='+this.state.lng+','+this.state.lat;
                    window.location.href = "http://uri.amap.com/search?keyword="+this.state.EXACT_ADDRESS+"&city="+config.map_seach_range+"&view=map&src=mypage&coordinate=gaode&callnative=0"

                }
            }],
            actions: [
                {
                    label: '取消',
                    onClick: this.hide.bind(this)
                }
            ],
            //控制区域列表显示于隐藏
            isAreaShow: false,
            //背景透明度
            opacity:1,
            //所有区域
            allArea:[],
            //所有地点
            locations:[],
            //过滤后的地点
            allLocation:[],
            wholeBack : false,
            machBack : false
        }
    }
//map选项隐藏
    hide(){
        this.setState({
            auto_show: false,
            ios_show: false,
        });
    }
    //控件挂在完毕加载数据
    componentDidMount(){
        //加载所有地点
        fetch('/public/donAppoint/loadLocation', {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.status == 200){
                        console.log(responseJson.data);
                        //赋值给allLoaction
                        this.setState({
                            locations:responseJson.data,
                            allLocation : responseJson.data
                       });
                    }
                }
            ).catch(function(error){
            console.log("加载献血地点出错！来自控件donLocation:"+error);
        });
    };
//全血被点击
    wholeClick = ()=>{
        let arr = new Array();
        //过滤数组中的全血点
        arr =   this.state.locations.filter((location)=>{
            return JSON.parse(location).TYPE_ID == 0 || JSON.parse(location).TYPE_ID == 2
        });
        console.log(arr);
        //设置献血点为可献全血的
        this.setState({
            allLocation : arr,
            wholeBack : true,
            machBack : false
        });
    }

//献血形式菜单被点击
    machClick = ()=>{
        let arr = new Array();
        //过滤数组中的全血点
        arr =   this.state.locations.filter((location)=>{
            return JSON.parse(location).TYPE_ID == 1 || JSON.parse(location).TYPE_ID == 2
        });
        console.log(arr);
        //设置献血点为可献全血的
        this.setState({
            allLocation : arr,
            wholeBack : false,
            machBack : true
        });
    }


    render() {
        return (
            <div  className='div_location' >
                {/*导航*/}
                <div className="top_menu_nvg">
                            <div style={{display:'table-cell',width:'50%',height:'100%',position:'relative',float:'left',textAlign:'center',lineHeight:'200%',backgroundColor:this.state.wholeBack ? 'rgb(232, 232, 232)' : '#fff'}} onClick={this.wholeClick} >
                                <span>全血</span>
                            </div>
                            <div style={{display:'table-cell',width:'50%',height:'100%',position:'relative',float:'right',textAlign:'center',lineHeight:'200%',backgroundColor:this.state.machBack ? 'rgb(232, 232, 232)' : '#fff' }} onClick={this.machClick} >
                                <span>机采</span>
                            </div>
                </div>
                {/*献血地点列表*/}
                <div className="don_bld_loc_list" style={{ overflow:'scroll',opacity:this.state.opacity}}>
                    {this.state.allLocation.map((item,i)=>{
                        return(
                            <li key={i}>
                                <a className="don_bld_loc_list_item">
                                    <div className="don_loc_detail">
                                        <div className="don_loc_detail_img"><img  src={JSON.parse(item).IMG_URI}/></div>
                                        <div className="don_loc_detail_item" style={{fontSize:'14px'}}>
                                            <span>{JSON.parse(item).LOCATION_NAME+"(可捐献"+JSON.parse(item).TYPE_DESC+")" }</span>
                                            <div  style={{fontSize:'13px'}}>
                                                <div >
                                                    <img style={{width:'2.8vw',height:'2.5vh'}} src="src/client/img/clocker.png"/>
                                                    <span style={{marginLeft:'4px'}} >{JSON.parse(item).OPENINGTIME+"-"+JSON.parse(item).CLOSEDTIME}</span>
                                                </div>
                                                <div >
                                                    <img style={{width:'2.8vw',height:'2.5vh'}} src="src/client/img/mapMaker.png"/>
                                                    <span style={{marginLeft:'4px'}} > {JSON.parse(item).EXACT_ADDRESS}</span>
                                                </div>
                                                {/*
                                                <div >
                                                    {JSON.parse(item).SERVICES != null ?
                                                        JSON.parse(item).SERVICES.substring(0,JSON.parse(item).SERVICES.length).split(",").map((service,i)=>{
                                                            return(<img key={i} style={{width:'10vw',height:'2.5vh',marginLeft:'5px'}} src={service.substring(1,service.length -1)}/>)
                                                        }) : null
                                                    }
                                                </div>
                                                */}
                                            </div>
                                            <div  style={{fontSize:'12px',color:'#91FF2E',display:'block',marginTop:'4px'}}>
                                                <a style={{textAlign:'center',display:'inline-block',color:'#FFFFFF',width:'15vw',height:'3vh',backgroundColor:'#1AAD19'}} href={"/donBldAppoint?donLocSeq="+JSON.parse(item).LOCATION_SEQ+"&donLocName="+JSON.parse(item).LOCATION_NAME+"&donTypeId="+JSON.parse(item).TYPE_ID+"&donTypeDesc="+JSON.parse(item).TYPE_DESC}>预约</a>
                                                <a style={{textAlign:'center',display:'inline-block',color:'#FFFFFF',width:'15vw',height:'3vh',backgroundColor:'#1AAD19',marginLeft:'2vh'}} href="tel:13764567708" >咨询</a>
                                                <a style={{textAlign:'center',display:'inline-block',color:'#FFFFFF',width:'15vw',height:'3vh',backgroundColor:'#1AAD19',marginLeft:'2vh'}} onClick={e=>this.setState({ios_show: true,EXACT_ADDRESS:JSON.parse(item).EXACT_ADDRESS})} >导航</a>
                                                {/*<a style={{textAlign:'center',display:'inline-block',color:'#FFFFFF',width:'15vw',height:'3vh',backgroundColor:'#58FF25',marginLeft:'2vh'}} href={"/baiduMap?lng="+ JSON.parse(item).LNG+"&lat="+JSON.parse(item).LAT} >导航</a>*/}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </div>
                {/*地图选项*/}
                <ActionSheet
                    menus={this.state.menus}
                    actions={this.state.actions}
                    show={this.state.ios_show}
                    type="ios"
                    onRequestClose={e=>this.setState({ios_show: false})}
                />

            </div>
        )
    }
}
{/*地图*/}

export default AppointLocation;