import React from 'react';
import { Dialog,Button,Article,Panel,
    PanelBody,ButtonArea,
    PanelHeader } from 'react-weui';
import Question, {} from '../components//Question';
import getScore from './score';

class Examination extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            style: {
                title: "考试提示",
                buttons: [
                    {
                        label: '开始考试',
                        onClick: this.handleDialogClick.bind(this)
                    }
                ]
            },
            resultshow: false, 
            resultstyle: {
                title: "提示",
                buttons: [
                    {
                        label: '确定',
                        onClick: this.handleResultDialogClick.bind(this)
                    }
                ]
            },
            // 问题
            questions: [],
            // 分数
            score: 0,
            // 所选
            choice:{}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        fetch(
            '/db/questions',
            {
                method: 'get'
            }
        ).then(res => res.json()
        .then(json => {
            let { rows } = json;
            this.setState({questions: rows}); 
        }))
    }

    handleDialogClick() {
        this.setState({ show: false });
   }
   handleResultDialogClick() {
    this.setState({ resultshow: false });
    // 计算分数的算法待定
    // 假如现已经有分数，则，最简单的即为更具分数更新用户表，标识用户以及通过献血者的考试
    console.log('sarting fetch ...')
    if (this.state.score > 60) {
        fetch(
            '/db/updtusrv',
            {
                method: 'get'
            }
        ).then(res => res.json())
            .then(json => {
            console.log(json.message);
            this.props.history.push('/home')
            });
    }
    // 提示用户没有通过考试

  }

   handleClick(e) {
     // 输出是否是本题得正确答案
     console.log(`###################################`);
     console.log(`是不是本题的答案： ${e.target.value}`);
     // 是否选中
     console.log(`是否选中了该答案： ${e.target.checked}`);
     // 题号
     console.log(`目前在作答的题号是：${e.target.name}`);
     console.log(`###################################`);
     // 1.用户所选是否是正确答案？
     // 选择： 加分
     // 不选：减分
     //getScore();

     // 怎么保存答题结果
     // 一般评分，所选答案与正确答案对比进行评分

     // 使用它的题号作为为属性

     // 计算答对题的个数

     // 查这道题的答案

     // 变量答案 和用户所选的进行对比，这里要标识选项？？，选项的主键


     // 选错的也不影响得分，那么可以全选，则得满分。

     if(e.target.value == 1 && e.target.checked) {
         let tmp = this.state.score + 2;
         this.setState({
             score: tmp
         })
     }

     if(e.target.value == 1 && !e.target.checked) {
        let tmp = this.state.score - 2;
        this.setState({
            score: tmp
        })
    }

   }


    render() {

        const question = this.state.questions.map(x => (
            <Question 
              title={x[2]}
              key={x[0]}
              handleClick={this.handleClick}
              //question_type={x[1]}
              question_id={x[0]}
              >
              
            </Question>
        ))

        return (
            <div>
                <Panel>
                    <PanelHeader>
                        志愿者考试
                    </PanelHeader>
                    <PanelBody>
                    {question}
                    <ButtonArea>
                        <Button msg = {this.responseMsg}
                                    onClick={() => {
                                        // 显示所得分数
                                         this.setState({resultshow : true});
                                    }}>
                                    交卷
                        </Button>
                    </ButtonArea>
                    </PanelBody>
                    <Dialog 
                        type="ios" title={this.state.style.title} 
                        show={this.state.show}
                        buttons={this.state.style.buttons} >
                        <div>
                        <Article>
                            <ol>
                                <li>
                                    题目一般分为单选题、多选题和判断题。
                                </li>
                                <li>
                                    多选题中，选错，投选皆视为错误答案，部分选对和全部选对将得分。
                                </li>
                                <li>
                                    总分100分，60分以上才能通过考试。
                                </li>
                                <li>
                                    只有通过考试才能进入下一步的面试邀请环节。
                                </li>
                            </ol>
                        
                        </Article>
                        </div>
                    </Dialog>
                    <Dialog 
                        type="ios" title={this.state.resultstyle.title} 
                        show={this.state.resultshow}
                        buttons={this.state.resultstyle.buttons} >
                        <div>
                        <Article>
                            {this.state.score > 59 ? 
                            <h1>你考试得分为: {this.state.score} 分,<br /><font color='#48B541'>考试未通过</font></h1>
                            : <h1>你考试得分为: {this.state.score} 分,<br /><font color='red'>考试未通过</font></h1>}
                        </Article>
                        </div>
                    </Dialog>
                </Panel>
            </div>
        )
    }
}

export default Examination;