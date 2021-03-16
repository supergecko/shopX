// pages/shop/shoplist.js
var app = getApp();
var page = 1;
var lng = '';
var lat = '';
var type = '';
var typelist = '';
var shoptype = '';
var typeid = 0;
var cateid = 0;
var siteurl = app.globalData.siteurl;
var catelist = true;
var sortlist = true;
var sxlist = true;
var sortid = 0;
var sendtype = 0;
var controltype = 0;
var loadshow = true;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    catelist: true,
    sortlist: true,
    sxlist: true,
    pxid:sortid,
    sendtype:sendtype,
    controltype:controltype,
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
    page = 1;
    sortid = 0;
    controltype = 0;
    sendtype = 0;
    var typename = options.typename;
    wx.setNavigationBarTitle({
      title: typename
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight-50
        });
      }
    });
    //获取店铺分类
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=typelist&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        adcode:app.globalData.adcode
      },
      success: function (ops) {
        if (ops.data.error == false) {
          var type = ops.data.msg.alllist;
          if (type.length > 0) {
            cateid = type[0].id;
          }
          that.setData({
            typelist: type,
            checkcate: cateid
          })
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
  upper: function (e) {

  },
  lower: function (e) {

  },


  scroll: function (e) {
    var query = wx.createSelectorQuery();
    query.select('.ordeing_right_title').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      res[0].top       // #the-id节点的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
    })
    // console.log(this)
    // var scrollTop = e.detail.scrollTop;
    // var scrollArr = this.data.heightArr;

    // var that = this;
    // if (scrollTop > scrollArr[scrollArr.length - 1] - this.data.height){
    //   return;
    // }else{
    //   for (var i = 0; i < scrollArr.length; i++){
    //     if (scrollTop >= 0 && scrollTop < scrollArr[0]){
    //       if(0 != this.data.lastActive){
    //         this.setData({
    //           navActive:0,
    //           lastActive:0
    //         })
    //       }
    //     } else if (scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]){
    //       if(i != this.data.lastActive){
    //         that.setData({
    //           navActive: i,
    //           lastActive: i
    //         })
    //       }
    //     }
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  checkSearch: function (e) {
    var that = this;
    var searchval = e.currentTarget.dataset.searchval;
    app.Skip('/pages/type/channelseach?typeid=' + typeid);
  },

  //点击一级分类操作
  typeOnclick: function (event) {
    // console.log(event);
    var that = this;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    that.setData({
      toView: id
    })
    var newtypelist = [];
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=typelist&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        cateid: index,
        adcode:app.globalData.adcode
      },
      success: function (ops) {
        if (!ops.data.error) {
          var typelist = ops.data.msg.alllist;
          newtypelist.push(typelist[0]);
          that.setData({
            list: [],
            checkcate: index,
            newtypelist: newtypelist
          })
        } else {
          app.showToast(ops.data.msg);
          that.setData({
            errorshow: 0,
            errormsg: ops.data.msg
          })
        }
      }
    })
  },
  //点击二级分类跳转
  sontypeOnclick: function (e) {
    var typeid = e.currentTarget.dataset.id;
    var typename = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/type/channel?typeid=' + typeid + '&typename=' + typename,
    })
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
    page = 1;
    this.setData({
      list: [],
      scrollTop: 0
    });
    loadshow = true;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})