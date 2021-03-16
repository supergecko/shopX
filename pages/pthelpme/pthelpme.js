//获取应用实例
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var siteurl = app.globalData.siteurl;
var userinfo = '';
var addressid = 0;
var shopid = 0;
var km = 0;
var kmcost = 0;
var addkm = 0;
var addkmcost = 0;
var kg = 0;
var kgcost = 0;
var addkg = 0;
var addkgcost = 0;
var allkgcost=0;
var allkmcost =0;
var juli = 0;
var allcost = 0;
var addcost = 0;
var allkg = 0;
var is_default = 1;
var getaddress='';
var newaddress = '';
var shouaddress = '';
var getinfo = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pttype:'',
    buyid:'',
    movegood:'',
    cost:'',
    weight:'',
    title:[],
    goods:'',
    bqlist:[],
    maskShow:0,
    movegoodsname:'',
    movegoodscost:'',
    movegoodsweight:'',
    ptsetinfo:[],
    pstimelist:[],
    lng:'',
    lat:'',
    mapname:'',
    beizhu:'',
    check_bigadr:'请输入(默认就近购买)',
    check_lat: 0,
    check_lng:0,
    timeShow:0,
    pstime:'',
    psvalue:0,
    addcostShow:0,
    addressShow:0,
    array: ['无','家', '公司', '学校'],
    objectArray: [
      {
        id: 0,
        name: '无'
      },
      {
        id: 1,
        name: '家'
      },
      {
        id: 2,
        name: '公司'
      },
      {
        id: 3,
        name: '学校'
      }
    ]
  },
 /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var that = this;
    getinfo = options;
    let pttype = options.pttype ;
    let goods = options.searchname;
    let id =  options.id;
    let movegood =  options.movegood;
    let cost =  options.cost;
    let weight =  options.weight;
    if(pttype==2){
      wx.setNavigationBarTitle({
        title: '帮我买'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '帮我送'
      })
    }
    if(app.checkLogin()){
      userinfo = app.globalData.userInfo
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=pthelpme&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          userid:userinfo.uid,
          pttype:pttype,
          goods:goods,
          id:id,
          movegood:movegood,
          cost:cost,
          weight:weight,
          adcode: app.globalData.adcode,
          lat: app.globalData.latitude,
          lng: app.globalData.longitude,
          mapname: app.globalData.address
        },
        success: function (ops) {
          if (!ops.data.error) {
            let helpbuyinfo = ops.data.msg.helpbuyinfo
            if(ops.data.msg.pttype==2){
                if(goods !=undefined){
                   var beizhu = ops.data.msg.goods+':';
                }else{
                   var beizhu = ops.data.msg.title.name+':';
                }
                shouaddress = ops.data.msg.defaultmsg;
                allcost = Number(ops.data.msg.ptsetinfo.kmcost);
                allcost = allcost.toFixed(2);
                juli = ops.data.msg.ptsetinfo.km+'公里以内';
                allkg = 0;
                allkmcost = ops.data.msg.ptsetinfo.kmcost;
                allkgcost = 0;
            }else{
              var beizhu ='';
              shouaddress='';
              getaddress='';
              allcost = Number(ops.data.msg.ptsetinfo.kmcost)+Number(ops.data.msg.ptsetinfo.kgcost);
              allcost = allcost.toFixed(2);
              juli = ops.data.msg.ptsetinfo.km+'公里以内';
              allkg = ops.data.msg.movegoodsweight;
              allkmcost = ops.data.msg.ptsetinfo.kmcost;
              allkgcost = ops.data.msg.ptsetinfo.kgcost;
            }
            if(ops.data.msg.pstimelist.length>0){
              var pstime = ops.data.msg.pstimelist[0]['name'];
              var psvalue = ops.data.msg.pstimelist[0]['value'];
            }
             kg= ops.data.msg.ptsetinfo.kg;
             kgcost= ops.data.msg.ptsetinfo.kgcost;
             addkg =ops.data.msg.ptsetinfo.addkg;
             addkgcost=ops.data.msg.ptsetinfo.addkgcost;
             km = ops.data.msg.ptsetinfo.km;
             kmcost = ops.data.msg.ptsetinfo.kmcost;
             addkm= ops.data.msg.ptsetinfo.addkm;
             addkmcost = ops.data.msg.ptsetinfo.addkmcost;
             addcost = 0;
            that.setData({
              pttype:ops.data.msg.pttype,
              movegood:ops.data.msg.movegood,
              cost:ops.data.msg.cost,
              weight:ops.data.msg.weight,
              title:ops.data.msg.title,
              goods:ops.data.msg.goods,
              bqlist:ops.data.msg.bqlist,
              movegoodsname:ops.data.msg.movegoodsname,
              movegoodscost:ops.data.msg.movegoodscost,
              movegoodsweight:ops.data.msg.movegoodsweight,
              ptsetinfo:ops.data.msg.ptsetinfo,
              pstimelist:ops.data.msg.pstimelist,
              mapname:ops.data.msg.mapname,
              beizhu:beizhu,
              defaultmsg: ops.data.msg.defaultmsg,
              arealist: ops.data.msg.arealist,
              userInfo: userinfo,
              pstime:pstime,
              psvalue:psvalue,
              allcost:allcost,
              juli:juli,
              addcost:addcost,
              shouaddress:shouaddress,
              getaddress:getaddress,
              allkmcost:allkmcost,
              allkgcost:allkgcost,
              check_lat:ops.data.msg.lat,
              check_lng:ops.data.msg.lng,
              is_default:1
            });
          } else {
            // console.log(res.data.msg);
            app.showToast(ops.data.msg);
          }
        }
      })
    }else{
      that.setData({
        userInfo:''
      })
    }
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
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },
  //textarea 输入内容离开时他的值
  textareaVal:function(event){
     var that = this;
    // console.log(event);
     let beizhu = event.detail.value
     let beizhulen = event.detail.cursor
     if(beizhulen >49){
        app.showToast('备注内容不能超过50字');
     }else{
      that.setData({
        beizhu:beizhu
      })
     }
  },
  bindGetUserInfo: function(e) {
     var that = this;
     app.getUserInfo(function (userInfo) {
      //更新数据
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      currentPage.onLoad(getinfo);
      that.setData({
        userInfo: userInfo
      })
    })
  },
  //点击标签增加备注内容
  bqnameOnclick:function(e){
    var that = this;
    let newbeizhu = e.currentTarget.dataset.beizhu + e.currentTarget.dataset.name+','
    that.setData({
      beizhu:newbeizhu
    })
  },
 //点击购买地址进入选择地址
 gouaddressOnclick:function(event){
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        //console.log(res);
        let addressInfo ={
          address:res.address,
          lat:res.latitude,
          lng:res.longitude,
          bigadr:res.name
        }
        newaddress =  JSON.stringify(addressInfo);
        getaddress = newaddress;
        var bigadr = res.name
        if (bigadr == ''){
          bigadr = res.address
        }
        that.getlastData(shouaddress.lat,shouaddress.lng,res.latitude,res.longitude,0);
        that.setData({
            check_bigadr: bigadr,
            check_lat: res.latitude,
            check_lng: res.longitude,
            is_default:0
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
                              let addressInfo = {
                                address: res.address,
                                lat: res.latitude,
                                lng: res.longitude,
                                bigadr: res.name
                              }
                              newaddress = JSON.stringify(addressInfo);
                              getaddress = newaddress;
                              var bigadr = res.name
                              if (bigadr == '') {
                                bigadr = res.address
                              }
                              that.getlastData(shouaddress.lat, shouaddress.lng, res.latitude, res.longitude, 0);
                              that.setData({
                                check_bigadr: bigadr,
                                check_lat: res.latitude,
                                check_lng: res.longitude,
                                is_default: 0
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
  //关闭弹窗
  maskbind: function (event) {
    var that = this;
    that.setData({
      addressHide: 1,
      timeHide:1,
      scoreHide: 1,
      addressShow:0,
      maskShow: 0
    })
  },
  //展示地址列表
  showAddress: function (event) {
    var that = this;
    var addresstype = event.currentTarget.dataset.addresstype;
    //console.log(event);
    that.setData({
      addressHide: 0,
      maskShow: 1,
      scrollTop: 0,
      addresstype:addresstype
    })
  },
   //进入编辑、添加地址
  editAddress: function (event) {
    var that = this;
    let addressid = event.currentTarget.dataset.id
    let addresstype = event.currentTarget.dataset.addresstype
    let addresstitle=''
    that.setData({
      addressHide: 1,
      maskShow: 1,
      addressShow:1,
      addresstype: addresstype
    })
     if (addressid > 0) {
            if(addresstype=='shou'){
                addresstitle = '编辑收货地址';
            }else{
                addresstitle = '编辑取货地址';
            }
            //获取地址信息
            wx.request({
              url: siteurl + '/index.php?ctrl=applet&action=oneAddress&version='+app.globalData.version+'&datatype=json',
              header: { 'Content-Type': 'application/json' },
              data: {
                id: addressid,
                userid: userinfo.uid
              },
              success: function (res) {
                if (!res.data.error) {
                  if(addresstype=='shou'){
                      shouaddress = res.data.msg.info;
                        that.setData({
                          shou_tag: shouaddress.tag,
                          shou_bigadr: shouaddress.bigadr,
                          shou_lat: shouaddress.lat,
                          shou_lng: shouaddress.lng,
                          addresstitle:addresstitle,
                          addressid:addressid,
                          arealist:res.data.msg.arealist
                        })
                  }else{
                      getaddress = res.data.msg.info;
                        that.setData({
                            get_tag: getaddress.tag,
                            get_bigadr: getaddress.bigadr,
                            get_lat: getaddress.lat,
                            get_lng: getaddress.lng,
                            addresstitle:addresstitle,
                            addressid:addressid,
                            arealist:res.data.msg.arealist
                        })
                  }
                } else {
                  app.showToast(res.data.msg);
                }
              }
            })
          } else {
            if(addresstype=='shou'){
                addresstitle = '新增收货地址'
                shouaddress = ''
                that.setData({
                  shouaddress: shouaddress,
                  shou_tag: 0,
                  shou_bigadr: '点击选择地址',
                  shou_lat: '',
                  shou_lng: '',
                  addresstitle:addresstitle,
                })
            }else{
                addresstitle = '新增取货地址'
                getaddress = ''
                that.setData({
                  getaddress: getaddress,
                  get_tag: 0,
                  get_bigadr: '点击选择地址',
                  get_lat: '',
                  get_lng: '',
                  addresstitle:addresstitle,
                })
            }

          }
  },
  //选择默认地址
  areaChange: function (e) {
    var that = this;
    let addressid = e.currentTarget.dataset.addressid
    var addresstype = e.currentTarget.dataset.addresstype
    if (addressid > 0) {
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=changeAddress&version='+app.globalData.version+'&datatype=json',
        header: { 'Content-Type': 'application/json' },
        data: {
          addressid: addressid,
          userid: userinfo.uid,
        },
        success: function (ops) {
          if (!ops.data.error) {
            if(addresstype=='shou'){
                shouaddress = ops.data.msg.info;
                if(newaddress!=''){
                    getaddress = JSON.parse(newaddress);
                }
                if(getaddress!=''){
                    that.getlastData(shouaddress.lat,shouaddress.lng,getaddress.lat,getaddress.lng,allkg);
                }
                that.setData({
                  shouaddress:shouaddress,
                  addressHide: 1,
                  maskShow: 0,
                  arealist:ops.data.msg.arealist
                })
            }else{
                getaddress = ops.data.msg.info;
                if(shouaddress!=''){
                 that.getlastData(shouaddress.lat,shouaddress.lng,getaddress.lat,getaddress.lng,allkg);
                }
                that.setData({
                  getaddress:getaddress,
                  addressHide: 1,
                  maskShow: 0,
                  arealist:ops.data.msg.arealist
                })
            }
          } else {
            // console.log(ops.data.msg);
            app.showToast(ops.data.msg);
          }
        }
      })
    } else {
      app.showToast('地址ID为空');
    }
  },
  //展示配送时间列表
  timeboxShow: function (event) {
    var that = this;
   var timeShow =  event.currentTarget.dataset.isshow;
    if(timeShow==0){
        var timeShow = 1;
    }else{
        var timeShow = 0;
    }
    that.setData({
      timeShow: timeShow,
      scrollTop: 0
    })
  },
   //选择配送时间
  selecttime: function (e) {
    var that = this;
    //console.log(e);
    that.setData({
      timeShow: 0,
      pstime: e.currentTarget.dataset.name,
      psvalue:e.currentTarget.dataset.value
    })
  },
   //展示增加费用列表
  addcostshow: function (event) {
    var that = this;
    let allcost = that.data.allcost
    let addcost = that.data.addcost
    allcost = Number(allcost) - Number(addcost);
    allcost = allcost.toFixed(2);
    var addcostShow =  event.currentTarget.dataset.isshow;
    //console.log(timeShow);
    if(addcostShow==0){
        var addcostShow = 1;
    }else{
        var addcostShow = 0;
    }
    that.setData({
      addcostShow: addcostShow,
      addcost:0,
      allcost:allcost,
      scrollTop: 0
    })
  },
  //点击增加费用
  selectmoreCost: function (e) {
    var that = this;
    let allcost = that.data.allcost
    let addcost = that.data.addcost
    allcost = Number(allcost)-Number(addcost);
    let newaddcost = e.currentTarget.dataset.value;
    allcost = Number(allcost)+Number(newaddcost);
    allcost = allcost.toFixed(2);
    that.setData({
      addcost: newaddcost,
      allcost:allcost
    })
  },
//帮我送备注
inputVal:function(e){
  var that = this;
  var beizhu = e.detail.value;
  that.setData({
      beizhu: beizhu
    })
},
 //点击选择地址
  choiceAddress: function (event) {
    if(getaddress!=''){
      newaddress = JSON.stringify(getaddress);
    }
    var that = this;
    let addresstype = event.currentTarget.dataset.addresstype
    wx.chooseLocation({
      success: function (res) {
        let addressInfo ={
          address:res.address,
          lat:res.latitude,
          lng:res.longitude,
          bigadr:res.name
        }
        var bigadr = res.name
        if (bigadr == ''){
          bigadr = res.address
        }
        if(addresstype=='shou'){
          shouaddress = JSON.stringify(addressInfo);
          that.setData({
            shou_bigadr: bigadr,
            shou_lat: res.latitude,
            shou_lng: res.longitude
          })
        }else{
          getaddress = JSON.stringify(addressInfo);
          that.setData({
            get_bigadr: bigadr,
            get_lat: res.latitude,
            get_lng: res.longitude
          })
        }
      },
      fail: function (err) {
        console.log('fail:')
        console.log(err)
      }
    })
  },
bindPickerChange: function (e) {
  var that = this;
  let addresstype = that.data.addresstype
  if(addresstype=='shou'){
    that.setData({
      shou_tag: e.detail.value
    })
  }else{
    that.setData({
      get_tag: e.detail.value
    })
  }
},
 formSubmitAddress: function (e) {
 //return false;
    var that = this;
    let formData = e.detail.value
    let addressid = that.data.addressid
    let addresstype = formData.addresstype
    if(that.data.movegoodsweight==undefined){
        allkg = 0;
    }else{
        allkg = that.data.movegoodsweight;
    }
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
        tag: formData.tag
      },
      success: function (ops) {
        if (!ops.data.error) {
            if(addresstype=='shou'){
                shouaddress = ops.data.msg.info
                if(newaddress!=''){
                    getaddress = JSON.parse(newaddress);
                }
                if(getaddress!=''){
                    that.getlastData(shouaddress.lat,shouaddress.lng,getaddress.lat,getaddress.lng,allkg);
                }else{
                   that.getlastData(shouaddress.lat,shouaddress.lng,that.data.check_lat,that.data.check_lng,allkg);
                }
                that.setData({
                  shouaddress:shouaddress,
                  defaultmsg:shouaddress,
                  getaddress:getaddress,
                  addressHide: 1,
                  maskShow: 0,
                  addressShow:0,
                  arealist:ops.data.msg.arealist
                })
            }else{
              getaddress = ops.data.msg.info
              if(shouaddress!=''){
                    that.getlastData(shouaddress.lat,shouaddress.lng,getaddress.lat,getaddress.lng,allkg);
                }
                that.setData({
                  getaddress:getaddress,
                  addressHide: 1,
                  maskShow: 0,
                  addressShow:0,
                  arealist:ops.data.msg.arealist
                })
            }
        } else {
          app.showToast(ops.data.msg);
        }
      }
    })
  },
  formSubmit: function (e) {
    var that = this;
    let form = []
     form['pttype'] = that.data.pttype
     form['is_default'] = that.data.is_default
     form['adcode']=app.globalData.adcode
     form['uid'] = userinfo.uid
    if(form['pttype']=='2'){
        form['getaddr'] =that.data.check_bigadr;
        form['getlat']= that.data.check_lat;
        form['getlng'] = that.data.check_lng;
        form['shouaddr'] = that.data.shouaddress.address;
        form['shoulat'] = that.data.shouaddress.lat;
        form['shoulng'] = that.data.shouaddress.lng;
        form['shouphone'] = that.data.shouaddress.phone;
        form['shouname'] = that.data.shouaddress.contactname;
        form['ptkg'] = 0;
    }else{
        form['getaddr'] =that.data.getaddress.address;
        form['getlat']= that.data.getaddress.lat;
        form['getlng']  = that.data.getaddress.lng;
        form['shouaddr'] = that.data.shouaddress.address;
        form['shoulat'] = that.data.shouaddress.lat;
        form['shoulng'] = that.data.shouaddress.lng;
        form['movegoodstype'] = that.data.movegoodsname
        form['movegoodscost'] = that.data.movegoodscost
        form['getphone'] = that.data.getaddress.phone;
        form['shouphone'] = that.data.shouaddress.phone;
        form['getname'] = that.data.getaddress.contactname;
        form['shouname'] = that.data.shouaddress.contactname;
        form['ptkg'] = parseInt(that.data.movegoodsweight);
    }
     form['beizhu'] = that.data.beizhu
     form['minit'] = that.data.psvalue
     form['allkmcost'] = that.data.allkmcost
     form['allkgcost'] = that.data.allkgcost
     form['ptkm'] = that.data.juli
     form['farecost'] = that.data.addcost
     form['allcost'] = that.data.allcost
       //console.log(form);
     //return false;
      wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=fabupaotui&version='+app.globalData.version+'&datatype=json',
        header: {'Content-Type': 'application/json'},
        data: form,
        success: function (ops) {
          //console.log(ops);
          if (!ops.data.error) {
            app.Skip('../orderpay/orderpay?id=' + ops.data.msg+'&sourcetype=1');
          } else {
            // console.log(ops.data.msg);
            app.showToast(ops.data.msg);
          }
        }
      })
  },
  getlastData:function(lat1,lng1,lat2,lng2,allkg){
    var that = this;
    allkg = parseInt(allkg);
     wx.request({
        url: siteurl + '/index.php?ctrl=applet&action=GetDistance3&version='+app.globalData.version+'&datatype=json',
        header: {'Content-Type': 'application/json'},
        data: {
          lat1:lat1,
          lng1:lng1,
          lat2:lat2,
          lng2:lng2,
          kg:kg,
          kgcost:kgcost,
          addkg:addkg,
          addkgcost:addkgcost,
          km:km,
          kmcost:kmcost,
          addkm:addkm,
          addkmcost:addkmcost,
          allkg:allkg,
          addcost:addcost
        },
        success: function (ops) {
          //console.log(ops);
          if (!ops.data.error) {
            that.setData({
              juli:ops.data.msg.juli,
              allcost:ops.data.msg.allcost,
              addcost:ops.data.msg.addcost,
              allkgcost:ops.data.msg.allkgcost,
              allkmcost:ops.data.msg.allkmcost
            })
          } else {
            // console.log(ops.data.msg);
            app.showToast(ops.data.msg);
          }
        }
      })
  }
})
