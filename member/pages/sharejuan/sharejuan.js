// pages/member/member.js
var app = getApp();
var siteurl = app.globalData.siteurl;

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
    // console.log(that)
    var key = that.options.key
    if (app.checkLogin('/pages/member/member')) {
      var userid = app.globalData.userInfo.uid
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=sharejuan&key=' + key + '&version=' + app.globalData.version + '&datatype=json',
        success: function (ops) {
          console.log(ops)
          if (!ops.data.error) {
            var shareinfo = ops.data.msg.shareinfo
            var bigimg = ops.data.msg.shareinfo.bigimg
            var img = ops.data.msg.shareinfo.img
            var actcolor = ops.data.msg.shareinfo.actcolor
            var color = ops.data.msg.shareinfo.color
            var avtrule = ops.data.msg.shareinfo.avtrule
            that.setData({
              shareinfo: shareinfo,
              bigimg: bigimg,
              img: img,
              actcolor: actcolor,
              color: color,
              avtrule: avtrule
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
    
  },
  formSubmit: function (e) {
    var that = this;
    // console.log(e);
    // console.log(that.data.tabsActive);
    let formData = []
    formData['phone'] = e.detail.value.phone;
    formData['uid'] = app.globalData.userInfo.uid;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=sharelqjuan&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        // let shopphone = ops.data.msg.shopphone
        // let shopname = ops.data.msg.shopname
        // let shopaddress = ops.data.msg.shopaddress
        // let cityid = ops.data.msg.cityid
        // let shoptype = ops.data.msg.shoptype
        // let shoplicense = ops.data.msg.shoplicense
        // console.log(ops);
        if (!ops.data.error) {
          app.showToast("领取成功");
          app.Skip('/pages/member/member');
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})