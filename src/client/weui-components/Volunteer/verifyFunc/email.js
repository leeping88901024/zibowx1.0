function checkEmail(myemail){
    　　var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
     
    　　if(myReg.test(myemail)){
    　　　　return true;
    　　}else{
    　　　　return false;
    }
}

export default checkEmail;