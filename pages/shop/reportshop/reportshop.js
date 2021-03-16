// pages/reportshop/reportshop.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var shopid = 0;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shopid = options.shopid
    //获取店铺顶部评价信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=reportshop&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        shopid: shopid,
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          let shopname = ops.data.msg.shopname;
          wx.setNavigationBarTitle({
            title: shopname
          })
          that.setData({
            reasonlist:ops.data.msg.reasonlist,
            shopname:shopname,
            shopid:shopid,
          })

        } else {
          app.showToast(res.data.msg);
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
  formSubmit:function(e){
    var that = this;
    let formdata = e.detail.value
    if(app.checkLogin()){
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=saveshopreport&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data:{
          shopname:formdata.shopname,
          typeidContent:formdata.reason,
          content:formdata.content,
          phone:formdata.phone,
          userid:app.globalData.userInfo.uid,
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error){
            app.showToast('举报成功，请等待管理员处理');
            setTimeout(function(){
              wx.navigateBack();
             },2000);
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      that.setData({
        loginShow:1
      })
    }
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        loginShow:0
      });
    })
  },
})