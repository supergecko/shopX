var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
var page = 1;
var loadshow = true;
var grade = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    loadshow: loadshow,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    grade = 1;
    userInfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
      title: '我的下线'
    })

    //获取用户最新信息
    that.setData({
      userinfo: userInfo,
      grade: grade,
    })
    app.showLoading();
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
    wx.stopPullDownRefresh();
    page = 1;
    this.setData({
      list: [],
    });
    GetList(this);
  },
  //上拉加载店铺
  onReachBottom: function () {
    var that = this;
    app.showLoading();
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changegradetype: function (e) {
    //console.log(e);
    var that = this;
    grade = e.currentTarget.dataset.grade
    that.setData({
      grade: grade
    })
    GetList(that);
  },
})
var GetList = function (that) {
  //console.log('grade='+grade);
  //获取店铺列表信息
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=myjuniorlist&version=' + app.globalData.version + '&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: 1,
      userid: userInfo.uid,
      grade: grade
    },
    success: function (ops) {
      // console.log(ops);
      that.setData({
        distribution_grade: ops.data.msg.distribution_grade
      });
      if (ops.data.msg.memberlist.length > 0) {
        that.setData({
          hidden: false,
          list: ops.data.msg.memberlist,
        });
        page++
      } else {
        loadshow = false;
        that.setData({
          list: []
        });
      }
      app.hideLoading();
      that.setData({
        hidden: true,
        loadshow: loadshow
      });
    },
    fail: function (error) {
      app.hideLoading();
      console.log('刷新下线列表错误信息：');
      console.log(error);
    }
  })
}