<template>
  <div class="home">
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
        @select="handleSelect" router>
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/question">题库系统</el-menu-item>
        </el-menu>
      </el-col>

      <!-- 登录按钮区域 -->
      <el-col :span="4">
        <div class="login-info">
          <el-button round v-if="!this.token" class="login-button"
          @click="toLogin">
            登录
          </el-button>
          <el-dropdown v-else placement="bottom-start" @command="goToResume">
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
    
    <!-- 首页轮播图 -->
    <div class="map-box">
      <img src="../assets/map/1.jpg" alt="">
    </div>

    <!-- 部门介绍 -->
    <div class="depart">
      <div class="department">
        <div class="depart-title">
          <img src="../assets/intro.png" alt="">
          <div class="depart-intro">
            项目组简介
          </div>
        </div>
        <div class="each-content" v-for="(item,index) in department" 
        :key="index">
          <div class="content">
            <div class="depart-info">
              <div class="left">
        <!-- {{item.d_pics}} -->
                <img :src="item.icon" alt="">
              </div>
              <div class="right">
                <div class="intro">
                  <div class="subtitle">{{item.name}}</div>
                  <div class="intro-content">{{item.intro}}</div>
                </div>

                <div class="depart-position">
                  <div class="subtitle">所有岗位</div>
                  <div >
                    <!-- <span class="position-name" v-for="(item1,i) in item.d_joblist" 
                    :key="i" >{{item1}}</span>
                    <span class="splitline"></span> -->
                    <div class="position-name" v-for="(item1,index1) in item.recruitList" 
                    :key="index1" @click="toSingleRecruitIntro(item1)">{{item1.name}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer>
      Copyright @数据挖掘实验室, All right reserved.
    </footer>

    <!-- 部门详细介绍对话框 -->
    <el-dialog    
      :visible.sync="departIntroDialogVisible"  
      :title="activeRecruit.name"    
      width="60%">
      

      <div class="active-require">
        <div class="each-recruit-box">
          <div class="recruit-title">岗位介绍</div>
          <div class="recruit-info">
            {{activeRecruit.intro}}
          </div>
        </div>
        <div class="each-recruit-box">
          <div class="recruit-title">
            招新人数
          </div>
          <div class="recruit-info">
            {{activeRecruit.num}}
          </div>
        </div>
        <div class="each-recruit-box">
          <div class="recruit-title">
            投递时间
          </div>
          <!-- <div class="recruit-info">
            {{activeRecruit.time}}
            {{activeRecruit.time[1]|dateFormat}}
          </div> -->
          <el-date-picker
            v-model="activeRecruit.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            disabled>
          </el-date-picker>
        </div>
        <div class="each-recruit-box">
          <div class="recruit-title">
            招新要求
          </div>
          <div class="recruit-info">
            {{activeRecruit.qualification}}
          </div>
        </div>


      </div>

      <div slot="footer">
        <el-button type="primary" @click="toApply(activeRecruit._id)" 
        :disabled="applyDisable" ref="applyBtnRef">申请</el-button>
      </div>

      <!-- <span slot="title">{{activeDepart.d_intro}}</span> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->

    </el-dialog>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  // name: 'Home',
  // components: {
  //   HelloWorld
  // }
  data(){
    return{
      token:'',
      username:'',
      user_id:'',
      resume:{},
      admin:'',
      // 导航栏当前活跃的页面index
      // activeIndex:'',
      // 登录后头像下拉栏选中的菜单项
      loginSelectedCommand:'',
      // 部门详情对话框显示与否
      departIntroDialogVisible:false,
      // 被点击的活跃部门信息
      activeRecruit:{},
      
      // 轮播图
      lun:[
        '../assets/map/1.jpg',
        '../assets/map/2.jpg',
        '../assets/map/3.jpg',
        '../assets/map/4.png',
        '../assets/map/5.jpg',
      ],

      // 部门信息
      department:{},
      // 岗位申请按钮是否可用（在时间段内）
      applyDisable:false,
      // 等待获取简历id成功后再跳转到岗位页面
      // ResumeAlready:false
      // 申请按钮的文字
      // applyBtnText:''



    }
  },
  created(){
    // 获取部门信息
    this.getDepartment();

    this.token=window.sessionStorage.getItem('token')
    this.username=window.sessionStorage.getItem('username')
    this.user_id=sessionStorage.getItem('user_id')
    this.admin=sessionStorage.getItem('admin')
    // console.log("用户类型")
    // console.log(this.admin)
    // 获取简历数据
    this.getResume()
    // if(this.token){
    //   console.log(222);
    // }
    // console.log(sessionStorage.getItem('token'));

  },
  methods:{
    // 获取部门信息数据
    async getDepartment(){
      const res= await this.$http.get('departments');
      console.log("部门信息数据")
      this.department=res.data
      console.log(this.department)
    },
    async getResume(){
      if(this.user_id){
        const res=await this.$http.get(`vitae/${this.user_id}`)
        console.log("根据用户id获取到的建立")
        // console.log(res)
        this.resume=res.data
        // this.ResumeAlready=true
        console.log(this.resume)
      }
    },
    // 导航栏点击更换当前活跃页面(首页或题库)
    handleSelect(key,keyPath){
      console.log(key, keyPath);
    },
    // 登录后头像下拉菜单项跳转
    goToResume(command){
      if(command=='Logout'){
        // console.log("退出登录")
        window.sessionStorage.setItem('token','');
        window.sessionStorage.setItem('username','')
        window.sessionStorage.setItem('user_id','')
        window.sessionStorage.setItem('admin','')
        // console.log("退出登录")
        // this.$router.push('/')
        this.$router.go(0);
      }
      else{
        this.loginSelectedCommand=command
        console.log(this.loginSelectedCommand);
        this.$router.push({name:this.loginSelectedCommand});
      }
      
    },
    // 跳转到各部门的详细介绍页面
    toSingleRecruitIntro(recruit){
      // const res=await this.ResumeAlready
      // console.log(res)
      console.log("部门详细介绍")
      this.departIntroDialogVisible=true;
      this.activeRecruit=recruit;
      console.log(this.activeRecruit.time[0]);
      const startDate=this.activeRecruit.time[0]
      const endDate=this.activeRecruit.time[1]
      // console.log(startDate)
      // console.log(endDate)
      this.nowInDateBetwen(startDate,endDate);
    },
    // 从部门详情页面跳转到申请页面
    async toApply(recruitId){
      // 通过用户id先判断该用户是否有简历，没有则跳转新建简历
      // 有简历id则将岗位id放入简历中，调用修改简历接口
      // 该用户有简历，进行投递
      if(this.resume._id){
        if(this.resume.recruits.indexOf(recruitId)!==-1){
          // 该简历已投递当前岗位
          return this.$message.error("您已投递过该岗位，请勿重复投递！")
        }
        this.resume.recruits.push(recruitId)
        const res=await this.$http.put(
          `rest/vitaes/${this.resume._id}`,this.resume)
        console.log("res")
        console.log(res)
        this.$message.success("您已成功投递！")
      }
      const toNewConfirm= await this.$confirm('您还没有简历，是否立即创建?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).catch(err=>err)
      if(toNewConfirm!=='confirm'){
        return
      }
      this.$router.push('/newresume')
      // 该用户没有简历，跳转到新建简历的页面
    },
    // 点击登录按钮进入登录注册页面
    toLogin(){
      this.$router.push({name:'Login'});
    },
    // 判断是否在投递范围时间内
    nowInDateBetwen(d1,d2){
      var dateBegin = new Date(d1);
      var dateEnd = new Date(d2);
      var dateNow = new Date()
      console.log(dateBegin)
      console.log(dateEnd)
      console.log(dateNow)
      //时间差的毫秒数
      var beginDiff = dateNow.getTime() - dateBegin.getTime(); 
      //计算出相差天数
      var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000)); 
      //时间差的毫秒数
      var endDiff = dateEnd.getTime() - dateNow.getTime(); 
      //计算出相差天数
      var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));
      
      if (endDayDiff < 0) {
        //已过期
        this.$refs.applyBtnRef.$el.innerText='已结束'
        // this.applyBtnText = '已结束';
        this.applyDisable=true;
        console.log("已过期")
        // return;
      }
      if (beginDayDiff < 0) {
        //没到开始时间
        this.$refs.applyBtnRef.$el.innerText='未开始'
        // this.applyBtnText = '未开始';
        this.applyDisable=true;
        console.log("还没开始")
        return;
      }
    },

    

  }
}
</script>

