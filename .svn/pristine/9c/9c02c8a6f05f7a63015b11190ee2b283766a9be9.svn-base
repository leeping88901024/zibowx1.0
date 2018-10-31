import React,{ Component }  from 'react';
import 'antd/dist/antd.css';
import './admin_index.css'
import {WangEditor,editor} from "./wangEditor"
import Home2 from "../Home2";

import {  Upload, Icon, Modal,Form, Input, Tooltip, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;

/**
 * 微信文章新建控件
 */
class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        previewVisible: false,
        previewImage: '',
        fileList: [],
        contentHint:false,
        thumbHint:false,
        radioValue:0,
        //保存次数
        saveCount :0,
        btnFlg:0,
        //文章ID
        id:-1,
        thumbFlag:false
    };

    editorClick = ()=>{
        this.setState({
            contentHint:false
        })
    }

    handleSubmit = (e,fag) => {
        //设置按钮标志
        this.setState({
            btnFlg:fag
        })

        this.propertyIsEnumerable()
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        //判断文章内容是否为空
        if(editor.txt.text() == ''){
           this.setState({
               contentHint:true
           })
            return false;
        }
        //判断是否有缩略图
        if(this.state.fileList.length == 0){
            this.setState({
                thumbHint:true
            })
            return false;
        }
        //封装参数
        var postData = {
            title: this.props.form.getFieldValue('title'),
            content:editor.txt.html(),
            author:this.props.form.getFieldValue('author'),
            digest:this.props.form.getFieldValue('digest'),
            show_cover_pic:this.state.radioValue,
            thumb:this.state.fileList
        }
        //根据ID的值判断保存还是更新文章
        if(this.state.id == -1){
            //提交数据到服务器
            fetch('/public/admin/media/saveArticles',
                {credentials: "include", method: "POST",
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify(postData)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status === 200){
                        //判断是保存还是保存并提交
                        if(fag== 0){
                            this.setState({
                                id:responseJson.data
                            });
                            alert("保存成功");
                        }else if(fag == 1){
                            window.location.href = "/admin_articlesList"
                        }
                    }else{
                        alert(responseJson.message);
                    }
                }).catch(function(error){
                console.log(error)
            })
        }else {
            //更新文章到数据库
            let updateData = postData;
            updateData.id = this.state.id,
            updateData.thumbFlag = this.state.thumbFlag
            fetch('/public/admin/media/updateArticles',
                {credentials: "include", method: "POST",
                    headers:{'Content-Type': 'application/json'},
                    body:JSON.stringify(updateData)
                })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status === 200){
                        //判断是保存还是保存并提交
                        if(fag== 0){
                            this.setState({
                                id:responseJson.data
                            });
                            alert("保存成功");
                        }else if(fag == 1){
                            window.location.href = "/admin_articlesList"
                        }
                    }else{
                        alert(responseJson.message);
                    }
                }).catch(function(error){
                console.log(error)
            })
        }
    }



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
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24},
            },
        };
        const authorItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 1 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 23 },
            },
        };
        const radioItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
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
            <Form >
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator('title', {
                        rules: [{
                            required: true, message: '请输入标题',
                        }],
                    })(
                        <Input placeholder="标题" />
                    )}
                </FormItem>
                <div style={{marginTop:'2vh'}} onClick={this.editorClick} >
                    <WangEditor  />
                    <div   style={{marginTop:'1vh',color:'red',display:this.state.contentHint ? 'block' : 'none'}}>请输入文章内容</div>
                </div>
                <FormItem
                    {...authorItemLayout}
                    label="作者"
                    style={{marginTop:'2vh'}}
                >
                    {getFieldDecorator('author')(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...authorItemLayout}
                    label="摘要"
                >
                    {getFieldDecorator('digest')(
                        <Input />
                    )}
                </FormItem>
                <label>是否显示封面:</label>
                <RadioGroup name="show_cover_pic" defaultValue={0}  onChange={(e)=>{
                    this.setState({
                        radioValue:e.target.value
                    })
                }} value={this.state.radioValue} style={{marginLeft:'2vh'}} >
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                </RadioGroup>
                <div style={{marginTop:'2vh'}}>
                    <label style={{display:'block',float:'left'}}>上传缩略图:</label>
                    <div className="clearfix" style={{float:'left',marginLeft:'2vw'}} onClick={()=>{
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

                <FormItem {...tailFormItemLayout}style={{marginTop:'8vh'}} >
                    <Button type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,0)
                    }} >保存</Button>
                    <Button style={{marginLeft:'2vw'}} type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,1)
                    }}  >保存并提交</Button>
                    <Button style={{marginLeft:'2vw'}} type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,-1)
                    }}  >返回</Button>
                </FormItem>
            </Form>
        );
    }
}
const UploadMaterial = Form.create()(RegistrationForm);
/**
 * 微信文章编辑控件
 */
class WxArticlesEditForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        previewVisible: false,
        previewImage: '',
         fileList: [],
        contentHint:false,
        thumbHint:false,
        radioValue:0,
        //保存次数
        saveCount :0,
        title:'',
        author:'',
        digest:'',
        show_cover_p:'',
        btnFlg:'',
        thumb:'',
        //缩略图是否被替换标志
        thumbFlag:false
    };

    componentDidMount(){
        //根据id查询文章
        fetch('/public/admin/media/loalMediaById?id='+this.props.id ,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log("我是加载出来的文章"+responseJson.data);
                    var artiles = JSON.parse(responseJson.data);
                    //填充编辑框
                    this.setState({
                        title:artiles.TITLE,
                        author: artiles.AUTHOR,
                        digest:artiles.DIGEST,
                        show_cover_p:artiles.SHOW_COVER_PIC,
                        fileList:[{
                            uid: '0',
                            size:artiles.THUMB_SIZE,
                            type:artiles.THUMB_TYPE,
                            name:artiles.THUMB_ORIGI_NAME,
                            url: artiles.THUMB_URL,
                        }]
                    });
                    //编辑器内容
                    editor.txt.html(artiles.CONTENT);

                }else{
                    console.log(responseJson.message);
                }
            }).catch(function(error){
            console.log("加载文章列表失败！"+error)
        })

    }
    editorClick = ()=>{
        this.setState({
            contentHint:false
        })
    }

    handleSubmit = (e,fag) => {
        //
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        //判断文章内容是否为空
        if(editor.txt.text() == ''){
            this.setState({
                contentHint:true
            })
            return false;
        }
        //判断是否有缩略图
        if(this.state.fileList.length == 0){
            this.setState({
                thumbHint:true
            })
            return false;
        }
        //封装参数
        var postData = {
            id:this.props.id,
            title: this.props.form.getFieldValue('title'),
            content:editor.txt.html(),
            author:this.props.form.getFieldValue('author'),
            digest:this.props.form.getFieldValue('digest'),
            show_cover_pic:this.state.radioValue,
            thumb:this.state.fileList,
            thumbFlag:this.state.thumbFlag
        }
        //提交数据到服务器
        fetch('/public/admin/media/updateArticles',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    //判断是保存还是保存并提交
                    if(fag== 0){
                        this.setState({
                            id:responseJson.data
                        });
                        alert("保存成功");
                    }else if(fag == 1){
                        window.location.href = "/admin_articlesList"
                    }
                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }



    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleChange = ({ fileList }) => {
        //改变缩略图状态
        this.setState({
            thumbFlag:true
        });
        this.setState({ fileList });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24},
            },
        };
        const authorItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 1 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 23 },
            },
        };
        const radioItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
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
            <Form >
                <FormItem
                    {...formItemLayout}
                >
                    {getFieldDecorator('title', {
                        rules: [{
                            required: true, message: '请输入标题',
                        }],
                        initialValue: this.state.title
                    })(
                        <Input placeholder="标题"  />
                    )}
                </FormItem>
                <div style={{marginTop:'2vh'}} onClick={this.editorClick} >
                    <WangEditor  />
                    <div   style={{marginTop:'1vh',color:'red',display:this.state.contentHint ? 'block' : 'none'}}>请输入文章内容</div>
                </div>
                <FormItem
                    {...authorItemLayout}
                    label="作者"
                    style={{marginTop:'2vh'}}
                >
                    {getFieldDecorator('author',{initialValue: this.state.author})(
                        <Input  />
                    )}
                </FormItem>
                <FormItem
                    {...authorItemLayout}
                    label="摘要"
                >
                    {getFieldDecorator('digest',{initialValue: this.state.digest})(
                        <Input />
                    )}
                </FormItem>
                <label>是否显示封面:</label>
                <RadioGroup name="show_cover_pic" defaultValue={this.state.show_cover_p}  onChange={(e)=>{
                    this.setState({
                        radioValue:e.target.value
                    })
                }} value={this.state.radioValue} style={{marginLeft:'2vh'}} >
                    <Radio value={0}>否</Radio>
                    <Radio value={1}>是</Radio>
                </RadioGroup>
                <div style={{marginTop:'2vh'}}>
                    <label style={{display:'block',float:'left'}}>上传缩略图:</label>
                    <div className="clearfix" style={{float:'left',marginLeft:'2vw'}} onClick={()=>{
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

                <FormItem {...tailFormItemLayout}style={{marginTop:'8vh'}} >
                    <Button type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,0)
                    }} >保存</Button>
                    <Button style={{marginLeft:'2vw'}} type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,1)
                    }}  >保存并提交</Button>
                    <Button style={{marginLeft:'2vw'}} type="primary"  onClick={(e)=>{
                        this.handleSubmit(e,-1)
                    }}  >返回</Button>
                </FormItem>
            </Form>
        );
    }
}
const WxArticlesEdit = Form.create()(WxArticlesEditForm);
/**
 * 文章列表控件
 */
