var app = getApp();
var siteurl = app.globalData.siteurl;
var shopid = 0;
var shoptype = 0;
var shopname = '';
var page = 1;
var lng = '';
var lat = '';
var loadshow = 2;
var img_box_list = [];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    is_showimg:0,
    img_box_list:[],
    maskshow:0,
    imgindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    shopid = options.id;
    shoptype = options.shoptype;
    page = 1;

    //获取店铺顶部评价信息
    wx.request({
      url: siteurl + '/index.php?ctrl=applet&action=getshopcomment&version='+app.globalData.version+'&datatype=json',
      header: { 'Content-Type': 'application/json' },
      data: {
        shopid: shopid
      },
      success: function (ops) {
        // console.log(ops);
        if (!ops.data.error) {
          shopname = ops.data.msg.shopinfo.shopname;
          wx.setNavigationBarTitle({
            title: shopname
          })

          GetList(that);
          that.setData({
            zonghefen: ops.data.msg.zonghefen,
            zongtistart: ops.data.msg.zongtistart,
            psfuwustart: ops.data.msg.psfuwustart,
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
     var that = this;
       GetList(that);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //点击顶部切换菜单
  topOnclick: function (event) {
    var goUrl = event.currentTarget.dataset.url;
    // console.log(goUrl);
    if (goUrl == 'orderingshop') {
      var url = '/pages/shop/' + goUrl + '/' + goUrl + '?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype;
    }else{
      var url = '/pages/shop/' + goUrl + '?id=' + shopid + '&shopname=' + shopname + '&shoptype=' + shoptype;
    }
    app.redirectSkip(url)
  },
  hideImg:function(e){
    var that = this;
    that.setData({
      is_showimg:0,
      img_box_list:[],
      maskshow:0
    })
  },
  showImgBox:function(e){
    var that = this;
    img_box_list = e.currentTarget.dataset.imglist
    let imgindex = e.currentTarget.dataset.imgindex
    that.setData({
      is_showimg:1,
      img_box_list:img_box_list,
      maskshow:1,
      imgindex:imgindex
    })
  },
})


var GetList = function (that) {
  //获取评价列表信息
  wx.request({
    url: siteurl + '/index.php?ctrl=applet&action=getshopmorecomment&version='+app.globalData.version+'&datatype=json',
    header: { 'Content-Type': 'application/json' },
    data: {
      page: page,
      shopid: shopid
    },
    success: function (ops) {
      var list = that.data.list;
      if (ops.data.error == true) {
        loadshow = 2;
        // console.log(ops.data.msg);
      } else {
        if (ops.data.msg.commentlist.length > 0) {
          for (var i = 0; i < ops.data.msg.commentlist.length; i++) {
            ops.data.msg.commentlist[i].shoppoint = Number(ops.data.msg.commentlist[i].shoppoint);
            list.push(ops.data.msg.commentlist[i]);
          }
          loadshow = 0;
        }else{
          if(page == 1){
            loadshow = 2;
          }else{
            loadshow = 1;
          }
        }
      }
      // console.log(loadshow)

      page++;
      that.setData({
        list: list,
        loadshow: loadshow
      });
    },
    fail: function (error) {
      console.log('获取评价列表失败：');
      console.log(error);
    }
  })
}