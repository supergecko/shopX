//app.js
App({
  onLaunch: function () {
    var that = this
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //获取网站配置信息
      wx.request({
        url: that.globalData.siteurl + '/index.php?ctrl=applet&action=getconfig&version='+that.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {},
        success: function (ques) {
          if (!ques.data.error) {
            that.globalData.appid = ques.data.msg.appid
            that.globalData.secret = ques.data.msg.secret
            that.globalData.mapKey = ques.data.msg.mapkey
            that.globalData.sitename = ques.data.msg.sitename
            that.globalData.sitedesc = ques.data.msg.sitedesc
            that.globalData.sitephone = ques.data.msg.sitephone
            that.globalData.is_applet_examine = ques.data.msg.is_applet_examine
            that.globalData.applet_url = ques.data.msg.applet_url
          }else {
            that.showToast(ques.data.msg);
          }
        }
      })
  },
  globalData:{
    siteurl: 'https://www.fjdq.vip',
    version: '9_1',
    userInfo:null,
    adcode: null,
    latitude:null,
    longitude: null,
    address: null,
    appid:null,
    secret: null,
    mapKey: null,
    open_shangou:0,//新增
    open_paotui:0,//新增
    sitephone:null,//新增
    is_applet_examine:null,//新增
    applet_url:null,//新增
  },
  //加载中
  showLoading: function (text = '加载中...') {
    wx.showLoading({
      title: text,
      mask: 'true'
    })
  },

  //加载完成
  hideLoading: function () {
    wx.hideLoading();
  },
  //页面跳转
  Skip: function (url) {
    wx.navigateTo({
      url: url
    })
  },
  reLaunchSkip: function (url) {
    wx.reLaunch({
      url: url
    })
  },
  redirectSkip: function (url) {
    wx.redirectTo({
      url: url
    })
  },
  showToast:function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      duration:2000
    })
  },
  checkLogin:function(){
    //检测登录，优先检测全局变量
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    if(that.globalData.userInfo==null){
      if(userInfo==null || userInfo=='' || userInfo==undefined){
        return false;
      }else{
        that.globalData.userInfo = userInfo;
        return true;
      }
    }else{
      if(userInfo==null || userInfo=='' || userInfo==undefined){
        wx.setStorageSync('userInfo',that.globalData.userInfo);
      }
      return true;
    }
  },
  getUserInfo:function(cb){
    var that = this;
    wx.getSetting({
     success: function(data) {
        if(data){
          if (data.authSetting["scope.userInfo"] == true) {
            wx.login({
              success: function (loginres) {
                wx.getUserInfo({
                  success: function (res) {
                    let wxuserinfo = res.userInfo
                    //获取网站用户信息
                    wx.request({
                      url: that.globalData.siteurl + '/index.php?ctrl=applet&action=setwxlogin&version='+that.globalData.version+'&datatype=json',
                      header: { 'Content-Type': 'application/json' },
                      data: {
                        appid: that.globalData.appid,
                        secret: that.globalData.secret,
                        code: loginres.code,
                        gender: wxuserinfo.gender,
                        nickName: wxuserinfo.nickName,
                        avatarUrl: wxuserinfo.avatarUrl
                      },
                      success: function (ops) {
                        // console.log(ops);
                        if (!ops.data.error) {
                          that.globalData.userInfo = ops.data.msg.userinfo;
                          wx.setStorageSync('userInfo',ops.data.msg.userinfo);
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        }else{
                          that.showToast(ops.data.msg);
                        }
                      }
                    })
                  }
                })
              }
          })
        }
      }
    },
    fail: function(){
      app.showToast("设置失败返回数据");
      }
    })

  },
})