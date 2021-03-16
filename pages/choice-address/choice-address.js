//获取应用实例
var app = getApp()
var siteurl = app.globalData.siteurl
var userinfo = ''
var amapFile = require('../../libs/amap-wx.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityname: '定位中',
    locationshow: 1,
    list: [],
    serachVal: '',
    nowlocation:'',
    nearadrlist:[],
    loginShow:false,
    adrshowmore:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var cityid = app.globalData.adcode
    wx.setNavigationBarTitle({
      title: '选择收货地址'
    })
    let loginShow = false
    var userid = 0;
    if (app.checkLogin()){
      userinfo = app.globalData.userInfo
      userid = userinfo.uid;
    }
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=address&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userid,
        area: 1
      },
      success: function (ops) {
        // console.log(ops)
        var cityname = ''
        var cityLocation = ''
        if (!ops.data.error) {
          if (ops.data.msg.citylist.length > 0) {
            for (var c = 0; c < ops.data.msg.citylist.length; c++) {
              if (ops.data.msg.citylist[c]['adcode'] == cityid) {
                cityname = ops.data.msg.citylist[c]['name']
                cityLocation = ops.data.msg.citylist[c]['location']
              }
            }
          }
          if (cityname == '' && ops.data.msg.default_cityid != 0) {
            cityid = ops.data.msg.default_cityid
            if (ops.data.msg.citylist.length > 0) {
              for (var y = 0; y < ops.data.msg.citylist.length; y++) {
                if (ops.data.msg.citylist[y]['adcode'] == cityid) {
                  cityname = ops.data.msg.citylist[y]['name']
                  cityLocation = ops.data.msg.citylist[y]['location']
                }
              }
            }
          }
          that.setData({
            userinfo:userinfo,
            loginShow:loginShow,
            cityname: cityname,
            citylist: ops.data.msg.citylist,
            arealist: ops.data.msg.arealist,
            cityid: cityid,
            cityLocation: cityLocation
          });
        } else {
          app.showToast(ops.data.msg);
        }

      }
    })
    if(app.globalData.latitude !=null && app.globalData.longitude !=null){
      //意味着首页已经定位，根据首页定位坐标获取附近地址
       wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=getnearadr&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          lat: app.globalData.latitude,
          lng: app.globalData.longitude
        },
        success: function (ops) {
          // console.log(ops)
          if (!ops.data.error) {
            let nearadrlist = []
            if(ops.data.msg.nearadrlist.length>0){
              nearadrlist = ops.data.msg.nearadrlist
            }
            that.setData({
              nearadrlist:nearadrlist,
              nowlocation:app.globalData.address
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
  //展示城市列表
  showCity: function () {
    var that = this;
    var locationshow = 2
    if (that.data.locationshow == 2) {
      locationshow = 1
    }
    that.setData({
      locationshow: locationshow
    });
  },
  //展示搜索列表
  showArea: function (e) {
    var that = this;
    that.setData({
      locationshow: 3
    });
  },
  //展示我的收货列表
  showAddress: function () {
    var that = this;
    that.setData({
      locationshow: 1,
      serachVal: ''
    });
  },
  //根据输入框内容搜索收货地址
  bindKeyInput: function (e) {
    var that = this;
    //高德小程序API
    var keywords = e.detail.value;
    //that.data.cityname +
    keywords = keywords;
    var key = app.globalData.mapKey;
    console.log(that.data.cityLocation);
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: that.data.cityLocation,
      success: function (data) {
        // console.log(data)
        if (data && data.tips) {
          that.setData({
            locationshow: 3,
            list: data.tips
          })
        }
      }
    })
  },
  //搜索收货地址
  searchAddress: function (e) {
    var that = this;
    //高德小程序API
    // console.log(that.data.cityLocation)
    var keywords = e.detail.value.searchval;
    keywords = that.data.cityname + keywords
    var key = app.globalData.mapKey;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: that.data.cityLocation,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            locationshow: 3,
            list: data.tips
          })
        }
      }
    })
  },
  //选择城市
  checkCity: function (event) {
    var that = this;
    that.setData({
      locationshow: 1,
      cityid: event.currentTarget.dataset.id,
      cityname: event.currentTarget.dataset.name,
      citylist: that.data.citylist,
      cityLocation: event.currentTarget.dataset.location
    })
  },
  //点击选择地址
  choiceAddress: function (event) {
    var that = this;
    if (event.currentTarget.dataset.location != undefined) {
      let lng = 0;
      let lat = 0;
      let location = event.currentTarget.dataset.location;
      if (location.length == 0) {
        lng = app.globalData.longitude;
        lat = app.globalData.latitude;
      } else {
        let lnglatarr = location.split(',');
        lng = lnglatarr[0];
        lat = lnglatarr[1];
      }

      let address = event.currentTarget.dataset.address;
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=getadcode&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          lat: lat,
          lng: lng
        },
        success: function (ops) {
          // console.log(ops)
          if (!ops.data.error) {
            app.globalData.latitude = lat
            app.globalData.longitude = lng
            app.globalData.adcode = ops.data.msg.info.adcode
            app.globalData.address = address
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.onLoad();
            wx.navigateBack();
          }
        }
      })
    } else {
      app.globalData.latitude = null
      app.globalData.longitude = null
      app.globalData.adcode = null
      app.globalData.address = null
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.onLoad();
      wx.navigateBack();
    }
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userinfo: userInfo,
        loginShow:false
      })
      that.onLoad();
    })
  },
  showMoreAdr:function(e){
    var that = this;
    let adrshowmore = that.data.adrshowmore
    adrshowmore = !adrshowmore
    that.setData({
      adrshowmore:adrshowmore
    })
  },
  navToOther:function(e){
    var that = this;
    if(app.checkLogin()){
      let id=0
      app.Skip('/pages/addto-address/addto-address?id=' + id);
    }else{
      that.setData({
        loginShow:true
      })
    }
  },
})