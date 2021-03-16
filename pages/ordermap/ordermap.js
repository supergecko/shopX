var app = getApp();
var siteurl = app.globalData.siteurl;
var userinfo = []
var amapFile = require('../../libs/amap-wx.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    polyline:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderid = options.id;
    userinfo = app.globalData.userInfo
    wx.setNavigationBarTitle({
      title: '位置'
    })
    wx.getSystemInfo({
      success: function (res) {
      // console.log(res);
        that.setData({
          windowHeight: res.windowHeight
        });
      }
    });
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
          var orderinfo = ops.data.msg.order 
          var showPoly = 0
          var markers = [] 
          var polyline = []   
          if (orderinfo.buyerlng != '' && orderinfo.buyerlng != undefined && orderinfo.buyerlat != '' && orderinfo.buyerlat != undefined){
            showPoly += 1
            var buyerLocation = {
              iconPath: "/images/order_dw.png",            
              latitude: orderinfo.buyerlat,
              longitude: orderinfo.buyerlng,
              width: 30,
              height: 30
            }
            markers.push(buyerLocation)
          }
          if (orderinfo.shoplng != '' && orderinfo.shoplng != undefined && orderinfo.shoplat != '' && orderinfo.shoplat != undefined) {           
            var shopLocation = {
              iconPath: "/images/order_sjwz.png",              
              latitude: orderinfo.shoplat,
              longitude: orderinfo.shoplng,
              width: 30,
              height: 30
            }
            markers.push(shopLocation)
          }
          if (ops.data.msg.psbpsyinfo.posilnglatarr != undefined) {
            showPoly += 1
            var psyLocation = {
              iconPath: "/images/psylocation_icon.png",              
              latitude: ops.data.msg.psbpsyinfo.posilnglatarr[1],
              longitude: ops.data.msg.psbpsyinfo.posilnglatarr[0],
              width: 30,
              height: 30
            }
            markers.push(psyLocation)
          } 
          console.log('showPoly'+showPoly);         
          if (showPoly == 2){
            console.log(showPoly);
            if (orderinfo.status == 2){
              var key = app.globalData.mapKey;
              var myAmapFun = new amapFile.AMapWX({key: key});
              myAmapFun.getDrivingRoute({
                origin: ops.data.msg.psbpsyinfo.posilnglat,
                destination: orderinfo.buyerlng + ',' + orderinfo.buyerlat,
                success: function (data) {
                  var points = [];
                  if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                      var poLen = steps[i].polyline.split(';');
                      for (var j = 0; j < poLen.length; j++) {
                        points.push({
                          longitude: parseFloat(poLen[j].split(',')[0]),
                          latitude: parseFloat(poLen[j].split(',')[1])
                        })
                      }
                    }
                  }
                  that.setData({
                    orderinfo: orderinfo,
                    markers: markers,
                    polyline: [{
                      points: points,
                      color: "#0091ff",
                      width: 3
                    }]
                  });

                },
                fail: function (info) {

                }
              })
            } else if (orderinfo.status == 3){
                polyline = [{
                  points: [{
                    longitude: ops.data.msg.psbpsyinfo.posilnglatarr[0],
                    latitude: ops.data.msg.psbpsyinfo.posilnglatarr[1]
                  }, {
                    longitude: orderinfo.buyerlng,
                    latitude: orderinfo.buyerlat
                  }],
                  color: "#0091FF",
                  width: 3,
                  dottedLine: true
                }]
              }  
              that.setData({
                orderinfo: orderinfo,
                markers: markers,
                polyline: polyline
              });                      
          }                      
          
        } else {
         
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
  
  }
})