import React,{ Component }  from 'react';
import 'antd/dist/antd.css';
import Home2  from "../Home2";

import {Tooltip,Form, Icon, Input, Button, Checkbox, Select, TimePicker, Upload, message, Modal,Tree} from 'antd';

const Option = Select.Option;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const TreeNode = Tree.TreeNode;
const Search = Input.Search;


/**
 * 系统设置
 */
class LocationSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            allLocation:[],
            initlocationSeq:'',
            locationService:[],
            timeHelp:'',
            thumbFlag:false,
            validStatus:'',
            openingTime:'',
            closedTime:'',
            initDonType:'',
            donTypes:[],
            photoShow:'block',
            draggerSHow:'none',
            initDetailAddress:'',
            locationName:'',
            imgPath:''
        }
    }
    componentDidMount() {
        //加载所有地点
        fetch('/public/admin/locationSet/loadLocations?location_seq='+this.props.locationSeq, {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.status == 200){
                        console.log(JSON.parse(responseJson.data[0]));
                        //赋值给allLoaction
                        this.setState({
                            allLocation:responseJson.data,
                            initlocationSeq: JSON.parse(responseJson.data[0]).LOCATION_SEQ,
                            initDetailAddress:JSON.parse(responseJson.data[0]).EXACT_ADDRESS,
                            locationName : JSON.parse(responseJson.data[0]).LOCATION_NAME,
                            imgPath : JSON.parse(responseJson.data[0]).IMG_PATH,
                        });
                        //判断献血点图片是否为空
                        if(JSON.parse(responseJson.data[0]).IMG_PATH != null){
                            this.setState({
                                fileList:[{
                                    uid: '0',
                                    size:"",
                                    type:"",
                                    name:"",
                                    url: JSON.parse(responseJson.data[0]).IMG_URI,
                                }]
                            })
                        }
                    }
                }
            ).catch(function(error){
            console.log("加载献血地点出错！来自控件sysSetting:"+error);
        });
        //加载服务
        fetch('/public/admin/locationSet/loadService', {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.status == 200){
                        console.log(responseJson.data[0]+"我是服务'");
                        let arr = new Array();
                        responseJson.data.map((item,i)=>{
                            arr = arr.concat({label:JSON.parse(item).SERVICE_NAME,value:JSON.parse(item).SERVICE_ID})
                        })
                        console.log(arr+"我是array")
                        //赋值给allLoaction
                        this.setState({
                            locationService:arr
                        });
                    }
                }
            ).catch(function(error){
            console.log("加载献血地点服务失败！来自控件sysSetting:"+error);
        });
        //加载献血点可以的献血形式
        fetch('/public/admin/locationSet/loadDonTypes', {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.status == 200){
                        console.log(responseJson.data[0]);
                        this.setState({
                            donTypes:responseJson.data,
                            initDonType: JSON.parse(responseJson.data[0]).TYPE_ID
                        });
                    }
                }
            ).catch(function(error){
            console.log("加载献血形式失败！来自控件sysSetting:"+error);
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                return;
            }
        });

        var subopeningTime = '';
        var subclosedTime = '';
        //得到表单数据提交服务器
        if(this.state.openingTime == '' || this.state.closedTime == ''){
            this.setState({
                validStatus:'error',
                timeHelp:'请设置可献血时间'
            })
        }else{
            //检查时间段是否有效
            var startDate = new Date(this.state.openingTime);
            var endDate = new Date(this.state.closedTime);

            //获取小时分钟
            var startTime = startDate.getHours();
            var endTime = endDate.getHours();

            var startMinute = startDate.getMinutes();
            var endMinute = endDate.getMinutes();
            //比较小时
            if(startTime>endTime){
                this.setState({
                    validStatus:'error',
                    timeHelp:'结束时间不可小于开始时间'
                })
                return
            }else if(startTime == endTime){
                if(startMinute >= endMinute){
                    this.setState({
                        validStatus:'error',
                        timeHelp:'时间段设置有误'
                    })
                    return
                }else {
                    subopeningTime = (startTime > 9 ? startTime : "0"+startTime)+":"+(startMinute > 9 ? startMinute : "0"+startMinute);
                    subclosedTime = (endTime > 9 ? endTime : "0"+endTime)+":"+(endMinute > 9 ? endMinute : "0"+endMinute);
                    this.setState({
                        validStatus:'success',
                        timeHelp:'',
                    })
                }
            }else{
                subopeningTime = (startTime > 9 ? startTime : "0"+startTime)+":"+(startMinute > 9 ? startMinute : "0"+startMinute);
                subclosedTime = (endTime > 9 ? endTime : "0"+endTime)+":"+(endMinute > 9 ? endMinute : "0"+endMinute);
                this.setState({
                    validStatus:'success',
                    timeHelp:'',
                })
            }
        }

        var postData = {
            locationSeq:this.props.form.getFieldValue('location'),
            openingTime : subopeningTime,
            closedTime :subclosedTime,
            donType:this.props.form.getFieldValue("donType"),
            addressDetail :this.props.form.getFieldValue("addressDetail"),
           // services :this.props.form.getFieldValue("services"),
            locationName:this.state.locationName,
            thumbFlag:this.state.thumbFlag,
            thumb:this.state.fileList,
            imgPath : this.state.imgPath
        }
        //提交数据到服务器
        fetch('/public/admin/locationSet/updateLocationDetail',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
               if(responseJson.status == 200){
                   alert("设置成功！");
                   window.location.href = "/admin_locationList";
               }else{
                    alert(responseJson.message);
               }
            }).catch(function(error){
                alert("设置失败！"+error);
                 console.log(error)
        })
    };

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        this.setState({
            thumbFlag:true
        });
        this.setState({ fileList });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
        };
        const addressLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };


        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem
                    {...formItemLayout}
                    label="献血点" >
                    {getFieldDecorator('location', {
                        rules: [{ required: true, message: '请选择地点!' }],
                         initialValue : this.state.initlocationSeq} )(
                        <Select  >
                        {this.state.allLocation.map((location,i) => <Option value={JSON.parse(location).LOCATION_SEQ} key={JSON.parse(location).LOCATION_SEQ} >{JSON.parse(location).LOCATION_NAME}</Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="献血形式" >
                    {getFieldDecorator('donType', {
                        rules: [{ required: true, message: '请选择献血形式!' }],
                        initialValue : this.state.initDonType} )(
                        <Select  >
                            {this.state.donTypes.map((don_type,i) => <Option value={JSON.parse(don_type).TYPE_ID} key={JSON.parse(don_type).LOCATION_SEQ} >{JSON.parse(don_type).TYPE_DESC}</Option>)}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="开放时间段"
                    validateStatus={this.state.validStatus}
                    help={this.state.timeHelp}
                >
                    <TimePicker value={this.state.openingTime} onChange={(value)=>{
                        this.setState({
                            openingTime:value
                        })
                    }} showTime format="HH:mm" placeholder="开始时间" />
                    <TimePicker value={this.state.closedTime} onChange={(value)=>{
                        this.setState({
                            closedTime:value
                        })
                    }} showTime format="HH:mm" placeholder="结束时间" />
                </FormItem>
                <FormItem
                    {...addressLayout}
                    label="详细地址" >
                    {getFieldDecorator('addressDetail', {initialValue:this.state.initDetailAddress,
                        rules: [{ required: true, message: '请填写该献血点详细地址!' }]
                        } )(
                        <Input />
                        )}
                </FormItem>
                {/*
                <FormItem
                    {...addressLayout}
                    label="提供的服务" >
                    {getFieldDecorator('services', {
                        rules: [{ required: true, message: '请勾选改地点提供的服务!' }],
                    } )(
                        <CheckboxGroup options={this.state.locationService} />
                    )}
                </FormItem>
                */}
                <div style={{marginTop:'2vh',height:'18vh'}}>
                    <label style={{display:'block',float:'left',width:'22%',textAlign:'right'}}>上传采血点图片:</label>
                    <div className="clearfix" style={{float:'left',marginLeft:'2vw',width:'75%'}} onClick={()=>{
                        this.setState({
                            thumbHint:false
                        })
                        return false;
                    }}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </div>
                    <div   style={{marginTop:'1vh',color:'red',display:this.state.thumbHint ? 'block' : 'none'}}>请上传缩略图</div>
                </div>
                <div style={{textAlign:'center'}}>
                 <Button type="primary" htmlType="submit"  style={{marginTop:'2vh'}} >
                    设置
                </Button>
                </div>
            </Form>
        );
    }
}
const LocationSettingForm = Form.create()(LocationSetting);

/**
 * 地点列表
 */
import { List, Avatar } from 'antd';
class LocationList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            list : []
        }
    }

    componentDidMount(){
        //加载所有地点
        fetch('/public/admin/locationSet/loadLocationDetail', {credentials: "include"})
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.status == 200){
                        console.log(responseJson.data);
                        let dataArray = new Array();
                        responseJson.data.map((loc,i)=>{
                            dataArray = dataArray.concat(JSON.parse(loc));
                        })

                        //赋值给allLoaction
                        this.setState({
                           list:dataArray
                        });
                    }
                }
            ).catch(function(error){
            console.log("加载献血地点详细信息出错！来自控件sysSetting:"+error);
        });
    }

    render(){
        return(
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={item => (
                            <List.Item actions={[<a href={"/admin_locationSetting?location_seq="+item.LOCATION_SEQ} >编辑</a>]}  >
                                <List.Item.Meta
                                    avatar={<Avatar src={item.IMG_URI} />}
                                    title={<a href="">{"献血点:"+item.LOCATION_NAME}</a>}
                                    description={item.EXACT_ADDRESS == null ?  '地址:未设置' : "地址:"+item.EXACT_ADDRESS}
                                />
                            </List.Item>
                    )}
                />
            </div>
        )
    }
}

