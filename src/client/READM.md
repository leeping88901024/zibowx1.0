用户操作流程：
if(localStorage.opneid) {
    => 主页面(Home)
    => if(logout){
        => clear localstorage.openid
        => 登录界面
    } else {
        => 其他后续操作
    }
} else {
    => 登录界面
}