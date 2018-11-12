import React from 'react';
import { Dialog,Button,Article,Panel,
    PanelBody,ButtonArea,
    PanelHeader } from 'react-weui';
import Question, {} from '../components//Question';

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
            arr: [],
            // 分数
            score: 0
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

   }

   handleClick(e) {
     var isc = e.target.value.substr(0,1);
     var qid = e.target.value.substr(1,e.target.value.length);

     if(e.target.checked) {
         this.state.arr.push({ 
             aid: e.target.name, // <选项编号>
             isc: isc,  // <是否本题正确答案>
             qid: qid  // <题目编号>
         });
     } else {
         var tmp =this.state.arr.filter(x => x.aid != e.target.name);
         this.setState({arr: tmp})
     }

   }


    render() {

        const question = this.state.questions.map(x => (
            <Question 
              title={x[2]}
              key={x[0]}
              handleClick={this.handleClick}
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
                                        /*
                                        记分算法
                                        */
                                       var tmp = 0; // 记分总和
                                       for (let index = 0; index < this.state.questions.length; index++) {
                                           var cnt = 0; // 计算它答对的个数
                                           var currcnt = 0; // 正确答案个数
                                           var currscore = 0; // 原题分数
                                           const question = this.state.questions[index]; // 题目
                                           for (let index = 0; index < this.state.arr.length; index++) {
                                               const singlechoise = this.state.arr[index];
                                               // 同一道题
                                               if (singlechoise.qid == question[0]) {
                                                   var score = 0; // 本题分数
                                                   currcnt = question[4];
                                                   currscore = question[3];
                                                   if (singlechoise.isc == 0) {
                                                       currcnt = -666;
                                                       break;
                                                   }
                                                   if ( singlechoise.isc == 1) {
                                                       cnt ++;
                                                   }
                                               }
                                           }
                                           if (cnt == 0 || cnt > currcnt) { score = 0; }
                                           if (cnt == currcnt) {
                                               score = currscore;
                                           }else {
                                                if (currcnt != -666) {
                                                    score = currscore/2;
                                                }
                                           }
                                            tmp += score;  
                                       }
                                       this.setState({score: tmp});
                                       this.setState({resultshow: true});
                                        // console.log(tmp);
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