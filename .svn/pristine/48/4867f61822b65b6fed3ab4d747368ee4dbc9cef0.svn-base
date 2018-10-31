/*
对数据库查询出来的数据进行处理
* */
var rowsData = {
    toMap:function(metaData,rows){

        if(!metaData || !rows){
            return null;
        }

        var data = new Array();
        var result = '';
        for(var i in rows){
            for(var j in rows[i]){
                if(rows[i].length == 1){
                    result = "{\""+metaData[j].name+"\":"+JSON.stringify(rows[i][j])+"}";
                }else{
                    if (j == 0){
                        result = "{\""+metaData[j].name+"\":"+JSON.stringify(rows[i][j])+",";
                    }else if(j == rows[i].length -1 ){
                        result += "\""+metaData[j].name+"\":"+JSON.stringify(rows[i][j])+"}";
                    }else{
                        result += "\""+metaData[j].name+"\":"+JSON.stringify(rows[i][j])+","
                    }
                }
            }
            data[i] = result;
            result = '';
        }
        return data;
    }
}

module.exports=rowsData;