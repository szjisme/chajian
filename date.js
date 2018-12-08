$(function(){
	var arr = [];
	var uName = getCookieValue("uName");
	$('.name').html(uName);
//	以下为搜索框以及百家号等点击事件
	$('body').on('click','.kind-list span',function(){
		$(this).addClass('active').siblings().removeClass('active');
	})
    $('#search-btn').click(function(){
		$(".search-box").show("slow");
		$('.kind-list').css('overflow-x','hidden');
		$('.keywords').focus();
	});
	function showhide(){
		$(".search-box").hide("slow");
		$('.keywords').val('');
		$('.kind-list').css('overflow-x','scroll')
	}
	$('.keywords').blur(function(){
		showhide();
	})
	$('.clear-btn').click(function(){
		showhide();
	})
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

//	渲染账号列表
	function accountList(data){
			var _html = '';
			var arr = [];
			if(typeof data=='string'){
				var arrlist = JSON.parse(data);
				console.log(arrlist);
				for(var i = 0;i<10;i++){
					arr.push(arrlist[i])
				}
				console.log(arr);
				var data = arr;
			}else{
				var data = data;
			}
			for(var i = 0;i<data.length;i++){
				if(data[i].nickname != 'undefined'){
					_html+="<li><a data-id=\""+data[i].id+"\" data-href=\""+data[i]['terrace']['link']+"\" data-uname=\""+data[i].username+"\"><span>"+data[i].id+".</span><img src=\'"+data[i].avatar+"\' /><div><h5>"+data[i].nickname+"</h5><p class=\"contact ellipsis\">"+data[i].username+"</p><p class=\"kind\">账号类型: <span>"+data[i]['terrace']['name']+"</span></p></div></a></li>"
				}
			}
			$('#tb').html('');
			$('#tb').html(_html);
	}
	var accessToken = getCookieValue("accessToken");
//	以下为读取账号列表
    var val = localStorage.getItem('myData');
    function dataCenter(){
    	$.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/accounts",
			data: {
				AUTHORIZATION: accessToken
			},
			async:false,
			success: function (data) {
				if(data.code == 40001){
					deleteCookie('accessToken');
					console.log(accessToken);
					self.location.replace("popup.html");
					return false;
				};
				var _data = data.data;
				arr = _data;
				var databox = JSON.stringify(_data);
				localStorage.setItem("myData",databox);
				accountList(arr); //重新渲染
			},
			error: function (msg) {
				alert('身份过期，请重新登录!')
			}
		});
    }
//  获取数据cookie,如果存在先行读取cookie
    if(val){
    	console.log(val);
    	accountList(val);
    	setTimeout(function(){
    		dataCenter();
    	},300)
    }else{
    	dataCenter();
    }
//	数据筛选
	$('.kind-list span').click(function(){
		var name = $(this).data('name');
		var ttdata = [];//存放趣头条数据
		var bjhdata = [];//存放百家号数据
		var yudata = [];//存放大鱼号数据
		var qqdata = [];//存放企鹅号数据
		var tthdata =[];//存放头条号数据
		var ydhdata =[];//存放一点号数据
		var kcdata =[];//存放快传号数据
		var qqkddata =[];//存放QQ看点数据
		for(var i=0;i<arr.length;i++){
			if(arr[i]['terrace']['name']=="百家号"){
				bjhdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="趣头条"){
				ttdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="大鱼号"){
				yudata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="企鹅号"){
				qqdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="头条号"){
				tthdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="一点号"){
				ydhdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="快传号"){
				kcdata.push(arr[i]);
			}else if(arr[i]['terrace']['name']=="QQ看点"){
				qqkddata.push(arr[i]);
			}
		}
		if(name == '百家号'){
			accountList(bjhdata)
		}else if(name == '趣头条'){
			accountList(ttdata)
		}else if(name == '大鱼号'){
			accountList(yudata)
		}else if(name == '企鹅号'){
			accountList(qqdata)
		}else if(name == '头条号'){
			accountList(tthdata)
		}else if(name == '一点号'){
			accountList(ydhdata)
		}else if(name == '快传号'){
			accountList(kcdata)
		}else if(name == 'QQ看点'){
			accountList(qqkddata)
		}
	});
