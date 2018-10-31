import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Link from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
// import RightContent from './RightContent';

class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    //this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    //const { collapsed, isMobile, logo } = this.props;
    return (
      <div>
        

        {/*
        <RightContent {...this.props} />
         */}
      </div>
    );
  }
}
export default GlobalHeader;
