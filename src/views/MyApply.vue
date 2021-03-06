<template>
  <div>
    <!-- 我的申请页面 -->
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
        <el-menu :default-active="this.$route.path" mode="horizontal" @select="handleSelect" router>
          <el-menu-item index="/" >首页</el-menu-item>
          <el-menu-item index="/question">题库系统</el-menu-item>
        </el-menu>
      </el-col>

      <!-- 个人信息区域 -->
      <el-col :span="4">
        <div class="login-info">
          <el-dropdown placement="bottom-start" @command="goToLogout">
            <div class="login-username">
              <div class="username">{{username}}</div>
              <div class="user-pulldown"></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <!-- 我的申请详情 -->
    <div style="background-color:#f5f5f5;padding:15px 0;">
      <div class="apply">
        <div class="username">
          {{username}}同学，<span>您好！</span>
        </div>
        <p>
          欢迎来到数据挖掘实验室招新个人中心！<br><br>
          我们希望通过科学严谨的面试流程，确保能充分了解每一位候选人。
          但同时我们也希望您能理解面试并不是对个人能力的单方面考核，
          而是关于匹配程度的双向选择。<br><br>
          在申请之前，请慎重考虑。
        </p>
        <div class="resume">
          <el-button type="primary" v-if="resume._id" round @click="showResume">查看简历</el-button>
          <el-button type="primary" v-else round @click="toNewResume">新建简历</el-button>
        </div>

        <div class="my-apply">
          <el-tabs v-model="activeApply" @tab-click="handleClick">
            <el-tab-pane label="我的申请" name="myApply">
              <div v-if="myApply.length==0">
                <p>没有进行中的申请!</p>
                <p>请选择自己喜欢的部门及岗位，抓紧时间进行申请噢~</p>
              </div>
              <div v-else class="present-apply">
                <div v-for="(item,i) in myApply" :key="i" class="each-apply">
                  <div class="apply-name">{{item.name}}</div>
                  <div class="apply-info">
                    所属项目组：{{item.belong}}
                    <span>申请时间：{{item.apply_time}}</span>
                  </div>
                  <div class="test-info">
                    <div class="test-name">{{item.test_name}}</div>
                    <el-button type="primary" round>进入考试</el-button>
                    <div class="test-time">
                      {{item.begin_time}}-
                      <span>{{item.end_time}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="已归档申请" name="archiveApply">已归档申请</el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer>
      Copyright @数据挖掘实验室, All right reserved.
    </footer>

    <!-- 显示简历对话框 -->
    <el-dialog
      title="个人简历"
      :visible.sync="ResumeDialogVisible"
      width="60%">
      <!-- <span>这是一段信息</span> -->
      <div class="resume-box">
        <div class="personal-info-box">
          <div class="personal-left">
            <div class="lab-name">数据挖掘实验室</div>
            <div class="user-info-box">
              <div class="user-left">
                <div>姓 名：{{resume.name}}</div>
                <div>学 号：{{resume.student_id}}</div>
              </div>
              <div class="user-right">
                <div>邮 箱：{{resume.email}}</div>
                <div>电 话：{{resume.tel}}</div>
              </div>
            </div>
          </div>
          <img :src="resume.avator" alt="">
        </div>

        <div class="teach-info-box">
          <div class="each-title-box">教育信息</div>
          <div class="each-info-box">
            <div class="grade-box same-line-box">
              <!-- <div>{{resume.grade}}级</div>
              <div>{{resume.academic}}</div>
              <div>{{resume.major}}</div> -->
              {{resume.grade}}级
              <span>{{resume.academic}}</span>
              <span>{{resume.major}}</span>
            </div>
            <div class="programing-box">
              熟悉的编程语言：{{resume.programing}}
            </div>
            <div class="language-skill-box">
              语言能力：{{resume.language_skill}}
            </div>
            <div class="personal-website-box">
              个人博客/网站：{{resume.personal_website}}
            </div>
          </div>
          
        </div>

        <div class="project-info-box">
          <div class="each-title-box">项目经历</div>
          <div class="each-info-box">
            <div class="each-project" v-for="(item,index) in resume.projects" 
            :key="index">
              <div class="name-time-box same-line-box">
                {{item.project_name}}
                <span>
                  {{getEachTime(item.project_time[0])}} - {{getEachTime(item.project_time[1])}}
                </span>
              </div>
              <div class="detail-box project-detail-box">
                {{item.project_detail}}
              </div>
            </div>

          </div>
        </div>

        <div class="awards-info-box">
         <div class="each-title-box">获奖经历</div>
          <div class="each-info-box">
            <div class="each-project" v-for="(item,index) in resume.awards" 
            :key="index">
              <div class="name-time-box same-line-box">
                {{item.awards_name}}
                <span>
                  {{getEachTime(item.awards_time)}}
                </span>
              </div>
              <div class="detail-box project-detail-box">
                {{item.awards_detail}}
              </div>
            </div>

          </div>
        </div>

        <div class="self-evalute-box">
          <div class="each-title-box">自我评价</div>
          <div class="each-info-box">
            {{resume.self_evalute}}
          </div>

        </div>
        <div class="edit-btn">
          <el-button type="primary" @click="toEditResume">修改</el-button>
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
    
    

  </div>
</template>

<script>
export default {
  data(){
    return{
      username:'',
      // 用户id
      user_id:'',
      // 简历id
      // resume_id:'',
      // 点击查看简历对话框显示与否
      ResumeDialogVisible:false,
      // 获取简历对象
      resume:{},
      // 导航栏当前活跃的页面index
      // activeIndex:'',
      // 登录后头像下拉栏选中的菜单项
      loginSelectedCommand:'',
      // 申请详情活跃页面（我的申请，已归档申请）
      activeApply:'myApply',
      //正在进行中的申请myApply
      myApply:[
        {
          id:'1',
          // a_flag:'present',
          name:'web前端开发工程师',
          belong:'舆情分析项目组',
          apply_time:'2021-03-01',
          test_name:'web前端开发在线考试',
          begin_time:'2021-03-02 19:00',
          end_time:'21:00',
        },
        {
          id:'2',
          // a_flag:'finished',
          name:'web后台开发工程师',
          belong:'舆情分析项目组',
          apply_time:'2021-03-01',
          begin_time:'2021-03-02 19:00',
          end_time:'2021-0302 21:00',
        }
      ],
      // 已归档的申请
      archiveApply:[
        {
          id:'1',
          // a_flag:'finished',
          name:'web后台开发工程师',
          belong:'舆情分析项目组',
          apply_time:'2021-03-01',
          begin_time:'2021-03-02 19:00',
          end_time:'2021-0302 21:00',
        },
        {
          id:'1',
          // a_flag:'finished',
          name:'web后台开发工程师',
          belong:'舆情分析项目组',
          apply_time:'2021-03-01',
          begin_time:'2021-03-02 19:00',
          end_time:'2021-0302 21:00',
        }
      ]

    }
  },
  computed:{
    getEachTime(){
      return function(sTime){
        // console.log(typeof(sTime))
        // console.log(sTime)
        return sTime.split('T')[0];
      }
      // console.log(typeof(sTime))
      // console.log(sTime)
      // return sTime.split('T')[0];
    }
  },
  created(){
    this.username=sessionStorage.getItem('username')
    this.user_id=sessionStorage.getItem('user_id')
    console.log("通过id获取用户简历")
    // console.log(this.user_id)
    this.getUserResume(this.user_id)
    // 获取用户进度
    this.getProgress()
  },
  methods:{
    // 通过用户id获取简历信息
    async getUserResume(user_id){
      const res=await this.$http.get(`vitae/${user_id}`)
      this.resume=res.data
      console.log(this.resume);
    },
    // 获取用户投递进度
    async getProgress(){
      console.log(this.user_id)
      if(this.user_id){
        const res=await this.$http.get(`schedule/${this.user_id}`)
      console.log("用户进度信息res")
      console.log(res)
      }
      
    },
    // 导航栏点击更换当前活跃页面(首页或题库)
    handleSelect(key,keyPath){
      console.log(key, keyPath);
    },
    // 登录后头像下拉菜单项跳转
    goToLogout(command){
      // this.loginSelectedCommand=command
      // console.log(this.loginSelectedCommand);
      // this.$router.push({name:this.loginSelectedCommand});
      if(command==='Logout'){
        window.sessionStorage.setItem('token','')
        window.sessionStorage.setItem('username','')
        window.sessionStorage.setItem('user_id','')
        window.sessionStorage.setItem('admin','')
        this.$router.push('/')
      }
      
    },
    // 点击切换标签页事件
    handleClick(tab) {
      console.log(tab.name);
    },
    // 点击新建简历按钮跳转事件
    toNewResume(){
      this.$router.push('/newresume');
    },
    // 查看简历
    showResume(){
      // let routeUrl=this.$router.resolve({
      //   path:'/resume',query:{_id:this.resume_id}
      // });

      // window.open(routeUrl.href,'_blank');
      // this.$router.push({
      //   path:'/resume',query:{_id:this.resume_id}
      // });
      this.ResumeDialogVisible=true;
    },
    // 查看简历对话框点击修改按钮，跳转到修改简历页面
    toEditResume(){
      this.$router.push({
        path:'/newresume',query:{resume_id:this.resume._id}
      })
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
.apply{
  width: 85%;
  margin: 0 auto;
  background-color: white;
  border-left: 2px solid #ececec;
  border-right: 2px solid #ececec;
  padding: 15px 30px;
  color: #444;
  
}
.apply .username{
  font-weight: bold;
}
.my-apply .present-apply{
  /* background-color: #f5f5f5; */
  /* padding:10px 20px; */
}
.my-apply .present-apply .each-apply{
  background-color: #f5f5f5;
  /* width: 95%; */
  /* margin: 0 auto;
  padding-top: 10px; */
  margin-bottom: 8px;
  padding: 10px 20px;
  /* border-bottom: 2px solid #ececec; */
}
/* 查看简历弹窗 */
.resume-box{
  padding: 0 30px;
}
.personal-info-box::after{
  content: '';
  clear: both;
  overflow: hidden;
  display: block;
}
.personal-info-box .personal-left{
  float: left;
  /* background-color: red; */
  width: 65%;
  padding: 10px 0 0 10px;
  line-height: 30px;
}
.personal-info-box .personal-left .lab-name{
  color: #7f97d7;
  font-size: 18px;
  font-weight: bold;
  /* padding-left: 5px; */
}
.personal-info-box img{
  display: block;
  float:right;
  width: 120px;
  height: 130px;
}
/* .personal-info-box .user-info-box{
  padding-left: 10px;
} */
.personal-info-box .user-info-box .user-left{
  float: left;
}
.personal-info-box .user-info-box .user-right{
  float: right;
}
.each-info-box{
  border-top: 1px solid #7f97d7;
  border-left: 1px solid #7f97d7;
  margin-left: 10px;
  padding: 10px;
  line-height: 22px;
}
.each-title-box{
  background-color: #7f97d7;
  width: 100px;
  margin-bottom: -1px;
  text-align: center;
  font-size: 16px;
}
.same-line-box span{
  padding-left: 120px;
  /* display: flex;
  justify-content: space-between; */
}
.name-time-box::before{
  content: '·';
  font-weight: bold;
}
.each-project{
  padding-bottom: 10px
}
.detail-box{
  padding:0 10px;
}
.edit-btn{
  text-align: center;
}
</style>