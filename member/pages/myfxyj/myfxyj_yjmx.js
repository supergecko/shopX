var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
var page = 1;
var loadshow = true;
var searchvalue='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    mxdetShow:0,
    loadshow: loadshow,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    userInfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
        title: '佣金明细'
      })
    //获取用户最新信息
    that.setData({
      userinfo:userInfo
    })
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
    wx.showToast({
      title: '刷新',
      icon: 'loading'
    });
    wx.stopPullDownRefresh();
    // console.log("刷新");
    page = 1;
    this.setData({
      list: []
    });
    loadshow = true;
    GetList(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  checksearchval:function(e){
    var that=this;
    searchvalue = e.detail.value;
    page = 1;
    loadshow = true;
    GetList(that);
  },
  clearsearchval:function(e){
    var that=this;
    searchvalue = '';
     page = 1;
    loadshow = true;
    GetList(that);
  },
})
var GetList = function (that) {
  //获取店铺列表信息
  console.log('searchvalue='+searchvalue);
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=yjloglist&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      userid: userInfo.uid,
      searchvalue: searchvalue
    },
    success: function (ops) {
      // console.log(ops);
      if (ops.data.msg.loglist.length > 0){
        that.setData({
          hidden: false
        });
        var list  = that.data.list;
          for (var i = 0; i < ops.data.msg.loglist.length; i++) {
            list.push(ops.data.msg.loglist[i]);
          }
        that.setData({
          list: list
        });
        page++;
      }else{
        loadshow = false;
        that.setData({
          list: [],
          hidden: true,
          loadshow: loadshow
        });
      }

    },
    fail: function (error) {
      console.log('刷新佣金列表错误信息：');
      console.log(error);
    }
  })
}