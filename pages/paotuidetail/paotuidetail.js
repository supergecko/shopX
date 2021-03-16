var app = getApp();
var siteurl = app.globalData.siteurl;
var userinfo = []
var orderinfo = []
var orderid = 0


Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_showdetail:0,
    is_showstatus:1,
    maskShow:0,
    showpop_up:0,
    maphidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    orderid = options.id;
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
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=paotuidetail&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          orderid: orderid,
          userid: userinfo.uid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
            orderinfo = ops.data.msg.order
            that.setData({
              orderwuliustatus: ops.data.msg.orderwuliustatus,
              orderinfo:orderinfo,
              callphone:ops.data.msg.callphone
            });
          } else {
            app.showToast(ops.data.msg);
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
  //点击切换订单详情
  statusShow: function (event) {
    var that=this;
    that.setData({
      is_showstatus: 1,
      is_showdetail:0
    })
  },
  //点击切换订单状态
  detailShow: function (event) {
    var that=this;
    that.setData({
      is_showstatus: 0,
      is_showdetail:1
    })
  },
  //点击跳转展示地图
  showMap: function (event) {
    app.Skip('../ordermap/ordermap?id=' + orderid);
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
      maskShow: 0,
      maphidden:false
    })
  },

  closepop_up:function(e){
    var that = this;
    that.setData({
     showpop_up:0,
      maskShow: 0,
      maphidden:false
    })
  },
  //绑定底部按钮点击事件
  bindButton: function (event) {
    var that = this;
    let data = event.currentTarget.dataset;
    //1再来一单、2取消订单(未支付)、3取消订单(已付)、4申请退款、5立即支付、6退款详情 7评价订单
    if(data.type == 1){
      wx.navigateBack({
        delta: 2
      })
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
                  var option = { id: orderid }
                  currentPage.onLoad(option);
                } else {
                  app.showToast(ops.data.msg);
                }
              }
            })
          }
        }
      })
    } else if (data.type == 3 || data.type == 6) {
       app.Skip('../refund/refund?id=' + orderid);
    } else if (data.type == 4) {
      that.setData({
        showpop_up: 1,
        maskShow:1,
        maphidden:true,
      })
    } else if (data.type == 5) {
      app.Skip('../orderpay/orderpay?id=' + orderid+'&sourcetype=3');
    }else if (data.type == 7) {
      app.Skip('../orderassess/orderassess?id=' + orderid);
    }
  }
})