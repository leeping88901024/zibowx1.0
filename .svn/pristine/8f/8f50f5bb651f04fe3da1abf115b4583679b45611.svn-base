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

class EditReimburseSuccessMsg extends React.Component {

    clickHander(url) {
        this.props.history.push(url);
    }

    render() {
        return(
            <Page className="msg_success">
                <Msg
                    type="success"
                    title="修改成功"
                    description="您已经成功更新了报销资料。"
                    buttons={[
                        {
                            type: 'default',
                            label: '返回首页',
                            onClick: this.clickHander.bind(this,'/home')
                        }
                    ]}
                    footer={SuccessFooter}
                />
            </Page>
        )
    }
}

export default EditReimburseSuccessMsg;