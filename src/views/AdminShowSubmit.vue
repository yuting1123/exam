<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
      <el-menu 
        unique-opened
        router 
        :default-active="activeRecruitId"
        >
        
        <!-- :default-active="activeRecruitId" -->
        <el-submenu :index="item._id" v-for="(item) in department" :key="item._id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item :index="subItem._id" v-for="(subItem) in item.recruitList" 
          :key="subItem._id" 
          :route="{ path: '/resumesubmit/show', query: { _id: subItem._id } }" 
          @click="saveNavState(subItem._id)">
          
            <template slot="title">
              <i class="el-icon-menu"></i>
                <span>{{subItem.name}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="link-box">
          <router-link class="router-link-box" :to="{name:'Home'}">首页</router-link>
          <router-link class="router-link-box" :to="{name:'Question'}">题库</router-link>
        </div>
        <el-dropdown placement="bottom" @command="goToSingleCommand">
            <div class="user-info">
              <div class="username">{{username}}</div>
              <div class="user-pulldown"></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item command="AdminShowSubmit">查看投递情况</el-dropdown-item> -->
              <el-dropdown-item command="AdminCreateTest">创建考试/试卷</el-dropdown-item>
              <el-dropdown-item command="Logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        
      </el-header>
      
      <el-main>
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
export default {
  data(){
    return{
      username:'',
      // 头像下拉栏选中的选项
      loginSelectedCommand:'',
      // 部门分类
      department:{},
      // 当前活跃的部门岗位
      activeRecruitId:'',
      departId:'',
      // 是否折叠菜单
      // isCollapse:false,

    }
  },
  created(){
    this.username=window.sessionStorage.getItem('username')
    if(this.$route.path=='/resumesubmit/welcome'){
      this.activeRecruitId=''
    }
    else{
      this.activeRecruitId=window.sessionStorage.getItem('activeRecruitId')
    }
    this.getDepartment()
  },
  watch:{
    //监听相同路由下参数变化的时候，从而实现异步刷新
    //监听路由是否变化
    '$route'(to,from){
      if(to.query._id!=from.query._id){
        this.activeRecruitId=to.query._id
      }
    }
  },
  methods:{
    // 获取部分分类情况
    async getDepartment(){
      const res =await this.$http.get('departments')
      this.department=res.data
    },
    // 头像下拉菜单项跳转
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
    // 保存当前激活的二级菜单项的岗位id
    saveNavState(recruitId){
      window.sessionStorage.setItem('activeRecruitId',recruitId);
      this.activeRecruitId=recruitId;
      // console.log(recruitId)
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  text-align: right; 
  /* font-size: 12px; */
  padding-right: 120px;
}
.el-header .router-link-box{
  font-size: 16px;
  margin: 0 10px;
  color: #909399;
  font-weight: 550;
}
.el-header .router-link-box:hover{
  color: #444;
}
.link-box{
  float: left;
  margin-left: 720px;
}
.user-info{
  float:right;
}


.el-header::after{
  clear: both;
  content: '';
  display:block;
  overflow: hidden;
}
.user-info::after{
  clear: both;
  content: '';
  display:block;
  overflow: hidden;
}
.user-info:hover{
  cursor: pointer;
}
.user-info .username{
  float: left;
}
.user-info .user-pulldown{
  float: right;
}
.user-pulldown{
  width:6px;
  height:6px;
  border-top: 1px solid #597bda;
  border-right: 1px solid #597bda;
  transform: rotate(135deg);
  margin: 25px 0 0 8px;
}

.el-aside {
  color: #333;
}
.el-menu-item.is-active {
    color:#409eff!important;
}
</style>