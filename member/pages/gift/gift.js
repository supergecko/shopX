var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var WxParse = require('../../../wxParse/wxParse.js');
var userInfo = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scoreShow:1,
    jfgzShow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userInfo = app.globalData.userInfo;
     wx.setNavigationBarTitle({
        title: '积分中心'
      })
      //获取用户最新信息
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=gift&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userInfo.uid
        },
        success: function (ops) {
          if (!ops.data.error) {
            that.setData({
              meminfo: ops.data.msg.meminfo,
               giftlog: ops.data.msg.giftlog
            })
             var jfgz = ops.data.msg.jfgz;
             WxParse.wxParse('jfgz', 'html', jfgz, that, 5);
          } else {
            app.showToast(ops.data.msg);
          }
        }
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
  showscore:function(e){
     var that = this;
     that.setData({
      scoreShow: 1,
      jfgzShow: 0
    })
  },
  showjfgz:function(e){
    var that = this;
     that.setData({
      scoreShow: 0,
      jfgzShow: 1
    })
  },
  intodhgift:function(e){
    app.Skip('../giftlist/giftlist');
  }
})