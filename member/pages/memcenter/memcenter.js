var app = getApp();
var siteurl = app.globalData.siteurl;
var userInfo = '';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(app.checkLogin()){
      var userid = app.globalData.userInfo.uid
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=updateuserinfo&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userid,
        },
        success: function(ops){
          if (!ops.data.error){
            app.globalData.userInfo = ops.data.msg.userinfo
            wx.setStorageSync('userInfo',ops.data.msg.userinfo);
            userInfo = ops.data.msg.userinfo
            that.setData({
              userInfo:userInfo,
              open_distribution:ops.data.msg.open_distribution,
              open_shangou:app.globalData.open_shangou,
              open_paotui:app.globalData.open_paotui,
              memimg: ops.data.msg.memimg
            })
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      that.setData({
        userInfo:'',
        open_distribution:app.globalData.open_distribution,
        open_shangou:app.globalData.open_shangou,
        open_paotui:app.globalData.open_paotui
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  indexskip: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    var num = e.currentTarget.dataset.num;
    if (num == 1) {
      app.reLaunchSkip(url);
    } else if (num == 2) {
      that.onLoad();
    } else if (num == 3) {
      app.Skip(url);
    } else {
      app.Skip(url);
    }
  },
  urlother:function(e){
    var that = this;
    var url = e.currentTarget.dataset.url;
    if(url=='/member/pages/shopsettled/shopsettled'){
      if(Number(userInfo.shopid)>0){
        if(Number(userInfo.is_pass)>0){
          app.showToast('您已入驻成功，请登录商家端管理店铺');
          return false;
        }else{
          app.showToast('您已提交入驻申请，正在审核中');
          return false;
        }
      }else{
        app.Skip(url);
      }
    }else{
      app.Skip(url);
    }
  },
  callSite:function(e){
    var that = this;
    var sitephone = app.globalData.sitephone
    if(sitephone!=''){
      wx.makePhoneCall({
        phoneNumber: sitephone,
      })
    }else{
      app.showToast('网站暂未设置客服电话');
    }

  },
   bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      that.onShow();
    })
  },
})