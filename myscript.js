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
//因"坑爹"百家号登录页一直处于等待响应的加载阶段，导致"页面加载完成函数"无法执行，特执行以下函数
var _href = window.location.href;
if(_href.indexOf("baijiahao") >= 0 ){
	var baijianame = getCookieValue('username');
	var baijiaid = getCookieValue('dataid');
	var baijiaToken = getCookieValue("mykey");
	var baijiapwd;
	var box = document.querySelector('.index-btn-login');
	if (box != null){
		window.location.replace("https://baijiahao.baidu.com/builder/app/login");
	}
    var login = document.querySelector('.tang-pass-footerBarULogin');
    var suggestionList = document.querySelector('.pass-suggestion-list');
    if(suggestionList != null && suggestionList != undefined){
	    document.querySelector('.pass-suggestion-list').remove();
    }
    if (login != null) {
        login.click();
        $.ajax({
			type:"get",
			url:"https://api.fxb-team.com/v1/accounts/password",
			async:false,
			data: {
				AUTHORIZATION: baijiaToken,
				account_id:baijiaid
			},
			success:function(data){
				console.log(data);
				baijiapwd = data.data.code;
			}
		});
        var username = document.querySelector('#TANGRAM__PSP_4__userName');
        var password = document.querySelector('#TANGRAM__PSP_4__password');
        var submit = document.querySelector("#TANGRAM__PSP_4__submit");
        username.value = baijianame;
        password.value = baijiapwd;
        submit.click();
	}
}
	
