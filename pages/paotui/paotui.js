//获取应用实例
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var siteurl = app.globalData.siteurl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pttype:2,
    helpbuyHide:1,
    helpmoveHide:0,
    helpbuyinfo:[],
    helpmoveinfo:[],
    searchVal:'',
    weightShow:0,
    costShow:0,
    weightlist:[],
    costlist:[],
    weight:'1kg',
    cost:'100元以下'
  },
 /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '跑腿服务'
    })
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=paotui&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
        },
        success: function (ops) {
          if (!ops.data.error) {
            let helpbuyinfo = ops.data.msg.helpbuyinfo
            let helpmoveinfo = ops.data.msg.helpmoveinfo
            let helpbuyHide = 1
            let helpmoveHide = 0
            let weightlist = ops.data.msg.weightlist
            let costlist = ops.data.msg.costlist
            if(helpmoveinfo.length >0){
               var selectid = helpmoveinfo[0].id;
               var movegood = helpmoveinfo[0].name;
            }
            that.setData({
              helpbuyinfo: helpbuyinfo,
              helpmoveinfo: helpmoveinfo,
              helpmoveHide:helpmoveHide,
              helpbuyHide:helpbuyHide,
              weightlist:weightlist,
              costlist:costlist,
              checkid:selectid,
              movegood:movegood
            });
          } else {
            app.showToast(res.data.msg);
          }
        }
      })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //点击登录
  loginOnclick: function (event) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      let backinfo = { id: shopid }
      that.onLoad(backinfo);
      that.onReady();
    })
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
changeType:function(event){
   var that = this;
   let pttype = event.currentTarget.dataset.pttype
   //console.log(pttype);
   that.setData({
      pttype:pttype
    })
},
//获取输入框的值
  inputVal: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  //点击跑腿订单进入跑腿订单列表
  urltoptorder: function(e){
    var that = this;
    app.Skip('../ptorder/ptorder');
  },
   //点击帮我买进入跑腿
  buymeOnclick: function (e) {
    var that = this;
    let pttype = e.currentTarget.dataset.pttype
    let searchname = that.data.searchVal
    if(searchname==''|| searchname==undefined){
      app.showToast('请输入商品名');
      return
    }else{
      app.Skip('../pthelpme/pthelpme?pttype=' + pttype + '&searchname=' + searchname);
    }
  },
    //点击帮我买下各分类进入跑腿
  helpbuyOnclick: function (e) {
    var that = this;
    let pttype = e.currentTarget.dataset.pttype
    let id = e.currentTarget.dataset.id
    app.Skip('../pthelpme/pthelpme?pttype=' + pttype + '&id=' + id);
  },
  //点击帮我送下各分类
 movegoodOnclick: function (e) {
    var that = this;
    let movegood = e.currentTarget.dataset.name
    let checkid =  e.currentTarget.dataset.id
    that.setData({
      movegood: movegood,
      checkid:checkid,
    })
  },
  //点击帮我送进入跑腿
  helpgiveOnclick: function (e) {
    var that = this;
    let pttype = e.currentTarget.dataset.pttype
    let cost = e.currentTarget.dataset.cost
    let movegood = e.currentTarget.dataset.movegood
    let weight = e.currentTarget.dataset.weight
    //console.log('pttype='+pttype);
   // console.log('cost='+cost);
   // console.log('movegood='+movegood);
   // console.log('weight='+weight);
   app.Skip('../pthelpme/pthelpme?pttype=' + pttype + '&movegood=' + movegood+ '&cost=' + cost+ '&weight=' + weight);
  },
  //点击重量显示弹窗
  showWeight: function () {
    var that = this;
    that.setData({
      costShow:0,
      weightShow: 1,
      scrollTop: 0
    })
  },
   //点击价钱显示弹窗
  showCost: function () {
    var that = this;
    that.setData({
      weightShow:0,
      costShow: 1,
      scrollTop: 0
    })
  },
  closeMask:function(){
      var that = this;
      that.setData({
      weightShow:0,
      costShow: 0,
    })
  },
  choiceWeight:function(event){
       var that = this;
      let weight = event.currentTarget.dataset.weight
      that.setData({
      weight:weight,
      weightShow: 0,
    })
  },
   choiceCost:function(event){
       var that = this;
       let cost = event.currentTarget.dataset.cost
      that.setData({
        cost:cost,
        costShow: 0,
    })
  },
})