import React,{ Component }  from 'react';
import {
    CellsTitle,
} from 'react-weui';
import 'react-weui/build/packages/react-weui.css';
import './donRecord.css';

/**
 * 献血记录结果显示
 */
class DonRecord extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name:'',
            idcard:'',
            sex:-1,
            aboGroup:'',
            records:[],
            statistics:'',
            donBldEqui:'',
            recordsHead:['COLLATE_DATE','LOCATION_NAME','DONATION_NAME','PHLE_TYPE',"ACTUAL_VOLUME"]
        };
    }
    componentDidMount(){
        fetch('/private/donRecord/recordResult',{credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log(responseJson.data)
                    this.setState({
                        donBldEqui:JSON.parse(responseJson.data.records[0]).SUM_PHLE_VOLUME,
                        statistics:responseJson.data.statistics,
                        records:responseJson.data.records,
                        name:JSON.parse(responseJson.data.records[0]).PSN_NAME,
                        idcard:JSON.parse(responseJson.data.records[0]).IDCARD,
                        sex:JSON.parse(responseJson.data.records[0]).SEX,
                        aboGroup:JSON.parse(responseJson.data.records[0]).ABO_GROUP,
                    })
                }else if(responseJson.status == 10024){
                    window.location.href = '/requestWxAuth';
                }else if(responseJson.status == 10025){
                    //进行献血者认证
                    window.location.href = "/login";
                }else{
                    alert(responseJson.message)
                }
            }).catch(function(err){
                console.log("系统异常"+err)
            //window.location.href = '/queryDonRecord';
            });
    }

    render(){
        return(
            <div className="all">
                <div style={{display:'block',margin:'4vh auto', textAlign: 'center'}}><h2 style={{color:'green',display:'inline'}} >献血记录</h2></div>
                <CellsTitle >姓名:<span className='result_span'>{this.state.name+'  '}</span> 身份证号:<span className='result_span'>{this.state.idcard+'  '}</span>性别:<span className='result_span'>{this.state.sex == 0 ? '男' :(this.state.sex == 1 ?   '女' +'  ' :  '' )}</span>血型:<span className='result_span'>{this.state.aboGroup}</span></CellsTitle>
                <CellsTitle >机采血量:<span className='result_span'>{this.state.statistics.maVolume != '' ? this.state.statistics.maVolume+'治疗量  ' : '0治疗量'}</span> 全血血量:<span className='result_span'>{this.state.statistics.wbVolume != '' ?  this.state.statistics.wbVolume+' ml ' : ' 0 ml'}</span>献血当量:<span className='result_span'>{this.state.donBldEqui+'ml  '}</span></CellsTitle>
                <div style={{overflow:'scroll'}} >
                    <table>
                        <tr>
                            {this.state.recordsHead.map((head,i)=>{
                                switch (head) {
                                    case "COLLATE_DATE": return(<th key={i}>献血日期</th>); break;
                                    case 'LOCATION_NAME': return(<th key={i} >献血地点</th>); break;
                                    case 'DONATION_NAME': return(<th key={i}>献血类型</th>); break;
                                    case 'PHLE_TYPE': return(<th key={i}>献血流程</th>); break;
                                    case 'ACTUAL_VOLUME': return(<th key={i}>献血量</th>); break;
                                }
                            })}
                        </tr>
                        {this.state.records.map((record,k)=>{
                            return(<tr>{this.state.recordsHead.map((head,i)=>{
                                switch (head) {
                                    case "COLLATE_DATE": return(<td key={i} >{JSON.parse(record).COLLATE_DATE}</td>); break;
                                    case 'LOCATION_NAME': return(<td key={i} >{JSON.parse(record).LOCATION_NAME}</td>); break;
                                    case 'DONATION_NAME': return(<td key={i} >{JSON.parse(record).DONATION_NAME}</td>); break;
                                    case 'PHLE_TYPE': return(<td key={i} >{JSON.parse(record).PHLE_TYPE == 1 ? '机采' : '全血'}</td>);  break;
                                    case 'ACTUAL_VOLUME': return(<td key={i} >{JSON.parse(record).ACTUAL_VOLUME }{JSON.parse(record).PHLE_TYPE == 1 ? '治疗量' : 'ml'}</td>); break;
                                }
                            })}</tr>)
                        })}
                    </table>
                </div>
            </div>
        );
    }
}


export {DonRecord};