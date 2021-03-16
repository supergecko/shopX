var app = getApp();
var siteurl = app.globalData.siteurl;
var userinfo = ''
var page = 1;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    maskShow:0,
    showpop_up:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '跑腿订单'
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
    if(app.checkLogin()){
      userinfo = app.globalData.userInfo
    }
    app.showLoading();
    page = 1;
    that.setData({
      list: [],
      userinfo: userinfo
    });
    GetList(that);
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
    app.showLoading();
    wx.stopPullDownRefresh();
    page = 1;
    that.setData({
      list: []
    });
    GetList(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
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
  //一键拨号
  callmeTap: function (event) {
    let phonenum = event.currentTarget.dataset.num;
    wx.makePhoneCall({
      phoneNumber: phonenum
    })
  },
    //关闭弹窗
  maskbind: function (event) {
    var that = this;
    that.setData({
     showpop_up:0,
      maskShow: 0
    })
  },
  close_draw:function(e){
    var that=this;
    that.setData({
      showpop_up: 0,
      maskShow: 0
    })
  },
  closepop_up:function(e){
    var that = this;
    that.setData({
     showpop_up:0,
      maskShow: 0
    })
  },
  //绑定底部按钮点击事件
  bindButton: function (event) {
    var that = this;
    let data = event.currentTarget.dataset;
    //1再来一单、2取消订单(未支付)、3取消订单(已付)、4申请退款、5立即支付、6退款详情 7评价订单
    if(data.type == 1){
      wx.navigateBack();
    } else if (data.type == 2) {
      wx.showModal({
        title: '取消订单操作',
        content: '确认取消订单？',
        confirmColor:'#00cd85',
        success (res) {
          if (res.confirm) {
            wx.request({
              url: siteurl + '/index.php?ctrl=applet&action=userunorder&version='+app.globalData.version+'&datatype=json',
              header: { 'Content-Type': 'application/json' },
              data: {
                orderid: data.id,
                userid: userinfo.uid
              },
              success: function (ops) {
                if (!ops.data.error) {
                  var pages = getCurrentPages()
                  var currentPage = pages[pages.length - 1]
                  currentPage.onShow();
                } else {
                  app.showToast(ops.data.msg);
                }
              }
            })
          }
        }
      })
    } else if (data.type == 3 || data.type == 6) {
      app.Skip('../refund/refund?id=' + data.id);
    } else if (data.type == 4) {
      that.setData({
        showpop_up: 1,
        maskShow:1
      })
    } else if (data.type == 5) {
      app.Skip('../orderpay/orderpay?id=' + data.id+'&sourcetype=2');
    }else if (data.type == 7) {
      app.Skip('../orderassess/orderassess?id=' + data.id);
    }
  } ,
  //订单详情
  infoptOrder: function (event) {
    let id = event.currentTarget.dataset.id;
    app.Skip('../paotuidetail/paotuidetail?id=' + id);
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      currentPage.onShow();
      that.setData({
        userinfo: userInfo
      })
    })
  }
})


var GetList = function (that) {
  //获取订单列表信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=userptorder&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        page: page,
        userid: userinfo.uid
      },
      success: function (ops) {
        var list = that.data.list;
        if (ops.data.msg.ptorderlist.length > 0) {
          for (var i = 0; i < ops.data.msg.ptorderlist.length; i++) {
            list.push(ops.data.msg.ptorderlist[i]);
          }
        }
        that.setData({
          list: list,
          callphone:ops.data.msg.callphone,
        });
        app.hideLoading();
        page++;
      },
      fail: function (error) {
        app.hideLoading();
        app.showToast(error);
      }
    })
}