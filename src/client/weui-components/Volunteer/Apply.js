import React from 'react';
import { Dialog,Button, Uploader,Article,Panel,Form,
    FormCell,CellBody,Select,CityPicker,Checkbox ,PanelBody,
    CellsTitle,CellHeader,Label,Input,ButtonArea,Cell,Gallery,GalleryDelete  } from 'react-weui';
import cnCity from './cnCity';
import checkIDCard from './verifyFunc/idcard';
import isTelphoneNumber from './verifyFunc/tel';
import checkEmail from './verifyFunc/email';
import checkChinese from './verifyFunc/chinese';


class Apply extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            // 图片上载
            gallery: false,
            profileImg : [],

            show: true,
            style: {
                title: "无偿志愿者入队须知",
                buttons: [
                    {
                        label: '确认',
                        onClick: this.handleDialogClick.bind(this)
                    }
                ]
            },
            values: {
              name: '',
              idcard: '',
              phone: '',
              email: '',
              company: '',
              profession: '',
              education: '',
              nation: '',
              abogroup: '',
              isdonation: false,
              address: '',
              //residence: '123',
              ispermanentresident: false,
              //servicesarea: [],
              //servicestime: [],

              // 加上个人头像
              // profileImg
            },
            // 存代码表
            profession: [],
            education: [],
            nation: [],
            abogroup: [],

            city_show: false,
            city_value: '',

            //服务端返回数据
            //responseMsg: '',

            //标识用户，和微信用户关联
            //该信息不再这里获取
            user_id: 1,

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

        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clickHander = this.clickHander.bind(this);
        this.handleVerifyIdcard = this.handleVerifyIdcard.bind(this);
        this.handleVerifyTel = this.handleVerifyTel.bind(this);
        this.handleVerifyEmail = this.handleVerifyEmail.bind(this);
        this.handleVerifyName = this.handleVerifyName.bind(this);
    }

    handleDialogClick() {
         this.setState({ show: false });
    }

    handleDialogClickNull() {
        this.setState({show_null: false})
    }

    handleInputChange(e) {
      this.setItemValue(e.target.name,e.target.value);
    }

    setItemValue(field,value){
      let _values = Object.assign({},this.state.values,{[field]:value});
      this.setState({values:_values});
    }

    handleVerifyIdcard(e) {
        if(!checkIDCard(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请输入有效的身份证号码</font></div>});
            this.setState({show_null: true});
            return;
        }
        
    }

    handleVerifyTel(e) {
        if (!isTelphoneNumber(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请输入有效的手机号码</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    handleVerifyEmail(e) {
        if (!checkEmail(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">请输入有效的邮件地址</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    handleVerifyName(e) {
        if (!checkChinese(e.target.value)) {
            this.setState({show_content: <div><font size="3" color="red">输入的姓名只能包含汉字</font></div>});
            this.setState({show_null: true});
            return;
        }
    }

    // 显示输入的内容
    handleSubmit() {
      let newdate = new Date();
      let localDate = newdate.toLocaleString();
      //
      if (this.state.profileImg.length == 0) {
          // 用户图片为空
          this.setState({show_content: <div><font size="3" color="red">用户没有选择头像。</font></div>});
          this.setState({show_null: true});
          return;
      }
      let applydata = Object.assign({},this.state.values,{residence: this.state.city_value},{url : this.state.profileImg[0].url},{user_id: this.state.user_id},{crete_date: localDate});
      console.log(applydata);
      let ret = {};
      for(let key in applydata) {
          if (applydata[key].toString() == '') {
              // 显示对话框，提示哪项字段为空
              // 提示内容：字段名称
              var content_null = '';
              switch (key) {
                  case 'name':
                      content_null = <div><font size="3" color="red">姓名不能为空。</font></div>;
                      break;
                  case 'idcard':
                      content_null = <div><font size="3" color="red">身份证不能为空。</font></div>;
                      break;
                  case 'phone':
                      content_null = <div><font size="3" color="red">手机号码不能为空。</font></div>;
                      break;
                  case 'email':
                      content_null = <div><font size="3" color="red">邮件地址不能为空。</font></div>;
                      break;
                  case 'company':
                      content_null = <div><font size="3" color="red">工作单位不能为空。</font></div>;
                      break;
                  case 'profession':
                      content_null = <div><font size="3" color="red">你没有主动选择职业，默认条件不可用。</font></div>;
                      break;
                  case 'education':
                      content_null = <div><font size="3" color="red">你没有主动选择学历，默认条件不可用</font></div>;
                      break;
                  case 'nation':
                      content_null = <div><font size="3" color="red">你没有主动选择名族，默认条件不可用</font></div>;
                      break;
                  case 'abogroup':
                      content_null = <div><font size="3" color="red">你没有主动选择ABO血型，默认条件不可用</font></div>;
                      break;
                  case 'address':
                      content_null = <div><font size="3" color="red">地址不能为空。</font></div>;
                      break;
                  case 'residence':
                      content_null = <div><font size="3" color="red">户籍所在地不能为空。</font></div>;
                      break;
              
                  default:
                      break;
              }
              this.setState({show_content: content_null});
              this.setState({show_null: true});
              console.log(`${key} is null : ${applydata[key]}`);
              return; 
          }

      };
      this.clickHander('/volunteer/success');
      console.log(ret);
      
      
      //console.log(this.state.profileImg[0].url);


       fetch('/db/add_apply',{
        method: 'post',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applydata),
      }).then(response => response.json()
        .then(updatedApply => {
            var { msg } = updatedApply;
            //this.setState({ responseMsg: msg });
            // 此时创建的属性已经因路由二挂载组件，不可访问了，
            this.state.responseMsg = msg;
        }));
        console.log(this.responseMsg)
    }

    componentWillUnmount(){

    }

    clickHander(url) {
        this.props.history.push(url);
    }

    // 数据填充
    componentDidMount() {
      fetch(
          '/db/profession',
          {
              method: 'get'
          }
      ).then(this.parseJson)
       .then(json => {
          
          let Newprofession= json.map( x => {
            let obj = {
              value: x[0],
              label: x[1]
            };
            return obj;
          })
          
          this.setState({ profession: Newprofession });

           

           // console.log(Newprofession);
       });

       fetch(
        '/db/education',
        {
            method: 'get'
        }
        ).then(this.parseJson)
        .then(json => {
            
            let Newdeucation= json.map( x => {
              let obj = {
                value: x[0],
                label: x[1]
              };
              return obj;
            })
            
            this.setState({ education: Newdeucation });

            

            // console.log(Newdeucation);
        });
        fetch(
          '/db/nation',
          {
              method: 'get'
          }
          ).then(this.parseJson)
          .then(json => {
              
              let Newdnation= json.map( x => {
                let obj = {
                  value: x[0],
                  label: x[1]
                };
                return obj;
              })
              
              this.setState({ nation: Newdnation });
  
              
  
              // console.log(Newdnation);
          });
        fetch(
            '/db/abogroup',
            {
                method: 'get'
            }
            ).then(this.parseJson)
            .then(json => {
                
                let Newdabogroup= json.map( x => {
                  let obj = {
                    value: x[0],
                    label: x[1]
                  };
                  return obj;
                })
                
                this.setState({ abogroup: Newdabogroup });
    
                
    
                // console.log(Newdabogroup);
          });


    }

    parseJson(response) {
        return response.json();
    }

      render() {
        return (
          <div>
            <Panel>
              <PanelBody>
                {/* <WeForm schema={schema} form={form}/> */}
                <CellsTitle>个人信息</CellsTitle>
                <Form>
                    <Cell>
                        <CellBody>
                            <Uploader
                                title="个人头像"
                                files={this.state.profileImg}
                                onError={msg => alert(msg)}
                                onChange={(file,e) => {
                                     let newFiles = [...this.state.profileImg, {url:file.data}];
                                     this.setState({
                                        profileImg: newFiles
                                     });
                                     console.log(file.data);
                                }}
                                onFileClick={
                                    (e, file, i) => {
                                        console.log('file click', file.url, i)
                                        this.setState({
                                             gallery: {
                                                 url: file.url,
                                                 id: i
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
                <Form>
                  <FormCell>
                      <CellHeader>
                          <Label>姓名</Label>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="name" 
                            value={this.state.values.name} 
                            type="string" 
                            onChange={this.handleInputChange}
                            onBlur={this.handleVerifyName}
                            placeholder="请输入姓名"/>
                      </CellBody>
                  </FormCell>
                  <FormCell>
                      <CellHeader>
                          <Label>身份证号</Label>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="idcard" 
                            value={this.state.values.idcard} 
                            type="number" 
                            onChange={this.handleInputChange}
                            onBlur={this.handleVerifyIdcard}
                            placeholder="请输入身份证号#"/>
                      </CellBody>
                  </FormCell>
                  <FormCell>
                      <CellHeader>
                          <Label>工作单位</Label>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="company" 
                            value={this.state.values.company} 
                            type="string" 
                            onChange={this.handleInputChange}
                            placeholder="请输入工作单位"/>
                      </CellBody>
                  </FormCell>
                  <FormCell select selectPos="after">
                    <CellHeader>
                        <Label>职业</Label>
                    </CellHeader>
                    <CellBody>
                        <Select
                          name="profession"
                          data={this.state.profession}
                          onChange={this.handleInputChange}
                          value={this.state.values.profession}/>
                    </CellBody>
                  </FormCell>
                  <FormCell select selectPos="after">
                    <CellHeader>
                        <Label>学历</Label>
                    </CellHeader>
                    <CellBody>
                        <Select
                          name="education"
                          data={this.state.education}
                          onChange={this.handleInputChange}
                          value={this.state.values.education}/>
                    </CellBody>
                  </FormCell>
                  <FormCell select selectPos="after">
                    <CellHeader>
                        <Label>名族</Label>
                    </CellHeader>
                    <CellBody>
                        <Select
                          name="nation"
                          data={this.state.nation}
                          onChange={this.handleInputChange}
                          value={this.state.values.nation}/>
                    </CellBody>
                  </FormCell>
                  <FormCell select selectPos="after">
                    <CellHeader>
                        <Label>ABO血型</Label>
                    </CellHeader>
                    <CellBody>
                        <Select
                          name="abogroup"
                          data={this.state.abogroup}
                          onChange={this.handleInputChange}
                          value={this.state.values.abogroup}/>
                    </CellBody>
                  </FormCell>
                  <Form checkbox>
                  <CellsTitle>献血经历</CellsTitle>
                  <FormCell checkbox>
                      <CellHeader>
                          <Checkbox 
                            name="isdonation" 
                            onChange={this.handleInputChange}
                            value={!this.state.values.isdonation}/>
                      </CellHeader>
                      <CellBody>我有献血经历</CellBody>
                  </FormCell>
                  </Form>
                  <CellsTitle>联系方式</CellsTitle>
                  <FormCell select selectPos="before">
                      <CellHeader>
                        <Select>
                              <option value="1">+86</option>
                              <option value="2">+80</option>
                              <option value="3">+84</option>
                              <option value="4">+87</option>
                          </Select>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="phone" 
                            value={this.state.values.phone} 
                            type="tel" 
                            onChange={this.handleInputChange}
                            onBlur={this.handleVerifyTel}
                            placeholder="请输入手机号码#"/>
                      </CellBody>
                  </FormCell>
                  <FormCell>
                      <CellHeader>
                          <Label>邮件地址</Label>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="email" 
                            value={this.state.values.email} 
                            type="string" 
                            onChange={this.handleInputChange}
                            onBlur={this.handleVerifyEmail}
                            placeholder="请输入邮件地址"/>
                      </CellBody>
                  </FormCell>
                  <FormCell>
                      <CellHeader>
                          <Label>地址</Label>
                      </CellHeader>
                      <CellBody>
                          <Input
                            name="address"
                            value={this.state.values.address} 
                            type="string"
                            onChange={this.handleInputChange}
                            placeholder="请输入地址"/>
                      </CellBody>
                  </FormCell>
                  <FormCell>
                        <CellHeader>
                            <Label>户籍所在地</Label>
                        </CellHeader>
                        <CellBody>
                            <Input type="text"
                                value={this.state.city_value}
                                onClick={ e=> {
                                    e.preventDefault();
                                    this.setState({city_show: true})
                                }}
                                placeholder="请选择户籍所在地"
                                readOnly={true}
                            />
                        </CellBody>
                  </FormCell>
                  <CityPicker
                    data={cnCity}
                    name="residence"
                    onCancel={e=>this.setState({city_show: false})}
                    onChange={text=>this.setState({city_value: text, city_show: false})}
                    //onChange={this.handleInputChange}
                    show={this.state.city_show}
                  />
                  <Form checkbox>
                  <CellsTitle>居住情况</CellsTitle>
                  <FormCell checkbox>
                      <CellHeader>
                          <Checkbox 
                            name="ispermanentresident" 
                            onChange={this.handleInputChange}
                            value={!this.state.values.ispermanentresident}/>
                      </CellHeader>
                      <CellBody>我长驻此地</CellBody>
                  </FormCell>
                  </Form>
                </Form>
              <ButtonArea>
                    <Button msg = {this.responseMsg}
                        onClick={() => {
                            this.handleSubmit();
                            //this.clickHander(this,'/locations');
                        }}>
                        确认
                    </Button>
              </ButtonArea>
              </PanelBody>
              <Dialog 
                type="ios" title={this.state.style.title} 
                show={this.state.show}
                buttons={this.state.style.buttons} >
                <div>
                  <Article>
                    <h2>志愿者基本条件</h2>
                      <section>
                          <h3>实习志愿者</h3>
                          <ol>
                              <li>年满18周岁，且常住本地，五地区及国籍限制；</li>
                              <li>遵纪守法，品行良好，具有奉献精神，热心于无偿献血事业；</li>
                              <li>接受加入总队所必须完成的志愿者登记手续，以及初级培训。</li>
                          </ol>
                      </section>
                      <section>
                          <h3>正式志愿者</h3>
                          <ol>
                              <li>符合实习志愿者条件</li>
                              <li>参加初级培训后，通过为期半年的一个考察期，并有两次及以上献血经历；</li>
                              <li>按时参加志愿者中级培训。</li>
                          </ol>
                      </section>
                  
                  </Article>
                </div>
              </Dialog>
              <Dialog 
                type="ios" title={this.state.style_null.title} 
                show={this.state.show_null}
                buttons={this.state.style_null.buttons} >
                <div>
                    {this.state.show_content}
                </div>
              </Dialog>         
            </Panel>
          </div>
        )
      }
}

export default Apply;