import { List, Avatar, Skeleton  } from 'antd';
const count = 3;
const CheckboxGroup = Checkbox.Group;
class ArticlesList extends React.Component {
    state = {
        //当前最后一条数据的 rownum
        lastRownum : 1,
        initLoading: true,
        loading: false,
        data: [],
        list: [],
        //选中的文章
        checkArticle :[]
    }

    componentDidMount() {
        this.getData((res) => {
            this.setState({
                initLoading: false,
                data: res,
                list: res,
            });
        });
    }

    //推送按钮点击
    pushClickHandle = ()=>{

        let psotData = {
            checkArticle:this.state.checkArticle
        }
        //提交数据到服务器
        fetch('/public/admin/media/wxMedia',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(psotData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){

                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }

    getData = (callback) => {
        //向数据库加载文章
        fetch('/public/admin/media/loalMedia?count='+count+'&rownum='+this.state.lastRownum ,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    responseJson.data.map((item,i)=>{
                        console.log(item);
                    })

                    //设置上次的rownum
                    this.setState({
                        lastRownum:responseJson.lastRownum
                    })

                    callback(responseJson.data);
                }else{
                    console.log(responseJson.message);
                }
            }).catch(function(error){
            console.log("加载文章列表失败！"+error)
        })
    }

    onLoadMore = () => {

        this.setState({
            loading: true
            //list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
        });
        this.getData((res) => {
            const data = this.state.data.concat(res);
            this.setState({
                data,
                list: data,
                loading: false,
            }, () => {
                // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                // In real scene, you can using public method of react-virtualized:
                // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                window.dispatchEvent(new Event('resize'));
            });
        });
    }

    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore = !initLoading && !loading ? (
            <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                <Button onClick={this.onLoadMore}>加载更多</Button>
            </div>
        ) : null;

        return (
            <div>
                <div style={{height:'4vh'}}><Button  onClick={this.pushClickHandle} type="primary" style={{width:'10vw',height:'4vh',float:'right'}} >推送</Button></div>
            <List
                className="demo-loadmore-list"
                style={{marginTop:'4vh',borderTop:'1px solid #e8e8e8'}}
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                renderItem={item => (
                    <List.Item actions={[<a href={"/admin_wxArticlesEdit?id="+ JSON.parse(item).ID}  >编辑</a>, <Checkbox value={JSON.parse(item).ID} onChange={(e)=>{
                       console.log(e)
                        var arr = new Array();
                        arr = arr.concat(this.state.checkArticle);
                        if(e.target.checked == true){
                            arr = arr.concat(e.target.value)
                        }else {
                            var index = arr.indexOf(e.target.value);
                            if (index > -1) {
                               arr.splice(index, 1);
                            }
                        }
                        this.setState({
                            checkArticle:arr
                        })

                    }}>选择</Checkbox>]}>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={JSON.parse(item).THUMB_URL} />}
                                title={<a href="#">{JSON.parse(item).TITLE}</a>}
                                description={JSON.parse(item).DIGEST}
                            />
                            <div>{JSON.parse(item).SHOW_COVER_PIC == 1 ? '显示为封面' : null}</div>
                        </Skeleton>
                    </List.Item>
                )}
            />
            </div>
        );
    }
}
/**
 * 微信文章浏览
 */
