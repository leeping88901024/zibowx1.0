import React from 'react';
// import { Progress, Page } from 'react-weui';
import { Progress, WingBlank, WhiteSpace } from 'antd-mobile';

class MyProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percent: 50,
        }
    }

    // 当前的报销进度该是对用户，没有对用户提交的表单
    // 报销进度百分百怎么来
    // 状态

    render() {
        return (
            <div>
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
                    您当前的报销进度：
                </WingBlank>
                <WhiteSpace size="lg" />
                <WingBlank size="lg">
                    <div className="progress-container">
                            <div className="show-info">
                                <div className="progress"><Progress percent={this.state.percent} position="normal" /></div>
                                <div aria-hidden="true">{this.state.percent}%</div>
                            </div>
                    </div>
                </WingBlank>
              
            {/** <Progress value='75' /> */}
            </div>
        )
    }
}

export default MyProgress;