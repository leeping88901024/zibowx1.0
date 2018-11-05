import React from 'react';
import ReactDOM from 'react-dom';
import WeuiRoute from './routes/index-weui';
import './css/home.css';
import './global.css';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <WeuiRoute />
     </LocaleProvider>
    ,
    document.getElementById('container')
);