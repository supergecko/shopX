//获取应用实例
var app = getApp();
var siteurl = app.globalData.siteurl;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchlist: [],
    shoplist: [],
    searchVal: '',
    needshow: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let searchVal = options.searchVal
    if (searchVal != '' && searchVal != undefined) {
      app.showLoading();
      that.setData({
        needshow: 1,
        searchVal: searchVal,
      })
      let indexsearch = []
      indexsearch = wx.getStorageSync('indexsearch')
      var in_search = 0
      if (indexsearch.length > 0) {
        for (var c = 0; c < indexsearch.length; c++) {
          if (indexsearch[c] == searchVal) {
            in_search = 1
          }
        }
      } else {
        indexsearch = []
      }
      if (in_search == 0) {
        indexsearch.push(searchVal)
        wx.setStorageSync('indexsearch', indexsearch)
      }
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
    var that = this;
    let indexsearch = []
    indexsearch = wx.getStorageSync('indexsearch')
    //获取热门搜索
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=search&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {},
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            searchlist: indexsearch,
            hotlist: ops.data.msg.searchwords
          });
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })

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
  //获取输入框的值
  inputVal: function (e) {
    this.setData({
      searchVal: e.detail.value
    })
  },
  //点击搜索店铺
  checkSearch: function (e) {
    app.showLoading();
    var that = this;
    console.log(e)
    var searchVal = e.currentTarget.dataset.name;
    let indexsearch = []
    indexsearch = wx.getStorageSync('indexsearch')
    var in_search = 0
    if (indexsearch.length > 0) {
      for (var c = 0; c < indexsearch.length; c++) {
        if (indexsearch[c] == searchVal) {
          in_search = 1
        }
      }
    } else {
      indexsearch = []
    }
    if (in_search == 0) {
      indexsearch.push(searchVal)
      wx.setStorageSync('indexsearch', indexsearch)
    }
    that.setData({
      searchVal: searchVal
    });
    GetList(that);
  },
  //清空历史
  clearSearch: function (e) {
    let indexsearch = []
    wx.setStorageSync('indexsearch', indexsearch)
    this.onShow()
  },
  //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  homelistShow: function (e) {
    var that = this;
    let data = e.currentTarget.dataset
    if (data.cxcount > 4) {
      let shoplist = that.data.shoplist
      let menu = shoplist.find(function (v) {
        return v.id == data.id
      })
      if (menu.checkcx == 0) {
        menu.checkcx = 1
      } else {
        menu.checkcx = 0
      }
      that.setData({
        shoplist: shoplist
      })

    }
  },
})

//获取店铺列表信息
var GetList = function (that) {
  let searchVal = that.data.searchVal
  let userid = 0;
  if (app.checkLogin()) {
    userid = app.globalData.userInfo.uid
  }
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=searchresult&version=' + app.globalData.version + '&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      searchname: searchVal,
      lat: app.globalData.latitude,
      lng: app.globalData.longitude,
      adcode: app.globalData.adcode,
      userid: userid
    },
    success: function (ops) {
      if (!ops.data.error) {
        that.setData({
          shoplist: ops.data.msg.shoplist,
          needshow: 1,
          searchVal: searchVal,
        });
        app.hideLoading();
      } else {
        app.showToast(ops.data.msg);
        app.hideLoading();
      }
    }
  })
}