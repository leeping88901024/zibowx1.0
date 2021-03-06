import React from 'react';
import { Panel, PanelHeader, PanelBody, Form, FormCell, Label, 
    CellBody, Select, CellHeader,Preview, PreviewHeader, 
    PreviewItem, PreviewBody, Cell, Uploader, CellsTitle, Input, 
    Dialog, CityPicker, ButtonArea, Button, Gallery, GalleryDelete, 
    Toast   } from 'react-weui';
import checkChinese from '../Volunteer/verifyFunc/chinese';
import cnCity from '../Volunteer/cnCity';
import luhnCheck from '../Volunteer/verifyFunc/luhnCheck';

class EditReimburse extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            form_id: this.props.match.params.form_id,
            //
            gallery: false,
            // 图片-提交内容2
            idcardImg1: [],
            idcardImg2: [],
            // 用血者手持身份证
            handleIdcardImg: [],
            // 住院发票
            inpatientInvoiceImg: [],
            // 用血明细 
            blooddetailImg: [],

            // 代码表
            relationship: [],

            // 非本人-与用血者关系证明
            proofofrelationImg: [],

            //提交内容1
            values: {
                relation: '', //与用血者关系
                account: '李平',  // 开户人
                bankaccount: '',  // 银行账号
                bankname: '建设银行', // 开户行名称
                branchname: '世纪城支行', // 开户支行
                bloodusername: '' //非本人-用血者姓名

            },
            city_show: false,
            city_value: '',

            // 表单验证提示
            show_null: false,
            style_null: {
                title: "提示",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClickNull.bind(this)
                    }
                ]
            },
            show_content: '',

            //献血者信息
            name: '',
            idcard: '',
            telphone: '',


            // 表单状态-判断是否能进行撤销操作
            form_state: '',

            // Loading
            showLoading: true
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleVerifyName = this.handleVerifyName.bind(this);
        this.handleVerifyLuhn = this.handleVerifyLuhn.bind(this);
    }

    componentDidMount() {
        fetch(
            '/db/relationship',
            {
                method: 'get'
            }
        ).then(this.parseJson)
        .then(json => {
            let Newrelationship= json.map( x => {
                let obj = {
                value: x[0],
                label: x[1]
                };
                return obj;
            });
            this.setState({ relationship: Newrelationship });
            
        });
        
        // 获取用户要修改的原数据
        fetch(
            `/db/editreimburse?form_id=${this.state.form_id}`,
            {
                method: 'get',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
            }
        ).then(this.parseJson)
         .then(json => {
             this.setItemValue('relation',json.relation);
             this.setItemValue('account',json.account);
             this.setItemValue('bankaccount',json.bankaccount);
             this.setItemValue('bloodusername',json.bloodusername || '');
             // console.log(`the value return from backend is ${json.bankaccount}`)
             this.setItemValue('bankname',json.bankname);
             this.setItemValue('branchname',json.branchname);
             this.setState({name: json.name});
             this.setState({idcard: json.idcard});
             this.setState({telphone: json.telphone});
             this.setState({city_value: json.city});
             this.setState({form_state: json.form_state});
             
             let newFiles1 = [...this.state.idcardImg1, {url: json.idcardimg1url}];
             this.setState({
                idcardImg1: newFiles1
            });
            let newFiles2 = [...this.state.idcardImg2, {url:json.idcardimg1ur2}];
             this.setState({
                idcardImg2: newFiles2
            });

            let newFiles3 = [...this.state.handleIdcardImg, {url:json.handleidcard}];
             this.setState({
                handleIdcardImg: newFiles3
            });

            let newFiles4 = [...this.state.inpatientInvoiceImg, 
                {url:json.inpatientInvoice},
                {url:json.inpatientInvoice2},
                {url:json.inpatientInvoice3},
                {url:json.inpatientInvoice4}];
            let newfiles41 = newFiles4.filter( x => x.url != 'null');
             this.setState({
                inpatientInvoiceImg: newfiles41
            });

            let newFiles5 = [...this.state.blooddetailImg, 
                {url:json.blooddetail},
                {url:json.blooddetail2},
                {url:json.blooddetail3},
                {url:json.blooddetail4}];
            let newFiles51 = newFiles5.filter( y => y.url != 'null');
             this.setState({
                blooddetailImg: newFiles51
            }); 

            let newFiles6 = [...this.state.proofofrelationImg, 
                {url:json.proofofrelation},
                {url:json.proofofrelation2},
                {url:json.proofofrelation3},
                {url:json.proofofrelation4}];
            let newFiles61 = newFiles6.filter( y => y.url != 'null');
             this.setState({
                proofofrelationImg: newFiles61
            }); 

            this.setState({showLoading: false});

         });
    }

    parseJson(response) {
        return response.json();
    }

    handleInputChange(e) {
        this.setItemValue(e.target.name,e.target.value);
    }

    setItemValue(field,value){
        let _values = Object.assign({},this.state.values,{[field]:value});
        this.setState({values:_values});
    }

    handleVerifyName(e) {
        if (!checkChinese(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">您输入的内容只能包含汉字</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    handleVerifyLuhn(e) {
        if (!luhnCheck(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">您输入有效的银行卡号</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    handleSubmit() {
        //验证图片
        // 1.身份证照正面
        if (this.state.idcardImg1.length != 1) {
            // 用户图片为空
            this.setState({show_content: <div><font size="3" color="red">请您上传身份证正面（一张）</font></div>});
            this.setState({show_null: true});
            return;
        }

        if (this.state.idcardImg2.length != 1) {
            this.setState({show_content: <div><font size="3" color="red">请您上传身份证反面（一张）</font></div>});
            this.setState({show_null: true});
            return;
        }

        // 2.手持身份证
        if (this.state.handleIdcardImg.length != 1) {
            this.setState({show_content: <div><font size="3" color="red">请您上传[手持]身份证照（一张）</font></div>});
            this.setState({show_null: true});
            return;
        }

        // 3.住院发票 多张
        let ipimglength = this.state.inpatientInvoiceImg.length;
        if ((ipimglength < 1) || (ipimglength > 4)) {
            this.setState({show_content: <div><font size="3" color="red">请您上传住院发票（至少一张，至多4张）</font></div>});
            this.setState({show_null: true});
            return;
        }

        // 4.用血明细 多张
        let bdimglength = this.state.blooddetailImg.length;
        if ((bdimglength < 1) || (bdimglength > 4)) {
            this.setState({show_content: <div><font size="3" color="red">请您上传用血明细（至少1张，至多4张）</font></div>});
            this.setState({show_null: true});
            return;
        }

        // 5.用血者与献血者关系证明 多张
        // console.log(`the current relation is ${this.state.values.relation}`)
        if(this.state.values.relation != 1) {
            let primglength = this.state.proofofrelationImg.length;
            if ((primglength < 1) || (primglength > 4)) {
                this.setState({show_content: <div><font size="3" color="red">请您上传【献血者与用血者关系】证明</font></div>});
                this.setState({show_null: true});
                return;
            }
        }

        // ###########################################
        let data = Object.assign({},this.state.values,{
            city: this.state.city_value,
            name: this.state.name,
            telphone: this.state.telphone,
            idcard: this.state.idcard,
            form_id: this.state.form_id
        });

        for(let key in data) {
            // console.log(`${key}-${data[key]}`);
            if (data[key].toString() == '') {
                var content_null = '';
                switch (key) {
                    case 'relation':
                        content_null = <div><font size="3" color="red">你没有主动选择与用血者的关系，默认条件不可用。</font></div>;
                        //console.log('iiiii')
                        break;
                    case 'account':
                        content_null = <div><font size="3" color="red">请您填写开户人。</font></div>;
                        break;
                    case 'bankaccount':
                        content_null = <div><font size="3" color="red">请您填写银行卡号。</font></div>;
                        break;
                    case 'bankname':
                        content_null = <div><font size="3" color="red">请您填写开户行名称-如:如交通银行</font></div>;
                        break;
                    case 'branchname':
                        content_null = <div><font size="3" color="red">请您填写支行名称-如:世纪城支行</font></div>;
                        break;
                    case 'city':
                        content_null = <div><font size="3" color="red">请您选择开户行省市。</font></div>;
                        break;
                    case 'bloodusername':
                        content_null = <div><font size="3" color="red">非本人请填写用血者姓名。</font></div>;
                        break;
                    default:
                        break;
                }
                if(!(this.state.values.relation == 1 && key == 'bloodusername')) {
                    this.setState({show_content: content_null});
                    this.setState({show_null: true});
                    console.log(`${key} is null : ${data[key]}`);
                    return; 
                }
            }
  
        };

        let data2 = Object.assign({},data,{
            idcardImg1url: this.state.idcardImg1[0].url,
            idcardImg2url: this.state.idcardImg2[0].url,
            handleIdcardImg: this.state.handleIdcardImg[0].url,
            // 住院发票 多张（大于1张小于5张）
            inpatientInvoiceImg: this.state.inpatientInvoiceImg[0].url,
            inpatientInvoiceImg2: this.state.inpatientInvoiceImg[1] || {url: 'null'},
            inpatientInvoiceImg3: this.state.inpatientInvoiceImg[2] || {url: 'null'},
            inpatientInvoiceImg4: this.state.inpatientInvoiceImg[3] || {url: 'null'},
            // 用血明细 多张 
            blooddetailImg: this.state.blooddetailImg[0].url,
            blooddetailImg2: this.state.blooddetailImg[1] || {url: 'null'},
            blooddetailImg3: this.state.blooddetailImg[2] || {url: 'null'},
            blooddetailImg4: this.state.blooddetailImg[3] || {url: 'null'},
            // 献血者与用血者的关系证明材料
            proofofrelationImg: this.state.proofofrelationImg[0]  || {url: 'null'},
            proofofrelationImg2: this.state.proofofrelationImg[1] || {url: 'null'},
            proofofrelationImg3: this.state.proofofrelationImg[2] || {url: 'null'},
            proofofrelationImg4: this.state.proofofrelationImg[3] || {url: 'null'},
        });

        // 本人置空字段
        if(this.state.values.relation == 1) {
            // console.log(data2);
            data2.bloodusername = '';
            data2.proofofrelationImg = {url: 'null'};
            data2.proofofrelationImg2 = {url: 'null'};
            data2.proofofrelationImg3 = {url: 'null'};
            data2.proofofrelationImg4 = {url: 'null'};
        }

        // 更新
        fetch('/db/update_reimburse',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data2),
          }).then(response => response.json()
            .then(json => {
                var { msg } = json;
                console.log(msg);
            }));

        // 跳转
        this.props.history.push('/editreimbursesuccess');

    }

    handleDialogClickNull() {
        this.setState({show_null: false})
    }

    renderGallery(){
        if(!this.state.gallery) return false;

        let srcs = this.state.gallery.url;

        return (
            <Gallery
                src={srcs}
                show
                defaultIndex={this.state.gallery.id}
                onClick={ e=> {
                    //avoid click background item
                    e.preventDefault()
                    e.stopPropagation();
                    this.setState({gallery: false})
                }}
            >

                <GalleryDelete onClick={ (e, id)=> {
                    switch (this.state.gallery.name) {
                        case 'idcard1':
                            this.setState({
                                idcardImg1: this.state.idcardImg1.filter((e,i)=>i != id),
                                gallery: this.state.idcardImg1.length <= 1 ? true : false
                            })
                            break;
                        case 'idcard2':
                            this.setState({
                                idcardImg2: this.state.idcardImg2.filter((e,i)=>i != id),
                                gallery: this.state.idcardImg2.length <= 1 ? true : false
                            })
                            break;
                        case 'handleidcard':
                            this.setState({
                                handleIdcardImg: this.state.handleIdcardImg.filter((e,i)=>i != id),
                                gallery: this.state.handleIdcardImg.length <= 1 ? true : false
                            })
                            break;
                        case 'inpatientinvoice':
                            this.setState({
                                inpatientInvoiceImg: this.state.inpatientInvoiceImg.filter((e,i)=>i != id),
                                gallery: this.state.inpatientInvoiceImg.length <= 1 ? true : false
                            })
                            break;
                        case 'blooddetail':
                            this.setState({
                                blooddetailImg: this.state.blooddetailImg.filter((e,i)=>i != id),
                                gallery: this.state.blooddetailImg.length <= 1 ? true : false
                            })
                            break;
                        case 'proofofrelation':
                            this.setState({
                                proofofrelationImg: this.state.proofofrelationImg.filter((e,i)=>i != id),
                                gallery: this.state.proofofrelationImg.length <= 1 ? true : false
                            })
                            break;
                        default:
                            break;
                    }
                }} />

            </Gallery>
        )
    }

    render() {
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        用血报销-信息修改
                    </PanelHeader>
                    <PanelBody>
                    { this.renderGallery() }
                        <Form> 
                            <FormCell select selectPos="after">
                                <CellHeader>
                                    <Label>与用血者关系</Label>
                                </CellHeader>
                                <CellBody>
                                    <Select 
                                      name='relation'
                                      onChange={this.handleInputChange}
                                      value={this.state.values.relation}
                                      data={this.state.relationship} />
                                </CellBody>
                            </FormCell>
                        </Form>
                        <CellsTitle>#献血者信息</CellsTitle>
                        <Preview>
                            <PreviewHeader>
                                <PreviewItem label="姓名" value={this.state.name} />
                            </PreviewHeader>
                            <PreviewBody>
                                <PreviewItem label="身份证号" value={this.state.idcard.toString()} />
                                <PreviewItem label="联系电话" value={this.state.telphone.toString()} />
                            </PreviewBody>
                        </Preview>
                        <CellsTitle>#用血者者相关凭证照片</CellsTitle>
                        <Form>
                            {/* 如果不是本人，则还需提供献血者身份证照片、用血者姓名，用血者与献血者关系证明材料 */}
                            <FormCell style={{display: this.state.values.relation != 1 ? null : 'none'}}>
                                    <CellHeader>
                                        <Label>用血者姓名</Label>
                                    </CellHeader>
                                    <CellBody>
                                        <Input
                                            name="bloodusername" 
                                            value={this.state.values.bloodusername} 
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleVerifyName}
                                            type="string" 
                                            placeholder="必填"/>
                                    </CellBody>
                            </FormCell>
                            <Cell style={{display: this.state.values.relation != 1 ? null : 'none'}}>
                                <CellBody>
                                    <Uploader
                                        title="亲属证明材料"
                                        files={this.state.proofofrelationImg}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.proofofrelationImg, {url: newUrl}];
                                                _this.setState({
                                                    proofofrelationImg: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'proofofrelation'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                            {/*********************************************************** */}
                            <Cell>
                                <CellBody>
                                    <Uploader
                                        title="身份证正面"
                                        files={this.state.idcardImg1}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.idcardImg1, {url: newUrl}];
                                                _this.setState({
                                                    idcardImg1: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'idcard1'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellBody>
                                    <Uploader
                                        title="身份证反面"
                                        files={this.state.idcardImg2}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.idcardImg2, {url: newUrl}];
                                                _this.setState({
                                                    idcardImg2: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'idcard2'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellBody>
                                    <Uploader
                                        title="手持身份证"
                                        files={this.state.handleIdcardImg}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.handleIdcardImg, {url: newUrl}];
                                                _this.setState({
                                                    handleIdcardImg: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'handleidcard'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellBody>
                                    <Uploader
                                        title="住院发票"
                                        files={this.state.inpatientInvoiceImg}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.inpatientInvoiceImg, {url: newUrl}];
                                                _this.setState({
                                                    inpatientInvoiceImg: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'inpatientinvoice'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                            <Cell>
                                <CellBody>
                                    <Uploader
                                        title="用血明细"
                                        files={this.state.blooddetailImg}
                                        onError={msg => alert(msg)}
                                        onChange={(file,e) => {
                                            var _this = this;
                                            if (file.type.indexOf('image') === 0) {
                                                var img = new Image();
                                                img.src = file.data;
                                            }
                                            img.onload = function () {
                                                var canvas = document.createElement('canvas');
                                                var context = canvas.getContext('2d');
                                                var originWidth = this.width;
                                                var originHeight = this.height;
                                                var maxWidth = 300,
                                                    maxHeight = 300;
                                                var targetWidth = originWidth,
                                                    targetHeight = originHeight;
                                                if(originWidth > maxWidth || originHeight > maxHeight) {
                                                    if(originWidth / originHeight > maxWidth / maxHeight) {
                                                        targetWidth = maxWidth;
                                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                                    } else {
                                                        targetHeight = maxHeight;
                                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                                    }
                                                }
                                                canvas.width = targetWidth;
                                                canvas.height = targetHeight;
                                                context.clearRect(0, 0, targetWidth, targetHeight);
                                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                                var newUrl = canvas.toDataURL('image/jpeg', 0.92);
                                                let newFiles = [..._this.state.blooddetailImg, {url: newUrl}];
                                                _this.setState({
                                                    blooddetailImg: newFiles
                                            });
                                            }
                                        }}
                                        onFileClick={
                                            (e, file, i) => {
                                                console.log('file click', file.url, i)
                                                this.setState({
                                                    gallery: {
                                                        url: file.url,
                                                        id: i,
                                                        name: 'blooddetail'
                                                    }
                                                })
                                            }
                                        }
                                        lang={{
                                            maxError: maxCount => `Max ${maxCount} images allow`
                                        }}
                                    />
                                </CellBody>
                            </Cell>
                        </Form>
                        <CellsTitle>#转账信息</CellsTitle>
                        <Form>
                            <FormCell>
                                <CellHeader>
                                    <Label>开户人</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input
                                        name="account" 
                                        value={this.state.values.account} 
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleVerifyName}
                                        type="string" 
                                        placeholder="必填"/>
                                </CellBody>
                            </FormCell>
                            <FormCell>
                                <CellHeader>
                                    <Label>银行卡号</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input
                                        name="bankaccount" 
                                        value={this.state.values.bankaccount} 
                                        type="string" 
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleVerifyLuhn}
                                        placeholder="必填"/>
                                </CellBody>
                            </FormCell>
                            <FormCell>
                                <CellHeader>
                                    <Label>开户行名称</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input
                                        name="bankname" 
                                        value={this.state.values.bankname} 
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleVerifyName}
                                        type="string" 
                                        placeholder="必填"/>
                                </CellBody>
                            </FormCell>
                            <FormCell>
                                <CellHeader>
                                    <Label>开户支行</Label>
                                </CellHeader>
                                <CellBody>
                                    <Input
                                        name="branchname" 
                                        value={this.state.values.branchname} 
                                        onChange={this.handleInputChange}
                                        onBlur={this.handleVerifyName}
                                        type="string" 
                                        placeholder="必填"/>
                                </CellBody>
                            </FormCell>
                            <FormCell>
                                    <CellHeader>
                                        <Label>开户省市</Label>
                                    </CellHeader>
                                    <CellBody>
                                        <Input type="text"
                                            value={this.state.city_value}
                                            onClick={ e=> {
                                                e.preventDefault();
                                                this.setState({city_show: true})
                                            }}
                                            placeholder="必填"
                                            readOnly={true}
                                        />
                                    </CellBody>
                            </FormCell>
                            <CityPicker
                                data={cnCity}
                                name="residence"
                                onCancel={e=>this.setState({city_show: false})}
                                onChange={text=>this.setState({city_value: text, city_show: false})}
                                show={this.state.city_show}
                            />
                        </Form>
                        <ButtonArea direction="horizontal" >
                            <Button 
                                onClick={() => history.back()}
                                type="default">取消</Button>
                            <Button
                                onClick={() => {
                                    this.handleSubmit();
                                }}>
                                提交修改
                            </Button>
                    </ButtonArea>
                    </PanelBody>
                    <Dialog 
                        type="ios" title={this.state.style_null.title} 
                        show={this.state.show_null}
                        buttons={this.state.style_null.buttons} >
                        <div>
                            {this.state.show_content}
                        </div>
                    </Dialog>
                    <Toast icon="loading" show={this.state.showLoading}>Loading...</Toast>
                </Panel>
            </div>
        )
    }
}

export default EditReimburse;