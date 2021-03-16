//获取应用实例
var app = getApp();
var page = 1;
var siteurl = app.globalData.siteurl;
var loadshow = true;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadshow: loadshow,
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '通知'
    })
    page = 1;
    loadshow = true;
    GetList(that);
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
    var that = this;
    wx.stopPullDownRefresh();
    page = 1;
    that.setData({
      list: []
    });

    GetList(that);
  },

  /**
   * 上拉加载
   */
  onReachBottom: function () {
    var that = this;
    GetList(that);
  },

  /**
   * 点击跳转通知详情
   */
  checkNotice: function (event) {
    var id = event.currentTarget.dataset.id;
    app.Skip('../notice-details/notice-details?id=' + id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


/**
 * 获取通知列表信息
 */
var GetList = function (that) {
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=noticelist&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      adcode: app.globalData.adcode
    },
    success: function (ops) {
      // console.log(ops)
      if (ops.data.error == true){
        loadshow = true;
      } else {
        if (ops.data.msg.noticelist.length > 0) {
          that.setData({
            hidden: false
          });
          var list = that.data.list;
          for (var i = 0; i < ops.data.msg.noticelist.length; i++) {
            list.push(ops.data.msg.noticelist[i]);
          }
          that.setData({
            list: list
          });
          page++;
        }else{
          loadshow = false;
        }
      }

      that.setData({
        hidden: true,
        loadshow: loadshow
      });

    },
    fail: function (error) {

    }
  })



}