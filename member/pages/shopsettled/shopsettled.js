// pages/member/member.js
var app = getApp();
var siteurl = app.globalData.siteurl;



Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    showImg:0,
    imgurl:'',
    catkey:0,
    citykey:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '商家入驻'
    })
    that.setData({
      siteurl: app.globalData.siteurl,
      version: app.globalData.version
    })
    //获取当前最新信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=shopsettled&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      success: function (ops) {
        // console.log(ops.data);
        if (!ops.data.error) {
          that.setData({
            catlist: ops.data.msg.catlist,
            catnamelist: ops.data.msg.catnamelist,
            citylist: ops.data.msg.citylist,
            citynamelist: ops.data.msg.citynamelist,
            sitephone: app.globalData.sitephone
          })
        } else {
          app.showToast(ops.data.msg);
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
  bindcity: function (e) {
    this.setData({
      citykey: e.detail.value
    })
  },
  bindshoptype: function (e) {
    this.setData({
      catkey: e.detail.value
    })
  },
  upimg: function () {
    var that = this
    wx.chooseImage({
      count: 1,// 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: siteurl + '/index.php?ctrl=other&action=appletupload&type=shopSettled&version=' + app.globalData.version + '&datatype=json',
          filePath: tempFilePaths[0],
          name: 'imgFile', //文件对应的参数名字(key)
          formData: {},  //其它的表单信息
          header: {
            "Content-Type": "multipart/form-data",
            'Content-Type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode == 200) {
              let resdata = JSON.parse(res.data)
              if (!resdata.error) {
                that.setData({
                  imgurl: resdata.msg,
                  showImg: 1
                })
              } else {
                app.showToast(res.data.msg);
                that.setData({
                  showImg: 0
                })
              }
            } else {
              app.showToast(res.errMsg);
            }
          }
        })
      }
    })
  },

  formSubmit: function (e) {
    var that = this;
    let formData = e.detail.value
    formData['shoplicense'] = that.data.imgurl;
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=sjapplyrz&version=' + app.globalData.version + '&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: formData,
      success: function (ops) {
        if (!ops.data.error) {
          app.Skip('/member/pages/shangjiaapply/shangjiaapply?applyinfo='+JSON.stringify(ops.data.msg));
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  }
})