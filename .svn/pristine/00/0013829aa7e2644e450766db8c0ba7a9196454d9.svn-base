import React from 'react';
import { Preview, PreviewHeader, PreviewBody, 
    PreviewItem, Panel, 
    PanelHeader, PanelBody  } from 'react-weui';

class MyReaction extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            reactionlist: [],
        }
    }

    componentWillMount() {
        fetch('/db/query_reaction',
              {
                  method: 'get',
                  headers: {
                    accept: 'application/json'
              }
              }).then(response => response.json()
                .then(json => {
                    this.setState({reactionlist : json.rows});
                }));
    }

    render() {
        const reservComponent = this.state.reactionlist.map(x => (
            <div key={x[0]}>
                <Preview>
                    <PreviewHeader>
                        <PreviewItem label="联系电话" value={x[2]} />
                    </PreviewHeader>
                    <PreviewBody>
                        <PreviewItem label="创建日期" value={x[1]} />
                        <PreviewItem label="备注" value={x[3]} />
                    </PreviewBody>
                </Preview>
            </div>
        ));
        return (
            <div>
                <Panel>
                    <PanelHeader>
                        献血反应提交记录
                    </PanelHeader>
                    <PanelBody>
                        {reservComponent}
                    </PanelBody>
                </Panel>
            </div>
        )
    }
}

export default MyReaction;