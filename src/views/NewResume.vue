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
        <el-menu :default-active="this.$route.path" mode="horizontal" router>
          <el-menu-item index="/" >首页</el-menu-item>
          <el-menu-item index="/question">题库系统</el-menu-item>
        </el-menu>
      </el-col>

      <!-- 个人信息区域 -->
      <el-col :span="4">
        <div class="login-info">
          <el-dropdown placement="bottom-start" @command="goToApply">
            <div class="login-username">
              <div class="username">
                {{username}}</div>
              <div class="user-pulldown"></div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="MyApply">我的申请</el-dropdown-item>
              <el-dropdown-item command="Logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <div class="newresume">
      <div class="newresume-box">
        <el-form :model="addResume" :rules="addResumeRules" 
        ref="addResumeRef" label-width="300px">
        <!-- <el-steps :active="activeStep" finish-status="success"
        align-center>
          <el-step title="基本信息">
            
          </el-step>
          <el-step title="项目经历"></el-step>
          <el-step title="获奖情况"></el-step>
          <el-step title="语言能力"></el-step>
          <el-step title="自我评价"></el-step>
        </el-steps> -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="addResume.name"></el-input>
              </el-form-item>
              <el-form-item label="学号" prop="student_id">
                <el-input v-model="addResume.student_id"></el-input>
              </el-form-item>
              <el-form-item label="照片" prop="avator">
              <!-- action,上传地址，在main.js中
              getAuthHeaders()加请求头，在main.js中 -->
                  <el-upload
                  class="avatar-uploader"
                  :action='uploadUrl'
                  :headers="getAuthHeaders()"
                  :show-file-list="false"
                  :on-success="afterUpload">
                  <img v-if="addResume.avator" :src="addResume.avator" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="手机号" prop="tel">
                  <el-input v-model="addResume.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addResume.email"></el-input>
                </el-form-item>
                <div class="next-tab-btn">
                  <el-button type="primary" @click="nextTab">下一步</el-button>
               </div>
            </el-tab-pane>

            <el-tab-pane label="教育信息"  name="1">
              <el-form-item label="学院" prop="academic">
                <el-input v-model="addResume.academic"></el-input>
              </el-form-item>
              <el-form-item label="专业" prop="major">
                <el-input v-model="addResume.major"></el-input>
              </el-form-item>
              <el-form-item label="年级(填写数字，如2017)" prop="grade">
                <el-input v-model="addResume.grade"></el-input>
              </el-form-item>
              <el-form-item label="个人博客/网站">
                <el-input v-model="addResume.personal_website"></el-input>
              </el-form-item>
              <el-form-item label="语言能力（如英语四、六级）">
                <el-input v-model="addResume.language_skill"></el-input>
              </el-form-item>
              <el-form-item label="熟悉的编程语言">
                <el-input v-model="addResume.programing"></el-input>
              </el-form-item>
              <div class="next-tab-btn">
                <el-button type="primary" @click="nextTab">下一步</el-button>
              </div>
              
            </el-tab-pane>

            <el-tab-pane label="项目经历" name="2">
              <div v-if="addResume.projects.length==0" class="each-project-box no-project-text">
                未添加项目经历
              </div>
              <div class="each-project-box" v-for="(item,index) in addResume.projects" :key="index">
                <el-form-item 
                  label="项目名称"
                  :prop="'projects.' + index + '.project_name'"
                  :rules="[{required:true,message:'请输入项目名称',trigger:'blur'}]"
                >
                  <el-input v-model="item.project_name"></el-input>
                </el-form-item>
                <el-form-item label="项目时间" 
                  :prop="'projects.' + index + '.project_time'"
                  :rules="[{required:true,message:'请输入项目时间',trigger:'blur'}]">
                  <!-- <el-input v-model="item.project_time"></el-input> -->
                  <el-date-picker
                    v-model="item.project_time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="项目职责及成果" 
                  :prop="'projects.' + index + '.project_detail'"
                  :rules="[{required:true,message:'请输入项目详情',trigger:'blur'}]">
                  <el-input type="textarea" rows="5" v-model="item.project_detail"></el-input>
                </el-form-item>
                <div class="dele-project-btn">
                  <el-button @click="deleteProject(index)" type="primary">删除</el-button>
                </div>
                
              </div>
              <div class="add-project-box" @click="addProject">
                <i class="el-icon-plus add-project-text"></i>
                <span class="add-project-text">继续添加</span>
              </div>
              <div class="next-tab-btn">
                <el-button type="primary" @click="nextTab">下一步</el-button>
              </div>
              
            </el-tab-pane>

            <el-tab-pane label="获奖情况" name="3">
              <div v-if="addResume.awards.length==0" class="each-project-box no-project-text">
                未添加奖项
              </div>
              <div class="each-project-box" v-for="(item,index) in addResume.awards" :key="index">
                <el-form-item label="奖项名称" 
                  :prop="'awards.' + index + '.awards_name'"
                  :rules="[{required:true,message:'请输入获奖名称',trigger:'blur'}]">
                  <el-input v-model="item.awards_name"></el-input>
                </el-form-item>
                
                <el-form-item label="获奖时间" 
                  :prop="'awards.' + index + '.awards_time'"
                  :rules="[{required:true,message:'请输入获奖时间',trigger:'blur'}]">
                  <el-date-picker
                    v-model="item.awards_time"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <!-- <el-input v-model="item.project_time"></el-input> -->
                </el-form-item>
                <el-form-item label="奖项详情" 
                  :prop="'awards.' + index + '.awards_detail'"
                  :rules="[{required:true,message:'请输入获奖详情',trigger:'blur'}]">
                  <el-input type="textarea" rows="5" v-model="item.awards_detail"></el-input>
                </el-form-item>
                <div class="dele-project-btn">
                  <el-button @click="deleteAwards(index)" type="primary">删除</el-button>
                </div>
              </div>
              <div class="add-project-box" @click="addAwards">
                <i class="el-icon-plus"></i>
                <span class="add-project-text">继续添加</span>
              </div>
              <div class="next-tab-btn">
                <el-button type="primary" @click="nextTab">下一步</el-button>
              </div>
            </el-tab-pane>

            <el-tab-pane label="自我评价" name="4">
              <el-form-item label="自我评价">
                <el-input type="textarea" rows="5" v-model="addResume.self_evalute"></el-input>
              </el-form-item>
              <div class="next-tab-btn">
                <el-button type="primary" @click="saveResume">保存简历</el-button>
                <el-button type="info" @click="resetResume">放弃填写</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>

        
        </el-form>

        <!-- 每个步骤的下一步按钮 -->
        <!-- <el-button style="margin-top: 12px;" 
        @click="next">下一步</el-button> -->


      </div>
    </div>

    <!-- 底部 -->
    <footer>
      Copyright @数据挖掘实验室, All right reserved.
    </footer>
    
    

    

    <!-- <el-form>
    <el-form-item label="照片" > -->
            <!-- action,上传地址，在main.js中
            getAuthHeaders()加请求头，在main.js中 -->
            <!-- <el-upload
            class="avatar-uploader"
            :action='uploadUrl'
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="afterUpload">
            <img v-if="model.avator" :src="model.avator" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
    </el-form-item>
    </el-form> -->
  </div>
