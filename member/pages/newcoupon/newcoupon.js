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
      title: '添加优惠券'
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
  //确认提交
  formSubmit: function (e) {
    var that = this;
    let formData = e.detail.value
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=exchangjuan&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: app.globalData.userInfo.uid,
        card: formData.card,
        password: formData.password
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          wx.navigateBack();
        } else {
          // console.log(ops.data.msg);
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})