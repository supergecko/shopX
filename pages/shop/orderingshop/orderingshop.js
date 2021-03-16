var app = getApp();
var siteurl = app.globalData.siteurl;
var WxParse = require('../../../wxParse/wxParse.js');
var shopid = 0;
var shoptype = 0;
var shopname = '';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_showimg:0,
    img_box_list:[],
    maskshow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shopid = options.id;
    shoptype = options.shoptype;

    //获取店铺顶部评价信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=getdetailinfo&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        shopid: shopid,
        lat: app.globalData.latitude,
        lng: app.globalData.longitude
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          shopname = ops.data.msg.shopinfo.shopname;
          wx.setNavigationBarTitle({
            title: shopname
          })
          that.setData({
            shopinfo: ops.data.msg.shopinfo,
            shopreal:ops.data.msg.shopreal,
            shopstart: ops.data.msg.shopstart,
            shopdet: ops.data.msg.shopdet,
            psinfo: ops.data.msg.psinfo,
            cxlist:ops.data.msg.cxlist,
            is_allow_ziti: ops.data.msg.is_allow_ziti,
          })
          var intr_info = ops.data.msg.shopinfo.intr_info;
          WxParse.wxParse('intr_info', 'html', intr_info, that, 5);
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
  //点击顶部切换菜单
  topOnclick: function (event) {
    var goUrl = event.currentTarget.dataset.url;
    // console.log(goUrl);
    if (goUrl==='shop'){
      app.redirectSkip('/pages/' + goUrl + '/' + goUrl + '?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype);
    }else{
      app.redirectSkip('/pages/shop/' + goUrl + '/' + goUrl + '?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype);
    }
    
  },
  reportShop:function(e){
    var that = this;
    app.Skip('/pages/shop/reportshop/reportshop?shopid='+shopid);
  },
  telShop:function(e){
    var that =this;
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  showImgBox:function(e){
    var that = this;
    let img_box_list = e.currentTarget.dataset.imglist
    that.setData({
      is_showimg:1,
      img_box_list:img_box_list,
      maskshow:1
    })
  },
  hideImg:function(e){
    var that = this;
    that.setData({
      is_showimg:0,
      img_box_list:[],
      maskshow:0
    })
  },
})