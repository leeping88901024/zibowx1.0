import React from 'react';
import Home2 from '../Home2';

class TestHome2 extends React.Component {
    render() {
        return (
            <Home2>
               <div style={{display:'block',width:'100%',height:'100%',textAlign:'center',textAlignVertical:'center',fontSize:'48px',paddingTop:'24%'}}>
                   欢迎来到微信献血公众服务系统后台管理系统！
               </div>
            </Home2>
        )
    }
}

export default TestHome2;