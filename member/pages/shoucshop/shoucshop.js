var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userinfo = [];
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    page = 1;
    userinfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
        title: '我的收藏'
      })
    //获取用户最新信息
    that.setData({
      userinfo:userinfo
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
    that.setData({
      searchvalue:e.detail.value
    })
    page = 1;
    GetList(that);
  },
   //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    // console.log(shopid);
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  //显示/隐藏店铺活动
  homelistShow: function (e) {
    let data = e.currentTarget.dataset
    if (data.cx > 2){
      let list = this.data.list
      let menu = list.find(function (v) {
        return v.id == data.id
      })
      if (menu.checkcx == 0) {
        menu.checkcx = 1
      } else {
        menu.checkcx = 0
      }
      this.setData({
        list: list
      })

    }
  },
})
var GetList = function (that) {
  //获取店铺列表信息
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=collectshopdata&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      userid: userinfo.uid,
      lat:app.globalData.latitude,
      lng:app.globalData.longitude,
    },
    success: function (ops) {
      // console.log(ops);
      if (ops.data.msg.shoplist.length > 0){
        that.setData({
          hidden: false
        });
        var list = that.data.list;
        for (var i = 0; i < ops.data.msg.shoplist.length; i++) {
          list.push(ops.data.msg.shoplist[i]);
        }
        that.setData({
            list: list,
          });
        page++;
      }
      that.setData({
        hidden: true,
      });
    }
  })
}