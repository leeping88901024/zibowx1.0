/**
 * 创建form令牌 防止表单重复提交
 * @type {{createToken, decodeToken, checkToken}}
 */
var token = require('../user/token');
var fs = require('fs');

//生成token
var n_token = token.createToken({item:'form'},7200);
//保存到文件
fs.writeFile('../commonFile/formtoken.txt',n_token, function (err) {
   if(err){
       console.log(err);
   }
   console.log("token保存成功！")
});