//获取应用实例
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var page = 1;
var lng = '';
var lat = '';
var shopid = 0;
var shoptype = 0;
var shopname = '';
var cateid = 0;
var topsort = 1;
var typeshow = 0;
var siteurl = app.globalData.siteurl;
var soncate = 0;
var opentype = 0;
var ordhide = 0;
var gghide = 0;
var refresh = 0;
var productname = '';
var logattrid = '';

Page({
  data: {
    list:[],
    cxlist:[],
    simplerule:[],
    shopjuan:[],
    newtypelist: [],
    scrollTop: 0,
    scrollHeight: 0,
    cxdisplay:0,
    topsort:topsort,
    opentype: opentype,
    productname: productname,
    loginShow:0,
   },
 /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoad: function (option) {
    shopid = option.id;
    shoptype = option.shoptype;
    wx.setStorageSync('ordersource','1');
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      backpage:2
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return{
      title: shopname,
      path:'/pages/shop/shop?id='+shopid+'&shoptype='+shoptype
    }
  },
  onShow: function () {
    var that = this;
    soncate = 0;
    typeshow = 0;
    topsort = 1;
    page = 1;
    ordhide = 0;
    gghide = 0;
    refresh = 0;
    cateid = 0;
    if(shoptype == 1){
        typeshow = 1;
    }
    var userid=0;
    if(app.checkLogin()){
      userid = app.globalData.userInfo.uid;
    }
    that.setData({
      list: []
    })
    //console.log(app.globalData);
    //获取店铺商品分类
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=shopgoodstype&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        shoptype: shoptype,
        id: shopid,
        userid: userid,
        lat:app.globalData.latitude,
        lng:app.globalData.longitude,
      },
      success: function (ops) {
        // console.log(ops);
        var cxlist = []
        if (!ops.data.error) {
          shopname = ops.data.msg.shopinfo.shopname;
          wx.setNavigationBarTitle({
            title: shopname
          })
          var typelist = ops.data.msg.goodstype;
          if (typelist.length > 0){
            cateid = typelist[0].id;
          }
          var favoriteImg = '';
          if (ops.data.msg.collect == 1) {
            favoriteImg = '/images/icon-xx02.png';
          }else{
            favoriteImg = '/images/icon-xx01.png';
          }
          GetList(that);
          var newtypelist = [];
          newtypelist.push(typelist[0]);
          cxlist = ops.data.msg.cxlist
          that.setData({
            showtypelist: typelist,
            checkcate: cateid,
            typeshow: typeshow,
            newtypelist: newtypelist,
            simplerule:ops.data.msg.simplerule,
            shopjuan:ops.data.msg.shopjuan,
            checksoncate: soncate,
            psinfo: ops.data.msg.psinfo,
            gghide: gghide,
            shopid: shopid,
            shopinfo: ops.data.msg.shopinfo,
            cxlist: cxlist,
            favoriteImg: favoriteImg,
          })
        } else {
          app.showToast(ops.data.msg);
        }
        wx.getSystemInfo({
          success: function (res) {
            // console.info(res);
            var simplerule = that.data.simplerule;
            var shopjuan = that.data.shopjuan;
            var height = res.windowHeight;
            height = height - 260
            if (shopjuan.length>0) {
              height = height - 22
            }
            if (simplerule.length > 0) {
              height = height - 36
            }
            if(typeshow == 1) {
              height = height - 46;
            }
            that.setData({
              scrollHeight: height
            });
          }
        });
      }
    })
   },
  //点击顶部切换菜单
  topOnclick: function (event) {
    var goUrl = event.currentTarget.dataset.url;
    app.redirectSkip('/pages/shop/' + goUrl + '/' + goUrl + '?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype);
  },
  //监听滚动
  scroll: function (e) {
    //  console.log(e.detail.scrollTop) ;
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.info(res);
        var scrollTop = e.detail.scrollTop;
        var simplerule = that.data.simplerule;
        var shopjuan = that.data.shopjuan;
        var height = res.windowHeight;
        height = height - 260
        if (shopjuan.length>0) {
          height = height - 22
        }
        if (simplerule.length > 0) {
          height = height - 36
        }
        if(typeshow == 1) {
          height = height - 46;
        }
        that.setData({
          scrollHeight: height,
          scrollTop: scrollTop
        });
      }
    });
  },
  //收藏操作
  myFavorite: function (event) {
    var that = this;
    if (app.checkLogin()) {
      //获取用户最新信息
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=myFavorite&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid: app.globalData.userInfo.uid,
          collectid: shopid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
            var favoriteImg = '/images/icon-xx01.png';
            if (ops.data.msg.collect == 1){
              app.showToast('收藏成功');
              favoriteImg = '/images/icon-xx02.png';
            }else{
              app.showToast('取消收藏');
            }
            that.setData({
              favoriteImg: favoriteImg,
            })
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      that.setData({
        loginShow:1
      })
    }
  },
  //领取优惠券
  receiveJuan:function(e){
    var that = this;
    let juanid = e.currentTarget.dataset.juanid
    if(app.checkLogin()){
      let userid = app.globalData.userInfo.uid
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=getshopjuan&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          shopid: shopid,
          juanid:juanid,
          userid:userid
        },
        success: function (ops) {
          // console.log(ops);
          if (!ops.data.error) {
            let shopjuan = that.data.shopjuan
            let menu = shopjuan.find(function (v) {
              return v.id == juanid
            })
            if(menu.canget == 1){
              menu.canget = 0
            }
            that.setData({
              shopjuan:shopjuan
            })
            app.showToast('领取成功');
          } else {
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      app.showToast('您还未登陆，请先登陆后再来领取');
    }
  },
  toShopSearch:function(e){
    var that = this;
    app.Skip('/pages/shop/shopsearch/shopsearch?shopid='+shopid+'&shopname='+shopname);
  },
  //活动显示隐藏
  showCx: function (event) {
    var cxdisplay = event.currentTarget.dataset.val;
    var that = this;
    that.setData({
      cxdisplay: cxdisplay
    })
  },
  //点击去支付
  gotoPay: function (event) {
    var that = this;
    let cartinfo = [];
    let ggcartinfo = [];
    let carts = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    var emptyMsg = 0
    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          if (carts[c]['dishs'] != undefined) {
            cartinfo = carts[c]['dishs'];
          }
          if (carts[c]['ggdishs'] != undefined) {
            ggcartinfo = carts[c]['ggdishs'];
          }
        }
      }
      //console.log(cartinfo);
      if (cartinfo.length == 0 && ggcartinfo.length == 0){
        emptyMsg = 1
      }
    }else{
      emptyMsg = 1
    }
    if (emptyMsg == 1){
      app.showToast('购物车为空');
    }else{
      wx.navigateTo({
        url: '../placeorder/placeorder?id=' + shopid,
      })
    }
  },
  //点击一级分类操作
  cateOnclick: function (event) {
    var that = this;
    cateid = event.currentTarget.dataset.id;
    soncate = 0;
    var newtypelist = [];
    refresh = 0;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=shopgoodstype&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        shoptype: shoptype,
        id: shopid,
        cateid: cateid,
        lat: app.globalData.latitude,
        lng: app.globalData.longitude
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          var typelist = ops.data.msg.goodstype;
          newtypelist.push(typelist[0]);
          that.setData({
            list: [],
            checkcate: cateid,
            newtypelist: newtypelist,
            checksoncate: soncate
          })
          page = 1;
          GetList(that)
        } else {
          // console.log(res.data.msg);
          app.showToast(ops.data.msg);
        }
      }
    })
  },
  //点击二级分类操作
  soncateOnclick: function (event) {
    var that = this;
    soncate = event.currentTarget.dataset.id;
    that.setData({
      list: [],
      checksoncate: soncate
    })
    page = 1;
    refresh = 0;
    GetList(that)
  },
  //点击左下角购物车显示购物车列表
  bgShow: function (event) {
    var that = this;
    if (ordhide == 1){
      ordhide = 0;
    }else{
      ordhide = 1;
    }
    refresh = 1;
    GetList(that)
  },
  //清空购物车
  clearCar: function (event) {
    var that = this;

    let carts = []
    wx.setStorageSync('wmrcart', carts)

    if (ordhide == 1) {
      ordhide = 0;
    } else {
      ordhide = 1;
    }
    refresh = 1;
    GetList(that)
  },
  //点击显示规格弹窗
  ggShow: function (event) {
    console.log(event);
    var that = this;
    let data = event.currentTarget.dataset
    let productlist = [];
    let productname = '';
    let productgid = 0;
    let carts = []
    let ggcartinfo = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    //console.log( carts);
    let firstgg = ''
    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          if (carts[c]['ggdishs'] != undefined) {
            for (var ga = 0; ga < carts[c]['ggdishs'].length; ga++) {
              if (carts[c]['ggdishs'][ga]['gid'] == data.id && carts[c]['ggdishs'][ga]['count'] > 0){
                firstgg = carts[c]['ggdishs'][ga]
              }
            }
          }
        }
      }
    }
    let checkattr = '';
    if (firstgg != '') {
      checkattr = firstgg.attrid;
    }
    //console.log(firstgg);
    logattrid = checkattr;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=foodsgg&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        id: data.id,
        attrid: checkattr
      },
      success: function (ops) {
         //console.log(ops)
        if (!ops.data.error) {
          productname = ops.data.msg.foodshow.name;
          productgid = ops.data.msg.foodshow.id;
          productlist = ops.data.msg.productinfo;
          let choiceinfo = ops.data.msg.choiceinfo;
          if (logattrid == '' && ops.data.msg.chekcstr != ''){
            logattrid = ops.data.msg.chekcstr;
          }

          let productinfo = [];
          /*
          if (firstgg != '') {
            productinfo = {
              id: firstgg.id,
              gid: firstgg.gid,
              attrid: firstgg.attrid,
              price: firstgg.price,
              stock: firstgg.stock,
              name: firstgg.name,
              attrname: firstgg.attrname,
              pic: firstgg.pic,
              bagcost: firstgg.bagcost,
              cxnum: firstgg.cxnum,
              count: firstgg.count
            }
          } else {*/
            //console.log(choiceinfo.is_cx+"xxxxx");
            productinfo = {
              id: choiceinfo.id,
              gid: choiceinfo.goodsid,
              attrid: choiceinfo.attrids,
              price: choiceinfo.newcost,
              oldcost:choiceinfo.oldcost,
              stock: choiceinfo.stock,
              name: ops.data.msg.foodshow.name,
              attrname: choiceinfo.attrname,
              pic: ops.data.msg.foodshow.img,
              bagcost: ops.data.msg.foodshow.bagcost,
              cxnum: choiceinfo.cxnum,
              iscx: choiceinfo.is_cx,
              count: firstgg.count
           // }
          }
          gghide = 1;
          that.setData({
            gghide: gghide,
            productlist: productlist,
            productname: productname,
            productgid: productgid,
            productinfo: productinfo
          })
        }
      }
    })
  },
  //点击规格选中状态
  choiceattr: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=doselectproduct&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        goodsid: data.gid,
        ggdetid: data.id,
        attrid: logattrid,
        mainid: data.main
      },
      success: function (ops) {
        if (!ops.data.error) {
          let carts = []
          let ggcartinfo = []
          try {
            carts = wx.getStorageSync('wmrcart')
          } catch (e) {

          }
          if (carts.length > 0) {
            for (var c = 0; c < carts.length; c++) {
              if (carts[c]['id'] == shopid) {
                if (carts[c]['ggdishs'] != undefined) {
                  ggcartinfo = carts[c]['ggdishs'];
                }
              }
            }
          }
          logattrid = ops.data.msg.chekcstr;
          let productlist = ops.data.msg.productinfo;
          let productinfo = [];
          let newcount = 0;
          if (ops.data.msg.productlist != '') {
            if (ggcartinfo.length > 0) {
              for (var g = 0; g < ggcartinfo.length; g++) {
                if (ggcartinfo[g]['id'] == ops.data.msg.productlist.id) {
                  newcount = ggcartinfo[g]['count'];
                }
              }
            }
            productinfo = {
              id: ops.data.msg.productlist.id,
              gid: ops.data.msg.productlist.goodsid,
              attrid: ops.data.msg.productlist.attrids,
              price: ops.data.msg.productlist.newcost,
              oldcost: ops.data.msg.productlist.oldcost,
              stock: ops.data.msg.productlist.stock,
              name: ops.data.msg.foodshow.name,
              attrname: ops.data.msg.productlist.attrname,
              pic: ops.data.msg.foodshow.img,
              bagcost: ops.data.msg.foodshow.bagcost,
              cxnum: ops.data.msg.productlist.cxnum,
              count: newcount,
              iscx:ops.data.msg.productlist.is_cx
            }
          } else {
            productinfo = {
              id: 0,
              gid: 0,
              attrid: '',
              price: 0,
              oldcost:0,
              stock: 0,
              name: '',
              attrname: '',
              pic: '',
              bagcost: 0,
              cxnum: 0,
              count: 0,
              iscx:0
            }
          }
          that.setData({
            productlist: productlist,
            productinfo: productinfo
          })
        }
      }
    })
  },
  //点击灰色背景隐藏购物车和规格弹窗
  maskbind: function (event) {
    var that = this;
    ordhide = 0;
    gghide = 0;
    that.setData({
      ordhide: ordhide,
      gghide: gghide
    })
  },
  //普通商品购物车减1
  downGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let carts = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    let menu = carts.find(function (v) {
      return v.id == shopid
    })
    let dish = menu.dishs.find(function (v) {
      return v.id == data.id
    })

    if (dish.count <= 0)
      return
    dish.count -= 1;
    wx.setStorageSync('wmrcart', carts)
    refresh = 1;
    GetList(that);
  },
  //规格商品购物车减1
  downggGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let carts = []
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }
    let menu = carts.find(function (v) {
      return v.id == shopid
    })
    let ggdish = menu.ggdishs.find(function (v) {
      return v.id == data.id
    })



    if (ggdish.count <= 0)
      return
    ggdish.count -= 1;
    wx.setStorageSync('wmrcart', carts)
    let proMenu = carts.find(function (v) {
      return v.id == shopid
    })
    let proDish = proMenu.ggdishs.find(function (v) {
      return v.id == data.id
    })
    that.setData({
      productinfo: proDish
    })
    refresh = 1;
    GetList(that);
  },
  //普通商品购物车加1
  addGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let carts = []
    carts = wx.getStorageSync('wmrcart')
    let cartinfo = [];
    let checkshop = 0;
    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          checkshop = 1;
          if (carts[c]['dishs'] != undefined) {
            cartinfo = carts[c]['dishs'];
          }
        }
      }
    }
    if (data.stock < 1) {
      app.showToast('库存不足');
      return
    }
    if (cartinfo.length > 0){
      let menu = carts.find(function (v) {
        return v.id == shopid
      })
      let dish = menu.dishs.find(function (v) {
        return v.id == data.id
      })
      if (dish != undefined){
        if (data.stock < dish.count + 1) {
          app.showToast('库存不足');
          return
        }
        if (data.iscx !=0 && data.cxnum>0 && data.cxnum < dish.count + 1 ) {
          app.showToast('已超过最大限购数量');
          return
        }
        dish.count += 1;
      }else{
        let newinfo = {
          id: data.id,
          price: data.cost,
          oldcost: data.oldcost,
          stock: data.stock,
          name: data.name,
          pic: data.pic,
          bagcost: data.bagcost,
          cxnum: data.cxnum,
          iscx: data.iscx,
          count: 1
        }
        cartinfo.push(newinfo);
        for (var c = 0; c < carts.length; c++) {
          if (carts[c]['id'] == shopid) {
            carts[c]['dishs'] = cartinfo;
          }
        }
      }
    }else{
      let newsetcart = {
        id: shopid,
        dishs: [
          {
            id: data.id,
            price: data.cost,
            oldcost: data.oldcost,
            stock: data.stock,
            name: data.name,
            pic: data.pic,
            bagcost: data.bagcost,
            cxnum: data.cxnum,
            iscx: data.iscx,
            count: 1
          }
        ]
      }
      let resetcart = [
        {
          id: data.id,
          price: data.cost,
          oldcost: data.oldcost,
          stock: data.stock,
          name: data.name,
          pic: data.pic,
          bagcost: data.bagcost,
          cxnum: data.cxnum,
          iscx: data.iscx,
          count: 1
        }
      ]
      if (carts.length > 0){
        if (checkshop == 1){
          for (var c = 0; c < carts.length; c++) {
            if (carts[c]['id'] == shopid) {
              carts[c]['dishs'] = resetcart;
            }
          }
        }else{
          carts.push(newsetcart);
        }

      }else{
        carts = [newsetcart];
      }
    }
    //console.log('dbddbdbdbdbd');console.log(carts);
    wx.setStorageSync('wmrcart', carts)
    refresh = 1;
    GetList(that);

  },
  //规格商品购物车加1
  addggGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let ggcartinfo = [];
    let carts = []
    let checkshop = 0;
    try {
      carts = wx.getStorageSync('wmrcart')
    } catch (e) {

    }

    if (carts.length > 0) {
      for (var c = 0; c < carts.length; c++) {
        if (carts[c]['id'] == shopid) {
          checkshop = 1;
          if (carts[c]['ggdishs'] != undefined) {
            ggcartinfo = carts[c]['ggdishs'];
          }
        }
      }
    }
    if (data.stock < 1){
      app.showToast('库存不足');
      return
    }
    if (ggcartinfo.length > 0) {
      let menu = carts.find(function (v) {
        return v.id == shopid
      })
      // console.log(carts);

      let dish = menu.ggdishs.find(function (v) {
        return v.id == data.id
      })
      var bugNum = 0
      for (var g = 0; g < ggcartinfo.length; g++) {
        if (ggcartinfo[g]['gid'] == data.gid) {
          bugNum += ggcartinfo[g]['count']
        }
      }


      if (data.iscx !=0 && data.cxnum > 0 && data.cxnum < bugNum + 1) {
        app.showToast('已超过最大限购数量');
        return
      }
      if (dish != undefined) {

        if (data.stock < dish.count + 1){
          app.showToast('库存不足');
          return
        }
        dish.count += 1;
        dish.iscx = data.iscx;
        dish.cxnum = data.cxnum;
        for(var i=0;i< carts.length;i++){
        }
      } else {
        let newinfo = {
          id: data.id,
          gid: data.gid,
          attrid: data.attrid,
          price: data.cost,
          oldcost: data.oldcost,
          stock: data.stock,
          name: data.name,
          attrname:  data.attrname,
          pic: data.pic,
          bagcost: data.bagcost,
          cxnum: data.cxnum,
          count: 1,
          iscx:data.iscx
        }
        ggcartinfo.push(newinfo);
        for (var c = 0; c < carts.length; c++) {
          if (carts[c]['id'] == shopid) {
            carts[c]['ggdishs'] = ggcartinfo;
          }
        }
      }
    } else {
      let newsetcart = {
        id: shopid,
        ggdishs: [
          {
            id: data.id,
            gid: data.gid,
            attrid: data.attrid,
            price: data.cost,
            oldcost: data.oldcost,
            stock: data.stock,
            name: data.name,
            attrname: data.attrname,
            pic: data.pic,
            bagcost: data.bagcost,
            cxnum: data.cxnum,
            count: 1,
            iscx:data.iscx
          }
        ]
      }
      let resetcart = [
        {
          id: data.id,
          gid: data.gid,
          attrid: data.attrid,
          price: data.cost,
          oldcost: data.oldcost,
          stock: data.stock,
          name: data.name,
          attrname: data.attrname,
          pic: data.pic,
          bagcost: data.bagcost,
          cxnum: data.cxnum,
          count: 1,
          iscx:data.iscx
        }
      ]
      if (carts.length > 0) {
          if (checkshop == 1){
             for (var c = 0; c < carts.length; c++) {
                 if (carts[c]['id'] == shopid) {
                   carts[c]['ggdishs'] = resetcart;
                 }
             }
         }else{
            carts.push(newsetcart);
         }
      } else {
        carts = [newsetcart];
      }
    }
    wx.setStorageSync('wmrcart', carts)
    let proMenu = carts.find(function (v) {
      return v.id == shopid
    })
    let proDish = proMenu.ggdishs.find(function (v) {
      return v.id == data.id
    })
    that.setData({
      productinfo: proDish
    })

    refresh = 1;
    GetList(that);
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      currentPage.onShow();
      that.setData({
        loginShow:0
      });
    })
  },
})


