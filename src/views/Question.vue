<template>
  <div>
    <!-- 首页导航条 -->
    <el-row class="navbar">
      <el-col :span="4" class="logo">
        <!-- logo -->
        <img src="../assets/sea.jpg" alt="">
      </el-col>
      <el-col :span="4" class="general-title">
        <!-- 文字 -->
        笔试面试系统
      </el-col>
      <el-col :span="12">
        <el-menu :default-active="this.$route.path" mode="horizontal" 
        router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-dropdown placement="bottom-start" @command="goToQuestion">
            <el-menu-item style="font-size:16px;color:#909399;border-bottom:2px solid #597bda;">题库</el-menu-item>
            <el-dropdown-menu slot="dropdown" >
              <!-- <el-dropdown-item command="/question">题目练习</el-dropdown-item> -->
              <el-dropdown-item command="/testpaper">真题练习</el-dropdown-item>
              <el-dropdown-item command="/interview">面经宝典</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-col>

      <!-- 登录按钮区域 -->
      <el-col :span="4">
        <div class="login-info">
          <el-button round v-if="!this.token" class="login-button"
          @click="toLogin">
            登录
          </el-button>
          <el-dropdown v-else placement="bottom-start" @command="goToSingleCommand">
            <!-- <el-avatar :size="large" src="../assets/logo.png"></el-avatar> -->
            <!-- <img class="login-button" src="../assets/logo.png" alt=""> -->
            <div class="login-username">
              <div class="username">{{username}}</div>
              <div class="user-pulldown"></div>
            </div>
            <el-dropdown-menu slot="dropdown" v-if="admin==='0'">
              <el-dropdown-item command="MyApply">我的申请</el-dropdown-item>
              <el-dropdown-item command="Logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
            <el-dropdown-menu slot="dropdown" v-else>
              <el-dropdown-item command="AdminShowSubmit">查看投递情况</el-dropdown-item>
              <el-dropdown-item command="AdminCreateTest">创建考试/试卷</el-dropdown-item>
              <el-dropdown-item command="Logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>

    </el-row>
    <!-- 题库主体区域 -->
    <div class="main">
      <div class="question-bank-box">
        <div class="question-category-box">
          <div class="category">
            <i class="el-icon-menu"></i>
            <span>全部分类</span>
          </div>
          <div class="single-cate-box">
            <div class="cate-btn" v-for="(item,key) in questionCate"
              :key="key">
              <el-button type="primary" 
                :plain="item==queryInfo.category_id?false:true"
                @click="changeCate(item)">{{key}}</el-button>
            </div>
            
          </div>
          <div class="question">
            <div class="category">
              <i class="el-icon-s-data"></i>
              <span>全部题目</span>
            </div>
            <div class="search-input">
              <el-input
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                v-model="seachText">
              </el-input>
              <el-button type="primary" v-if="showSeachBtn" @click="keyWordSeach">查询</el-button>
              <el-button type="primary" v-else @click="cancleSeach">取消</el-button>
            </div>

            <el-table
              :data="question" stripe style="width: 100%" @row-click="tableRowClick">
              <el-table-column type="index" width="100" align="center">
              </el-table-column>
              <el-table-column prop="name" label="题目" >
              </el-table-column>
              <el-table-column prop="categories" label="题型" width="140">
              </el-table-column>
              <!-- <el-table-column  width="140">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini">做题{{scope.row.id}}</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
          <!-- 分页条 -->
          <div class="block">
            <!-- <span class="demonstration">直接前往</span> -->
            <el-pagination
              background
              hide-on-single-page
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="2"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    
    
    
    <!-- 底部 -->
    <footer>
      Copyright @数据挖掘实验室, All right reserved.
    </footer>
</div>  

 
</template>

