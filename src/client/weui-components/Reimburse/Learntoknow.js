import React from 'react';
import { Panel, PanelHeader, ButtonArea, Button, PanelBody, Article  } from 'react-weui';

class Learntoknow extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }

        this.clickHander = this.clickHander.bind(this);
        this.handleClickPreview = this.handleClickPreview.bind(this);
    }

    clickHander(url) {
        this.props.history.push(url);
    }


    handleClickNext() {
        this.clickHander('/reimburse');
    }

    handleClickPreview() {
        history.back();
    }

    render() {
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        用血报销-悉知
                    </PanelHeader>
                    <PanelBody>
                        <Article>
                            <h4>一、办理用血报销的文件依据</h4>
                            <p>（一）根据《青岛市实施〈中华人民共和国献血法〉若干规定》有关规定，无偿献血者在青岛市中心血站献血，献血者本人及其配偶、父母、子女、兄弟姐妹、祖父母、外祖父母、岳父母、公婆享有下列临床用血返还的政策。</p>
                            <ol>
                                <li>
                                无偿献血者献血量累计不足1000毫升的，献血者本人可累计报销不超过五倍献血量的医疗用血费用；其亲属等量报销相当于献血者献血量的医疗用血费用。
                                </li>
                                <li>
                                无偿献血者献血量累计1000毫升及以上的，献血者本人可终身享受报销临床医疗用血费用；其亲属等量报销相当于献血者献血量的医疗用血费用。
                                </li>
                            </ol>
                                <p>（二）《无偿献血者及其亲属用血费用报销管理办法》自2018年6月14日起实施，即在用血之日前及用血之日起180天之内所献的血液都可以用于临床用血费用的报销；原《青岛市卫生局关于无偿献血者及其亲属医疗用血费用报销办法》适用于2018年6月14日之前的医疗用血费用报销。</p>
                                <h4> 二、献血者本人用血报销：出院后携带以下证件（原件 ）</h4>
                                <ol>
                                    <li>献血者身份证。</li>
                                    <li>无偿献血证。</li>
                                    <li>出院结算发票。</li>
                                    <li>用血明细（医院住院费用明细表）。</li>
                                    <li>献血者本人的银行帐号（写明开户行到支行）。</li>
                                </ol>
                                <div>
                                    <h4> 三、献血者亲属用血报销：出院后携带以下证件（原件）</h4>
                                    <ol>
                                        <li>用血者身份证。</li>
                                        <li>献血者身份证。</li>
                                        <li>无偿献血证。</li>
                                        <li>出院结算发票。</li>
                                        <li>用血明细（医院住院费用明细表）。</li>
                                        <li>用血者及献血者关系的有效证明（户口本、结婚证或由派出所、村委会、居委会、街道办事处开具的有效关系证明，只需其中任意一项有效关系证明即可）。</li>
                                        <li>献血者本人的银行帐号（写明开户行到支行）。</li>
                                    </ol>
                                </div>
                                <h4>四、代办者办理还血报销：出院后需要的证件（原件）</h4>
                                <ol>
                                    <li>代办者身份证。</li>
                                    <li>用血者身份证。</li>
                                    <li>献血者身份证。</li>
                                    <li>无偿献血证。</li>
                                    <li>出院结算发票。</li>
                                    <li>用血明细（医院住院费用明细表）。</li>
                                    <li>用血者及献血者关系的有效证明（户口本、结婚证或由派出所、村委会、居委会、街道办事处开具的有效关系证明，只需其中任意一项有效关系证明即可）。</li>
                                    <li>献血者本人的银行帐号（写明开户行到支行）。</li>
                                </ol>
                                <h4>五、温馨提示</h4>
                                <ol>
                                    <li>代办血费报销业务需经献血者本人知情同意。</li>
                                    <li>您上传的所有材料必须为原件，并对材料的真实性、合法性负责。血站仅负责审核材料的完整性，如出现伪造材料等不实情况，造成法律责任和纠纷由材料提供者承担。</li>
                                    <li>献血者本人银行账号应真实有效，报销的血费由血站统一转账至您所提供的献血者本人银行账号，请仔细核对账号信息无误。由于您单方面提供账号有误或因其他不可抗力造成款项无法及时支付，或献血者及用血者之间报销血费分配产生纠纷，血站不承担相关法律责任。</li>
                                    <li>您提供的材料经审核通过后，血站将及时为您办理报销结算，并对您提供的所有材料负有保密义务，非经血站造成的信息泄露，血站不承担相关法律责任。</li>
                                    <li>成功办理的血费报销业务，相关款项将于十个工作日内转账至您所提供的献血者银行账户，请您随时关注资金到账情况，逾期未到账请及时致电血站财务科0532-85716860问询。</li>
                                    <strong>以上内容我已仔细阅读，充分理解，责任自负。</strong>
                                </ol>
                        </Article>
                        <div>
                            
                        </div>
                    <ButtonArea direction="horizontal">
                        <Button 
                            onClick={this.handleClickPreview}
                            type="default">取消</Button>
                        <Button
                            onClick={this.handleClickNext.bind(this)}>
                            我知道了
                        </Button>
                    </ButtonArea>
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

export default Learntoknow;