<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
          <img src="../assets/sea.jpg" alt="">
      </div>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <div class="user-btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button el-button type="primary" @click="registe">注册</el-button>
          </div>
          <!-- <div class="reset-btn"> -->
            <el-button @click="resetLoginForm" type="primary" 
            class="reset-btn">重置</el-button>
          <!-- </div> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      loginForm:{
        username:"123",
        password:"123",
        admin:"0"
      },
      // 表单验证规则：1）绑定rules；2）在js中声明规则；3）为不同表单相用prop绑定规则
      loginFormRules:{
        // 验证用户名合法
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur'},
          {min:3,max:10,message: '用户名长度在3-10个字符'}
        ],
        // 验证密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur'},
          {min:3,max:15,message: '密码长度在3-15个字符'}
        ]
      }

    }
  },
  created(){

  },
  methods:{
    // 重置按钮
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    // 点击登录
    login(){
      // console.log("正在登录");
      // console.log(this.loginForm);
      // this.$message.success("正在登录")
      // 使用validate进行预校验，validate方法接收一个回调函数，第一个参数为bool值，是否通过校验
      // 使用async+await结合简化promise对象，返回的是object
      this.$refs.loginFormRef.validate(async valid=>{
                
      // 验证成功后，就发起请求，失败直接return
      if(!valid) return;

      // 将返回的内容进行结构赋值命名为res
      const res=await this.$http.post('login',
        {username:this.loginForm.username,
         password:this.loginForm.password});
      // console.log(res);
      if(res.status!==200){
        return this.$message.error("登录失败")
      }
      this.$message.success("登录成功");

      // 1、将登陆成功后的token，保存到客户端的sessionStorage中
      //   1.1项目中除了登录之外的其他api接口，必须在登录之后才能访问
      //   1.2token只应用在当前网站打开期间生效，所以将token保存在sessionStorage
      // 2、通过编程式导航跳转到后台主页，路由地址是/home
      console.log("登录后的个人信息")
      console.log(res)
      // console.log(res.data.token)
      window.sessionStorage.setItem('token',res.data.token);
      window.sessionStorage.setItem('username',res.data.username)
      window.sessionStorage.setItem('user_id',res.data.user_id)
      window.sessionStorage.setItem('admin',res.data.admin)
      this.$router.push("/")
      })

      // 用then的写法，返回的是一个对象
      // this.$refs.loginFormRef.validate(valid=>{
      //     if(!valid) return;
      //     this.$http.post('login',this.loginForm).then(res=>{
      //         console.log(res);
      //         console.log(typeof(res))
      //     })
      // })
    },
    // 点击注册
    async registe(){
      console.log(this.loginForm)
      const res=await this.$http.post('register',this.loginForm);
      console.log(res);
      // this.loginForm.admin="0"
      // console.log(this.loginForm);
    },

  }
}
</script>

<style scoped>
.login_container{
  background-color :#2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.login_box .avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;

  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
}
.login_box .avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form{
  position:absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.user-btns{
  display: flex;
  justify-content:flex-end;
  float: right;
}
.reset-btn{
  float: left;
}
.btns::after{
  clear: both;
  content: '';
  overflow: hidden;
  display: block;
}
</style>