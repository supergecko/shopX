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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    orderid = options.id;
    userinfo = app.globalData.userInfo
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=drawbacklog&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        orderid: orderid,
        userid: userinfo.uid
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          orderinfo = ops.data.msg.order
          let drawbacklog = ops.data.msg.drawbacklog
          let title = '申请退款'
          let buttonShow = 1
          if (drawbacklog != null){
            title = '退款详情'
            buttonShow = 0
          }
          wx.setNavigationBarTitle({
            title: title
          })

          that.setData({
            drawbacklog: drawbacklog,
            buttonShow: buttonShow,
            drawsmlist: ops.data.msg.drawsmlist,
            info: orderinfo,
            userid: userinfo.uid,
            status:ops.data.msg.status,
            showbtn:ops.data.msg.showbtn,
            backacount:ops.data.msg.backacount,
            nowstatus:ops.data.msg.nowstatus,
            cost:ops.data.msg.cost,
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
  //提交申请
  formSubmit: function (e) {
    var that = this;
    let formData = e.detail.value
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=savedrawbacklog&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          wx.navigateBack();
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  },
  cancelDraw:function(e){
    var that = this;
    wx.showModal({
        title: '取消退款操作',
        content: '确认取消退款？',
        confirmColor:'#00cd85',
        success (res) {
          if (res.confirm) {
            wx.request({
              url: siteurl + '/index.php?ctrl=applet&action=quxiaotk&version='+app.globalData.version+'&datatype=json',
              header: { 'Content-Type': 'application/json' },
              data: {
                orderid: orderid,
                userid: userinfo.uid
              },
              success: function (ops) {
                if (!ops.data.error) {
                  var page = getCurrentPages().pop();
                  var option = { id: orderid }
                  if (page == undefined || page == null) return;
                  page.onLoad(option);
                } else {
                  app.showToast(ops.data.msg);
                }
              }
            })
          }
        }
      })
  },
  keepDraw:function(e){
    var that = this;
     wx.setNavigationBarTitle({
            title: '申请退款'
          })
    that.setData({
        buttonShow: 1
      })
  },
})