/**
 * 微信 菜单献血须知媒体消息设置
 */
const x = 3;
const y = 2;
const z = 1;
var gData = [];

const generateData = (_level, _preKey, _tns) => {
//请求服务器获取数据
    fetch('/public/admin/locationSet/loalAllWxMediaFromWx', {credentials: "include"})
        .then((response) => response.json())
        .then((responseJson) => {
                if(responseJson.status == 200){
                    var resu = new Array();
                    var children = new Array();
                   responseJson.data.item.map((item,i)=>{
                        item.content.news_item.map((news,j)=>{
                            children = children.concat({title:news.title,key:news.title+i})
                        });
                        resu = resu.concat({title:item.media_id,key:item.media_id,children});
                        children = [];
                    });
                    console.log("我是resu："+resu);
                    gData = resu;
                    generateList(gData);
                }else{
                    alert(responseJson.message);
                }
            }
        ).catch(function(error){
            console.log("加载微信媒体消息失败！来自控件sysSetting:"+error);
    });
/*
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
        const key = `${preKey}-${i}`;
        tns.push({ title: key, key });
        if (i < y) {
            children.push(key);
        }
    }
    if (_level < 0) {
        return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
        tns[index].children = [];
        return generateData(level, key, tns[index].children);
    });
*/
};