$(function(){
	var url = window.location.href;
	var pwd;
	var host = window.location.host;
	var accessToken = getCookieValue("mykey");
	var cookiebox;
	var strCookie;
	var warehouse;
	var dataid = getCookieValue('dataid');
	var usernamev = getCookieValue('username');
	chrome.runtime.sendMessage({greeting: "plant"}, function(response) {
					  	  
	});
//	谷歌通信返回数据与当前不同步,设置定时器,请求一致后再赋予用于发送cookie的strCookie值
	if(host.indexOf("api.open.uc.cn") >= 0 ){
		
	}else{
		var timer = setInterval(function(){
		  chrome.runtime.sendMessage({greeting: "hello"}, function(response){
		  	  warehouse = '';
			  warehouse = response.fare;
		  });
		  var part = JSON.parse(warehouse);
		   for(var i = 0;i<part.length;i++){
				if(part[i].name == 'dataid'){
					if(part[i].value != dataid){
						return false;
					}else{
						console.log('相等');
						window.clearInterval(timer);
						strCookie = warehouse;
					}
				}
			}
		},500)
	}
//	登录成功后执行发送cookie函数
	function cookieData(){
		var arrData = [];
		if(cookiebox == strCookie){
			return false;
		}else{
			cookiebox = strCookie;
			var parselist = JSON.parse(cookiebox);
			for(var i = 0;i<parselist.length;i++){
				var obj ={};
				obj.name = parselist[i].name;
				obj.value = parselist[i].value;
				obj.domain = parselist[i].domain;
				if(obj.name=='mykey'){
					
				}else{
				  arrData.push(obj);
				}
			}
			var data = JSON.stringify(arrData);
			console.log(data);
//			发送cookie
//			$.ajax({
////            url:'https://api.fxb-team.com/v1/accounts/set-cookie',
//              type:'post',
//              data:data,
//              success:function (data) {
//					console.log('发送成功！')
//              },
//              error:function(){
//              }
//          })
		}
}
	function pwd(){ //请求密码
		var data_id = getCookieValue("dataid");
		console.log(data_id);
		$.ajax({
			type:"get",
			url:"https://api.fxb-team.com/v1/accounts/password",
			async:false,
			data: {
				AUTHORIZATION: accessToken,
				account_id:data_id
			},
			success:function(data){
				console.log(data);
				pwd = data.data.code;
			}
		});
	}
//	大鱼号iframe跨域
	if(host.indexOf("api.open.uc.cn") >= 0 ){
		pwd();
		var username = document.querySelector('#login_name');
        var password = document.querySelector('#password');
        var submit = document.querySelector("#submit_btn");
        username.value = usernamev;
        username.dispatchEvent(new Event('input'));

        password.type = 'password';
        password.value = pwd;
        password.dispatchEvent(new Event('input'));
        submit.click();
    }
//	QQ看点跨域
	if(host.indexOf("xui.ptlogin2.qq.com") >= 0 ){
		var btn = document.querySelector(".switcher_plogin");
		if(btn != null){
	        btn.click();
		}
		pwd();
        var username = document.querySelector('input[name=u]');
        var password = document.querySelector('input[name=p]');
        var submit = document.querySelector('#login_button');
        if (username !== null) {
            username.value = usernamev;
            username.dispatchEvent(new UIEvent('change'));
            var tip = document.querySelector('#uin_tips');
            if (tip) {
                tip.style = "display:none;"
            }
            password.value = pwd;
            if (!submit) {
                return
            }
            setTimeout(function () {
                submit.click();
            }, 400);
        }
        
    }
	if(host.indexOf("qutoutiao") >= 0){ //趣头条
		var href = top.location.href;
		pwd();
		var login = document.querySelector('.login-box');
		if(login != null){
			var username = login.querySelector('.el-form-item:nth-child(1) input');
		    var password = login.querySelector('.el-form-item:nth-child(2) input');
		    var submit = login.querySelector('#submit-login');
			username.value = usernamev;
			username.dispatchEvent(new Event('input'));
			password.value = pwd;
			password.dispatchEvent(new Event('input'));
			submit.click();
		}
		setInterval(function(){
			$.ajax({
				type: "GET",
				dataType: 'json',
				url: "https://api.fxb-team.com/v1/user/info",
				data: {
					AUTHORIZATION: accessToken
				},
				async:false,
				success: function (data) {
					var _data = data.data;
					if(!_data.role){
						var intervalId = setInterval(function () {
				            var income = document.querySelector('.icon-7');
				            if (income != null) {
				                income.parentNode.parentNode.style.display = 'none';
				
				                if (document.querySelector('.information:nth-child(1)')) {
				                    document.querySelector('.information:nth-child(1)').style.display = 'none';
				                }
				
				                clearInterval(intervalId);
				            }
				        }, 500);
					}
				},
				error: function (msg) {
				}
			});
		},100);
		setInterval(function () {
            if (document.querySelector('.logout') != null) {
               cookieData()
            }
        }, 500);
	}else if(host.indexOf("baijiahao") >= 0){ //百家号
			$.ajax({
				type: "GET",
				dataType: 'json',
				url: "https://api.fxb-team.com/v1/user/info",
				data: {
					AUTHORIZATION: accessToken
				},
				async:false,
				success: function (data) {
					var _data = data.data;
					console.log(_data);
					if(!_data.role){
						var intervalId = setInterval(function () {
				            var income = document.querySelector('.bjh-icon-spread');
				            if (income != null) {
				                income.parentNode.parentNode.style.display = 'none';
				                clearInterval(intervalId);
				            }
				        }, 500);
					}
				},
				error: function (msg) {
				}
			});
			setInterval(function () {
	            if (document.querySelector('.name') != null) {
	            	cookieData();
	            }
	        }, 500);
	}else if(host.indexOf("dayu") >= 0){ //大鱼号
		 console.log(usernamev);
		 $.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
					 var intervalId = setInterval(function () {
			            var income = document.querySelector('.wm-icon-money');
			            if (income != null) {
			                income.parentNode.parentNode.style.display = 'none';
			
			                clearInterval(intervalId);
			            }
			        }, 500);
				}
			},
			error: function (msg) {
			}
		});
		setInterval(function () {
            if (document.querySelector('.name') != null) {
            	cookieData()
            }
        }, 500);
		setInterval(function () {
            if (document.querySelector('.name') != null) {
            	cookieData();
            }
        }, 500);
	}else if(host.indexOf("om.qq.com") >= 0){ //企鹅号
		pwd();
		console.log(usernamev);
		var btn = document.querySelector(".other-type");
		if(btn != null){
			btn.click();
		}
		var login = document.querySelector('.loginForm');
        if (login != null) {
            var username = document.querySelector('.email-input');
            var password = document.querySelector('.password-input');
            var submit = document.querySelector(".btnLogin");

            username.value = usernamev;
            password.value = pwd;
            submit.click();
        };
        setInterval(function () {
            if (document.querySelector('.name') != null) {
            	cookieData()
            }
        }, 500);
        $.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
					 var intervalId = setInterval(function () {
			            var income = document.querySelector('.icon-menu-adv').parentNode.parentNode.parentNode;
			            if (income != null) {
			                income.style.display = 'none';
			
			                clearInterval(intervalId);
			            }
			        }, 500);
				}
			},
			error: function (msg) {
			}
		});
	}else if(host.indexOf("toutiao") >= 0){ //头条号
		pwd();
		var btn = document.querySelector(".i3");
		if(btn != null){
			btn.click();
		}
		var login = document.querySelector('.baseLogin');
        if (login != null) {
            var username = document.querySelector('#account');
            var password = document.querySelector('#password');
            var submit = document.querySelector(".action-btn");
            username.value = usernamev;
            password.value = pwd;
            clearcookie();
            submit.click();
        }
        setInterval(function () {
            if ($('.new_user_name span').html() != null) {
            	cookieData()
            }
        }, 500);
        $.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
		            var income = document.querySelector('.tui2-menu-container');
		            if (income != null) {
		                $(".tui2-menu-container").find('a').each(function () {
		                    if ($(this).attr('href') == '/profile_v3/index/income-overview' || $(this).attr('href') == '/profile_v3/index/checkout-center' || $(this).attr('href') == '/profile_v3/xigua/income-analysis') {
		                        $(this).parent('li').hide();
		                    }
		                });
		
		            }
				}
			},
			error: function (msg) {
			}
		});
	}else if(host.indexOf("mp.qq.com") >= 0){ //QQ看点
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
					setInterval(function () {
			            var income = document.querySelector('.icon_nav_revenue');
			            if (income != null) {
			                income.parentNode.parentNode.parentNode.style.display = 'none';
			
			                clearInterval(intervalId);
			            }
			        }, 500);
				}
			},
			error: function (msg) {
			}
		});
		setInterval(function () {
            if (document.querySelector('.header_name') != null) {
            	cookieData()
            }
        }, 500);
		
	}else if(host.indexOf("kuaichuan") >= 0){  //快传号
		pwd();
		var btn = document.querySelector('.top_content a:nth-child(2)');
		if(btn != null){
			btn.click();
		}
		var theEvent = document.createEvent('MouseEvent');
        var test = document.querySelector('.quc-sign-in-nav a:nth-child(2)');
        theEvent.initMouseEvent('click', true, true, window, 0, 202, 302, 0, 0, false, false, false, false, 0, null);
        if (test) {
            test.dispatchEvent(theEvent);
        }
        var login = document.querySelector('.quc-mod-normal-sign-in .quc-form');
        if (login != null) {
            var username = login.querySelector('.quc-input-account');
            if (username) {
                var password = login.querySelector('.quc-input-password');
                var submit = login.querySelector('.quc-button-sign-in');
                if (username !== null) {
                    username.value = usernamev;
                    password.value = pwd;
                    submit.click();
                }
            }
        }
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
					setInterval(function () {
			            var income = document.querySelector('.profit-part');
			            var incomebody = document.querySelector('.profit-partbody');
			            if (income != null) {
			                income.style.display = 'none';
			                incomebody.style.display = 'none';
			            }
			        }, 500);
				}
			},
			error: function (msg) {
			}
		});
		setInterval(function () {
            if (document.querySelector('.user-name') != null) {
            	cookieData()
            }
        }, 500);
		
	}else if(host.indexOf("yidian") >= 0){  //一点号
		pwd();
		var btn = document.querySelector(".mp-btn");
		if(btn != null){
			btn.click();
		}
		var root = document.querySelector('.content');
        if (root != null) {
        	setTimeout(function(){
        		var username = document.querySelector('input[name=username]');
	            var password = document.querySelector('input[name=password]');
	            var submit = document.querySelector("button[type=submit]");
	            username.value = usernamev;
	            username.dispatchEvent(new Event('input'));
	            password.value = pwd;
	            password.dispatchEvent(new Event('input'));
	            submit.click();
        	},300)
        }
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/user/info",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				var _data = data.data;
				if(!_data.role){
					setInterval(function () {
			            var income = document.querySelector('.menu-settlement');
			            if (income != null) {
			                income.style.display = 'none';
			            }
			        }, 500);
				}
			},
			error: function (msg) {
			}
		});
		setInterval(function () {
            if (document.querySelector('.user-name') != null) {
            	cookieData()
            }
        }, 500);
	}

})