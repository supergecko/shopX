//获取应用实例
var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../libs/amap-wx.js');
var loadshow = true;
var page = 1;
var shopcat = 0;

Page({
  data: {
    hidden: true,
    scrollTop: 0,
    list:[],
    loadshow: loadshow,
   },

  onLoad: function (options) {
    var that = this;
    page = 1;
    shopcat = 0;
    wx.setNavigationBarTitle({
      title: '同城闪购'
    })
    GetType(that);
    GetList(that);
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  onShow: function () {

   },
   //监听页面滚动
  onPageScroll: function (e) {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    // wx.showToast({
    //   title: '刷新',
    //   icon: 'loading'
    // });
    wx.stopPullDownRefresh();
    // console.log("刷新");
    page = 1;
    this.setData({
      list: [],
      scrollTop: 0
    });

    if (app.globalData.latitude != '' && app.globalData.longitude != '') {
      GetList(this);
    }
  },
  //上拉加载店铺
  onReachBottom: function () {
    var that = this;
    if (app.globalData.latitude != '' && app.globalData.longitude != '') {
      GetList(that);
    }
  },
  //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    // console.log(shopid);
    app.Skip('../shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  //搜索商家或商品
  checkSearch: function () {
    var that = this;
    //console.log('history')
    app.Skip('../history/history');
  },
  //显示/隐藏店铺活动
  homelistShow: function (e) {
    let data = e.currentTarget.dataset
    if (data.cx > 1) {
      let list = this.data.list
      let menu = list.find(function (v) {
        return v.id == data.id
      })
      menu.checkcx = !menu.checkcx
      this.setData({
        list: list
      })

    }
  },
  typeOnclick:function(e){
    var that=this;
    let selectid = e.currentTarget.dataset.id
    shopcat = selectid;
    wx.pageScrollTo({
      scrollTop:0
    })
    page = 1;
    GetList(that);
  },
})


//获取分类信息
var GetType = function (that) {
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=marketshop&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      adcode: app.globalData.adcode,
    },
    success: function (ops) {
      // console.log(ops)
      if (!ops.data.error) {
        that.setData({
          goodstype: ops.data.msg.goodstype,
          lbimg:   ops.data.msg.imglist,
        })
      }
    }
  })
}
 //获取店铺列表信息
var GetList = function (that) {
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=marketlistdata&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      lat: app.globalData.latitude,
      lng: app.globalData.longitude,
      adcode: app.globalData.adcode,
      shopcat: shopcat
    },
    success: function (ops) {
      if(ops.data.error == true){
        loadshow = true;
      }else{
        if (ops.data.msg.shoplist.length > 0) {
          that.setData({
            hidden: false
          });
          var list = [];
          for (var i = 0; i < ops.data.msg.shoplist.length; i++) {
            list.push(ops.data.msg.shoplist[i]);
          }
          that.setData({
            list: list,
            shopcat:shopcat,
            page: ops.data.msg.page
          });
          page++;
        }else {
          loadshow = false;
          var list =[]
          if (ops.data.msg.page>1){
            list = that.data.list
          }else{
            list = ops.data.msg.shoplist
          }
          that.setData({
            shopcat: shopcat,
            list:list,
            page: ops.data.msg.page
          });
        }
      }
      that.setData({
        hidden: true,
        loadshow: loadshow
      });
    },
    fail: function (error) {
      // console.log(error);
    }
  })



}