<script>
export default {
  data(){
    return{
      token:'',
      username:'',
      admin:'',
      // 当前分类（默认所有题目）
      activeCate:'',
      // 题目搜索框的双向绑定数据
      seachText:'',
      // 分页跳转前的页码
      beforeJumpPage:1,
      // 分页条的当前页码
      currentPage:1,
      // 查询及取消按钮的显示与否
      showSeachBtn:true,
      // 分页条请求的参数
      queryInfo:{
        category_id:'',
        last_id:'',
        from:'',
        to:'',
        admin:'',
        num:2,
        keyword:''
      },
      // 题目总数
      total:0,
      // 所有题目分类
      questionCate:{
        所有题目:'',
        前端:'603d9f23fc781741efe8a981',
        后台:'603d9f45fc781741efe8a982',
        算法:'603e1f95d2f7244421f3df2e',
        产品:'603e1fb1d2f7244421f3df2f'
      },
      question:[],
    }
  },
  created(){
    this.token=window.sessionStorage.getItem('token')
    this.username=window.sessionStorage.getItem('username')
    this.admin=sessionStorage.getItem('admin')
    this.getTotalQuestion()
    this.getQuestion()
  },
  methods:{
    // 测试接口
    async getThreePage(){
      console.log("获取第三页数据")
      // const res=await this.$http.post()
      console.log("获取第三页数据")
    },
    // 获取题目信息
    async getQuestion(){
      const res=await this.$http.post('search/questions',this.queryInfo)
      console.log("请求的信息")
      console.log(this.queryInfo)
      console.log("题目信息")
      console.log(res)
      res.data.forEach(value=>{
        this.question.push({
          _id:value._id,
          name:value.name,
          categories:value.categories[0].name
        })
      })
    },
    // 获取题目总数
    async getTotalQuestion(){
      const res=await this.$http.post('questions/num',{
        category_id:this.queryInfo.category_id
      })
      // console.log("总数")
      // console.log(res)
      this.total=res.data
    },
    // 登录名下拉栏跳转
    goToSingleCommand(command){
      if(command=='Logout'){
        window.sessionStorage.clear()
        this.$router.push('/');
      }
      else{
        this.loginSelectedCommand=command
        // console.log(this.loginSelectedCommand);
        this.$router.push({name:this.loginSelectedCommand});
      }
    },
    // 跳转到登录页面按钮
    toLogin(){
      this.$router.push({name:'Login'});
    },
    // 分页条的当前页码改变时触发的函数
    async handleCurrentChange(newPage){
      // 重新进行请求，刷新表格数据
      if(this.beforeJumpPage<newPage){
        // 从前往后跳
        this.queryInfo.last_id=this.question[this.question.length-1]._id
        this.queryInfo.from=this.beforeJumpPage
        this.queryInfo.to=newPage
        this.question=[]
        console.log("form")
        console.log(this.queryInfo.from)
        this.getQuestion()
        this.beforeJumpPage=newPage
      }
      if(this.beforeJumpPage>newPage){
        this.queryInfo.last_id=this.question[0]._id
        // this.queryInfo.last_id=this.test[0]._id
        this.queryInfo.from=this.beforeJumpPage
        this.queryInfo.to=newPage
        this.question=[]
        console.log("form")
        console.log(this.queryInfo.from)
        const res=await this.$http.post('search/questions',this.queryInfo)
        
        console.log("请求的信息111")
        console.log(this.queryInfo)
        // console.log("题目信息")
        // console.log(res)
        res.data.reverse().forEach(value=>{
          this.question.push(value)
        })
        this.beforeJumpPage=newPage
        // console.log("逆转")
        // console.log(this.question)
      }
      
    },
    
    // 题库下拉跳转
    goToQuestion(command){
      this.$router.push(command)
    },
    // 根据关键词查询题目
    keyWordSeach(){
      console.log(this.seachText)
      this.showSeachBtn=false
      this.queryInfo.keyword=this.seachText
      console.log(this.queryInfo)
      this.question=[]
      this.getQuestion()
    },
    // 取消根据关键词查询题目
    cancleSeach(){
      this.showSeachBtn=true
    },
    // 点击类别，按分类获取题目
    changeCate(cateId){
      this.queryInfo.category_id=cateId
      console.log(this.queryInfo)
      this.question=[]
      this.getQuestion()
    },
     // // 表格某一行被点击进入做题
    tableRowClick(row){
      console.log(row)
      this.$router.push({
        path:'/detailquestion',
        query:{questionId:row._id,categories:row.categories}
      })
    },

  }
}
</script>

<style scoped>
/* 顶部右侧导航栏 */
.el-menu{
  padding: 10px 30px 0 0;
  float:right; 
}
.el-menu.el-menu--horizontal{
  border-bottom: none !important;
}
/* 活跃底部颜色 */
.el-menu--horizontal > 
.el-menu-item.is-active{
  border-bottom: 2px solid #7f97d7 !important;
}
.el-menu--horizontal > 
.el-menu-item{
  font-size: 16px;
  margin-right: 15px;
}  

/* 主体区域 */
.main{
  /* border-top: 2px solid red; */
  background-color: #f5f5f5;
  padding: 20px 0px;
}
.question-bank-box{
  width: 85%;
  margin: 0 auto;
  background-color: white;
  /* border-left: 2px solid #ececec;
  border-right: 2px solid #ececec; */
  color: #444;
}
.question-category-box .category{
  font-size: 17px;
  font-weight: bold;
  padding: 15px 0 0 15px;
  color: #597bda;
}

.single-cate-box .cate-btn .el-button{
  width: 120px;
  height: 120px;
  margin: 15px 25px;
  font-size: 18px;
  font-weight: bold;
}
.cate-btn{
  float: left;
}
.search-input{
  /* width: 600px; */
  margin: 15px 25px 10px 25px;
}
.search-input .el-input{
  float: left;
  width: 35%;
}
.search-input .el-button{
  margin-left: 10px;
  float: left;
}
.search-input::after,
.single-cate-box::after{
  content: '';
  clear: both;
  overflow: hidden;
  display: block;
}
.el-table--enable-row-hover .el-table__body tbody > tr:hover > td{
 cursor: pointer!important;
}
.block{
  text-align: center;
  padding: 20px 0;
}
.question >>> .el-table .cell:hover{
  cursor: pointer;
}
</style>