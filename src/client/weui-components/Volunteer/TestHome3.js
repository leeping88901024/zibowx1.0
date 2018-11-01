import React from 'react';
import Home3 from '../Home3';

class TestHome3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render () {
        return (
            <Home3>
                <div>
                这是主要，请点击左侧功能列表。
                </div>
            </Home3>            
        )
    }
}

export default TestHome3;