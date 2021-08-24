// pages/cart/index.js
import {getSetting,chooseAddress,openSetting,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    Date:{
      address:{},
      cart:[],
      allChecked:false,
      totalPrice:0,
      totalNum:0
    },
    onShow(){
      //获取缓存中的收货地址信息
      const address=wx.getStorageSync('address');
      //获取缓存中的购物车数据
      const cart=wx.getStorageSync("cart")||[];
      // 1.计算全选
      //const allChecked=cart.length?cart.every(v=>v.checked):false;
      //总价格 总数量
      let allChecked=true;
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v => {
        if(v.checked){
          totalPrice +=v.num*v.goods_price;
          totalNum +=v.num;
        }else{
          allChecked=false;
        }
      })
      // 判断数组是否为空
      allChecked!=cart.lenght!=0?allChecked:false;
      //给data赋值
        this.setData({
          address,
          cart,
          allChecked,
          totalPrice,
          totalNum
        })
    },
  //点击 收货地址
  async handleChooseAddress(){
    try{
    //1.获取收货地址
    const res1= await getSetting();
    const scopeAddress=res1.authSetting['scope.address'];
     //2.判断 权限状态
    if(scopeAddress === false){
       //4.先诱导用户打开授权页面
      await openSetting();
    }
      //4.调用获取收货地址的 api
      let address=await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      //5.存入缓存中
      wx.setStorageSync('address', address);
        
    }catch(error){
      console.log(error);
    }
  },
  //商品选中
  handeItemChange(e){
    //获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id;
    //获取购物车数组
    let {cart}=this.data;
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id === goods_id);
    //选中状态取反
    cart[index].checked =! cart[index].checked;
    //把 购物车数据重新设置回data中和缓存中
      this.setCart(cart);
      },
      //设置购物车状态同时，重新计算 底部工具栏的数据 全选 总价格 购买色数量
  setCart(cart){
    let allChecked=true;
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v => {
        if(v.checked){
          totalPrice +=v.num*v.goods_price;
          totalNum +=v.num;
        }else{
          allChecked=false;
        }
      })
      //判断数组是否为空
      allChecked!=cart.lenght!=0?allChecked:false;
      this.setData({
        cart,
        allChecked,totalNum,totalPrice
      });
      wx.setStorageSync("cart",cart);
  },
  //商品全选功能
  handleItemAllChecked(){
    //换取data种的数据
    let {cart,allChecked}=this.data;
    //修改值
    allChecked=!allChecked;
    //循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    //把修改后的值 填充回data中或者缓存中
    this.setCart(cart);
  },
  //商品数量编辑功能
  handleItemNumEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //获取购物车数组
    let {cart}=this.data;
    //找到需要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '提示',
        content: '是否要删除',
        success :(res) =>{
          if (res.confirm) {
           cart.splice(index,1);
           this.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
       //进行修改数据
    cart[index].num+=operation;
    //设置回缓存和data中
    this.setCart(cart);
    }
   

  },
  //点击结算
  async handlePay(){
     //判断收货地址
     const {address,totalNum}=this.data;
     if(!address.userName){
       await showToast({title:"您还没有选择收货地址"});
       return;
     }
     //判断有没有选择商品
     if(totalNum===0){
      await showToast({title:"您还没有选择商品"});
      return;
     }
     //跳转到支付页面
     wx.navigateTo({
       url: '/pages/pay/index'
     });
  }
})