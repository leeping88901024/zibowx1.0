import React from 'react'
import Home3 from '../Home3'
import { Table, Popconfirm, Button } from 'antd'
import UserModal from './UserModal'
import SHA2 from '../Volunteer/verifyFunc/sha1'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userDataSource: [],
        };
    }

    componentDidMount () {
        fetch(
            '/db/query_localusers',
            {
                method: 'get',
                headers: {
                    accept: 'application/json'
                }
            }
        ).then(res => res.json())
         .then(json => {
             const dataSource = json.rows.map( x => {
                 var list = {}
                 for (let key in x) {
                     switch (key) {
                         case '0':
                             list['id'] = x[key]
                             break
                        case '1':
                             list['mail'] = x[key]
                             break
                        case '2': 
                             list['mobile'] = x[key]
                             break
                        default :
                             break                        
                     }
                 }
                 return list
             });
            this.setState({userDataSource: dataSource})
         })
    }

    editHandler(id, values) {
        console.log(`the is is ${id} and the values is ${values}`)
    }

    deleteHandler(id) {
        console.log(`the id i will delete is ${id}`)
    }

    createHandler(values) {
        let  { password } = values;
        let data = {
            password: SHA2(password),
            mail: values.mail,
            mobile: values.mobile
        }
        fetch(
            '/db/user_register',
            {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        ).then(res => res.json())
         .then(json => {
             console.log(json);
             location.reload();
         });
    }

    // 该函数返回一个React元素（JSX表达式）
    render () {

        // 在这里定义数据列
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                render: text => <a ref=''>{text}</a>,
            },
            {
                title: '邮箱',
                dataIndex: 'mail',
                key: 'mail',
            },
            {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile',
            },
            //这里还可以加创建时间

            // 定义操作列
            {
                title: '操作',
                key: 'opration',
                render: (text, record) => (
                    <span>
                      <UserModal record={record} onOk={this.editHandler.bind(this, record.id)}>
                          <a>更改</a>
                      </UserModal>
                      {'  '}
                      <Popconfirm title='确定要删除该用户吗'
                          onConfirm={this.deleteHandler.bind(this,record.id)}>
                            <a href=''>删除</a>
                      </Popconfirm>
                          
                    </span>
                ),
            },
        ];

        return (
            <Home3>
                <UserModal record={{}} onOk={this.createHandler}>
                    <Button type="primary">创建用户</Button>
                </UserModal>
                <Table
                  columns={columns}
                  dataSource={this.state.userDataSource}
                  rowKey={record => record.id}
                  pagination={false} />
            </Home3>
        )
    }
}

export default User