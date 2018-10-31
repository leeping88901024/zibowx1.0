import React from 'react';
import { Modal, Form, Input, Select, DatePicker   } from 'antd';
const FormItem = Form.Item;
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


class PeriodEditModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visable: false,
            locations: [],

            // 提交数据
            location_id: '',
            values: {
                aviable: '',
                start: null,
                end: null
            },
            startValue: null,
            endValue: null,
            endOpen: false,

        };

        this.handleSelectorChange = this.handleSelectorChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    showModelHandler = (e) => {
        if (e) e.stopPropagation();
        this.setState({
            visible: true,
        });
    };

    hideModelHandler = () => {
        this.setState({
            visible: false,
        });
    };

    okHandler = () => {
        const { onOk } = this.props;
        this.props.form.validateFields((err,values) => {
            if (!err) {
                console.log(`the data will send is ${JSON.stringify(values)}`);
                onOk(values)
                this.hideModelHandler()
            }
        });
    };

    componentDidMount() {
        fetch(
            '/db/locationslist',
            {
                method: 'get'
            }
        ).then(res => res.json())
         .then(json => {
             this.setState({ locations: json });
         })
    }

    handleSelectorChange(value) {
        this.setState({location_id: value});
    }

    handleInputChange(e) {
        this.setItemValue(e.target.name,e.target.value);
        console.log(this.state.values);
    }

    setItemValue(field,value){
      let _values = Object.assign({},this.state.values,{[field]:value});
      this.setState({values:_values});
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
    }
    
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }
    
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    
    handleStartOpenChange = (open) => {
        if (!open) {
        this.setState({ endOpen: true });
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    render() {
        const { children } = this.props;
        const { getFieldDecorator } = this.props.form;
        console.log(`the record object is :${JSON.stringify(this.props.record)}`);

        //const { name, email, website } = this.props.record;
        const { location_id, periodstart, periodend, available } = this.props.record;
        // console.log(`the record object include the -> collectionpoint: ${collectionpoint}`);
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        const { startValue, endValue, endOpen } = this.state;

        const selectComponent = this.state.locations.map(x => {
            return (<Select.Option value={x[0]}>{x[1]}</Select.Option>)
        });
        
        return (
            <span>
                <span onClick={this.showModelHandler}>
                    {children}
                </span>
                <Modal
                   title="修改-采血点预约信息"
                   visible={this.state.visible}
                   onOk={this.okHandler}
                   onCancel={this.hideModelHandler}
                >
                <Form horizontal onSubmit={this.okHandler}>
                   <FormItem
                      {...formItemLayout}
                      label="采血点"
                   >
                       {
                          getFieldDecorator('collectionpoint',{
                              initialValue: location_id,
                          })(<Select
                               onChange={this.handleSelectorChange}
                               >
                              {selectComponent}
                          </Select>)
                        }
                   </FormItem>
                   <FormItem
                      {...formItemLayout}
                      label="预约时间段（开始）:" 
                   >
                       {
                          getFieldDecorator('start',{
                              initialValue: moment(periodstart || new Date(), 'YYYY-MM-DD  HH:mm:ss'),
                          })(<DatePicker
                            name='start'
                            locale={locale}
                            disabledDate={this.disabledStartDate}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            value={startValue}
                            placeholder="预约开始"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
                            />)
                        }

                   </FormItem>
                   <FormItem
                      {...formItemLayout}
                      label="预约时间段（结束）:" 
                   >
                       {
                          getFieldDecorator('end',{
                              initialValue: moment(periodend || new Date(), 'YYYY-MM-DD  HH:mm:ss'),
                          })(<DatePicker
                            name='end'
                            locale={locale}
                            disabledDate={this.disabledEndDate}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            value={endValue}
                            placeholder="预约结束"
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                            />)
                        }

                   </FormItem>
                   <FormItem
                      {...formItemLayout}
                      label="可预约人数" 
                   >
                       {
                          getFieldDecorator('available',{
                              initialValue: available,
                          })(<Input 
                               name="available"
                               onChange={this.handleInputChange}
                              />)
                        }

                   </FormItem>
                </Form>
                </Modal>
            </span>
        );
    }

}

export default Form.create()(PeriodEditModel);