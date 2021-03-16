// pages/member/member.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var lay = 2;
var shopxieyi = 'shopxieyi';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseColor: '#00CD85', // 主体色
    checkboxed:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '商家入驻'
    })
    that.setData({
      siteurl: app.globalData.siteurl,
      version: app.globalData.version
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
  //点击跳转商家入驻协议页面
  xyOnclick: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    app.Skip(url);
  },
  checkboxChange:function(e){
    var that = this;
    let is_checked = e.detail.value[0]
    if (is_checked==undefined){
      is_checked = 0
    }
    that.setData({
      checkboxed: is_checked
    })
  },
  formSubmit: function (e) {
    var that = this;
    let checkboxed = that.data.checkboxed
    if (checkboxed==1){
      let applyinfo = JSON.parse(that.options.applyinfo)
      applyinfo['username'] = e.detail.value.username;
      applyinfo['password'] = e.detail.value.password;
      applyinfo['password2'] = e.detail.value.password2;
      applyinfo['laiyuan'] = lay;
      applyinfo['userid'] = app.globalData.userInfo.uid;
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=saveshop&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: applyinfo,
        success: function (ops) {
          let shopid = ops.data.msg
          if (!ops.data.error) {
            app.showToast("提交成功");
            setTimeout(function () {
              app.Skip('/member/pages/shangjiaresult/shangjiaresult?shopid=' + shopid);
            }, 1000);
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      app.showToast('请先勾选商家入驻协议');
    }
  }
})