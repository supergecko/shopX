// pages/channel/channel.js
var app = getApp();
var page = 1;
var lng = '';
var lat = '';
var shoptype = '';
var typeid = 0;
var siteurl = app.globalData.siteurl;
var sortid = 0;
var sendtype = 0;
var controltype = 0;
var sortisShow = 0;
var sxisShow = 0;
var maskShow = 0;
var sticky_top = 0;
var sortname = '综合排序';
var shaixuanname = '筛选';
var sortupdown = 'arrowdown';
var sortcolor = 'noselectcolor';
var sxcolor = 'noselectcolor';
var tname = '';
var loadshow = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseColor: '#ff6e6e', // 主体色
    classifyStyle: 1, // 分类样式：1、一行  2、两行
    classifyActive: 0, // 分类选中样式
    maskShow: 0,
    sticky_top:0,
    sortisShow: 0,
    sxisShow: 0,
    sendtype:0,
    controltype:0,
    sortname:'综合排序',
    shaixuanname:'筛选',
    sellcountname:'销量最高',
    distancename:'距离最近',
    sortupdown: 'arrowdown',
    sortcolor: 'noselectcolor',
    sxcolor: 'noselectcolor',
    shoplist: [],
    loadshow:true,
  },
  /**
   * 监听页面滚动
   */
  onPageScroll: function (e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    typeid = options.typeid;
    var tname = options.typename;
    that.setData({
      tname: tname
    })
    if (tname != ''){
      wx.setNavigationBarTitle({
        title: tname
      })
    }
    GetType(that);
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
    that.setData({
      shoplist: [],
      scrollTop: 0
    });
    GetType(that);
    page = 1;
    loadshow = true;
    GetList(that);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  //上拉加载店铺
  onReachBottom: function () {
    var that = this;
    loadshow = true;
    GetList(that);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击分类样式1
   */
  classify1Click: function (e) {
    var that =this;
    typeid= e.currentTarget.dataset.typeid
    tname = e.currentTarget.dataset.typename
    that.setData({
      classifyActive: e.currentTarget.dataset.typeid,
      shoplist: []
    });
    page = 1;
    loadshow = true;
    GetList(that)
  },
  /**
   * 点击分类样式2
   */
  classify2Click: function (e) {
    var that = this;
    typeid = e.currentTarget.dataset.typeid
    tname = e.currentTarget.dataset.typename;
    that.setData({
      classifyActive: e.currentTarget.dataset.typeid,
      shoplist:[]
    })
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //显示/隐藏店铺活动
  homelistShow: function (e) {
    var that = this;
    let data = e.currentTarget.dataset
    if (data.cxcount > 4){
      let shoplist = that.data.shoplist
      let menu = shoplist.find(function (v) {
        return v.id == data.id
      })
      if(menu.checkcx == 0){
        menu.checkcx = 1
      }else{
        menu.checkcx = 0
      }
      that.setData({
        shoplist: shoplist
      })
    }
  },
  sortShow: function(e){
    var that = this;
    sticky_top = !sticky_top
    sortisShow = !sortisShow
    maskShow = !maskShow
    if (sortisShow == false) {
      sortupdown = 'arrowup';
      sortcolor = 'selectcolor';
    } else {
      sortupdown = 'arrowdown';
      sortcolor = 'noselectcolor';
    }
    if(sxisShow){
      sticky_top = !sticky_top
      maskShow = !maskShow
      sxisShow = false;
    }
    that.setData({
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: sortupdown,
      sortcolor: sortcolor,
      sxcolor: 'noselectcolor',
      sticky_top:sticky_top,
      maskShow:maskShow
    })
  },
  //点击展示筛选列表
  sxShow: function(e){
    var that = this;
    sticky_top = !sticky_top
    sxisShow = !sxisShow
    maskShow = !maskShow
    if (sxisShow == false) {
      sxcolor = 'selectcolor';
    } else {
      sxcolor = 'noselectcolor';
    }
    if (sortisShow) {
      sticky_top = !sticky_top
      maskShow = !maskShow
      sortisShow = false;
    }
    that.setData({
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: sxcolor,
      sortcolor: 'noselectcolor',
      sticky_top:sticky_top,
      maskShow:maskShow
    })
  },
  //点击排序展示店铺列表
  sortOnclick: function (event) {
    var that = this;
    sortid = event.currentTarget.dataset.id;
    let sortname = event.currentTarget.dataset.name;
    sortisShow = false;
    sticky_top = false
    maskShow = false
    that.setData({
      shoplist: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sticky_top:false,
      maskShow:false,
    })
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //点击销量展示店铺列表
  sellcountOnclick: function(e){
    var that = this;
    sortid = e.currentTarget.dataset.id;
    if (sxisShow) {
      sxisShow = false;
    }
    if (sortisShow) {
      sortisShow = false;
    }
    sticky_top = false
    maskShow = false
    that.setData({
      shoplist: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sticky_top:false,
      maskShow:false
    })
    page = 1;
    loadshow = true;
    GetList(that)

  },
  //点击距离展示店铺列表
  juliOnclick: function(e){
    var that = this;
    sortid = e.currentTarget.dataset.id;
    let sortname = e.currentTarget.dataset.name;
    if (sxisShow) {
      sxisShow = false;
    }
    if (sortisShow) {
      sortisShow = false;
    }
    that.setData({
      shoplist: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sticky_top:false,
      maskShow:false
    })
    page = 1;
    loadshow = true;
    GetList(that)
  },
  sendtypeOnclick: function (event) {
    var that = this;
    let oldsendtype = that.data.sendtype
    sendtype = event.currentTarget.dataset.sendtype;
    if (oldsendtype == sendtype) {
      sendtype = 0;
    }
    that.setData({
      sendtype: sendtype
    })
  },
  yhhdOnclick: function (event) {
    var that = this;
    let oldcontroltype = that.data.controltype
    controltype = event.currentTarget.dataset.controltype;
    if (oldcontroltype == controltype) {
      controltype = 0;
    }
    that.setData({
      controltype: controltype
    })
  },
  clearsxOnclick: function (event) {
    var that = this;
    let sendtype = 0;
    let controltype = 0;
    that.setData({
      sendtype: sendtype,
      controltype: controltype
    })
  },
  oversxOnclick: function (event) {
    var that = this;
    sendtype = event.currentTarget.dataset.sendtype;
    controltype = event.currentTarget.dataset.controltype;
    let sortname = that.data.sortname;
    sortisShow = false
    sxisShow = false
    sticky_top = false
    maskShow = false
    that.setData({
      shoplist: [],
      pxid: sortid,
      sortisShow: false,
      sxisShow: false,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sendtype: sendtype,
      controltype: controltype,
      sticky_top:false,
      maskShow:false
    })
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  //点击搜索
  checkSearch: function (e) {
    var that = this;
    var searchval = e.currentTarget.dataset.searchval;
    app.Skip('/pages/type/channelseach?typeid=' + typeid);
  },
  //点击灰色背景隐藏购物车和规格弹窗
  maskbind: function (event) {
    var that = this;
    sortisShow = false
    sxisShow = false
    maskShow = false
    sticky_top = false
    that.setData({
      sortisShow: false,
      sxisShow: false,
      pxid: sortid,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sendtype: sendtype,
      controltype: controltype,
      maskShow:false,
      sticky_top:false
    })
  },
})
//获取分类信息
var GetType = function (that) {
  //获取二级分类信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=channelindex&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        typeid: typeid,
        adcode:app.globalData.adcode
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            showtypelist: ops.data.msg.sonlist,
            lbimglist: ops.data.msg.lblist,
            typeid: typeid,
            classifyStyle: ops.data.msg.sonstyle,
            classifyActive: typeid,
            typename: ops.data.msg.name
          })
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
}
//获取店铺列表信息
var GetList = function (that){
  app.showLoading();
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=shoplistdata&version=' + app.globalData.version + '&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      lat: app.globalData.latitude,
      lng: app.globalData.longitude,
      adcode: app.globalData.adcode,
      order: sortid,
      sendtype: sendtype,
      cxtype: controltype,
      typeid: typeid
    },
    success: function (ops) {
      if (!ops.data.error) {
        let shoplist = that.data.shoplist;
        if(ops.data.msg.shoplist.length>0){
          for (var i = 0; i < ops.data.msg.shoplist.length; i++) {
            shoplist.push(ops.data.msg.shoplist[i]);
          }
          that.setData({
            shoplist:shoplist,
            is_allow_ziti: ops.data.msg.is_allow_ziti
          })
          page++;
        }else{
          loadshow = false;
        }
        that.setData({
          loadshow: loadshow
        });
        app.hideLoading();
      } else {
        app.hideLoading();
        app.showToast(ops.data.msg);
      }
    },
    fail: function (error) {
      app.hideLoading();
      app.showToast(error);
    }
  })
}