//获取应用实例
var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../libs/amap-wx.js');
var page = 1;
var loadshow = true;
var sortid = 0;
var sendtype = 0;
var controltype = 0;
var sortisShow = 0;
var sticky_top = 0;
var sxisShow = 0;
var maskShow = 0;
var sortname = '综合排序';
var shaixuanname = '筛选';
var sortupdown = 'arrowdown';
var sortcolor = 'noselectcolor';
var sxcolor = 'noselectcolor';
var cartnum = 0;
Page({
  data: {
    moretypelist: [],
    advlist: [],
    locationshow: false,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    loadshow: loadshow,
    homeposition: '定位中...',
    notice: '',
    notice_size: 14,
    marquee: 0,
    wxkefu_open: 0, //微信客服是否开启
    wxkefu_show: 0,
    wxkefu_logo: '',
    flfontcolor: '',//分类字体颜色
    flimgurl: '',//分类背景图片
    flximginfo_img: '', //是否显示图片（分类下展示图）
    flbottomHeight: '',
    sortisShow: 0,
    sxisShow: 0,
    sendtype: 0,
    controltype: 0,
    sortname: '综合排序',
    shaixuanname: '筛选',
    sellcountname: '销量最高',
    distancename: '距离最近',
    sortupdown: 'arrowdown',
    sortcolor: 'noselectcolor',
    sxcolor: 'noselectcolor',
    cartShow: 1,
    wxSow: 1,
    sticky_top: 0,
    maskShow: 0
  },

  onLoad: function (options) {
    var that = this;
    wx.setStorageSync('backpage', '0');
    app.showLoading();
    var lat = '';
    var lng = '';
    page = 1;
    that.setData({
      scrollTop: 0,
      version: app.globalData.version,
      list:[]
    });
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=getconfig&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {},
      success: function (ques) {
        if (!ques.data.error) {
          if(ques.data.msg.is_applet_examine!=0){
            if (app.globalData.latitude == null && app.globalData.longitude == null) {
              wx.getLocation({
                type: 'gcj02',
                success: function (datas) {
                  lat = datas.latitude;
                  lng = datas.longitude;
                  if (lat != '' && lng != '') {
                    wx.request({
                      url: siteurl + '/index.php?ctrl=applet&action=getadcode&version=' + app.globalData.version + '&datatype=json',
                      header: { 'Content-Type': 'application/json' },
                      data: {
                        lat: lat,
                        lng: lng
                      },
                      success: function (ops) {
                        if (!ops.data.error) {
                          app.globalData.latitude = lat
                          app.globalData.longitude = lng
                          app.globalData.adcode = ops.data.msg.info.adcode
                          app.globalData.address = ops.data.msg.info.address
                          that.setData({
                            homeposition: ops.data.msg.info.address
                          });
                          GetType(that);
                          GetList(that);
                          wx.getSystemInfo({
                            success: function (res) {
                              that.setData({
                                scrollHeight: res.windowHeight
                              });
                            }
                          });
                        } else {
                          that.setData({
                            locationshow: true
                          });
                        }
                      }
                    })
                  } else {
                    that.setData({
                      locationshow: true
                    });
                  }
                },
                fail: function (error) {
                  //获取地理位置
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
                                    //授权成功之后，再调用当前位置
                                    wx.getLocation({
                                      type: 'gcj02',
                                      success: function (datas) {
                                        lat = datas.latitude;
                                        lng = datas.longitude;
                                        if (lat != '' && lng != '') {
                                          wx.request({
                                            url: siteurl + '/index.php?ctrl=applet&action=getadcode&version=' + app.globalData.version + '&datatype=json',
                                            header: { 'Content-Type': 'application/json' },
                                            data: {
                                              lat: lat,
                                              lng: lng
                                            },
                                            success: function (ops) {
                                              if (!ops.data.error) {
                                                app.globalData.latitude = lat
                                                app.globalData.longitude = lng
                                                app.globalData.adcode = ops.data.msg.info.adcode
                                                app.globalData.address = ops.data.msg.info.address
                                                that.setData({
                                                  homeposition: ops.data.msg.info.address
                                                });
                                                GetType(that);
                                                GetList(that);
                                                wx.getSystemInfo({
                                                  success: function (res) {
                                                    that.setData({
                                                      scrollHeight: res.windowHeight
                                                    });
                                                  }
                                                });
                                              } else {
                                                that.setData({
                                                  locationshow: true
                                                });
                                              }
                                            }
                                          })
                                        } else {
                                          that.setData({
                                            locationshow: true
                                          });
                                        }
                                      }
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
                      that.setData({
                        locationshow: true
                      });
                    }
                  })
                }
              })
            }else{
              if (app.globalData.address != null) {
                that.setData({
                  homeposition: app.globalData.address
                });
              }
              GetType(that);
              GetList(that);
              wx.getSystemInfo({
                success: function (res) {
                  that.setData({
                    scrollHeight: res.windowHeight
                  });
                }
              });
            }
          }else{
            app.hideLoading();
            that.setData({
              is_applet_examine:ques.data.msg.is_applet_examine,
              applet_url:ques.data.msg.applet_url
            })
          }
        }else {
          app.showToast(ques.data.msg);
        }
      }
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  onShow: function () {
    var that = this;
    let carts = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    var goodnum = 0;
    var ggoodnum = 0;
    if (carts.length > 0) {
      for (var i = 0; i < carts.length; i++) {
        if (carts[i].dishs != null && carts[i].dishs != undefined) {
          if (carts[i].dishs.length > 0) {
            for (var n = 0; n < carts[i].dishs.length; n++) {
              goodnum = goodnum + carts[i].dishs[n].count;
            }
          }
        }
        if (carts[i].ggdishs != null && carts[i].ggdishs != undefined) {
          if (carts[i].ggdishs.length > 0) {
            for (var m = 0; m < carts[i].ggdishs.length; m++) {
              ggoodnum = ggoodnum + carts[i].ggdishs[m].count;
            }
          }
        }
      }
    }
    cartnum = Number(goodnum) + Number(ggoodnum)
    that.setData({
      cartnum: cartnum
    })
  },
  //监听页面滚动

  //下拉刷新
  onPullDownRefresh: function () {
    // wx.showToast({
    //   title: '刷新',
    //   icon: 'loading'
    // });
    wx.stopPullDownRefresh();
    // console.log("刷新");
    page = 1;
    this.setData({
      list: [],
      scrollTop: 0
    });

    if (app.globalData.latitude != '' && app.globalData.longitude != '') {
      app.showLoading();
      GetType(this);
      GetList(this);
    }
  },
  //上拉加载店铺
  onReachBottom: function () {
    var that = this;
    if (app.globalData.latitude != '' && app.globalData.longitude != '') {
      app.showLoading();
      GetList(that);
    }
  },
  //点击跳转通知页面
  noticeOnclick: function (event) {
    app.Skip('/pages/notice/notice');
  },
  //点击分类跳转
  cateOnclick: function (event) {
    var shoptype = event.currentTarget.dataset.activity;
    var typeid = event.currentTarget.dataset.typeid;
    var typename = event.currentTarget.dataset.name;
    if (shoptype == 'paotui') {
      app.Skip('/pages/paotui/paotui');
    } else if (typeid == -1) {
      app.Skip('/pages/type/typelist?typename=' + typename);
    } else if (shoptype == 'marketlist') {
      app.Skip('/pages/quickcart/quickcart');
    } else {
      app.Skip('/pages/type/channel?typeid=' + typeid + '&typename=' + typename);
    }
  },
  sortShow: function (e) {
    var that = this;
    sticky_top = !sticky_top
    sortisShow = !sortisShow
    maskShow = !maskShow
    if (sortisShow == false) {
      sortupdown = 'arrowup';
      sortcolor = 'selectcolor';
    } else {
      sortupdown = 'arrowdown';
      sortcolor = 'noselectcolor';
    }
    if (sxisShow) {
      sticky_top = !sticky_top
      maskShow = !maskShow
      sxisShow = false;
    }
    that.setData({
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: sortupdown,
      sortcolor: sortcolor,
      sxcolor: 'noselectcolor',
      sticky_top: sticky_top,
      maskShow: maskShow
    })
  },
  //点击展示筛选列表
  sxShow: function () {
    var that = this;
    sticky_top = !sticky_top
    sxisShow = !sxisShow
    maskShow = !maskShow
    if (sxisShow == false) {
      sxcolor = 'selectcolor';
    } else {
      sxcolor = 'noselectcolor';
    }
    if (sortisShow) {
      sticky_top = !sticky_top
      maskShow = !maskShow
      sortisShow = false;
    }
    that.setData({
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: sxcolor,
      sortcolor: 'noselectcolor',
      sticky_top: sticky_top,
      maskShow: maskShow
    })
  },
  //点击排序展示店铺列表
  sortOnclick: function (event) {
    var that = this;
    sortid = event.currentTarget.dataset.id;
    let sortname = event.currentTarget.dataset.name;
    sortisShow = false;
    sticky_top = false
    maskShow = false
    that.setData({
      list: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sticky_top: false,
      maskShow: false,
    })
    app.showLoading();
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //点击销量展示店铺列表
  sellcountOnclick: function (event) {
    var that = this;
    sortid = event.currentTarget.dataset.id;
    if (sxisShow) {
      sxisShow = false;
    }
    if (sortisShow) {
      sortisShow = false;
    }
    sticky_top = false
    maskShow = false
    that.setData({
      list: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sticky_top: false,
      maskShow: false
    })
    app.showLoading();
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //点击距离展示店铺列表
  juliOnclick: function (event) {
    var that = this;
    sortid = event.currentTarget.dataset.id;
    let sortname = event.currentTarget.dataset.name;
    if (sxisShow) {
      sxisShow = false;
    }
    if (sortisShow) {
      sortisShow = false;
    }
    sticky_top = false
    maskShow = false
    that.setData({
      list: [],
      pxid: sortid,
      sortisShow: sortisShow,
      sxisShow: sxisShow,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sticky_top: false,
      maskShow: false
    })
    app.showLoading();
    page = 1;
    loadshow = true;
    GetList(that)
  },
  sendtypeOnclick: function (event) {
    var that = this;
    let oldsendtype = that.data.sendtype
    sendtype = event.currentTarget.dataset.sendtype;
    if (oldsendtype == sendtype) {
      sendtype = 0;
    }
    that.setData({
      sendtype: sendtype
    })
  },
  yhhdOnclick: function (event) {
    var that = this;
    let oldcontroltype = that.data.controltype
    controltype = event.currentTarget.dataset.controltype;
    if (oldcontroltype == controltype) {
      controltype = 0;
    }
    that.setData({
      controltype: controltype
    })
  },
  clearsxOnclick: function (event) {
    var that = this;
    let sendtype = 0;
    let controltype = 0;
    that.setData({
      sendtype: sendtype,
      controltype: controltype
    })
  },
  oversxOnclick: function (event) {
    var that = this;
    sendtype = event.currentTarget.dataset.sendtype;
    controltype = event.currentTarget.dataset.controltype;
    let sortname = that.data.sortname;
    sortisShow = false
    sxisShow = false
    sticky_top = false
    maskShow = false
    that.setData({
      list: [],
      pxid: sortid,
      sortisShow: false,
      sxisShow: false,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sendtype: sendtype,
      controltype: controltype,
      sticky_top: false,
      maskShow: false
    })
    app.showLoading();
    page = 1;
    loadshow = true;
    GetList(that)
  },
  //点击灰色背景隐藏购物车和规格弹窗
  maskbind: function (event) {
    var that = this;
    sortisShow = false
    sxisShow = false
    maskShow = false
    sticky_top = false
    that.setData({
      sortisShow: false,
      sxisShow: false,
      pxid: sortid,
      sortname: sortname,
      sortupdown: 'arrowdown',
      sxcolor: 'noselectcolor',
      sortcolor: 'noselectcolor',
      sendtype: sendtype,
      controltype: controltype,
      maskShow: false,
      sticky_top: false
    })
  },
  //点击店铺跳转
  shopOnclick: function (e) {
    var shopid = e.currentTarget.dataset.shopid;
    var shopname = e.currentTarget.dataset.shopname;
    var shop_type = e.currentTarget.dataset.shoptype;
    app.Skip('/pages/shop/shop?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shop_type);
  },
  //显示/隐藏店铺活动
  homelistShow: function (e) {
    var that = this;
    let data = e.currentTarget.dataset
    if (data.cxcountx > 4) {
      let list = that.data.list
      let menu = list.find(function (v) {
        return v.id == data.id
      })
      if (menu.checkcx == 0) {
        menu.checkcx = 1
      } else {
        menu.checkcx = 0
      }
      that.setData({
        list: list
      })

    }
  },
  //切换地址
  checkCity: function () {
    var that = this;
    app.Skip('/pages/choice-address/choice-address');
  },

  //拨打电话
  calling: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //显示微信客服
  showwx: function () {
    var that = this;
    that.setData({
      wxkefu_show: 1,
      wxSow: 0,
      cartShow: 0
    })
  },
  //隐藏微信客服
  closedwx: function () {
    var that = this;
    that.setData({
      wxkefu_show: 0,
      wxSow: 1,
      cartShow: 1
    })
  },
  indexskip: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    var num = e.currentTarget.dataset.num;
    if (num == 1) {
      app.reLaunchSkip(url)
    } else if (num == 2) {
      that.onLoad();
    } else if (num == 3) {
      app.Skip(url)
    } else {
      app.Skip(url)
    }
  },

  checkSearch: function (e) {
    var that = this;
    var searchval = e.currentTarget.dataset.searchval;
    app.Skip('/pages/history/history?searchVal=' + searchval);
  },
})

//获取分类信息
var GetType = function (that) {
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=checkopencity&version=' + app.globalData.version + '&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      adcode: app.globalData.adcode,
      lat: app.globalData.latitude,
      lng: app.globalData.longitude
    },
    success: function (ops) {
      if (!ops.data.error) {
        that.setData({
          notice: ops.data.msg.notice
        })
        var length = that.data.notice.length * that.data.notice_size;//文字长度
        var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
        windowWidth = windowWidth - 30;
        if (length >= windowWidth) {
          that.setData({
            marquee: 1
          });
        }
        var flfontcolor = '#4d4d4d';
        if (ops.data.msg.flfontcolor.length > 0) {
          flfontcolor = ops.data.msg.flfontcolor;
        }
        app.globalData.open_shangou = ops.data.msg.shangou
        app.globalData.open_paotui = ops.data.msg.paotui
        that.setData({
          locationshow: false,
          weatherinfo: ops.data.msg.weatherinfo,
          hotsearchlist: ops.data.msg.hotsearchlist,
          moretypelist: ops.data.msg.moretypelist,
          ztymode: ops.data.msg.ztymode,
          flfontcolor: flfontcolor,
          flimgurl: ops.data.msg.flimgurl,
          flximginfo_img: ops.data.msg.flximginfo_img,
          advlist: ops.data.msg.advlist,
          advlist2: ops.data.msg.advlist2,
          fyshoplist: ops.data.msg.fyshoplist,
          wxkefu_open: ops.data.msg.wxkefu_open,
          wxkefu_logo: ops.data.msg.wxkefu_logo,
          wxkefu_ewm: ops.data.msg.wxkefu_ewm,
          wxkefu_phone: ops.data.msg.wxkefu_phone,
          is_applet_examine: ops.data.msg.is_applet_examine,
          applet_url: ops.data.msg.applet_url,
          is_open_paotui: ops.data.msg.paotui,
          is_open_shangou: ops.data.msg.shangou,
          is_show_weather: ops.data.msg.is_show_weather,
        })
      } else {
        that.setData({
          locationshow: true,
          is_open_paotui: 0,
          is_open_shangou: 0,
        });
      }
    }
  })
}

var flag = true;
//获取店铺列表信息
var GetList = function (that) {
  if(flag){
        flag = false;
        wx.request({
          url: siteurl + '/index.php?ctrl=applet&action=indexshoplistdata&version=' + app.globalData.version + '&datatype=json',
          header: { 'Content-Type': 'application/json' },
          data: {
            page: page,
            lat: app.globalData.latitude,
            lng: app.globalData.longitude,
            adcode: app.globalData.adcode,
            order: sortid,
            sendtype: sendtype,
            cxtype: controltype,
          },
          success: function (ops) {
            if (ops.data.error == true) {
              loadshow = true;
            } else {
              var newlist = that.data.list;

              if (ops.data.msg.shoplist.length > 0) {
                for (var i = 0; i < ops.data.msg.shoplist.length; i++) {
                  newlist.push(ops.data.msg.shoplist[i]);
                }
                that.setData({
                  list: newlist,
                  is_allow_ziti: ops.data.msg.is_allow_ziti
                });
                page++;
              } else {
                loadshow = false;
              }
            }
            flag = true;
            app.hideLoading();
            that.setData({
              loadshow: loadshow
            });
          },
          fail: function (error) {
            app.hideLoading();

            // console.log(error);
          }
        })
    }
}