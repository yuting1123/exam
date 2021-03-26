<template>
  <el-container style="height: 100%; border: 1px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu 
      unique-opened
      router
      :default-active="this.$route.path"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>试卷管理</span>
        </template>
        <el-menu-item index="/createtest/create">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>创建试卷</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/createtest/list">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>试卷列表</span>
          </template>
        </el-menu-item>
      </el-submenu>
      
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>考试管理</span>
        </template>
        <el-menu-item index="/createexam/create">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>创建考试</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/createexam/list">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>考试列表</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>题目管理</span>
        </template>
        <el-menu-item index="/question/create">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>创建题目</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/question/list">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>题目列表</span>
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
            <el-dropdown-item command="AdminShowSubmit">查看投递情况</el-dropdown-item>
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

    }
  },
  created(){
    this.username=sessionStorage.getItem('username')
    
  },
  methods:{
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
    

  }
}
</script>
<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  text-align: right; 
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
  margin-left: 820px;
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
</style>