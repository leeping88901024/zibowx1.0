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

class ReactionSuccessMsg extends React.Component {

    clickHander(url) {
        this.props.history.push(url);
    }

    render() {
        return(
            <Page className="msg_success">
                <Msg
                    type="success"
                    title="提交成功"
                    description="您提交提交了献血反应的信息，我们会安排工作人员及时和你联系。"
                    buttons={[{
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

export default ReactionSuccessMsg;