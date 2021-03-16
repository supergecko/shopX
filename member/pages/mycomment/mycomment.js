// pages/member/member.js
var app = getApp();
var siteurl = app.globalData.siteurl;
var version = app.globalData.version;
var userInfo = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_showimg:0,
    img_box_list:[],
    maskshow:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的评价'
    })
    app.showLoading();
    if(app.checkLogin('/pages/mem_other/mycomment/mycomment')){
      userInfo = app.globalData.userInfo
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=usercomlist&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userInfo.uid,
        },
        success: function(ops){
          if (!ops.data.error){
            let commentlist = ops.data.msg.list
            that.setData({
              commentlist:commentlist,
            })
            if(commentlist.length>0){
                setTimeout(function () {
                  app.hideLoading();
                } ,1000)
            }else{
                app.hideLoading();
            }

          } else {
            app.showToast(ops.data.msg);
            app.hideLoading();
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
  goShop:function(e){
    var that = this;
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  lookImg:function(e){
    var that = this;
    let img_box_list = e.currentTarget.dataset.imglist
    that.setData({
      is_showimg:1,
      img_box_list:img_box_list,
      maskshow:1
    })
  },
  hideImg:function(e){
    var that = this;
    that.setData({
      is_showimg:0,
      img_box_list:[],
      maskshow:0
    })
  },
  delComment:function(e){
    var that = this;
    var comid = e.currentTarget.dataset.comid;
    wx.showModal({
      title: '提示信息',
      content: '确认删除此条评价？',
      confirmColor:'#00cd85',
      success(res) {
        if(res.confirm) {
          wx.request({
            url: siteurl + '/index.php?ctrl=applet&action=delcomment&version='+app.globalData.version+'&datatype=json',
            header: { 'Content-Type': 'application/json' },
            data: {
              userid: userInfo.uid,
              id:comid
            },
            success: function(ops){
              if (!ops.data.error){
                that.onLoad();
              } else {
                app.showToast(ops.data.msg);
              }
            }
          })
        }
      }
    })
  },
})