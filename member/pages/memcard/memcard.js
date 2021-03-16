var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var userInfo = [];
var fastrecharge = 0;
var rechargecost = 0;
var fastcost = 0;
var inputcost = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxchargeShow:1,
    cardchargeShow:0,
    costlogShow:0,
    maskShow:0,
    yhinfo:'',
    showMore:0,
    inputcost:0,
    fastcost:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(app.checkLogin()){
      userInfo = app.globalData.userInfo
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=memcard&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userInfo.uid
        },
        success: function (ops) {
          if (!ops.data.error) {
            let yhinfo = ''
            let rechargelist = ops.data.msg.rechargelist
            if(rechargelist.length>0){
              if(rechargelist[0].is_sendcost==1 && Number(rechargelist[0].sendcost)>0 && rechargelist[0].is_sendjuan==0){
                yhinfo = '售价'+rechargelist[0].cost+'元赠送'+rechargelist[0].sendcost+'元';
              }
              if(rechargelist[0].is_sendcost==1 && Number(rechargelist[0].sendcost)>0 && rechargelist[0].is_sendjuan==1 && Number(rechargelist[0].sendjuancost)>0){
                yhinfo = '售价'+rechargelist[0].cost+'元赠送'+rechargelist[0].sendcost+'元+'+rechargelist[0].sendjuancost+'优惠券';
              }
              if(rechargelist[0].is_sendcost==0 && rechargelist[0].is_sendjuan==1 && Number(rechargelist[0].sendjuancost)>0){
                yhinfo = '售价'+rechargelist[0].cost+'元赠送'+rechargelist[0].sendjuancost+'优惠券';
              }
              if(rechargelist[0].is_sendcost==0 && rechargelist[0].is_sendjuan==0){
                yhinfo ='售价'+rechargelist[0].cost+'元';
              }
              fastrecharge = 1
              fastcost = rechargelist[0].cost
            }
            that.setData({
              rechargelist: ops.data.msg.rechargelist,
              costloglist: ops.data.msg.costloglist,
              userInfo:ops.data.msg.userinfo,
              yhinfo:yhinfo
            })
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
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
  //点击微信充值
  showwxcharge: function (event) {
    var that=this;
     wx.setNavigationBarTitle({
        title: '余额'
      })
    that.setData({
        wxchargeShow:1,
        costlogShow:0,
        cardchargeShow:0
    })
  },
  //点击显示充值卡充值
  showcardcharge: function (event) {
   var that=this;
   wx.setNavigationBarTitle({
        title: '充值卡充值'
      })
    that.setData({
        wxchargeShow:0,
        costlogShow:0,
        cardchargeShow:1
    })
  },
  //点击显示余额明细
  showcostlog: function (event) {
    var that=this;
    that.setData({
        costlogShow:1,
        maskShow: 1
    })
  },
   //关闭弹窗
  maskbind: function (event) {
    var that = this;
    that.setData({
      costlogShow:0,
      maskShow: 0
    })
  },
  selectRecharge:function(event){
    var that=this;
    if(Number(inputcost)>0){
      app.showToast('您已手动输入充值金额，请清空后再选择！');
      return;
    }
    let newrechargelist = that.data.rechargelist
    let yhinfo = ''
    let newcheckid = event.currentTarget.dataset.checkid
    for(var i=0;i<newrechargelist.length;i++){
      if(newrechargelist[i].id==newcheckid){
        if(newrechargelist[i].check ==1){
          newrechargelist[i].check =0
          fastrecharge = 0
          fastcost = 0
        }else{
          newrechargelist[i].check =1
          if(newrechargelist[i].is_sendcost==1 && Number(newrechargelist[i].sendcost)>0 && newrechargelist[i].is_sendjuan==0){
            yhinfo = '售价'+newrechargelist[i].cost+'元赠送'+newrechargelist[i].sendcost+'元';
          }
          if(newrechargelist[i].is_sendcost==1 && Number(newrechargelist[i].sendcost)>0 && newrechargelist[i].is_sendjuan==1 && Number(newrechargelist[i].sendjuancost)>0){
            yhinfo = '售价'+newrechargelist[i].cost+'元赠送'+newrechargelist[i].sendcost+'元+'+newrechargelist[i].sendjuancost+'优惠券';
          }
          if(newrechargelist[i].is_sendcost==0 && newrechargelist[i].is_sendjuan==1 && Number(newrechargelist[i].sendjuancost)>0){
            yhinfo = '售价'+newrechargelist[i].cost+'元赠送'+newrechargelist[i].sendjuancost+'优惠券';
          }
          if(newrechargelist[i].is_sendcost==0 && newrechargelist[i].is_sendjuan==0){
            yhinfo ='售价'+newrechargelist[i].cost+'元';
          }
          fastrecharge = 1
          fastcost = newrechargelist[i].cost
        }
      }else{
        newrechargelist[i].check =0
      }
    }
    that.setData({
      yhinfo:yhinfo,
      rechargelist:newrechargelist
    })
  },
  checkVal:function(e){
    var that = this;
    let newinputcost = e.detail.value;
    inputcost = newinputcost
    if(fastrecharge==1 && Number(fastcost)>0){
      app.showToast('您已选择快捷充值，请取消后再输入');
      return
    }
    that.setData({
        yhinfo:'无优惠'
    })
    if(Number(inputcost)<1){
      app.showToast('充值金额不能少于1元');
      return
    }
    if(Number(inputcost)>500000){
      app.showToast('充值金额不能大于500000');
      return
    }
  },
  isShowMore:function(e){
    var that = this;
    let nowshow = that.data.showMore
    if(nowshow==1){
      nowshow = 0
    }else{
      nowshow = 1
    }
    that.setData({
      showMore:nowshow
    })
  },
  //确认充值
  surewxrecharge:function(event){
      var that=this;
      let rechargecost = 0
      if(fastrecharge==1){
          if(Number(inputcost)>0){
            app.showToast('手动输入和快捷充值只能选择一种');
            return
          }
          if(Number(fastcost)==0){
            app.showToast('请选择快捷充值金额');
            return
          }
          rechargecost = fastcost
      }else{
          if(Number(inputcost)==0){
            app.showToast('请输入充值金额');
            return
          }
          if(Number(fastcost)>0){
            app.showToast('手动输入和快捷充值只能选择一种');
            return
          }
          rechargecost = inputcost
      }
      if(Number(rechargecost)<1){
          app.showToast('充值金额不能少于1元');
          return
      }
      app.Skip('/member/pages/rechargepay/rechargepay?cost='+rechargecost);
  },
  checkCnum:function(e){
    var that=this;
    let cardnum = e.detail.value
    that.setData({
      cardnum:cardnum
    })
  },
  checkPwd:function(e){
    var that=this;
    let cardpwd = e.detail.value
    that.setData({
      cardpwd:cardpwd
    })
  },
  surecardrecharge:function(event){
      var that=this;
      let cardnum = that.data.cardnum
      let cardpwd = that.data.cardpwd
      if(cardnum==''||cardnum==undefined){
        app.showToast('充值卡卡号为空');
        return
      }
      if(cardpwd==''||cardpwd==undefined){
        app.showToast('充值卡密码为空');
        return
      }
       wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=exchangcard&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userInfo.uid,
          cardnum:cardnum,
          cardpwd:cardpwd
        },
        success: function (ops) {
          if (!ops.data.error) {
            app.reLaunchSkip('/member/pages/memcenter/memcenter');
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
  },
})