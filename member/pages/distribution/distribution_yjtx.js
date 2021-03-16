var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
var txtype=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zfbShow:0,
    yhkShow:0,
    zfbaccount:'',
    zfbusername:'',
    cardusername:'',
    cardnumber:'',
    bankname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    userInfo = app.globalData.userInfo;
    let fxfeelv =0
    let txcost=''
    wx.setNavigationBarTitle({
        title: '佣金提现'
      })
    //获取用户最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=distribution_yjtx&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userInfo.uid
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            meminfo: ops.data.msg.userinfo,
            fxfeelv:ops.data.msg.fxfeelv,
            minfxtxcost: ops.data.msg.minfxtxcost,
            txcost:txcost,
            txtype:1
          })
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
  alltxcost:function(e){
      var that = this;
      let alltxcost = that.data.meminfo.fxcost
      that.setData({
        txcost:alltxcost
      })
  },
  radioChange:function(e){
    var that=this;
    txtype = e.detail.value
    let zfbShow = 0
    let yhkShow = 0
    if(txtype==1){
      zfbShow=0;
      yhkShow=0;
    }else if(txtype==2){
        zfbShow=1;
       yhkShow=0;
    }else{
      zfbShow=0;
      yhkShow=1;
    }
    that.setData({
      zfbShow:zfbShow,
      yhkShow:yhkShow,
      txtype:txtype
    })
  },
  checktxcost:function(e){
    var that=this;
    that.setData({
      txcost:e.detail.value
    })
  },
   checkzfbaccount:function(e){
    var that=this;
    that.setData({
      zfbaccount:e.detail.value
    })
  },
   checkzfbusername:function(e){
    var that=this;
    that.setData({
      zfbusername:e.detail.value
    })
  },
   checkcardusername:function(e){
    var that=this;
    that.setData({
      cardusername:e.detail.value
    })
  },
   checkcardnumber:function(e){
    var that=this;
    that.setData({
      cardnumber:e.detail.value
    })
  },
   checkbankname:function(e){
    var that=this;
    that.setData({
      bankname:e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    let formData = []
    let memfxcost = that.data.meminfo.fxcost
    formData['userid'] = userInfo.uid;
    formData['txcost'] = that.data.txcost;
    formData['txtype'] = txtype;
    formData['zfbaccount'] = that.data.zfbaccount;
    formData['zfbusername'] = that.data.zfbusername;
    formData['cardusername'] = that.data.cardusername;
    formData['cardnumber'] = that.data.cardnumber;
    formData['bankname'] = that.data.bankname;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=dofxtx&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        if (!ops.data.error) {
          app.showToast("申请提现成功");
          app.Skip('../distribution/distribution_center');
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})