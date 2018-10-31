import React from "react";
import {Toast,Gallery,GalleryDelete,Cell,Uploader,CellsTitle,Button, CellBody, CellFooter, CellHeader, Form, FormCell, Input, Label, Select} from "react-weui";
import 'react-weui/build/packages/react-weui.css';


class DnrReactionFedb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){
    }

    render() {
        return (
            <div>
                <CellsTitle>献血反应反馈</CellsTitle>
            </div>
        )
    }
}

export  {DnrReactionFedb};