import React from 'react';
import { FormCell, CellHeader, Form, Checkbox, CellBody } from 'react-weui';

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 备选答案，有错得，也有对的
            answers: []
        }
    }

    componentDidMount(){
        const url = '/db/examination/answers?question_id=' + this.props.question_id;
        return fetch(
            url,
            {
                method: 'post',
                headers: {
                    accept: 'application/json',
                },
            }
        ).then(res => res.json()
        .then(json => {
            //console.log(json);
            let { rows } = json;
            this.setState({answers: rows});
            //console.log(this.props.question_type);
        }));

        
    }

    

    render() {

        const answers = this.state.answers.map(
            x => (
                <FormCell checkbox key={x[0]}>
                        <CellHeader>
                            <Checkbox 
                              // 用它的name属性保存题目的类型
                              name={x[3]} 
                              onChange={this.props.handleClick}
                              //question_type={this.props.question_type}
                              value={x[2]} />
                        </CellHeader>
                        <CellBody>{x[1]}</CellBody>
                </FormCell>
            )
        )


        return (
            <div>
                <h4>{this.props.question_id}、{this.props.title}</h4>
                <Form checkbox>
                  {answers}
                </Form>
            </div>
        )
    }
}

export default Question;