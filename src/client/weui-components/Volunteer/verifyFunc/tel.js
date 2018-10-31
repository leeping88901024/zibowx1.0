function isTelphoneNumber(telNum) {
    if (telNum.length != 11) {
        return false;
    }
    let CM_NUM = "^((13[4-9])|(147)|(15[0-2,7-9])|(17[8])|(18[2-4,7-8]))\\d{8}|(170[5])\\d{7}$";
    let CU_NUM = "^((13[0-2])|(145)|(15[5-6])|(17[156])|(18[5,6]))\\d{8}|(170[4,7-9])\\d{7}$";
    let CT_NUM = "^((133)|(149)|(153)|(17[3,7])|(18[0,1,9]))\\d{8}|(170[0-2])\\d{7}$";

    let isMatch_CM = telNum.match(CM_NUM); // 匹配移动     
    let isMatch_CU = telNum.match(CU_NUM); // 匹配联通     
    let isMatch_CT = telNum.match(CT_NUM); // 匹配电信

    if (isMatch_CM || isMatch_CT || isMatch_CU) {
        return true;
    }
    return false;
}

export default isTelphoneNumber;