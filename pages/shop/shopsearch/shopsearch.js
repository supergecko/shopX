//获取应用实例
var app = getApp();
var siteurl = app.globalData.siteurl;
var amapFile = require('../../../libs/amap-wx.js');
var lng = '';
var lat = '';
var shopid = 0;

var logattrid = '';

Page({
  data: {
    list:[],
    gghide:1,
    goodhide:1,
    carthide:1,
    searchVal:'',
    limitcost:0,
    maskshow:0
   },
 /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoad: function (option) {
    var that = this;
    shopid = option.shopid;
    let shopname = option.shopname;
    wx.setNavigationBarTitle({
      title: shopname
    })
    GetList(that);
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },
  onShow: function () {

   },
  checkSearch:function(e){
    var that = this;
    let searchVal = e.detail.value
    that.setData({
      searchVal:searchVal
    })
  },
  startSearch:function(e){
    var that = this;
    if(that.data.searchVal==''){
      app.showToast('请输入商品名字');
      return;
    }
    GetList(that);
  },
  //点击去支付
  gotoPay: function (event) {
    var that = this;
    let cartinfo = [];
    let ggcartinfo = [];
    let carts = []
    carts = wx.getStorageSync('wmrcart')
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
      if(cartinfo.length == 0 && ggcartinfo.length == 0){
        emptyMsg = 1
      }
    }else{
      emptyMsg = 1
    }
    if (emptyMsg == 1){
      app.showToast('购物车为空');
    }else{
      wx.navigateTo({
        url: '/pages/placeorder/placeorder?id=' + shopid,
      })
    }
  },
  //点击左下角购物车显示购物车列表
  bgShow: function (event) {
    var that = this;
    let carthide = that.data.carthide
    carthide = !carthide
    let maskshow = that.data.maskshow
    maskshow = !maskshow
    that.setData({
      carthide:carthide,
      maskshow: maskshow
    })
  },
  //清空购物车
  clearCar: function (event) {
    var that = this;
    let carts = []
    wx.setStorageSync('wmrcart', carts)
    GetList(that)
  },
  //点击显示规格弹窗
  ggShow: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let productlist = [];
    let productname = '';
    let productgid = 0;
    let carts = []
    let ggcartinfo = []
    carts = wx.getStorageSync('wmrcart')
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
          }
          that.setData({
            gghide:0,
            maskshow:1,
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
    that.setData({
      gghide: 1,
      carthide:1,
      maskshow:0
    })
  },
  //普通商品购物车减1
  downGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let carts = []
    carts = wx.getStorageSync('wmrcart')
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
    GetList(that);
  },
  //规格商品购物车减1
  downggGoods: function (event) {
    var that = this;
    let data = event.currentTarget.dataset
    let carts = []

    carts = wx.getStorageSync('wmrcart')
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
    wx.setStorageSync('wmrcart',carts)
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
    GetList(that);
  }
})


var GetList = function (that){
  let searchVal = that.data.searchVal
  //获取店铺列表信息
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=shopsearch&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      shopid:shopid,
      searchVal:searchVal,
    },
    success: function (ops) {
      let list = ops.data.msg.goodsinfo
      let shop = ops.data.msg.shop
      let cartinfo = [];
      let ggcartinfo = [];
      let carts = []
      carts = wx.getStorageSync('wmrcart')
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
      }
      let limitcost = that.data.limitcost
      if(Number(shop.limitcost) > 0){
        limitcost = Number(shop.limitcost) - total.money;
        if(limitcost <= 0) {
          limitcost = 0;
        }
      }
      limitcost = Number(limitcost).toFixed(2);
      if (list.length > 0){
        if (cartinfo.length > 0){
          for (var x = 0; x < list.length; x++) {
            for(var g = 0; g < list.length;g++){
              for (var t = 0; t < cartinfo.length; t++) {
                if (list[g]['id'] == cartinfo[t]['id']) {
                  list[g]['cartnum'] = cartinfo[t]['count'];
                }
              }
            }
          }
        }else{
          for (var x = 0; x < list.length; x++) {
            for (var g = 0; g < list.length; g++) {
                list[g]['cartnum'] = 0;
            }
          }
        }
      }
      that.setData({
        list: list,
        shopinfo: shop,
        total: total,
        psinfo: ops.data.msg.psinfo,
        openinfo: ops.data.msg.openinfo,
        limitcost: limitcost,
        cartinfo: cartinfo,
        ggcartinfo: ggcartinfo
      });
    },
    fail: function (error) {
      app.showToast(error);
    }
  })
}

