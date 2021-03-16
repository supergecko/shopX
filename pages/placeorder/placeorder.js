//获取应用实例
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var siteurl = app.globalData.siteurl;
var userinfo = ''
var shopid = 0;
var ziti_phone = '';
var ordhide = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordhide: 1,
    is_ziti: 0,
    ziti_phone:'',
    total:{count: 0,money: 0},
    cartcost:0,
    allcost:0,
    allcxcost:0,
    temppscost:0,//自提，外卖切换替代配送费
    shopdowncost:0,//接口返回的优惠金额
    adrpscost:0,
    addpscost:0,
    bagcost:0,
    checkscore:0,
    checkjuan:0,
    checkshopjuan:0,
    goodscxdowncost:0,
    cx_shoudan:0,
    cx_manjian:0,
    cx_zhekou:0,
    cx_nopsf:0,
    is_nopsf:0,
    addressHide: 1,
    scoreHide: 1,
    maskShow: 0,
    timeHide: 1,
    juanHide: 1,
    shopjuanHide: 1,
    zititimeHide: 1,
    jfgzshow: 0,
    scrollTop: 0,
    checkscore: 0,
    checkjuan: 0,
    checkshopjuan: 0,
    minit: 0,
    juanid: 0,
    juanname: '',
    juancolor: '#808080',
    shopjuanid:0,
    shopjuanname:'',
    shopjuancolor: '#808080',
    scorecolor: '#808080',
    scorename: '选择抵扣金额',
    moregood: 0,
    orderid:0,
    backpage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '购物车下单'
    })
    if(app.checkLogin()){
      userinfo = app.globalData.userInfo
      if(ziti_phone==''){
        ziti_phone = userinfo.phone
      }
    }
    that.setData({
      userinfo: userinfo,
    })
    shopid = options.id;
    let goodid = ''
    let goodcx = ''
    let goodcount = ''
    let goodcost = ''

    let ggoodid = ''
    let productid = ''
    let ggoodcx = ''
    let ggoodcount = ''
    let ggoodcost = ''
    let carts = []
    let cartinfo = []
    let ggcartinfo = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    console.log(carts);
    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          if (carts[c]['dishs'] != undefined) {
            cartinfo = carts[c]['dishs'];
          } else {
            cartinfo = '';
          }
          if (carts[c]['ggdishs'] != undefined) {
            ggcartinfo = carts[c]['ggdishs'];
          } else {
            ggcartinfo = '';
          }
        }
      }
    } else {
      cartinfo = '';
      ggcartinfo = '';
    }
    if (cartinfo.length > 0) {
      for (var m = 0; m < cartinfo.length; m++) {
        if (cartinfo[m]['count'] > 0) {
          goodid += cartinfo[m]['id'] + ',';
          goodcx += cartinfo[m]['iscx'] + ',';
          goodcount += cartinfo[m]['count'] + ',';
          goodcost += cartinfo[m]['price'] + ',';
        }
      }
    }
    if (ggcartinfo.length > 0) {
      for (var n = 0; n < ggcartinfo.length; n++) {
        if (ggcartinfo[n]['count'] > 0) {
          ggoodid += ggcartinfo[n]['id'] + ',';
          productid += ggcartinfo[n]['gid'] + ',';
          ggoodcx += ggcartinfo[n]['iscx'] + ',';
          ggoodcount += ggcartinfo[n]['count'] + ',';
          ggoodcost += ggcartinfo[n]['price'] + ',';
        }
      }
    }
    if (userinfo != null && userinfo!=''){
      var lat = '';
      var lng = '';
      //获取地址信息
      if (app.globalData.latitude == null && app.globalData.longitude == null){
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
                  } else {
                    app.showToast(ops.data.msg);
                  }
                }
              })
            } else {
              app.showToast('请返回首页定位');
            }
          }
        })
      }
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=address&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: userinfo.uid,
          shopid: shopid,
          score: userinfo.score,
          minit: that.data.minit,
          lat: app.globalData.latitude,
          lng: app.globalData.longitude,
          adcode: app.globalData.adcode,
          goodid: goodid,
          goodcx: goodcx,
          goodcount: goodcount,
          goodcost: goodcost,
          ggoodid: ggoodid,
          productid: productid,
          ggoodcx: ggoodcx,
          ggoodcount: ggoodcount,
          ggoodcost: ggoodcost,
        },
        success: function (ops) {
          if (!ops.data.error) {
            let is_ziti = that.data.is_ziti
            let cartcost = ops.data.msg.cartcost
            let bagcost = ops.data.msg.bagcost
            let addpscost = ops.data.msg.addpscost
            let goodscxdowncost = ops.data.msg.goodscxdowncost
            let cx_shoudan = ops.data.msg.cx_shoudan
            let cx_manjian = ops.data.msg.cx_manjian
            let cx_zhekou = ops.data.msg.cx_zhekou
            let shopdowncost = ops.data.msg.downcost
            let adrpscost = 0
            let is_nopsf=0
            if (ops.data.msg.defaultmsg == null || ops.data.msg.defaultmsg.canps != 1) {
              if(is_ziti==1){
                ordhide = 1;
              }else{
                ordhide = 0;
              }
              adrpscost = 0;
            }else{
              ordhide = 1;
              adrpscost = ops.data.msg.defaultmsg.pscost;
            }
            if(ops.data.msg.nops == true) {
              is_nopsf = 1;
            }else{
              is_nopsf = 0;
            }
            let total = {count: 0,money: 0}
            total.count = ops.data.msg.sumcount
            that.setData({
              is_ziti:is_ziti,
              cartcost:cartcost,
              bagcost:bagcost,
              addpscost:addpscost,
              adrpscost:adrpscost,
              goodscxdowncost:goodscxdowncost,
              shopdowncost:shopdowncost,
              cx_shoudan:cx_shoudan,
              cx_manjian:cx_manjian,
              cx_zhekou:cx_zhekou,
              is_nopsf:is_nopsf,
              total:total,
            })
            let minit = 0
            let choiceTime = ' '
            let zititime = ''
            let zttimelist = []
            let pstime = []
            if (ops.data.msg.timelist.length>0) {
              if (ops.data.msg.timelist[0] != undefined) {
                minit = ops.data.msg.timelist[0]['value']
                choiceTime = ops.data.msg.timelist[0]['name']
              }
              for(var i=0;i<ops.data.msg.timelist.length;i++){
                ops.data.msg.timelist[i].cost = Number(ops.data.msg.timelist[i].cost)+Number(adrpscost)
                pstime.push(ops.data.msg.timelist[i])
              }
            }
            if (ops.data.msg.zttimelist != null) {
              if (ops.data.msg.zttimelist[0] != undefined) {
                zititime = ops.data.msg.zttimelist[0]
              }
            } else {
              zititime = '当前时间不支持自取'
            }
            let juanname = that.data.juanname
            let juancolor = that.data.juancolor
            let shopjuanname = that.data.shopjuanname
            let shopjuancolor = that.data.shopjuancolor
            if(ops.data.msg.juanlist.length>0){
              if(juanname==''){
                juanname = ops.data.msg.juanlist.length+'张可用'
                juancolor = '#ff0000'
              }
            }else{
              juanname="暂无可用"
              juancolor = '#808080'
            }
            if(ops.data.msg.shopjuanlist.length>0){
              if(shopjuanname==''){
                shopjuanname = ops.data.msg.shopjuanlist.length+'张可用'
                shopjuancolor = '#ff0000'
              }
            }else{
              shopjuanname="暂无可用"
              shopjuancolor = '#808080'
            }
            //计算费用
            that.countcost();
            that.setData({
              ordhide: ordhide,
              defaultmsg: ops.data.msg.defaultmsg,
              arealist: ops.data.msg.arealist,
              scorelist: ops.data.msg.scorelist,
              goodslist: ops.data.msg.goodslist,
              juanlist: ops.data.msg.juanlist,
              shopjuanlist: ops.data.msg.shopjuanlist,
              support_ziti: ops.data.msg.support_ziti,
              shopinfo: ops.data.msg.shopinfo,
              shopid: shopid,
              userid: userinfo.uid,
              pstime: pstime,
              minit: minit,
              choiceTime: choiceTime,
              ziti_phone: ziti_phone,
              zttimelist: ops.data.msg.zttimelist,
              zititime: zititime,
              cxdet: ops.data.msg.cxdet,
              isopenscoretocost: ops.data.msg.isopenscoretocost,
              scoretocost: ops.data.msg.scoretocost,
              scoretocostmax: ops.data.msg.scoretocostmax,
              juli: ops.data.msg.juli,
              juanname:juanname,
              juancolor:juancolor,
              shopjuanname:shopjuanname,
              shopjuancolor:shopjuancolor,
            });
          } else {
            // console.log(res.data.msg);
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
    var that = this;
    let ordersource = wx.getStorageSync('ordersource');
    //下单成功后，返回到当前页 判断来源页面 接着返回来源页 1 店铺页 2 购物车页 否则首页
    let backpage = that.data.backpage
    if(backpage==1){
      that.setData({
        backpage: 0
      })
      if (ordersource == 2) {
        app.Skip('/pages/indexcart/indexcart');
      }else{
        let orderid = that.data.orderid
        if(orderid>0){
          wx.request({
            url: siteurl + '/index.php?ctrl=applet&action=ordershow&version='+app.globalData.version+'&datatype=json',
            header: { 'Content-Type': 'application/json' },
            data: {
              orderid: orderid,
              userid: userinfo.uid
            },
            success: function (ops) {
              // console.log(ops);
              if (!ops.data.error) {
               app.Skip('/pages/shop/shop?id=' + ops.data.msg.order.shopid +'&shoptype=' + ops.data.msg.order.shoptype);
              } else {
                app.reLaunchSkip('/pages/index/index');
              }
            }
          })
        }else{
          app.reLaunchSkip('/pages/index/index');
        }
      }
    }else if(backpage==2){
      that.setData({
        backpage: 0
      })
      app.reLaunchSkip('/pages/index/index');
    }
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //计算费用
  countcost:function(e){
    var that = this;
    let is_ziti = that.data.is_ziti
    let total = that.data.total
    let cartcost = that.data.cartcost
    let bagcost = that.data.bagcost
    let adrpscost = that.data.adrpscost
    let addpscost = that.data.addpscost
    let is_nopsf = that.data.is_nopsf
    let shopdowncost = that.data.shopdowncost
    let checkscore = that.data.checkscore
    let checkjuan = that.data.checkjuan
    let checkshopjuan = that.data.checkshopjuan
    let goodscxdowncost = that.data.goodscxdowncost
    let cx_shoudan = that.data.cx_shoudan
    let cx_manjian = that.data.cx_manjian
    let cx_zhekou = that.data.cx_zhekou
    let temppscost = 0;//中间配送费
    let cx_nopsf = 0;
    if(is_ziti==1){//自提
        temppscost = 0;//中间配送费
        cx_nopsf = 0;
    }else{//外卖
        temppscost = Number(adrpscost)+Number(addpscost);
        if(is_nopsf==1){//免配送费
            cx_nopsf = Number(adrpscost)+Number(addpscost);
        }else{//不免配送费
            cx_nopsf = 0;
        }
    }
    let allcxcost = Number(shopdowncost) + Number(checkscore) + Number(checkjuan) + Number(goodscxdowncost)+Number(checkshopjuan)+Number(cx_nopsf);
    allcxcost = allcxcost.toFixed(2);
    let allcost = Number(cartcost) + Number(bagcost) + Number(temppscost)-Number(cx_nopsf)-Number(shopdowncost)-Number(checkscore)-Number(checkjuan) - Number(checkshopjuan);
    allcost = allcost.toFixed(2);
    total.money = allcost
    that.setData({
        total: total,
        bagcost: bagcost,
        checkscore: checkscore,
        checkjuan: checkjuan,
        checkshopjuan: checkshopjuan,
        allcost: allcost,
        allcxcost: allcxcost,
        cartcost: cartcost,
        adrpscost:adrpscost,
        addpscost:addpscost,
        newpscost:temppscost,
        cx_shoudan: cx_shoudan,
        cx_manjian: cx_manjian,
        cx_zhekou: cx_zhekou,
        cx_nopsf: cx_nopsf,
        is_ziti:is_ziti
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    app.getUserInfo(function (userinfo) {
      that.setData({
        userinfo: userinfo
      })
      let backinfo = { id: shopid }
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      currentPage.onLoad(backinfo);
    })
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  changezitiType: function (e) {
    var that = this;
    let is_ziti = e.currentTarget.dataset.isziti
    that.setData({
      is_ziti:is_ziti
    })
    let backinfo = { id: shopid }
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    currentPage.onLoad(backinfo);
  },
  //进入编辑、添加地址
  editAddress: function (event) {
    let id = event.currentTarget.dataset.id;
    app.Skip('../addto-address/addto-address?shopid=' + shopid + '&id=' + id);
  },
  //展示地址列表
  showAddress: function (event) {
    var that = this;
    that.setData({
      addressHide: 0,
      maskShow: 1,
      scrollTop: 0,
    })
  },
  showjfgz: function (e) {
    var that = this;
    that.setData({
      jfgzshow: 1,
      maskShow: 1,
      scrollTop: 0
    })
  },
  closejfgz: function (e) {
    var that = this;
    that.setData({
      jfgzshow: 0,
      maskShow: 0
    })
  },
  //展示配送时间列表
  showTime: function (event) {
    var that = this;
    that.setData({
      timeHide: 0,
      maskShow: 1,
      scrollTop: 0
    })
  },
  //展示配送时间列表
  showzitiTime: function (event) {
    var that = this;
    that.setData({
      zititimeHide: 0,
      maskShow: 1,
      scrollTop: 0
    })
  },
  //展示积分列表
  showScore: function (event) {
    var that = this;
    that.setData({
      scoreHide: 0,
      maskShow: 1,
      scrollTop: 0
    })
  },
  //跳转到平台优惠券
  showPtJuan: function (event) {
    var that = this;
    that.setData({
      juanHide: 0,
      maskShow: 1,
      scrollTop: 0
    })
  },
  //跳转到商家优惠券
  showShopJuan: function (event) {
    var that = this;
    that.setData({
      shopjuanHide: 0,
      maskShow: 1,
      scrollTop: 0
    })
  },
  //显示更多商品
  showmoregoods: function (event) {
    var that = this;
    let moregood = event.currentTarget.dataset.more
    that.setData({
      moregood: moregood
    })
  },
  //关闭弹窗
  maskbind: function (event) {
    var that = this;
    that.setData({
      addressHide: 1,
      timeHide: 1,
      scoreHide: 1,
      juanHide: 1,
      shopjuanHide: 1,
      zititimeHide: 1,
      maskShow: 0,
      jfgzshow: 0
    })
  },
  //选择默认地址
  areaChange: function (e) {
    var that = this;
    let id = e.detail.value
    if (id > 0) {
      //获取地址列表
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=editaddress&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          what: 'default',
          addressid: id,
          userid: userinfo.uid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
            that.setData({
              addressHide: 1,
              maskShow: 0
            })
            let backinfo = { id: shopid }
            var pages = getCurrentPages()
            var currentPage = pages[pages.length - 1]
            currentPage.onLoad(backinfo);
          } else {
            // console.log(ops.data.msg);
            app.showToast(ops.data.msg)
          }
        }
      })
    } else {
      app.showToast('地址ID为空')
    }
  },
  //选择配送时间
  checkTime: function (e) {
    var that = this;
    let choiceTime = e.currentTarget.dataset.name
    let adrpscost = that.data.adrpscost
    let addpscost = Number(e.currentTarget.dataset.cost)-Number(adrpscost)
    if (e.currentTarget.dataset.name != '立即配送') {
      choiceTime = e.currentTarget.dataset.name + '送达'
    }
    that.setData({
      timeHide: 1,
      maskShow: 0,
      minit: e.currentTarget.dataset.val,
      choiceTime: choiceTime,
      addpscost:addpscost,
    })
    that.countcost();
  },
  //选择自提时间
  choicezitiTime: function (e) {
    var that = this;
    that.setData({
      zititimeHide: 1,
      maskShow: 0,
      zititime: e.currentTarget.dataset.time
    })
  },
  checkztphone: function (e) {
    var that = this;
    //console.log(e);
    ziti_phone = e.detail.value
    that.setData({
      ziti_phone: ziti_phone
    })
  },
  //选择积分抵扣
  choiceScore: function (e) {
    var that = this;
    var scorecolor = scorecolor;
    if (e.currentTarget.dataset.cost == 0) {
      that.setData({
        scoreHide: 1,
        maskShow: 0,
        scorename: '不使用积分',
        scorecolor: '#808080',
        checkscore:0,
      })
    } else {
      that.setData({
        scoreHide: 1,
        maskShow: 0,
        scorename: '-￥' + e.currentTarget.dataset.cost,
        scorecolor: '#ff0000',
        checkscore:e.currentTarget.dataset.cost,
      })
    }
    that.countcost();
  },
  //选择平台优惠券
  choicePtJuan: function (e) {
    var that = this;
    var juancolor = juancolor;
    if (e.currentTarget.dataset.cost == 0) {
      that.setData({
        juanHide: 1,
        maskShow: 0,
        juanid: 0,
        juancolor: '#808080',
        juanname: '不使用优惠券',
        checkjuan:0,
      })
    } else {
      that.setData({
        juanHide: 1,
        maskShow: 0,
        juanid: e.currentTarget.dataset.id,
        juancolor: '#ff0000',
        juanname: '-￥' + e.currentTarget.dataset.cost,
        checkjuan:e.currentTarget.dataset.cost
      })
    }
    that.countcost();
  },
  //选择商家优惠券
  choiceShopJuan: function (e) {
    var that = this;
    var shopjuancolor = shopjuancolor;
    if (e.currentTarget.dataset.cost == 0) {
      that.setData({
        shopjuanHide: 1,
        maskShow: 0,
        shopjuanid: 0,
        shopjuancolor: '#808080',
        shopjuanname: '不使用优惠券',
        checkshopjuan:0,
      })
    } else {
      that.setData({
        shopjuanHide: 1,
        maskShow: 0,
        shopjuanid: e.currentTarget.dataset.id,
        shopjuancolor: '#ff0000',
        shopjuanname: '-￥' + e.currentTarget.dataset.cost,
        checkshopjuan:e.currentTarget.dataset.cost,
      })
    }
    that.countcost();
  },
  //提交订单
  formSubmit: function (e) {
    var that = this;
    let carts = []
    let cartinfo = [];
    let ggcartinfo = [];
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          if (carts[c]['dishs'] != undefined) {
            cartinfo = carts[c]['dishs']
          } else {
            cartinfo = '';
          }
          if (carts[c]['ggdishs'] != undefined) {
            ggcartinfo = carts[c]['ggdishs']
          } else {
            ggcartinfo = '';
          }
        }
      }
    } else {
      cartinfo = '';
      ggcartinfo = '';
    }
    let formData = e.detail.value
    //console.log(e);return false;
    if (cartinfo == '') {
      formData['dishs'] = '';
    } else {
      formData['dishs'] = JSON.stringify(cartinfo)
    }
    if (ggcartinfo == '') {
      formData['ggdishs'] = '';
    } else {
      formData['ggdishs'] = JSON.stringify(ggcartinfo)
    }
    formData['adcode'] = app.globalData.adcode
    formData['username'] = app.globalData.userInfo.username
    if (that.data.choiceTime == '立即配送' && formData['is_ziti'] == 0) {
      formData['is_hand'] = 1;
    } else {
      formData['is_hand'] = 0;
    }
    formData['userid'] = userinfo.uid
    if (formData['userid'] == 0) {
      app.showToast('用户uid未获取到，请先确认登录');
      return;
    }
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=makeorder&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        // console.log(ops);
        ordhide = 1;
        var newcart = [];
        if (!ops.data.error) {
          if (carts.length > 0) {
            for (var c = 0; c < carts.length; c++) {
              if (carts[c]['id'] != shopid) {
                newcart.push(carts[c]);
              }
            }
          }
          wx.setStorageSync('wmrcart', newcart)
          app.Skip('../orderpay/orderpay?id=' + ops.data.msg.id+'&sourcetype=1');
          that.setData({
            ordhide: ordhide,
          })
        } else {
          // console.log(ops.data.msg);
          app.showToast(ops.data.msg)
          ordhide = 1
          that.setData({
            ordhide: ordhide,
          })
        }
      }
    })
  }
})