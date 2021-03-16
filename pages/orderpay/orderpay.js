//获取应用实例
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var orderid = 0;
var siteurl = app.globalData.siteurl;
var userinfo = []
var shoptype = 0;
var sourcetype = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordhide: 1,
    detshow:0,
    overPayBox:0,
    backpage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    orderid = options.id;
    sourcetype = options.sourcetype;//支付来源
    userinfo = app.globalData.userInfo
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=ordershow&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        orderid: orderid,
        userid: userinfo.uid
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setData({
            orderid: orderid,
            backpage:1
          })
          shoptype  =  ops.data.msg.order.shoptype;
          that.setData({
            info: ops.data.msg.order,
            paylist:ops.data.msg.paylist,
            userinfo: userinfo,
            balance: ops.data.msg.balance,
            balancepay: ops.data.msg.balancepay,
            orderdet:ops.data.msg.orderdet,
          });
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
  showOrderDet:function(e){
    var that = this;
    that.setData({
      detshow:1
    })
  },
  //点击灰色背景隐藏购物车和规格弹窗
  maskbind: function (event) {
    var that = this;
    that.setData({
      detshow: 0
    })
  },
  closeBox:function(e){
    var that = this;
    that.setData({
      detshow: 0
    })
  },
  nextRecharge:function(e){
    var that = this;
    app.Skip('/member/pages/memcard/memcard');
  },
  changePaytype:function(e){
    var that = this;
    let data = e.currentTarget.dataset
    let newpaylist = []
    for(var i=0;i< data.paylist.length;i++){
      data.paylist[i].checked = false;
      if(data.type==data.paylist[i].loginname){
        data.paylist[i].checked = true
      }
      newpaylist.push(data.paylist[i]);
    }
    that.setData({
      paylist:newpaylist
    })
  },
  //确认支付
  formSubmit: function (e) {
    var that = this;
    that.setData({
      ordhide: 0
    })
    let formData = e.detail.value
    if (formData['paydotype'] == 'weixinapplet'){
      //判断登录获取openid
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: siteurl + '/index.php?ctrl=applet&action=getwxapi&version='+app.globalData.version+'&datatype=json',
              data: {
                appid: app.globalData.appid,
                secret: app.globalData.secret,
                code: res.code
              },
              success: function (ques) {
                // console.log(ques)
                if (ques.data.msg && ques.data.msg.openid) {
                  //调用支付统一下单API
                  wx.request({
                    url: siteurl + '/index.php?ctrl=applet&action=paydata&version='+app.globalData.version+'&datatype=json',
                    header: { 'Content-Type': 'application/json' },
                    data: {
                      dotype:'order',
                      orderid: orderid,
                      openid: ques.data.msg.openid
                    },
                    success: function (ops) {
                      if (!ops.data.error) {
                        var paydata = ops.data.msg
                        if (paydata['appid'] != '' && paydata['appid'] != undefined) {
                          //调起微信支付
                          wx.requestPayment({
                            'timeStamp': paydata['timeStamp'],
                            'nonceStr': paydata['nonce_str'],
                            'package': paydata['package'],
                            'signType': 'MD5',
                            'paySign': paydata['paySign'],
                            'success': function (payres) {
                              //console.log('微信支付成功：');
                             // console.log(payres);
                             that.setData({
                              overPayBox:1
                             })
                             setTimeout(function () {
                                //支付来源  1正常下单 2订单列表 3订单详情
                                if(sourcetype==1){
                                  if(shoptype==100){
                                      app.redirectSkip('/pages/paotuidetail/paotuidetail?id=' + orderid);
                                   }else{
                                    app.redirectSkip('/pages/orderdetail/orderdetail?orderid=' + orderid);
                                   }
                                }else if(sourcetype==2 || sourcetype==3){
                                  wx.navigateBack();
                                }
                              }, 2000);
                            },
                            'fail': function (payerr) {
                              if (payerr.errMsg =='requestPayment:fail cancel'){
                                app.showToast('用户取消支付');
                              }else{
                                app.showToast('调用支付失败');
                              }
              
                               that.setData({
                                 ordhide: 1,
                                 overPayBox:0
                               })
                            }
                          })
                        } else {
                          app.showToast('调用支付统一下单失败');
                          that.setData({
                            ordhide: 1,
                            overPayBox:0
                          })
                        }

                      } else {
                        app.showToast(ops.data.msg);
                        that.setData({
                          ordhide: 1,
                          overPayBox:0
                        })
                      }
                    }
                  })
                }else{
                  app.showToast(ques.data.msg);
                  that.setData({
                    ordhide: 1,
                    overPayBox:0
                  })
                }

              }
            })
          } else {
            // console.log('获取用户登录态失败！' + res.errMsg)
            app.showToast('获取用户登录态失败！' + res.errMsg);
            that.setData({
              ordhide: 1,
              overPayBox:0
            })
          }
        }
      });

    }else{
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=gotopay&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: formData,
        success: function (ops) {
          //console.log(ops);
          if (!ops.data.error) {
            if (ops.data.msg.id > 0){
              that.setData({
                overPayBox:1
               })
               setTimeout(function () {
                  //支付来源  1正常下单 2订单列表 3订单详情
                  if(sourcetype==1){
                    if(shoptype==100){
                        app.redirectSkip('/pages/paotuidetail/paotuidetail?id=' + orderid);
                     }else{
                      app.redirectSkip('/pages/orderdetail/orderdetail?orderid=' + orderid);
                     }
                  }else if(sourcetype==2 || sourcetype==3){
                    wx.navigateBack();
                  }
                }, 2000);
            }else{
              app.showToast('支付失败');
              that.setData({
                ordhide: 1,
                overPayBox:0
              })
            }

          } else {
            // console.log(ops.data.msg);
            app.showToast(ops.data.msg);
            that.setData({
              ordhide: 1,
              overPayBox:0
            })
          }
        }
      })
    }


  }
})

