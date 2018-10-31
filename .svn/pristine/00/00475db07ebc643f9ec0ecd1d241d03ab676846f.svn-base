import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState,RichUtils} from 'draft-js';
import {Button } from 'antd';
import "./richText.css";

class DrEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    }
    toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    componentDidMount() {

    }
    render() {
        return (
            <div style={{border:'solid 1px #f6f8fa',backgroundColor:'#f6f8fa'}}>
            <div><Button onClick={() => {this.toggleInlineStyle('BOLD')}}>Bold</Button></div>
            <div style={{padding:'1vw',backgroundColor:'#FFFFFF'}} ><Editor   ref="editor"editorState={this.state.editorState} onChange={this.onChange} /></div>
            </div>
        );
    }
}



export  {DrEditor};