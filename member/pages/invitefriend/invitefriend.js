// pages/member/member.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '邀请好友'
    })
    that.setData({
      siteurl: app.globalData.siteurl,
      version: app.globalData.version
    })
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
    if (app.checkLogin('/pages/member/member')) {
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=invitefriend&uid=' + app.globalData.userInfo.uid +'&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid:app.globalData.userInfo.uid
        },
        success: function (ops) {
          // console.log(ops)
          if(ops.data.msg.checkinfosendjuan==0){
            wx.hideShareMenu();
          }
          if (!ops.data.error) {
            wx.getSystemInfo({
              success: function (res) {
                that.setData({
                  windowHeight: res.windowHeight
                });
              }
            });
			var avtrule = ops.data.msg.shareinfo.avtrule;
            WxParse.wxParse('avtrule', 'html', avtrule, that, 5);
            that.setData({
              shareinfo: ops.data.msg.shareinfo,
              bigimg: ops.data.msg.shareinfo.bigimg,
              img: ops.data.msg.shareinfo.img,
              actcolor: ops.data.msg.shareinfo.actcolor,
              color: ops.data.msg.shareinfo.color,
              key: ops.data.msg.jiamiuidkey,
              checkinfosendjuan:ops.data.msg.checkinfosendjuan
            })
          } else {
            app.showToast(ops.data.msg);
          }
        }
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
    var that = this;
    // console.log(that.data.key)
    let checkinfosendjuan = that.data.checkinfosendjuan
    if(checkinfosendjuan==1){
      var title = that.data.shareinfo.title
      var desc = that.data.shareinfo.describe
      var img = that.data.shareinfo.img
      var key = that.data.key
      return {
        title: title,
        desc: desc,
        path: 'member/pages/sharejuan/sharejuan?key=' + key // 路径，传递参数到指定页面。
      }
    }
  },
})