var GetList = function (that) {
  that.setData({
    hidden: false
  });
  var paramcateid = cateid;
  if (soncate > 0){
    paramcateid = soncate;
  }
  //获取店铺列表信息
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=catefoods&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      shopid:shopid,
      shoptype: shoptype,
      curcateid: paramcateid
    },
    success: function (ops) {
      var list = that.data.list;
      let cartinfo = [];
      let ggcartinfo = [];
      let carts = []
      try {
        carts = wx.getStorageSync('wmrcart')
      } catch (e) {

      }

      if (carts.length > 0){
        for (var c = 0; c < carts.length; c++) {
          if (carts[c]['id'] == shopid){
            if (carts[c]['dishs'] != undefined){
              cartinfo = carts[c]['dishs'];
            }
            if (carts[c]['ggdishs'] != undefined) {
              ggcartinfo = carts[c]['ggdishs'];
            }
          }
        }
      }
      let total = {
        count: 0,
        money: 0
      };
      if (cartinfo.length > 0 || ggcartinfo.length > 0) {
        if (cartinfo.length > 0) {
          for (var t = 0; t < cartinfo.length; t++) {
            total.count += cartinfo[t]['count']
            total.money += cartinfo[t]['count'] * cartinfo[t]['price']
          }
        }
        if (ggcartinfo.length > 0) {
          for (var gg = 0; gg < ggcartinfo.length; gg++) {
            total.count += ggcartinfo[gg]['count']
            total.money += ggcartinfo[gg]['count'] * ggcartinfo[gg]['price']
          }
        }
        total.money = total.money.toFixed(2)
      }else{
        if (ordhide == 1){
          ordhide = 0;
        }
      }

      opentype = ops.data.msg.opentype;

      if (ops.data.msg.catefoodslist.length > 0 && refresh == 0){
        for (var i = 0; i < ops.data.msg.catefoodslist.length; i++) {
          list.push(ops.data.msg.catefoodslist[i]);
        }
      }
      let limitcost = 0;
      if (ops.data.msg.shopdet.limitcost > 0){
        limitcost = ops.data.msg.shopdet.limitcost - total.money;
        if (limitcost <= 0) {
          limitcost = 0;
        }
      }

      if (list.length > 0) {
        if (cartinfo.length > 0) {
          for (var x = 0; x < list.length; x++) {
            for(var g = 0; g < list[x]['goodslist'].length;g++){
              for (var t = 0; t < cartinfo.length; t++) {
                if (list[x]['goodslist'][g]['id'] == cartinfo[t]['id']) {
                  list[x]['goodslist'][g]['cartnum'] = cartinfo[t]['count'];
                }
              }
            }
          }
        }else{
          for (var x = 0; x < list.length; x++) {
            for (var g = 0; g < list[x]['goodslist'].length; g++) {
                list[x]['goodslist'][g]['cartnum'] = 0;
            }
          }
        }
      }
      //console.log(list);
      that.setData({
        list: list,
        opentype: opentype,
        total: total,
        limitcost: limitcost.toFixed(2),
        cartinfo: cartinfo,
        ggcartinfo: ggcartinfo,
        ordhide: ordhide
      });
      page++;
      that.setData({
        hidden: true
      });


    },
    fail: function (error) {
      app.showToast(error);
    }
  })



}