class ArticlesLook extends React.Component {
    state = {

    };

    componentDidMount(){
        console.log(this.props.id+"大叫好 我就是传说中的 this。props")
        //根据id查询文章
        fetch('/public/admin/media/loalMediaById?id='+this.props.id ,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log("我是加载出来的文章"+responseJson.data);
                    var artiles = JSON.parse(responseJson.data);
                    //填充编辑框
                    this.setState({
                        title:artiles.TITLE,
                        author: artiles.AUTHOR,
                        digest:artiles.DIGEST,
                        show_cover_p:artiles.SHOW_COVER_PIC,
                        fileList:[{
                            uid: '0',
                            size:artiles.THUMB_SIZE,
                            type:artiles.THUMB_TYPE,
                            name:artiles.THUMB_ORIGI_NAME,
                            url: artiles.THUMB_URL,
                        }]
                    });
                    //编辑器内容
                    editor.txt.html(artiles.CONTENT);

                }else{
                    console.log(responseJson.message);
                }
            }).catch(function(error){
            console.log("加载文章列表失败！"+error)
        })

    }

    render() {
        return (
          <div></div>
        );
    }
}
const WxArticlesLook = Form.create()(ArticlesLook);

/**
 * 显示已上传到微信的永久素材
 */
class PerMaterialsList extends React.Component {
    state = {

    }

    componentDidMount() {

    }

    loadMediaList = ()=>{
        //加载媒体列表
        fetch('/public/admin/media/loalAllWxMediaFromWx',
            {credentials: "include", method: "POST",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){

                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }

    loadFollowers = ()=>{
        //加载关注者
        fetch('/public/admin/media/loadFollowers',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){

                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }

    pushMedia = ()=>{
        //加载关注者
        fetch('/public/admin/media/pushMedia',
            {credentials: "include",
                headers:{'Content-Type': 'application/json'},
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){

                }else{
                    alert(responseJson.message);
                }
            }).catch(function(error){
            console.log(error)
        })
    }


    render() {
        return(
            <div>
                <Button  onClick={this.loadMediaList} >加载上传到微信服务器的媒体列表</Button>
                <Button  onClick={this.loadFollowers} >加载所有关注者</Button>
                <Button  onClick={this.pushMedia} >推送媒体</Button>
            </div>)
    }
}
/**
 * 微信文章新建
 */
class AdminUploadMaterial extends React.Component {
    render() {
        return (<Home2><UploadMaterial /></Home2>)
    }
}
/**
 * 微信文章列表
 */
class AdminArticlesList extends React.Component {
    render() {
        return (<Home2><ArticlesList /></Home2>)
    }
}

/**
 * 微信文章编辑控件
 */
class AdminWxArticlesEdit extends React.Component {
    render() {
      const paramsString = this.props.location.search.substring(1);
      const searchParams = new URLSearchParams(paramsString);
      const id = searchParams.get('id');
        return (<Home2><WxArticlesEdit id={id} /></Home2>)
    }
}
/**
 * 微信文章新建
 */
class AdminWxArticlesLook extends React.Component {
    render() {
        return (<Home2><WxArticlesLook /></Home2>)
    }
}
/**
 * 显示已上传到微信的永久素材
 */
class AdminPerMaterialsList extends React.Component {
    render() {
        return (<Home2><PerMaterialsList /></Home2>)
    }
}


export {AdminUploadMaterial,AdminArticlesList,AdminWxArticlesEdit,AdminWxArticlesLook,AdminPerMaterialsList};