const dataList = [];
const generateList = (data) => {
    console.log("我是data"+data);
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const key = node.key;
        dataList.push({ key, title: key });
        if (node.children) {
            generateList(node.children, node.key);
        }
    }
};

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some(item => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            }
        }
    }
    return parentKey;
};

/**
 * 献血须知菜单媒体消息控件
 */
class BldNotice extends React.Component {
    state = {
        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
    }

    componentDidMount(){
        generateData(z);
    }

    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return getParentKey(item.key, gData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };
//设置按钮
    setClick =()=>{
        //检查check数组
        if(this.state.checkedKeys.length > 1){
            alert("只能设置一条");
        }else if(this.state.checkedKeys.length <1 ){
            alert("请选择要设置为献血须知菜单推送媒体消息的nedia_id");
        }else{
            //提交数据到服务器
            fetch('/public/admin/locationSet/setDonNoticeMenu?mediaId='+this.state.checkedKeys[0],
                {credentials: "include",
                    headers:{'Content-Type': 'application/json'},
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status == 200){
                        alert("设置成功！");
                    }else{
                        alert(responseJson.message);
                    }
                }).catch(function(error){
                alert("设置失败！"+error);
            })
        }
    }


    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const loop = data => data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title = index > -1 ? (
                <span>
          {beforeStr}
                    <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
        </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} disableCheckbox />;
        });
        return (
            <div>
                <div style={{diplay:'block',height:'6vh',marginBottom:'2vh'}}><Tooltip placement="topLeft" title="提示:通过微信公众号编辑图文消息，保存到微信，在此页面选中需要设置到献血须知菜单推送的图文消息，点击设置按钮，重新生成菜单" arrowPointAtCenter>
                    <Button>帮助</Button>
                </Tooltip><Button type="primary" size="large " style={{float:'right'}} onClick={this.setClick} >设置</Button></div>
                <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                    checkable
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                >
                    {loop(gData)}
                </Tree>
            </div>
        );
    }
}

/**
 * 系统设置
 */
class AdminLocationSetting extends React.Component {
    render() {
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);
        const seq = searchParams.get('location_seq');
        return (<Home2><LocationSettingForm  locationSeq={seq} /></Home2>)
    }
}
/**
 * 地点列表
 */
class AdminLocationList extends React.Component {
    render() {
        return (<Home2><LocationList  /></Home2>)
    }
}

/**
 * 微信 菜单献血须知媒体消息设置
 */
class AdminBldNotice extends React.Component {
    render() {
        return (<Home2><BldNotice  /></Home2>)
    }
}

export {AdminLocationSetting,AdminLocationList,AdminBldNotice};