</template>
<script>
export default {
  data(){
    // 通过regEmail.test验证值是否合法
    var checkEmail=(rule,value,callback)=>{
      const regEmail= /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(regEmail.test(value)){
        return callback();
      }
      return callback(new Error("请输入合法的邮箱"));

    }
    // 验证手机号的规则
    var checkMobile=(rule,value,callback)=>{
      const regMobile= /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if(regMobile.test(value)){
        return callback();
      }
      return callback(new Error("请输入正确的手机号"));

    }
    return{
      username:'',
      // 当前页签
      activeName: '0',
      // 修改简历时获取页面传过来的建立id
      resume_id:'',
      // 新建简历表单
      // 页签显示与否
      // diasbleTab:false,
      // 项目经历数组
      
      // 获奖经历数组
      
      addResume:{
        name:'',
        user:'',
        student_id:'',
        avator:'',
        tel:'',
        email:'',
        academic:'',
        major:'',
        grade:'',
        personal_website:'',
        language_skill:'',
        programing:'',
        projects:[],
        awards:[],
        self_evalute:'',
      },
      // 简历表单的验证规则
      addResumeRules:{
        name:[
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        student_id:[
          {required: true, message: '请输入学号', trigger: 'blur' },
          {min:11,max:11,message:'请输入11位的学号'}
        ],
        avator:[
          {required: true,message:'选择照片',trigger:'change'},
        ],
        tel:[
          {required:true,message:"请输入手机号",trigger:'blur'},
          {validator:checkMobile,trigger:'blur'},
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          {validator:checkEmail,trigger:'blur'},
        ],
        academic:[
          {required:true,message:"请输入学院名称",trigger:'blur'}
        ],
        major:[
          {required:true,message:"请输入专业名称",trigger:'blur'}
        ],
        grade:[
          {required:true,message:"请输入年级，如2017",trigger:'blur'}
        ],
        
      }

      // model:{
      //   avator:'',
      // }

    }
  },
  created(){
    console.log("项目经历")
    if(this.$route.query.resume_id){
      this.resume_id=this.$route.query.resume_id
      console.log("修改简历简历")
      this.getResumeData(this.resume_id);
    }
    console.log(this.$route.query)
    this.username=sessionStorage.getItem('username')
    console.log(this.username)
    this.addResume.user=sessionStorage.getItem('user_id')

  },
  methods:{
    // 编辑简历时先获取简历的数据，然后赋值显示在页面上
    async getResumeData(resume_id){
      const res=await this.$http.get(`rest/vitaes/${resume_id}`);
      console.log("获取修改简历数据")
      this.addResume=res.data;
      console.log(this.addResume);
    },
    // 上照片
    afterUpload(res){
      this.$set(this.addResume,'avator',res.url)
      console.log("已上传")
      console.log(this.addResume.avator)
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        console.log(1);
        const formData = new FormData();
        formData.append("file", file);
        const res = await this.$http.post("http://shuwa.alinyuan.com/admin/api/upload", formData);
        Editor.insertEmbed(cursorLocation, "image", res.data.url);
        resetUploader();
    },
    // getAuthHeaders(){

    // }

    // 步骤条点击下一步
    // next() {
    //   if (this.activeStep++ > 4) this.activeStep = 0;
    // }
    // 导航条下拉栏跳转
    goToApply(command){
      if(command=='Logout'){
        // console.log("退出登录")
        window.sessionStorage.setItem('token','');
        // console.log("退出登录")
        // this.$router.push('/')
        window.sessionStorage.setItem('username','')
        window.sessionStorage.setItem('user_id','')

        window.sessionStorage.setItem('admin','')
        this.$router.push('/')
      }
      else{
        // this.loginSelectedCommand=command
        // console.log(this.loginSelectedCommand);
        this.$router.push({name:command});
      }

    },
    // 点击修改当前页签
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    // 当前页签点击保存并跳转下一页
    nextTab(){
      // console.log(this.)
      // this.$refs.addResumeRef.validate(valid=>{
      //   console.log(valid);
      // })
      this.activeName=this.activeName-0+1+""
      // console.log(typeof(this.activeName))
      // console.log(this.activeName)
    },
    // 添加项目经历按钮
    addProject(){
      this.addResume.projects.push({
        project_name:'',
        project_time:'',
        project_detail:''
      })
    },
    // 点击删除项目按钮
    deleteProject(index){
      this.addResume.projects.splice(index,1);
    },
    // 添加h获奖经历按钮
    addAwards(){
      this.addResume.awards.push({
        awards_name:'',
        awards_time:'',
        awards_detail:''
      })
    },
    // 点击删除获奖情况
    deleteAwards(index){
      this.addResume.awards.splice(index,1)
    },
    // 保存并进行预览简历按钮
    saveResume(){
      console.log(this.addResume)
      this.$refs.addResumeRef.validate(async valid=>{
        // console.log(valid);
        if(!valid){
          return this.$message.error("请将简历信息正确填写完整")
        }
        // resume_id不存在时发起创建简历的请求
        if(!this.resume_id){
          const res=await this.$http.post('rest/vitaes',this.addResume)
          if(res.status!==200){
            return this.$message.error("创建简历失败")
          }
          this.$message.success("创建成功")
          this.$router.push('/myapply')
        }
        // 当resume_id存在时发起修改简历的请求
        const editRes=await this.$http.put(
          `rest/vitaes/${this.resume_id}`,
          this.addResume
        )
        if(editRes.status!==200){
          return this.$message.error("修改简历失败")
        }
        this.$message.success("修改简历成功")
        this.$router.push('/myapply')

        // const resume_id=res.data._id
        // console.log(resume_id)
        // this.$router.push('/')
      })

    },
    // 放弃填写简历按钮
    async resetResume(){
      const resetConfirm=await this.$confirm('此操作将清楚前面所填的全部内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      
      if(resetConfirm!=='confirm'){
        return this.$message.info("取消清除！")
      }
      this.$refs.addResumeRef.resetFields();
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
.newresume{
  background-color: #f5f5f5;
  padding:15px 0;
}
.newresume-box{
  width: 85%;
  margin: 0 auto;
  background-color: white;
  border-left: 2px solid #ececec;
  border-right: 2px solid #ececec;
  padding: 15px 30px;
  color: #444;
}
.el-tabs__item{
  padding: 0 82px !important;
}
/* 上传照片的样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  /* line-height: 178px; */
  text-align: center;
}
.el-icon-plus:before{
  line-height: 178px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-input__inner {
  width:400px !important;
}
.el-textarea__inner{
  width: 550px!important;
}
.el-form-item{
  margin: 30px!important;
}
.each-project-box{
  /* background-color: red; */
  border-bottom: 1px solid #ececec;
  padding: 20px 0;
  width: 90%;
  margin: 0 auto;
}
.no-project-text{
  text-align: center;
}
.add-project-box{
  text-align: center;
  padding: 0;
  /* height: 30px; */
  
  /* height: 80px; */
  /* line-height: 80px; */
}
.el-icon-plus{
  /* font-size: 13px; */
  /* height: 20px; */
  /* padding-bottom: 30px */
}
.add-project-text:hover{
  cursor: pointer;
}
.dele-project-btn{
  text-align: center
}
.next-tab-btn{
  text-align:center;
  /* padding-right: 300px; */
}
</style>