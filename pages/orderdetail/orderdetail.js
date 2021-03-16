// pages/orderdetails/orderdetails.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var orderid = 0
var shopid = 0
var shopname = ''
var shoptype = ''
var interval1;
var interval2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseColor: '#00cd85', // 主体色
    moregood: 0,
    countcontent:'',
    maphidden:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    orderid = options.orderid;
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
    clearTimeout(interval1);
    clearTimeout(interval2);
    app.showLoading();
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=orderdetail&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        orderid: orderid,
        userid: app.globalData.userInfo.uid
      },
      success: function (ops) {
        var psy = ops.data.msg.mapinfo.psy;
        var shop = ops.data.msg.mapinfo.shop;
        var user = ops.data.msg.mapinfo.user;
        if (!ops.data.error) {
          shopid=ops.data.msg.shopinfo.id
          shopname=ops.data.msg.shopinfo.shopname
          shoptype=ops.data.msg.shopinfo.shoptype
          if(ops.data.msg.order.paytype=='在线支付 (未支付)' && ops.data.msg.order.paystatus==0 && ops.data.msg.order.paytime==0&&Number(ops.data.msg.order.status)<2){
            //在线支付未付订单
            if(ops.data.msg.paytime >0){
              that.count_down(ops.data.msg.paytime);
            }
          }
          that.setData({
            latitude: user.userlat,
            longitude: user.userlng,
            markers: [{
              latitude: user.userlat,
              longitude: user.userlng,
              iconPath: '/images/icon_shou.png',
              width:30,
              height:30
            },
              {
                latitude: shop.shoplat,
                longitude: shop.shoplng,
                iconPath: '/images/order_sjwz.png',
                width: 30,
                height: 30
              }, {
                latitude: psy.psylat,
                longitude: psy.psylng,
                iconPath: '/images/psylocation_icon.png',
                width: 30,
                height: 30
              }],
            orderwuliustatus: ops.data.msg.orderwuliustatus,
            orderstatus: ops.data.msg.orderstatus,
            order: ops.data.msg.order,
            orderdet: ops.data.msg.orderdet,
            shopinfo: ops.data.msg.shopinfo,
            btnarr: ops.data.msg.btnarr,
            allowreback: ops.data.msg.allowreback,
            statusnum: ops.data.msg.statusnum,
            is_show_map: ops.data.msg.is_show_map,
            psyinfo: ops.data.msg.psyinfo,
            cxdet: ops.data.msg.order.cxdet,
          });
          app.hideLoading();
          var pages = getCurrentPages()
          var currentPage = pages[pages.length - 1]
          currentPage.refresh();
        } else {
          app.showToast(ops.data.msg);
          app.hideLoading();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(interval1);
    clearTimeout(interval2);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(interval1);
    clearTimeout(interval2);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.stopPullDownRefresh();
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    currentPage.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    currentPage.onShow();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  refresh:function(e){
    var that = this;
    interval1 = setTimeout(function(){
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      currentPage.onShow();
    } ,30000)

  },
  //拨打商家电话
  callSite: function (e) {
    var that = this;
    var shopphone = e.currentTarget.dataset.phone
    if (shopphone != '') {
      wx.makePhoneCall({
        phoneNumber: shopphone,
      })
    } else {
      app.showToast('商家暂未设置电话');
    }
  },
  //拨打配送员电话
  clearpsy: function (e) {
    var that = this;
    var psyphone = e.currentTarget.dataset.phone
    if (psyphone != '') {
      wx.makePhoneCall({
        phoneNumber: psyphone,
      })
    } else {
      app.showToast('配送员暂未设置电话');
    }
  },
  //显示更多商品
  showmoregoods: function (event) {
    var that = this;
    let moregood = event.currentTarget.dataset.more
    that.setData({
      moregood: moregood
    })
  },
    showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-in-out",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      maphidden:true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
      maphidden:false
    })

  },
  //绑定底部按钮点击事件
  bindButton: function (event) {
    var that = this;
    var data = event.currentTarget.dataset
    //1跳转到店铺页面   2执行取消订单操作   3跳转到支付页面 5跳转到退款详情页面 6跳转到申请退款页面 7跳转到评价页面 8跳转到店铺列表 9执行确认收货操作
    if (data.type == 1) {
      app.Skip('../shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype);
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
                orderid: orderid,
                userid: app.globalData.userInfo.uid
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
    } else if (data.type == 3) {
      app.Skip('../orderpay/orderpay?id=' + orderid+'&sourcetype=3');
    } else if (data.type == 5 || data.type == 6) {
      app.Skip('../refund/refund?id=' + orderid);
    } else if (data.type == 7) {
      app.Skip('../orderassess/orderassess?id=' + orderid);
    } else if (data.type == 8) {
      app.Skip('../index/index');
    } else if (data.type == 9) {
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=acceptorder&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          orderid: orderid,
          userid: app.globalData.userInfo.uid
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
  },
  count_down: function(remaintime) {
      var that = this;
      var expireMs = remaintime;
      that.setData({
         countcontent: that.date_format(expireMs),
      });
      interval2 = setTimeout(function() {
           expireMs = expireMs - 1;
           if (expireMs < 0) {
              that.setData({
                 countcontent:''
              });
              var pages = getCurrentPages()
              var currentPage = pages[pages.length - 1]
              currentPage.onShow();
              clearTimeout(interval2)
              return;
           }else{
              that.count_down(expireMs);
           }
        }, 1000)
   },
   /* 格式化倒计时 */
   date_format: function(seconds) {
      var that = this;
      //天
     // var day = that.fill_zero_prefix(Math.floor(seconds / 86400))
      //小时
      //var folur = that.fill_zero_prefix(Math.floor((seconds % 86400) / 3600))
      // 分钟位
      var min = that.fill_zero_prefix(Math.floor((seconds % 3600) / 60));
      // 秒位
      var sec = that.fill_zero_prefix(seconds % 60); // equal to => var sec = second % 60;
      console.log(111);
      return '付款剩余时间'+min+':'+sec+'，早下单早送达~';

   },
   fill_zero_prefix: function(num) {
      return num < 10 ? "0" + num : num
   },

})