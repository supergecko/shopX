var app = getApp();
var siteurl = app.globalData.siteurl;
var userinfo = []


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的收货地址'
    })
    if(app.checkLogin()){
      userinfo = app.globalData.userInfo
      that.setData({
        userInfo: userinfo
      })
      GetList(that);
    }
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
  //选择默认地址
  radioChange: function (e) {
    var that = this;
    // console.log('radio发生change事件，携带value值为：', e.detail.value)
    let id = e.detail.value
    if (id > 0) {
      //获取地址列表
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=editaddress&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          what: 'default',
          addressid:id,
          userid: userinfo.uid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      GetList(that);
      app.showToast('地址ID为空');
    }
  },
  //进入编辑地址
  editAddress: function (event) {
    let id = event.currentTarget.dataset.id;
    app.Skip('/pages/addto-address/addto-address?id=' + id);
  },
  //删除地址
  delAddress: function (event) {
    var that = this;
    let id = event.currentTarget.dataset.id;
    if (id > 0) {
      //获取地址列表
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=deladdress&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          addressid: id,
          userid: userinfo.uid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
            GetList(that);
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }
  }
})


//获取地址列表信息
var GetList = function (that) {
  if (userinfo != null) {
    //获取地址列表
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=address&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userinfo.uid
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          that.setData({
            list: ops.data.msg.arealist
          })
        } else {
          // console.log(ops.data.msg);
          app.showToast(ops.data.msg);
        }
      }
    })
  }
}