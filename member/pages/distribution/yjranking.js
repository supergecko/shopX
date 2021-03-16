var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    selfranking:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userInfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
        title: '佣金排名'
      })
     wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=yjranking&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userInfo.uid
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            meminfo:ops.data.msg.meminfo,
            list:ops.data.msg.newlist,
            selfranking:ops.data.msg.selfranking
          })
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
})