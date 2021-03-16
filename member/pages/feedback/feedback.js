// pages/feedback/feedback.js
var app = getApp();
var siteurl = app.globalData.siteurl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseColor: '#00cd85',
    tabsActive: 0,
    problem:'',
    suggestion: '',
  },

  tabsClick: function (e) {
    this.setData({
      tabsActive: e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(app);
    wx.setNavigationBarTitle({
      title: '意见反馈'
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
    formData['problem'] = e.detail.value.problem;
    formData['suggestion'] = e.detail.value.suggestion;
    formData['typeid'] = that.data.tabsActive+1;
    formData['userid'] = app.globalData.userInfo.uid;

    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=savesuggestion&version=' + app.globalData.version + '&datatype=json',
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