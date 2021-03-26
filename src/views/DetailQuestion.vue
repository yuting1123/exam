<template>
  <div class="detail-question">
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
              <el-dropdown-item command="/question">题目练习</el-dropdown-item>
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

    <div class="show-question-box">
      <el-card shadow="always">
        <div v-if="question.categories=='单选题'||question.categories=='判断题'">
            <div id="answer" class="ques-header">
            <span>[{{question.categories}}]</span>{{question.name}}
          </div>
          <el-radio-group v-model="choice">
            <el-radio :label="index" v-for="(item,index) in question.answers" 
            :key="index" border >{{item.name}}</el-radio>
          </el-radio-group>
          <div class="show-choice" v-if="showAnswer">
            <div v-if="choice==question.right" style="color:green">
              回答正确√
            </div>
            <div v-else style="color:red">
              ×回答错误，
              <span>正确答案是：{{choiceName[question.right]}}</span>
            </div>
          </div>
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </div>
        <div v-if="question.categories=='主观题'">
            <div id="answer" class="ques-header">
            <span>[{{question.categories}}]</span>{{question.name}}
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            placeholder="请输入内容"
            v-model="choice">
          </el-input>
          <div class="show-choice" v-if="showAnswer" style="color:red">
            标准答案：<br>
            {{question.right}}
          </div>
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </div>
        <div v-if="question.categories=='多选题'">
            <div id="answer" class="ques-header">
            <span>[{{question.categories}}]</span>{{question.name}}
          </div>
          <el-checkbox-group v-model="multiChoice">
            <el-checkbox :label="index" v-for="(item,index) in question.answers"
            :key="index" border>{{item.name}}</el-checkbox>
            
          </el-checkbox-group>
          <div class="show-choice" v-if="showAnswer">
            <div v-if="multiChoice.toString()==question.right.toString()" style="color:green">
              回答正确√
            </div>
            <div v-else style="color:red">
              ×回答错误，
              <span>正确答案是：{{toResultString(question.right)}}</span>
            </div>
          </div>
          <el-button type="primary" @click="submitAnswer">提交</el-button>
        </div>
        
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      
      showAnswer:false,
      choiceName:['A','B','C','D','E','F','G','H','I'],
      questionId:'',
      // 用户答案选项
      choice:'',
      // 多选
      multiChoice:[],
      question:{
        name:'',
        answers:[],
        right:'',
        categories:''
      },
    }
  },
  created(){
    this.token=window.sessionStorage.getItem('token')
    this.username=window.sessionStorage.getItem('username')
    this.admin=sessionStorage.getItem('admin')
    this.questionId=this.$route.query.questionId
    this.question.categories=this.$route.query.categories
    console.log(this.question)
    console.log(this.questionId)
    this.getDetailQuestion()

  },
  methods:{
    // 获取题目详情
    async getDetailQuestion(){
      const res=await this.$http.get(`rest/questions/${this.questionId}`)
      console.log("题目数据")
      console.log(res)
      this.question.name=res.data.name
      this.question.answers=res.data.answers
      if(this.question.categories=='多选题'){
        // console.log('111')
        this.question.right=[]
        res.data.right.split(',').forEach(value=>{
          this.question.right.push(parseInt(value))
        })
      }
      else{
        this.question.right=res.data.right
      }
      
      console.log(this.question)
      // res.data
    },

    // 题库下拉跳转
    goToQuestion(command){
      this.$router.push(command)
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
    // 用abc显示选择结果
    toResultString(rightArray){
      var newArr=[]
      rightArray.forEach(value=>{
        newArr.push(
          this.choiceName[value],
        )
      })
      return newArr.join( ',')
    },
    // 提交题目查看结果
    submitAnswer(){
      this.showAnswer=true
      console.log(this.multiChoice)
      console.log(this.question.right)
      // var answer=document.getElementById('answer')
      // if(this.choice==this.question.right){
      //   answer.style.color="green";
      // }
      // else{
      //   answer.style.color="red";
      // }

    },

  },

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
.show-question-box{
  background-color: #f5f5f5;
  padding: 20px 0;
}
.detail-question>>>.el-card{
  width: 70%;
  margin: 0 auto;
  /* margin-top: 30px; */
}
.ques-header{
  padding-bottom: 10px;
  border-bottom: 1px solid #ececec;
  font-weight: bold;
}
.detail-question>>>.el-radio.is-bordered,
.detail-question>>>.el-checkbox.is-bordered,
.detail-question>>>.el-textarea__inner{
  width: 600px;
  margin:15px 0 15px 15px!important;
}
.show-choice{
  padding-left: 15px;
}
.show-question-box>>>.el-button{
  margin:15px 0 0 15px;
}
</style>