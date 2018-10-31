import React from 'react';
import { Icon } from 'antd';

export default {
  UserName: {
    props: {
      size: 'large',
      prefix: <Icon type="user" />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: '请您输入用户名!',
      },
    ],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <Icon type="lock"/>,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: '请您输入用户密码!',
      },
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <Icon type="mobile"/>,
      placeholder: '手机号码',
    },
    rules: [
      {
        required: true,
        message: '请输您入手机号码!',
      },
      {
        pattern: /^1\d{10}$/,
        message: '错误的手机号码格式!',
      },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <Icon type="mail"/>,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码！',
      },
    ],
  },
};
