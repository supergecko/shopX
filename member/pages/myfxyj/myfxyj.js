var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yjmxShow:0,
    txlogShow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userInfo = app.globalData.userInfo;
    let todaycost=0
    let allcost=0
    let cantxcost=0
    let txcost=0
    wx.setNavigationBarTitle({
        title: '我的佣金'
      })
    //获取用户最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=distribution_myyj&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userInfo.uid
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            userinfo: userInfo,
            todaycost:ops.data.msg.todaycost,
            allcost:ops.data.msg.allcost,
            cantxcost:ops.data.msg.cantxcost,
            txcost:ops.data.msg.txcost
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
  urltoYjmx:function(e){
    var that=this;
    app.Skip('../myfxyj/myfxyj_yjmx');
  },
  urltoTxlog:function(e){
     var that=this;
     app.Skip('../myfxyj/myfxyj_txlog');
  },
  intoyjtx:function(e){
     var that=this;
     app.Skip('../distribution/distribution_yjtx');
  },
})