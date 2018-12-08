chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	var cook;
//	删除大鱼号隐藏的cookie
		if (request.greeting == "plant"){
			chrome.cookies.getAll({'domain':'mpids.uc.cn'},function(cookies){
				console.log(cookies);
				if(cookies){
					for(var i=0;i<cookies.length;i++){
						chrome.cookies.remove({
						'url': 'http://mpids.uc.cn',
						'name': cookies[i].name
						}, function() {
								console.log('删除成功')
						});
					}
				}
		  })
			chrome.cookies.getAll({'domain':'mpids.uc.cn'},function(cookies){
				console.log(cookies);
		 })
		}
//获取当前页cookie
    if (request.greeting == "hello"){
	      chrome.cookies.getAll({'url':sender.url},function(cookies){
	      	cook = JSON.stringify(cookies);
	      	localStorage.setItem('data',cook);
	      })
	      var cookie = localStorage.getItem('data');
	      sendResponse({fare:cookie});
    }
  });


