import { request} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
     //左侧菜单栏
      leftMenuList:[],
      //右侧商品列表
      rightContent:[],
      //被点击的左侧的菜单
      currentIndex:0,
      scrollTop:0
  },
  //接口的返回数据
    Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        /* this.getCates();
         1  先判断一下本地存储中有没有旧的数据 time:Date.now(),data:this.Cates}
         2  没有旧的数据 直接发送新的请求
         3  有旧的数据 同时 旧的数据没有过期 就使用存储中的旧数据即可
        */
        // 1 获取本地存储中的数据
        const Cates=wx.getStorageSync("cates");
        // 2 判断
        if(!Cates){
          //不存在  发送请求获取数据
          this.getCates();
        }else{
          //有旧的数据 定义过期时间  10s 改成5分钟
          if(DataCue.now - Cates.time > 10000 * 10){
            //重新发送请求
            this.getCates();
          }else{
          //可以使用旧数据
          this.Cates=Cates.data;
          let leftMenuList=this.Cates.map(v=>v.cat_name);
          let rightContent=this.Cates[0].children;
          this.setData({
            leftMenuList,
            rightContent
        })
          }
        }
  },
  //获取数据分类
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    //   .then(res=>{
    //     this.Cates=res.data.message;
    //     //把接口的数据存入到本地服务器
    //     wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});
    //     //构造左侧的大菜单数据
    //     let leftMenuList=this.Cates.map(v=>v.cat_name);
    //     //构造右侧商品列表
    //     let rightContent=this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    //使用es7 的async await来发送请求
     const res=await request({url:"/categories"});
     this.Cates=res;
        //把接口的数据存入到本地服务器
        wx.getStorageSync("cates",{time:Date.now(),data:this.Cates});
        //构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        //构造右侧商品列表
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    /*
    1 获取被点击的标题身上的索引
    2 给data中的currentIndex赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
     */
    const {index}=e.currentTarget.dataset;
    let rightContent=this.Cates[index].children;
        this.setData({
          currentIndex:index,
          rightContent,
          //重新设置，右侧内容的scroll-view标签的距离顶部的距离
          scrollTop:0
        })
    }
})