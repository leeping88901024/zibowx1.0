import React from 'react';
import { Msg, Page, Footer, FooterLinks, FooterLink, FooterText } from 'react-weui';


const SuccessFooter = ()=>(
    <Footer>
        <FooterLinks>
            { /* <FooterLink href="#">Footer Link</FooterLink> */ }
        </FooterLinks>
        <FooterText>
            Copyright © 2008-2016 suopu
        </FooterText>
    </Footer>
);

class SuccessMsg extends React.Component {

    clickHander(url) {
        this.props.history.push(url);
    }

    render() {
        return(
            <Page className="msg_success">
                <Msg
                    type="success"
                    title="提交成功"
                    description="您已完成志愿者申请，请完成志愿者培训考试。"
                    buttons={[{
                        type: 'primary',
                        label: '进入考试',
                        onClick: this.clickHander.bind(this,'/volunteer/examination')
                    }, {
                        type: 'default',
                        label: '返回首页',
                        onClick: this.clickHander.bind(this,'/home')
                    }]}
                    footer={SuccessFooter}
                />
            </Page>
        )
    }
}

export default SuccessMsg;