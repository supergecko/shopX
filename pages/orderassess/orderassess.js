// pages/evaluateorder/evaluateorder.js\
var app = getApp();
var siteurl = app.globalData.siteurl;
var orderid = 0;
var userInfo = [];
var imgcount = 9;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseColor: '#00cd85', // 主体色
    population: 5,
    distribution: 5,
    allpoint: 5,
    pspoint:5,
    uploadlist:[],
    uploadhide:0,
    type:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    orderid = options.id;
    wx.setNavigationBarTitle({
      title: '订单评价'
    })
    if(app.checkLogin()){
      userInfo = app.globalData.userInfo
      //获取评价信息
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=commentorder&version=' + app.globalData.version + '&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          orderid: orderid,
          userid: userInfo.uid
        },
        success: function (ops) {
          if (!ops.data.error) {
            that.setData({
              goodslist: ops.data.msg.goodslist,
              orderid: orderid,
              shoplogo: ops.data.msg.shoplogo,
              shopname: ops.data.msg.shopname,
              type: ops.data.msg.type,
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
  //点击配送服务
  bindDistribution: function (event) {
    var that = this;
    var distribution = that.data.distribution;
    let datatype = event.currentTarget.dataset.type;
    let index = event.currentTarget.dataset.index;
    index = index + 1
    if (datatype == 1) {
      distribution = index;
    } else if (datatype == 2) {
      distribution = distribution + index
    }
    that.setData({
      distribution: distribution
    })
  },
  //点击商家评价
  bindPopulation: function (event) {
    var that = this;
    var population = that.data.population;
    let datatype = event.currentTarget.dataset.type;
    let index = event.currentTarget.dataset.index;
    index = index + 1
    if (datatype == 1) {
      population = index;
    } else if (datatype == 2) {
      population = population + index
    }
    that.setData({
      population: population
    })
  },
  //跑腿点击配送服务
  bindPsPoint: function (event) {
    var that = this;
    var pspoint = that.data.pspoint;
    let datatype = event.currentTarget.dataset.type;
    let index = event.currentTarget.dataset.index;
    index = index + 1
    if (datatype == 1) {
      pspoint = index;
    } else if (datatype == 2) {
      pspoint = pspoint + index
    }
    that.setData({
      pspoint: pspoint
    })
  },
  //跑腿点击总体评价
  bindAllpoint: function (event) {
    var that = this;
    var allpoint = that.data.allpoint;
    let datatype = event.currentTarget.dataset.type;
    let index = event.currentTarget.dataset.index;
    index = index + 1
    if (datatype == 1) {
      allpoint = index;
    } else if (datatype == 2) {
      allpoint = allpoint + index
    }
    that.setData({
      allpoint: allpoint
    })
  },
  //上传图片
  upimg: function () {
    var that = this;
    let newlist = that.data.uploadlist
    let uploadhide = 0
    imgcount = 9-Number(newlist.length)
    wx.chooseImage({
      count: imgcount,// 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if(newlist.length>0){
          if(Number(newlist.length)+Number(tempFilePaths.length)>9){
            var cannum = 9-Number(newlist.length);
            app.showToast('您最多可以上传'+cannum+'张');
            return
          }
        }
        if(tempFilePaths.length>0){
          for(var i=0;i<tempFilePaths.length;i++){
            wx.uploadFile({
              url: siteurl + '/index.php?ctrl=other&action=appletupload&type=comment&version=' + app.globalData.version + '&datatype=json',
              filePath: tempFilePaths[i],
              name: 'imgFile', //文件对应的参数名字(key)
              formData: {},  //其它的表单信息
              header: {
                "Content-Type": "multipart/form-data",
                'Content-Type': 'application/json'
              },
              success: function (res) {
                if (res.statusCode == 200) {
                  let resdata = JSON.parse(res.data)
                  if (!resdata.error){
                    newlist.push(resdata.msg)
                    if(newlist.length==9){
                      uploadhide =1
                    }else{
                      uploadhide =0
                    }

                    that.setData({
                      uploadlist:newlist,
                      uploadhide:uploadhide,
                      imgcount:imgcount
                    })
                  } else {
                    app.showToast(res.data.msg);
                  }
                } else {
                  app.showToast(res.errMsg);
                }
              }
            })
          }
          imgcount = 9-Number(newlist.length);
          that.setData({
            imgcount:imgcount
          })
        }
      }
    })
  },
  delNowImg:function(e){
    var that = this;
    let delindex = e.currentTarget.dataset.delindex
    let oldlist = e.currentTarget.dataset.imglist
    let newlist = []
    for(var i=0;i<oldlist.length;i++){
      if(i==delindex){

      }else{
        newlist.push(oldlist[i])
      }
    }
    imgcount = 9-Number(newlist.length);
    let uploadhide = 0
    if(newlist.length<9){
      uploadhide = 0
    }else{
      uploadhide = 1
    }
    that.setData({
      uploadlist:newlist,
      uploadhide:uploadhide
    })

  },
  //提交评价
  formSubmit: function (e) {
    var that = this;
    let formData = e.detail.value
    //console.log(formData);
    //return false;
    if(formData['sjpoint']<1){
      if(that.data.type==1){
        app.showToast('请给商家评分');
        return
      }
      if(that.data.type==2){
        app.showToast('请给总体评分');
        return
      }
    }
    if(formData['pspoint']<1){
      app.showToast('请给配送服务评分');
      return
    }
    formData['imgstr'] = that.data.uploadlist
    formData['userid'] = userInfo.uid
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=yijianping&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: formData,
      success: function (ops) {
        if (!ops.data.error) {
          //return false;
          wx.navigateBack();
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})