var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var meminfo=[];
Page({

  /**
   * 页面的初始数据
   */
  data: {
     successcontent:'分享好友赚佣金',
     invitecode:0,
     allyjcost:0,
     allordercost:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
        title: '分销中心'
      })
    //获取用户最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=distribution_center&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: app.globalData.userInfo.uid
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            meminfo: ops.data.msg.userinfo,
            invitecode:ops.data.msg.invitecode,
            allyjcost:ops.data.msg.allyjcost,
            allordercost:ops.data.msg.allordercost
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
  urltomember:function(e){
    var that=this;
    app.reLaunchSkip('/member/pages/memcenter/memcenter');
  },
  urlToOther:function(e){
    var that=this;
    var url = e.currentTarget.dataset.url
    app.Skip(url);
  },
})