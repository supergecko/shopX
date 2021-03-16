var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
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
    userInfo = app.globalData.userInfo;
     wx.setNavigationBarTitle({
        title: '积分兑换'
      })
    //获取用户最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=giftlist&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        adcode: app.globalData.adcode
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            userinfo: userInfo,
            giftlist: ops.data.msg.giftlist,
            lunboimg: ops.data.msg.lunboimg
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
  urltogiftlog:function(e){
    var that = this;
    app.Skip('../giftlist/giftlog');
  },
  urltogiftdetail:function(e){
    var that = this;
    let id=e.currentTarget.dataset.id
    app.Skip('../giftlist/giftdetail?id='+id);
  },
  startfuihuan:function(e){
    var that = this;
    let id=e.currentTarget.dataset.id
    let score=e.currentTarget.dataset.score
    let stock=e.currentTarget.dataset.stock
    if(id>0){
      if(Number(app.globalData.userInfo.score) < Number(score)){
        app.showToast('积分不足！');
      }
      if(Number(stock) < 1){
        app.showToast('兑换商品库存不足');
      }else{
        app.Skip('../giftlist/dhgift?id='+id);
      }
    }
  }
})