<style scoped>
/* 顶部右侧导航栏 */
.el-menu{
  padding: 10px 20px 0 0;
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
}
/* 轮播图 */
.map-box{
  /* width: 1226px; */
}
.map-box img{
  width: 100%;
  height: 400px;
  /* display: block */
}

/* 部门简介 */
.depart{
  background-color: #f5f5f5;
  /* background-color: red; */
}
.department{
  width: 81%;
  margin: 0 auto;
  /* margin-top: 20px; */
  /* border: 1px solid #ececec; */
  background-color: #fff;
}
.depart-title{
  /* background-color: red; */
  width: 100%;
  text-align: center;
  border-left: 2px solid #ececec;
  border-right: 2px solid #ececec;
  border-bottom: 1px solid #ececec;
  padding: 18px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.depart-title img{
  width: 25px;
  height: 25px;
  padding-right: 5px;
}
.depart-title .depart-intro{
  color:#444444;
  font-weight: bold;
  font-size: 20px;
}
.each-content{
  width: 100%;
  border: 1px solid #ececec;
  border-left: 2px solid #ececec;
  border-right: 2px solid #ececec;
}
/* 部门简介点击后跳转 */

.each-content:last-child{
  border-bottom:none;
}
.content{
  width: 94%;
  margin: 0 auto;
  padding:18px 20px 25px 20px;
  /* margin-top: 40px; */
}
.content::after{
  display: block;
  content: "";
  overflow: hidden;
  clear: both;
}
.content .left{
  width: 36%;
  float: left;
}
.content .left img{
  width: 380px;
  height: 260px;
}
.content .right{
  width: 55%;
  float:left;
  padding: 18px 0 10px 35px;
  /* background-color: blue; */
}
.content .right .intro{
  /* background-color: red; */
  height: 125px;
}
.content .right .subtitle{
  font-weight:700;
  color: #444444;
  padding-bottom: 5px;
  font-size: 17px;
}
.content .right .intro .intro-content{
  font-size: 17px;
  color:#666666;
  line-height: 24px;
  display: -webkit-box; 
  -webkit-box-orient: vertical; 
  -webkit-line-clamp: 4; 
  overflow: hidden;
}
.content .right .depart-position{
  /* background-color: blue; */
  margin-top: 15px;
}

.content .right .depart-position .position-name{
  display: inline-block;
  text-decoration: underline;
  padding-right: 24px;
  line-height: 25px;
  color: #666666;
  font-size: 14px;
  /* word-break:pre; */
}
.content .right .depart-position .position-name:hover{
  cursor: pointer;
  color: #444444;
}
 /* 点击部门介绍详情页面 */
.el-dialog__header{
  /* padding-bottom: 0 !important; */
  background-color: #efefef;
  
}
.el-dialog__body {
  padding-top: 15px !important;
  /* background-color: #efefef; */
}
.active-require{
  width: 90%;
  margin: 0 auto;
  border-left: 2px solid #f5f5f5;
  line-height: 26px;
}
.recruit-info{
  border-top: 1px solid #f5f5f5;
  /* border-left: 1px solid #f5f5f5; */
}
.recruit-title{
  background-color: #f5f5f5;
  width: 100px;
  margin-bottom: -1px;
  text-align: center;
  font-size: 16px;
}
.recruit-info{
  padding:10px 15px;
}
/* 显示时间 */
.el-range-editor.is-disabled input{
  color:#444!important;
}
.el-range-editor.is-disabled{
  margin: 10px;
}
/* .active-header .active-title{
  padding-bottom: 10px;
} */
</style>
