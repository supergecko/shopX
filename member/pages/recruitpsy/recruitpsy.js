// pages/recruit/recruit.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var type = 2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    address: '',
    city: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '骑手招募'
    })
    that.setData({
      siteurl: app.globalData.siteurl,
      version: app.globalData.version
    })
    //获取当前最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=recruitpsy&version=' + app.globalData.version + '&datatype=json',
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            content: ops.data.msg.content
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
  formSubmit: function (e) {
    var that = this;
    let formData = []
    formData['phone'] = e.detail.value.phone;
    formData['city'] = e.detail.value.city;
    formData['address'] = e.detail.value.address;
    formData['type'] = 2;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=saveapply&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        if (!ops.data.error) {
          app.showToast("提交成功");
          setTimeout(function(){
            app.reLaunchSkip('/member/pages/memcenter/memcenter');
          },300);
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})