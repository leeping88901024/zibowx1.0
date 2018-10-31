import React from "react";
import {Article} from "react-weui";
import 'react-weui/build/packages/react-weui.css';
import {editor} from "../admin/wangEditor";


class WxArticleLook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            author:'',
            digest:''
        }
    }
    componentDidMount(){
        //获取文章id
        const paramsString = this.props.location.search.substring(1);
        const searchParams = new URLSearchParams(paramsString);
        const id = searchParams.get('id')
        var  ids = 62;

        //加载文章
        //根据id查询文章
        fetch('/public/admin/media/loalMediaById?id='+ids ,{credentials: "include",headers:{token:window.localStorage.getItem("token")}})
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson.status === 200){
                    console.log("我是加载出来的文章"+responseJson.data);
                    var artiles = JSON.parse(responseJson.data);
                    //填充编辑框
                    this.setState({
                        title:artiles.TITLE,
                        author: artiles.AUTHOR,
                        digest:artiles.DIGEST
                    });

                    var document_content = document.getElementById("content");
                    document_content.innerHTML = artiles.CONTENT;

                }else{
                    console.log(responseJson.message);
                }
            }).catch(function(error){
            console.log("加载文章列表失败！"+error)
        })
    }

    render() {
        return (
            <Article>
                <h1 style={{fontWeight: 400}} >{this.state.title}</h1>
                <section>
                    <h2 className="title"> <a style={{color:'#576b95'}}>{this.state.author}</a></h2>
                    <section style={{marginTop:'4vh'}} >
                        <p style={{
                            textIndent: '2em',
                            display: 'block',
                            color: '#333',
                            fontSize: '17px',
                            textAlign: 'justify'
                        }} id="content" ></p>
                    </section>
                </section>
            </Article>
        )
    }
}

export  {WxArticleLook};