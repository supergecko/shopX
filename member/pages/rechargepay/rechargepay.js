//获取应用实例
var app = getApp();
var amapFile = require('../../../libs/amap-wx.js');
var cost = 0;
var siteurl = app.globalData.siteurl;
var userinfo = []


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordhide: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    cost = options.cost;
    userinfo = app.globalData.userInfo;
    wx.setNavigationBarTitle({
      title: '余额充值'
    })
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=rechargepay&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userinfo.uid
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          that.setData({
            paylist:ops.data.msg.paylist,
            orderName:'余额充值',
            userinfo: userinfo,
            cost: cost
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
  //确认支付
  formSubmit: function (e) {
    var that = this;
    that.setData({
      ordhide: 0
    })
    let formData = e.detail.value
    if (formData['paydotype'] == 'weixin'){
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
                      dotype:'account',
                      cost: cost,
                      openid: ques.data.msg.openid,
                      userid: userinfo.uid
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
                              app.reLaunchSkip('/pages/member/member');
                            },
                            'fail': function (payerr) {
                              app.showToast(payerr.errMsg);
                              that.setData({
                                ordhide: 1
                              })
                            }
                          })
                        } else {
                          app.showToast('调用支付统一下单失败');
                          that.setData({
                            ordhide: 1
                          })
                        }

                      } else {
                        app.showToast(ops.data.msg);
                        that.setData({
                          ordhide: 1
                        })
                      }
                    }
                  })
                }else{
                  app.showToast(ques.data.msg);
                  that.setData({
                    ordhide: 1
                  })
                }
              }
            })
          } else {
            // console.log('获取用户登录态失败！' + res.errMsg)
            app.showToast('获取用户登录态失败！' + res.errMsg);
            that.setData({
              ordhide: 1
            })
          }
        }
      });

    }
  }
})

