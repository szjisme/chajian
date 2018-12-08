// 新建cookie。
// hours为空字符串时,cookie的生存期至浏览器会话结束。
// hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。
function setCookie(name,value,days,path){
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + days*24*60*60*1000);
    path = path == "" ? "" : ";path=" + path;
    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
} 
 
//获取cookie值
function getCookieValue(name){
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie
    var allcookies = document.cookie; 
	
    //查找名为name的cookie的开始位置
    name += "=";
    var pos = allcookies.indexOf(name);    
    //如果找到了具有该名字的cookie，那么提取并使用它的值
    if (pos != -1){                                          
        var start = pos + name.length;                 
        var end = allcookies.indexOf(";",start);      
        if (end == -1) end = allcookies.length;        
        var value = allcookies.substring(start,end);  
        return unescape(value);                                 
        }  
    else return "";                                             
}
 
//删除cookie
function deleteCookie(name,path){
    var name = escape(name);
    var expires = new Date(0);
    path = path == "" ? "" : ";path=" + path;
    document.cookie = name + "="+ ";expires=" + expires.toUTCString() + path;
}
$(function(){
	var uName = getCookieValue("uName");
	var num = document.cookie.indexOf("uName=");
	var cook = getCookieValue("accessToken");
//	alert(uName);
	if(num !== -1){
		if(cook){
			setCookie("accessToken",cook,3,"/");  
		    setCookie("uName",uName,3,"/"); 
			self.location.replace("date.html");
		}
	}
	//写入点击事件
	$("#btnlogin").click(function(){
		var uName = $("#userName").val();
		var pwd = $("#password").val();
		$.ajax({
	            type: "post",
	            url: 'https://api.fxb-team.com/v1/user/login',
	            data: JSON.stringify({
				    "username": uName,
				    "password": pwd,
				}),
				async:false,
	            contentType : "application/json",
	            dataType : "json",
	            success:function(data){
	            	console.log(data);
	            	if (data.code != 0) {
	                    $('.pwdtit').show().delay(2000).hide(100);
	                    return false;
	                }
	            	accessToken = data.data.access_token;
	            	setCookie("accessToken",accessToken,3,"/");  
	            	setCookie("uName",uName,3,"/"); 
	          		self.location.replace("date.html");
	            },
	            error:function(){
	            	alert('用户名或密码错误！')
	            }
	    });
	});
	$("body").keydown(function(event) {
	 if (event.keyCode == "13") {//keyCode=13是回车键
	    $("#btnlogin").click();
	 }
	}); 
})

