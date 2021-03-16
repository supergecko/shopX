var app = getApp();
var siteurl = app.globalData.siteurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtype: 1,
    shownothing:0,
    uselist:[],
    nolist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '优惠券列表'
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
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    wx.getSystemInfo({
      success: function (res) {
        // console.info(res);
        var height = res.windowHeight;
        height = height - 75
        that.setData({
          scrollHeight: height
        });
      }
    });
    if (app.globalData.userInfo != null) {
        wx.request({
          url: siteurl + '/index.php?ctrl=applet&action=juanlist&version='+app.globalData.version+'&datatype=json',
          header: { 'Content-Type': 'application/json' },
          data: {
            userid: app.globalData.userInfo.uid
          },
          success: function (ops) {
            // console.log(ops);
            if (!ops.data.error) {
              var shownothing = 0;
              if ( ops.data.msg.list.length <= 0){
                shownothing = 1;
              }
              that.setData({
                uselist: ops.data.msg.list,
                nolist: ops.data.msg.nouselist,
                shownothing: shownothing
              });
            }
          }
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
  //点击展示 已失效/可使用 列表
  typeOnclick: function (event) {
    var that = this;
    var showtype = event.currentTarget.dataset.type;
    var shownothing = 0;
    var uselist = that.data.uselist;
    var nolist = that.data.nolist;
    if ( (uselist.length <= 0 && showtype == 1) || (nolist.length <= 0 && showtype == 2) ) {
      shownothing = 1;
    }
    that.setData({
      showtype: showtype,
      shownothing: shownothing
    })
  },
  //点击跳转
  urlOnclick: function (event) {
    var goUrl = event.currentTarget.dataset.url;
    if (goUrl == 'orderlist') {
      app.reLaunchSkip('../' + goUrl + '/' + goUrl);
    } else {
      app.Skip('../' + goUrl + '/' + goUrl);
    }
  },
})