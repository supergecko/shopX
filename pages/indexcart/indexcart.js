// pages/indexcart/indexcart.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../libs/amap-wx.js');
var cartinfo = [];
var carts = [];
var userInfo = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartempty:0,
    shoplist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '购物车'
    })
    wx.setStorageSync('ordersource','2');
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      backpage:2
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
  onShow: function (){
    var that=this;
    if(app.checkLogin()){
      app.showLoading();
      userInfo = app.globalData.userInfo
      that.setData({
        userInfo:userInfo
      })
      carts = wx.getStorageSync('wmrcart')
      if (carts.length > 0) {
        let cartempty = 1
        var cartdata = JSON.stringify(carts);
        wx.request({
          url: siteurl + '/index.php?ctrl=applet&action=index_cart&version=' + app.globalData.version + '&datatype=json',
          data: { cartdata },
          header: { 'Content-Type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          success: function (ops) {
            //console.log(ops);
            if (!ops.data.error) {
              that.setData({
                cartinfo: ops.data.msg.cartinfo,
                cartempty:cartempty,
              })
            } else {
              app.showToast(ops.data.msg);
            }
          }
        })
      } else{
        let cartempty = 0
        wx.request({
          url: siteurl + '/index.php?ctrl=applet&action=indexcartshop&version=' + app.globalData.version + '&datatype=json',
          header: {'Content-Type': 'application/json'},
          method: 'GET',
          data: {
            userid:userInfo.uid,
            lat:app.globalData.latitude,
            lng:app.globalData.longitude,
            adcode:app.globalData.adcode
          },
          success: function (ops) {
            if (!ops.data.error){
              that.setData({
                cartempty:cartempty,
                shoplist:ops.data.msg.shoplist
              })
            } else {
              app.showToast(ops.data.msg);
            }
          }
        })
      }
      setTimeout(function () {
       app.hideLoading();
     } ,1000)
    }else{
      that.setData({
        userInfo:'',
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
  indexskip: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    var num = e.currentTarget.dataset.num;
    if (num == 1) {
      app.reLaunchSkip(url)
    } else if (num == 2) {
      that.onLoad();
    } else if (num == 3) {
      app.Skip(url)
    } else {
      app.Skip(url)
    }
  },
  tomakeorder:function(e){
    var that = this;
    var shopid = e.currentTarget.dataset.shopid;
    app.Skip('/pages/placeorder/placeorder?id='+shopid);
  },
   //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    // console.log(shopid);
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  clearShopcart:function(e){
    var shopid = e.currentTarget.dataset.shopid;
    var that = this;
    var newcart = [];
    if (carts.length > 0) {
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].id != shopid){
          newcart.push(carts[i]);
        }
      }
    }
    wx.showModal({
      title: '删除商家',
      content: '确认要删除该商家的所有商品',
      showCancel: true,//是否显示取消按钮
      cancelText: "取消",//默认是“取消”
      cancelColor: '#666666',//取消文字的颜色
      confirmText: "删除",//默认是“确定”
      confirmColor: '#00cd85',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          app.showToast("清空该店铺购物车成功");
          wx.setStorageSync('wmrcart', newcart);
          that.onShow();
        }
      },
      fail: function (res) {
        app.showToast("清空该店铺购物车失败");
      },//接口调用失败的回调函数
    })
  },
  clearAllcart:function(e){
    var that = this;
    var newcart = [];
    wx.showModal({
      title: '删除商家',
      content: '确定清空购物车所有商品？',
      showCancel: true,//是否显示取消按钮
      cancelText: "取消",//默认是“取消”
      cancelColor: '#666666',//取消文字的颜色
      confirmText: "确定",//默认是“确定”
      confirmColor: '#00cd85',//确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          app.showToast("清空购物车成功");
          wx.setStorageSync('wmrcart', newcart);
          that.onShow();
        }
      },
      fail: function (res) {
        app.showToast("清空购物车失败");
      },//接口调用失败的回调函数
    })
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      that.onShow();
    })
  },
  homelistShow: function (e) {
    var that = this;
    let data = e.currentTarget.dataset
    if (data.cxcountx > 4) {
      let shoplist = that.data.shoplist
      let menu = shoplist.find(function (v) {
        return v.id == data.id
      })
      if (menu.checkcx == 0) {
        menu.checkcx = 1
      } else {
        menu.checkcx = 0
      }
      console.log(shoplist);
      that.setData({
        shoplist: shoplist
      })

    }
  },
})