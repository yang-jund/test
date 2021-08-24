import { request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{}
  },
   //商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const {goods_id}=options;
      //console.log(goods_id);
      this.getGoodsDetail(goods_id);
  },
  //获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      }
    })
   },
   //点击轮播图 放大预览
   handlePrevewImage(e){
     //构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    //接收传递过来的图片
     wx.previewImage({
       current,
       urls
     });
       
   },
   //点击 加入购物车
   handleCartAdd(){
      //获取缓存中的购物车 数组
      let cart=wx.getStorageSync("cart")||[];
      //判断 商品对象是不是存在购物车数组
      let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
      if(index===-1){
        //不存在第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
      }else{
        //已经存在购物车数据 执行 num++
        cart[index].num++;
      }
      //把购物车重新添加回缓存中
      wx.setStorageSync("cart",cart);
      //弹窗提示
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        mask: true
      });
   }
})