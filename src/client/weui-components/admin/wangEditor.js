import React,{ Component }  from 'react';
var E = require('wangeditor')  // 使用 npm 安装
var E = require('./wangEditor.min')  // 使用下载的源码


var editor ='';

class WangEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
// 创建编辑器
        editor = new E('#editor');
        //关闭样式过滤
        editor.customConfig.pasteFilterStyle = false
        editor.customConfig.uploadImgServer = '/public/admin/media/uploadImg'  // 上传图片到服务器
        //editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
        // 隐藏“网络图片”tab
        editor.customConfig.showLinkImg = false;
        editor.customConfig.uploadFileName = 'imgfile'//自定义input 上传图片的 name属性值
        editor.create();
    }

    render() {
        return (
            <div>
                <div id="editor"></div>
            </div>
        );
    }
}


export {WangEditor,editor};