import 'whatwg-fetch';

export default {

	// API 调用
	requestApi: function(payload) {
		// const { url, data } = payload;

		// return fetch(url, {
		// 	method: 'post',
		// 	headers: {
		// 	'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //   },
    //   credentials: 'include',
    //   body: data
		// })
		// .then(response => response.json())
		// .then(data => data);
		return payload;
	},

	// cookie操作
	getCookie: function(name) {
		const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
		if (arr && arr.length > 2) {
			return decodeURIComponent(arr[2]);
		} else {
			return null;
		}
	},

	setCookie: function(name, value) {
		const Days = 30;
		const exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		// document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + '; path=/';
		document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()};path=/`;
	},

	delCookie: function(name) {
		const exp = new Date();
		exp.setTime(exp.getTime() - 1);
		const cval = this.getCookie(name);
		if (cval != null) document.cookie = `${name}=${cval};expires=${exp.toGMTString()}; path=/`;
		// if (cval != null) document.cookie = name + '=' + cval + '; expires=' + exp.toGMTString() + '; path=/';
	}
};
