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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;
   var giftid = options.id;
    userInfo = app.globalData.userInfo;
     wx.setNavigationBarTitle({
        title: '积分兑换详情'
      })
      //获取用户最新信息
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=giftdetail&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          giftid: giftid
        },
        success: function (ops) {
          if (!ops.data.error) {
            that.setData({
              userinfo: userInfo,
              giftinfo:ops.data.msg.giftinfo
            })
             var content = ops.data.msg.giftinfo.content;
             WxParse.wxParse('content', 'html', content, that, 5);
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
   startduihuan:function(e){
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