//	关键词搜索
    var nameVal;
    $(".keywords").on("input",function(){
    	nameVal=$(this).val();
    	nameArr=name(nameVal,arr);
		accountList(nameArr)
	})
	function name(nameVal,arr){
		var nameArr=[];
		console.log(nameVal);
		for(var i=0;i<arr.length;i++){
			if(PinyinMatch.match(arr[i].nickname,nameVal)){
				nameArr.push(arr[i]);
				console.log(nameArr);
			}
		}
		return nameArr
	}
	$('body').on('click','#tb a',function(){
		var data_id = $(this).data('id').toString();
		var link = $(this).data('href');
		var myname = $(this).data('uname');
		var uname = $.trim(myname);
//		存储cookie之前率先删除原网页cookie值
		chrome.cookies.getAll({url:link},function(cookies){
			for(var i=0;i<cookies.length;i++){
				if(cookies[i].name == 'dataid' ||cookies[i].name == 'mykey' ||cookies[i].name == 'username'){
					
				}else{
					chrome.cookies.remove({
					'url': link,
					'name': cookies[i].name
					}, function() {
	//					alert('设置cookie成功！')
					});
				}
			}
		})
//		存储请求密码所需参数
		chrome.cookies.set({
			'url':link,
			'name':'dataid',
			'value':data_id,
		}, function() {
//			alert('设置cookie成功！')
		});
		chrome.cookies.set({
			'url':link,
			'name':'mykey',
			'value':accessToken,
		}, function() {
//			alert('设置cookie成功！')
		});
		chrome.cookies.set({
			'url':link,
			'name': 'username',
			'value': uname,
		}, function() {
//			alert('设置cookie成功！')
		});
//		如果为大鱼号,向跨域iframe存储cookie
		if(link.indexOf("dayu") >= 0){
			chrome.cookies.set({
				'url':'https://api.open.uc.cn',
				'name':'dataid',
				'value':data_id,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://api.open.uc.cn',
				'name':'mykey',
				'value':accessToken,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://api.open.uc.cn',
				'name': 'username',
				'value': uname,
			}, function() {
	//			alert('设置cookie成功！')
			});
		}
//		如果为头条号,另行存储cookie
		if(link.indexOf("toutiao") >= 0){
			chrome.cookies.set({
				'url':'https://sso.toutiao.com',
				'name':'dataid',
				'value':data_id,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://sso.toutiao.com',
				'name':'mykey',
				'value':accessToken,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://sso.toutiao.com',
				'name': 'username',
				'value': uname,
			}, function() {
	//			alert('设置cookie成功！')
			});
		}
//		如果为QQ看点,向跨域iframe存储cookie
		if(link.indexOf("mp.qq.com") >= 0){
			chrome.cookies.set({
				'url':'https://xui.ptlogin2.qq.com',
				'name':'dataid',
				'value':data_id,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://xui.ptlogin2.qq.com',
				'name':'mykey',
				'value':accessToken,
			}, function() {
	//			alert('设置cookie成功！')
			});
			chrome.cookies.set({
				'url':'https://xui.ptlogin2.qq.com',
				'name': 'username',
				'value': uname,
			}, function() {
	//			alert('设置cookie成功！')
			});
		}
		$.ajax({
			type: "GET",
			dataType: 'json',
			url: "https://api.fxb-team.com/v1/accounts/cookie",
			data: {
				AUTHORIZATION: accessToken,
				account_id:data_id
			},
			success: function (data) {
				if(data.code == 400){
					alert('身份过期，请重新登录!');
					self.location.replace("popup.html");
					return false;
				}else if(data.code == 0){
					var _data = data.data.cookie;
	//				存储cookie
					if(_data){
//						if(link.indexOf("mp.qq.com") >= 0){
//							//QQ看点通过请求密码登录
//						}else{
							for(var i=0;i<_data.length;i++){
								chrome.cookies.set({
									'url': link,
									'name': _data[i].name,
									'value': _data[i].value,
								}, function() {
	//								alert('设置cookie成功！')
								});
							}	
//						}
						chrome.tabs.create({
				              'url':link,
				              'selected':true,  
				        })
					}else{
//						requstPwd(data_id,link,uname);
					}
				}else{
					chrome.tabs.create({
			          'url':link,
			          'selected':true,  
			        });
				}
			},
			error: function (msg) {
				console.log(msg);
			}
		});
	})
    $('.loginout').click(function(){
        var message = "你确认要退出吗？";
        dialogBox(message,
            function () {
                var n = getCookieValue("uName");
                console.log(n);
                deleteCookie("uName",'/');
                console.log(getCookieValue("uName"))
                window.opener=null;
				window.open('','_self');
				window.close();
            },
            function(){
                console.log("canceled");
                // do something
            }
        );
    });
    function dialogBox(message, yesCallback, noCallback){
        if(message){
            $('.dialog-message').html(message);
        }
        // 显示遮罩和对话框
        $('.wrap-dialog').removeClass("hide");
        // 确定按钮
        $('#confirm').click(function(){
            $('.wrap-dialog').addClass("hide");
            yesCallback();
        });
        // 取消按钮
        $('#cancel').click(function(){
            $('.wrap-dialog').addClass("hide");
            noCallback();
        });
    }
})