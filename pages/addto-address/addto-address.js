var app = getApp();
var siteurl = app.globalData.siteurl;
var userinfo = []
var addressid = 0
var shopid = 0


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchshow:0,
    list:[],
    buttonText: '保存地址',
    check_tag:0,
    array: [
      {
        id:1,
        name: '家',
      },
      {
        id:2,
        name: '公司',
      },
      {
        id:3,
        name: '学校',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    addressid = options.id
    if (options.shopid != null && options.shopid != undefined){
      shopid = options.shopid
    }
    let title = ''
    let addressInfo = []
    userinfo = app.globalData.userInfo
    var cityid = app.globalData.adcode

    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=address&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        userid: userinfo.uid,
        area: 1
      },
      success: function (ops) {
        // console.log(ops)
        var cityname = ''
        if (!ops.data.error) {
          if (ops.data.msg.citylist.length > 0) {
            for (var c = 0; c < ops.data.msg.citylist.length; c++) {
              if (ops.data.msg.citylist[c]['adcode'] == cityid) {
                cityname = ops.data.msg.citylist[c]['name']
              }
            }
          }
          if (cityname == '' && ops.data.msg.default_cityid != 0) {
            cityid = ops.data.msg.default_cityid
            if (ops.data.msg.citylist.length > 0) {
              for (var c = 0; c < ops.data.msg.citylist.length; c++) {
                if (ops.data.msg.citylist[c]['adcode'] == cityid) {
                  cityname = ops.data.msg.citylist[c]['name']
                }
              }
            }
          }
          that.setData({
            cityname: cityname
          });


          if (addressid > 0) {
            title = '编辑收货地址'
            //获取地址信息
            wx.request({
              url: siteurl + '/index.php?ctrl=applet&action=oneAddress&version='+app.globalData.version+'&datatype=json',
              header: { 'Content-Type': 'application/json' },
              data: {
                id: addressid
              },
              success: function (res) {
                // console.log(res);
                if (!res.data.error) {
                  addressInfo = res.data.msg.info
                  that.setData({
                    info: addressInfo,
                    check_tag: addressInfo.tag,
                    check_bigadr: addressInfo.bigadr,
                    check_lat: addressInfo.lat,
                    check_lng: addressInfo.lng
                  })
                } else {
                  app.showToast(res.data.msg);
                }
              }
            })
          } else {
            title = '新增收货地址'
            addressInfo = {
              contactname: '',
              phone: '',
              bigadr: '',
              lat: '',
              lng: '',
              detailadr: '',
              tag: 0
            }
            that.setData({
              info: addressInfo,
              check_tag: 0,
              check_bigadr: '点击选择地址',
              check_lat: '',
              check_lng: ''
            })
          }
          wx.setNavigationBarTitle({
            title: title
          })
        } else {
          // console.log(res.data.msg);
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
  //点击选择地址
  choiceAddress: function (event) {
    /*
    wx.openLocation({
      name:'位置名称',
      address:'地址详情',
      latitude:34.748210,
      longitude:113.613320,
      scale: 18
    })
    return false;
    */

    var that = this;
      wx.chooseLocation({
        success: function (res) {
          var bigadr = res.name
          if (bigadr == '') {
            bigadr = res.address
          }
          that.setData({
            check_bigadr: bigadr,
            check_lat: res.latitude,
            check_lng: res.longitude
          })
        },
        fail: function (err) {
          wx.getSetting({
            success: function (res) {
              var statu = res.authSetting;
              if (!statu['scope.userLocation']) {
                wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                  confirmColor: '#00cd85',
                  cancelColor: '#333',
                  success: function (tip) {
                    if (tip.confirm) {
                      wx.openSetting({
                        success: function (data) {
                          if (data.authSetting["scope.userLocation"] === true) {
                            //授权成功之后，再调用chooseLocation选择地方
                            wx.chooseLocation({
                              success: function (res) {
                                var bigadr = res.name
                                if (bigadr == '') {
                                  bigadr = res.address
                                }
                                that.setData({
                                  check_bigadr: bigadr,
                                  check_lat: res.latitude,
                                  check_lng: res.longitude
                                })
                              },
                            })
                          } else {
                            app.showToast('授权失败');
                          }
                        }
                      })
                    }
                  }
                })
              }
            },
            fail: function (res) {
              app.showToast('调用授权窗口失败');
            }
          })
        }
      })
  },
  tagChange: function (e) {
    var that=this;
    let tagid = e.currentTarget.dataset.tagid
     let check_tag = that.data.check_tag
     if(check_tag==tagid){
       check_tag = 0
     }else{
       check_tag = tagid
     }
    that.setData({
      check_tag: check_tag,
    })
  },
  //点击地址（搜索结果）
  checkAddress: function (event) {
    var that = this;
    let location = event.currentTarget.dataset.location;
    let lnglatarr = location.split(',');
    let lng = lnglatarr[0];
    let lat = lnglatarr[1];
    let name = event.currentTarget.dataset.name;

    that.setData({
      searchshow: 0,
      check_bigadr: name,
      check_lat: lat,
      check_lng: lng
    })
  },
  //搜索收货地址
  searchAddress: function (e) {
    var that = this;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=searchAddress&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        searchval: e.detail.value.searchval,
        cityname: that.data.cityname
      },
      success: function (ops) {
        if (!ops.data.error) {
          that.setData({
            list: ops.data.msg.list
          })
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  },
  //保存地址
  formSubmit: function (e) {
    var that = this;
    let formData = e.detail.value
    let tag = that.data.check_tag
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=saveaddress&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        addressid: addressid,
        userid: userinfo.uid,
        username: userinfo.username,
        contactname: formData.contactname,
        phone: formData.phone,
        bigadr: formData.bigadr,
        lat: formData.lat,
        lng: formData.lng,
        detailadr: formData.detailadr,
        tag: tag
      },
      success: function (ops) {
        if (!ops.data.error) {
          // wx.navigateBack({
          //   delta: 1,
          //   success: function (e) {
          //     var page = getCurrentPages().pop();
          //     if (page == undefined || page == null) return;
          //     let backinfo = {id:shopid}
          //     page.onLoad(backinfo);
          //   }
          // })
          var pages = getCurrentPages();
          // var currPage = pages[pages.length - 1];  //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面
          let backinfo = { id: shopid }
          prevPage.onLoad(backinfo);
          wx.navigateBack();
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})