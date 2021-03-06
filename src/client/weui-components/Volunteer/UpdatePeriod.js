import React from 'react';
import { Table, Select , Popconfirm, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import PeriodModel from './PeriodModal';
import 'antd/dist/antd.css';
import Home2 from '../Home2';
import getAbsTime from './verifyFunc/time';

class UpdatePeriod extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            dataSource: [],
            locations: [],
            filteredData: []

        }

        this.handleSelectorChange = this.handleSelectorChange.bind(this);
    }

    createHandler(values) {
        console.log(values);
        // 提交数据
        fetch('/db/add_period',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          }).then(response => response.json()
            .then(json => {
                var { msg } = json;
                console.log(msg);
                location.reload();
            }));    
    }

    editHandler(id,values) {
        let data = Object.assign(values,{id:id});
        //console.log(data);
        fetch('/db/edit_period',{
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then(response => response.json()
            .then(json => {
                var { msg } = json;
                console.log(msg);
                location.reload();
            }));
    }

    deleteHandler(id) {
        // 删除数据
        console.log(id);
        const url = '/db/delete_period?id=' + id;
        fetch(
            url,
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }

        ).then(res => res.json())
         .then(json => {
             console.log(json);
             location.reload();
         });
    }

    componentDidMount() {
        fetch(
            '/db/query_period',
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => {
             // console.log(json);
            const dataSource = json.rows.map(x => {
               var list = {};
               for (let key in x) {
                    //console.log(key);
                   switch (key) {
                       case '0':
                           list["key"] = x[key];
                           break;
                       case '1':
                           list["location_id"] = x[key];
                           break;
                       case '2':
                           list["collectionpoint"] = x[key];
                           break;
                       case '3':
                           list["periodstart"] = x[key];
                           break;
                       case '4':
                           list["periodend"] = x[key];
                           break;
                       case '5':
                           list["available"] = x[key];
                           break;
                        case '6':
                           // console.log(`yyyyy is ${getAbsTime(x[key])}`);
                           list["create_date"] = getAbsTime(x[key]);
                           // list["create_date"] = x[key];
                           break;
                        case '7':
                           list["mail"] = x[key];
                           break;
                        
                       default:
                           break;
                   }
               }
               return list;
            });
            this.setState({dataSource: dataSource});
            this.setState({filteredData: dataSource});
         });


         fetch(
            '/db/locations',
            {
                method: 'get'
            }
        ).then(res => res.json())
         .then(json => {
             this.setState({ locations: json });
         });
    }

    handleSelectorChange(value) {
        let newData =  this.state.dataSource.filter( x => x.location_id == value);
        // 您不能改变这里的值
        this.setState({filteredData: newData});
    }


    render() {

        const columns = [
            {
                title: '采血点',
                dataIndex: 'collectionpoint', // 数据索引
                key: 'collectionpoint',
                render: text => <a ref="">{text}</a>,
            },
            {
                title: '预约时间段(开始)',
                dataIndex: 'periodstart',
                key: 'periodstart',
            },
            {
                title: '预约时间段(结束)',
                dataIndex: 'periodend',
                key: 'periodend',
            },
            {
                title: '可预约人数',
                dataIndex: 'available',
                key: 'available'
            },
            {
                title: '创建时间',
                dataIndex: 'create_date',
                key: 'create_date'
            },
            {
                title: '创建用户',
                dataIndex: 'mail',
                key: 'mail'
            },
            {
                title: '操作',
                key: 'opration',
                render: (text, record) => (
                    <span >
                       <PeriodModel record={record} onOk={this.editHandler.bind(null,record.key)}>
                           <a>更改</a>
                       </PeriodModel>
                       {'  '}
                       <Popconfirm title="确定要删除该预约人数设置"
                         onConfirm={this.deleteHandler.bind(null,record.key)}>
                           <a href="">删除</a>
                       </Popconfirm>
                    </span>
                ),
            },
        ];

        const selectComponent = this.state.locations.map(x => {
            return (<Select.Option value={x[0]}>{x[1]}</Select.Option>)
        });
          
        return (
            <Home2>
                <div className="components-table-demo-control-bar">
                    <div>
                        <div>
                            <PeriodModel record={{}} onOk={this.createHandler}>
                                <Button type="primary">创建</Button>
                            </PeriodModel>
                            <Select
                                style={{ width: '50%', margin: '0px 0px 10px 50px' }}
                                placeholder="请选择采血点过滤"
                                onChange={this.handleSelectorChange}
                                >
                                {selectComponent}
                            </Select>
                        </div>
                    </div>
                    <Table
                    columns={columns}
                    dataSource={this.state.filteredData}
                    rowKey={record => record.id}
                    size='small'
                    />
                </div>
        </Home2>
        )
    }
}


export default withRouter(UpdatePeriod);