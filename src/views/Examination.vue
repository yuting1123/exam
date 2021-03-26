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

      <!-- 个人信息区域 -->
      <el-col :span="16">
        <div class="login-info">
          <div class="login-username">
            <div class="username">{{username}}</div>
            <!-- <div class="user-pulldown"></div> -->
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 显示题目区域 -->
    <div style="background-color:#f5f5f5;border-top:2px solid #f5f5f5;">
      <div class="show-test-box">
        <div class="test-header-box">
          <div class="test-name">
            {{testName}}
          </div>
          <div class="test-time" v-if="examId">
            倒计时：<el-button type="primary" plain>{{hours}}:{{minutes}}:{{seconds}}</el-button>
          </div>
          <div class="test-user-name" v-if="examId">
            姓名：<span>{{username}}</span>
          </div>
        </div>
        <!-- 单选 -->
        <div class="question-type-box" v-if="addTestForm.single_choice.length">
          <!-- {{addTestForm.single_choice.length}} -->
          <div class="question-type-title" >
            ·单选题({{eachScore['single_choice']}}分×
            {{addTestForm.single_choice.length}})
          </div>
          
            <div class="each-question-content" v-for="(item1,index1) in addTestForm.single_choice" :key="index1">
                <div class="question-text">
                  {{index1+1}}、{{questionList[item1.question].name}}
                  <!-- {{questionList[item1.question]}} -->
                </div>
                <el-radio-group v-model="item1.choice" 
                  v-for="(subItem1,subIndex1) in questionList[item1.question].answers" :key="subIndex1">
                  <el-radio :label="subIndex1" border>
                    {{subItem1.name}}
                  </el-radio>
                </el-radio-group>
            </div>
          
        </div>
        <!-- 多选 -->
        <div class="question-type-box" v-if="addTestForm.multiple_choice.length">
          <div class="question-type-title" v-if="addTestForm.single_choice.length">
            ·多选题({{eachScore['multiple_choice']}}分×
            {{addTestForm.multiple_choice.length}})
          </div>

          <div class="each-question-content" v-for="(item2,index2) in addTestForm.multiple_choice" :key="index2">
            <div class="question-text">
              {{index2+1}}、{{questionList[item2.question].name}}
            </div>  
            <el-checkbox-group v-model="item2.choice">
              <el-checkbox 
                :label="subIndex2" 
                v-for="(subItem2,subIndex2) in questionList[item2.question].answers" 
                :key="subIndex2" border>
                {{subItem2.name}}
              </el-checkbox>
            </el-checkbox-group>
          </div> 
        </div>
        <!-- 判断 -->
        <div class="question-type-box" v-if="addTestForm.ture_or_false.length">
          <div class="question-type-title" >
            ·判断题({{eachScore['ture_or_false']}}分×
            {{addTestForm.ture_or_false.length}})
          </div>
          <div class="each-question-content" v-for="(item3,index3) in addTestForm.ture_or_false" :key="index3">
            <div class="question-text">
              {{index3+1}}、{{questionList[item3.question].name}}
              <!-- {{questionList[item1.question]}} -->
            </div>
            <el-radio-group v-model="item3.choice" 
              v-for="(subItem3,subIndex3) in questionList[item3.question].answers" :key="subIndex3">
              <el-radio :label="subIndex3" border>
                {{subItem3.name}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 主观 -->
        <div class="question-type-box" v-if="addTestForm.subjective.length">
          <div class="question-type-title" >
            ·主观题
            ({{eachScore['subjective']}}分×
            {{addTestForm.subjective.length}})
          </div>
          <div class="each-question-content" v-for="(item4,index4) in addTestForm.subjective" :key="index4">
            <div class="question-text">
              {{index4+1}}、{{questionList[item4.question].name}}
            </div>
            <div class="subjective-input-box">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                placeholder="请输入内容"
                v-model="item4.choice"
              >
              </el-input>
            </div>
          </div>
        </div>
        <div class="test-btn">
          <el-button type="primary" plain @click="submitTest"
          v-if="examId">交卷</el-button>
          <el-button v-else type="primary" plain
          @click="showResult">查看结果</el-button>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <footer>
      Copyright @数据挖掘实验室, All right reserved.
    </footer>

    <!-- 显示答卷结果对话框 -->
    <el-dialog
      title="答题详情"
      :visible.sync="showResultDialogVisible"
      width="60%"
      >
      <!-- 单选 -->
      <div class="question-type-box" v-if="addTestForm.single_choice.length">
        <div class="question-type-title" >
          ·单选题({{eachScore['single_choice']}}分×
          {{addTestForm.single_choice.length}})
        </div>
        
          <div class="each-question-content" v-for="(item1,index1) in addTestForm.single_choice" :key="index1">
              <div :class="item1.choice==questionList[item1.question].right?'question-text':'error-question-text'">
                {{index1+1}}、{{questionList[item1.question].name}}
                <span class="result-text" style="color:green"
                v-if="item1.choice==questionList[item1.question].right">[√正确]</span>
                <span class="result-text" style="color:red" v-else>
                  [×错误] 你的选择：{{choiceName[item1.choice]}},
                  正确答案：{{choiceName[questionList[item1.question].right]}}
                </span>
              </div>
              <el-radio-group v-model="item1.choice" 
                v-for="(subItem1,subIndex1) in questionList[item1.question].answers" :key="subIndex1">
                <el-radio :label="subIndex1" border>
                  {{subItem1.name}}
                </el-radio>
              </el-radio-group>
          </div>
      </div>
      <!-- 多选 -->
      <div class="question-type-box" v-if="addTestForm.multiple_choice.length">
        <div class="question-type-title" v-if="addTestForm.multiple_choice.length">
          ·多选题({{eachScore['multiple_choice']}}分×
          {{addTestForm.multiple_choice.length}})
        </div>

        <div class="each-question-content" v-for="(item2,index2) in addTestForm.multiple_choice" :key="index2">
          <div :class="[judgeMultiple(item2.choice,questionList[item2.question].right)?'question-text':'error-question-text']">
            {{index2+1}}、{{questionList[item2.question].name}}
            {{judgeMultiple(item2.choice,questionList[item2.question].right)}}
            <span class="result-text" style="color:green"
            v-if="judgeMultiple(item2.choice,questionList[item2.question].right)">[√正确]</span>
            <span class="result-text" style="color:red" v-else>
              [×错误] 你的选择：{{arrayToString(item2.choice)}},
              正确答案：{{toResultString(questionList[item2.question].right)}}
            </span>
          </div>  
          <el-checkbox-group v-model="item2.choice">
            <el-checkbox 
              :label="subIndex2" 
              v-for="(subItem2,subIndex2) in questionList[item2.question].answers" 
              :key="subIndex2" border>
              {{subItem2.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div> 
      </div>
      <!-- 判断 -->
      <div class="question-type-box" v-if="addTestForm.ture_or_false.length">
        <div class="question-type-title" >
          ·判断题({{eachScore['ture_or_false']}}分×
          {{addTestForm.ture_or_false.length}})
        </div>
        <div class="each-question-content" v-for="(item3,index3) in addTestForm.ture_or_false" :key="index3">
          <div class="item3.choice==questionList[item3.question].right?'question-text':'error-question-text'">
            {{index3+1}}、{{questionList[item3.question].name}}
            <span class="result-text" style="color:green"
            v-if="item3.choice==questionList[item3.question].right">[√正确]</span>
            <span class="result-text" style="color:red" v-else>
              [×错误] 你的选择：{{choiceName[item3.choice]}},
              正确答案：{{choiceName[questionList[item3.question].right]}}
            </span>
          </div>
          <el-radio-group v-model="item3.choice" 
            v-for="(subItem3,subIndex3) in questionList[item3.question].answers" :key="subIndex3">
            <el-radio :label="subIndex3" border>
              {{subItem3.name}}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 主观 -->
      <div class="question-type-box" v-if="addTestForm.subjective.length">
        <div class="question-type-title" >
          ·主观题
          ({{eachScore['subjective']}}分×
          {{addTestForm.subjective.length}})
        </div>
        <div class="each-question-content" v-for="(item4,index4) in addTestForm.subjective" :key="index4">
          <div class="question-text">
            {{index4+1}}、{{questionList[item4.question].name}}
          </div>
          <div class="subjective-input-box">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
              v-model="item4.choice"
            >
            </el-input>
          </div>
          <div class="standard-answer-box" v-if="questionList[item4.question].right">
            <div class="standard-answer-title">标准答案:</div>
            <el-input 
              type="textarea"
              :autosize="{ minRows: 3}"
              v-model="questionList[item4.question].right"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showResultDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showResultDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

</div>
</template>
<script>
export default {
  data(){
    return{
      username:'',
      examId:'6043926b3100f0798a5d6e3f',
      testId:'',
      // 考试是否结束
      // examIsEnd:false, 
      // 考试名称
      testName:'',
      choiceName:['A','B','C','D','E','F','G','H','I'],
      // 考试倒计时
      hours:0,
      minutes:0,
      seconds:0,
      // 每道题的分数
      eachScore:{},
      // 正确答案的数组
      // singleAnswer:[],
      // mutipleAnswer:[],
      // TFAnswer:[],
      // subAnswer:[],
      // 所有题目的数组
      questionList:{},
      // 提交到后台的数据
      addTestForm:{
        name:'',
        user:'',
        test:'',
        test_item:'',
        comment:'',
        score:0,
        pass:'',
        single_choice:[],
        multiple_choice:[],
        ture_or_false:[],
        subjective:[]
      },
      // 练习卷显示答题结果对话框显示与否
      showResultDialogVisible:false
    }
  },
  created(){
    this.username=sessionStorage.getItem('username')
    this.addTestForm.user=sessionStorage.getItem('user_id')
    this.addTestForm.name=this.username
    this.examId=this.$route.query.examId
    this.testId=this.$route.query.testId
    console.log("输出考试、测试id")
    console.log(this.examId)
    console.log(this.testId)
    if(this.examId){
      this.addTestForm.test_item=this.examId
      this.getExamInfo();
    }
    if(this.testId){
      this.getTestPaper()
    }
    
  },
  watch:{
    // 监听数值变化
    second: {
      handler(newVal) {
        this.num(newVal)
      }
    },
    minute: {
      handler(newVal) {
        this.num(newVal)
      }
    },
    hour: {
      handler(newVal) {
        // console.log(this.num(newVal))
        this.num(newVal)
      }
    }
  },
  mounted(){
    if(this.examId){
      this.add();
    }
    
  },
  computed:{
    // 初始化数据
    second() {
      return this.num(this.seconds)
    },
    minute() {
      return this.num(this.minutes)
    },
    hour() {
      return this.num(this.hours)
    }
  },
  methods:{
    // 根据试卷id获取试卷
    async getTestPaper(){
      const res=await this.$http.get(`rest/tests/${this.testId}`)
      console.log("练习试卷信息")
      console.log(res)
      console.log("练习试卷信息")
      // 考试名称
      this.testName=res.data.name
      // 单选
      if(res.data.single_choice.id.length!==0){
        this.eachScore['single_choice']=res.data.single_choice.score
        res.data.single_choice.id.forEach(question=>{
          console.log(question)
          this.addTestForm.single_choice.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }
      // 多选
      if(res.data.multiple_choice.id.length!==0){
        this.eachScore['multiple_choice']=res.data.multiple_choice.score
        res.data.multiple_choice.id.forEach(question=>{
          console.log(question)
          this.addTestForm.multiple_choice.push({
            question:question._id,
            choice:[]
          })
          // question.right=question.right.split(',')
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }
      // 主观
      if(res.data.subjective.id.length!==0){
        this.eachScore['subjective']=res.data.subjective.score
        res.data.subjective.id.forEach(question=>{
          console.log(question)
          this.addTestForm.subjective.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
            right:question.right
          }
        })
      }

      // 判断
      if(res.data.ture_or_false.id.length!==0){
        this.eachScore['ture_or_false']=res.data.ture_or_false.score
        res.data.ture_or_false.id.forEach(question=>{
          console.log(question)
          this.addTestForm.ture_or_false.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }

      console.log("输出测试卷的数据")
      console.log(this.questionList)
      console.log(this.addTestForm)
      console.log(this.eachScore)
      console.log("输出测试卷的数据")
    },
    // 根据考试id获取数据
    async getExamInfo(){
      const res=await this.$http.get(`rest/test_items/${this.examId}`)
      console.log("考试试卷信息")
      console.log(res)
      console.log("考试试卷信息")
      // 试卷id
      this.addTestForm.test=res.data.test._id
      // 考试名称
      this.testName=res.data.name
      console.log("考试名称")
      console.log("考试时间")
      this.getTimeCountDown(res.data.time[1])
      // 单选
      if(res.data.test.single_choice.id.length!==0){
        // this.eachScore.push(
        //   {single_choice:res.data.test.single_choice.score+0}
        // )
        this.eachScore['single_choice']=res.data.test.single_choice.score
        res.data.test.single_choice.id.forEach(question=>{
          console.log(question)
          this.addTestForm.single_choice.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }
      // 多选
      if(res.data.test.multiple_choice.id.length!==0){
        this.eachScore['multiple_choice']=res.data.test.multiple_choice.score
        res.data.test.multiple_choice.id.forEach(question=>{
          console.log(question)
          this.addTestForm.multiple_choice.push({
            question:question._id,
            choice:[]
          })
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }
      // 主观
      if(res.data.test.subjective.id.length!==0){
        this.eachScore['subjective']=res.data.test.subjective.score
        res.data.test.subjective.id.forEach(question=>{
          console.log(question)
          this.addTestForm.subjective.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
          }
        })
      }

      // 判断
      if(res.data.test.ture_or_false.id.length!==0){
        this.eachScore['ture_or_false']=res.data.test.ture_or_false.score
        res.data.test.ture_or_false.id.forEach(question=>{
          console.log(question)
          this.addTestForm.ture_or_false.push({
            question:question._id,
            choice:''
          })
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }

      console.log("res数据")
      console.log(res.data)
      console.log("要提交的数组")
      console.log(this.addTestForm)
      console.log("题目数组")
      console.log(this.questionList)
      console.log("分数数组")
      console.log(this.eachScore)
    },
    // 点击交卷事件
    async submitTest(){
      const submitConfirm=await this.$confirm('是否确认交卷', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(submitConfirm!='confirm'){
        return
      }
        
      // 评分
      // 单选
      if(this.addTestForm.single_choice.length){
        this.addTestForm.single_choice.forEach(value=>{
          if(this.questionList[value.question].right==value.choice){
            this.addTestForm.score+=parseInt(this.eachScore['single_choice']) 
          }
        })
      }
          
      // 多选
      if(this.addTestForm.multiple_choice.length){
        this.addTestForm.multiple_choice.forEach(value=>{
          var choiceStr=value.choice.join(',')
          console.log(choiceStr)
          if(this.questionList[value.question].right==choiceStr){
            this.addTestForm.score+=parseInt(this.eachScore['multiple_choice']) 
          }
        })
      }
          
      // 判断
      if(this.addTestForm.multiple_choice.length){
        this.addTestForm.multiple_choice.forEach(value=>{
          var choiceStr=value.choice.join(',')
          console.log(choiceStr)
          if(this.questionList[value.question].right==choiceStr){
            this.addTestForm.score+=parseInt(this.eachScore['multiple_choice']) 
          }
        })
      }
      this.addTestForm.score=this.addTestForm.score.toString()
      console.log(this.addTestForm)
      const res=await this.$http.post('rest/answers',this.addTestForm)
      if(res.status===200){
        this.$message.success("已成功提交答卷!")
        this.$router.push('/myapply')
      }
      // console.log("交卷")
      // console.log(this.addTestForm)
    },
    // 练习卷点击查看结果
    showResult(){
      console.log(this.addTestForm)
      this.showResultDialogVisible=true
    },

    // 处理时间，计算时间差,倒计时
    getTimeCountDown(endTime){
        //计算剩余的毫秒数
        var date=(new Date(endTime)) - (new Date())
        //相差小时数
        var leave1 = date % (24 * 3600 * 1000);
        this.hours = Math.floor(leave1 / (3600 * 1000))
        console.log(typeof(hours))
        //相差分钟
        var leave2 = leave1 % (3600 * 1000)
        this.minutes = Math.floor(leave2 / (60 * 1000));
        //相差秒
        var level3 = leave2 % (60 * 1000)
        this.seconds = Math.round(level3 / 1000);
    },
    // 倒计时函数
    // 防止数值小于10时，出现一位数
    num(n) {
        return n < 10 ? '0' + n : '' + n
    },
    // 倒计时函数
    add() {
      let time = window.setInterval( ()=> {
        if (this.hours !== 0 && this.minutes === 0 && this.seconds === 0) {
          this.hours -= 1;
          this.minutes = 59;
          this.seconds = 59;
        } 
        else if(this.hours === 0 && this.minutes !== 0 && this.seconds ===0) {
          this.minutes -= 1;
          this.seconds = 59;
        }
        else if(this.hours === 0 && this.minutes === 0 && this.seconds ===0) {
          this.seconds = 0
          window.clearInterval(time)
          this.autoSubmit()
          // 倒计时截止，自动提交表单
        } 
        else if(this.hours !== 0 && this.minutes !== 0 && this.seconds ===0) {
          this.minutes -= 1;
          this.seconds = 59;
        } 
        else {
          this.seconds -= 1;
        }
      }, 1000)
    },
    // 倒计时结束自动提交表单事件，跳转到我的申请页面
    async autoSubmit(){
      const res=await this.$http.post('rest/answers',this.addTestForm)
      if(res.status==200){
        this.$message.success("考试时间已到，已成功为您提交答卷!")
        this.$router.push('/myapply')
      }
    },
    // 练习卷多选题评判
    judgeMultiple(choiceArray1,choicestr){
      return choiceArray1.join(',')==choicestr?true:false
    },
    // 将数组选项转换
    arrayToString(choiceArray){
      var newArr=[]
      choiceArray.forEach(value=>{
        newArr.push(
          this.choiceName[value],
        )
      })
      return newArr.join( ',')
    },
    toResultString(choiceStr){
      var newArr=[]
      choiceStr.split(',').forEach(value=>{
        newArr.push(
          this.choiceName[value],
        )
      })
      return newArr.join( ',')
    }
  }
}
</script>
<style scoped>
.login-info{
  float:right;
  padding-right: 100px;
}
.show-test-box{
  background-color: white;
  width: 70%;
  margin:0 auto;
  border-left: 2px solid #ececec;
  border-right: 2px solid #ececec;
  /* vertical-align: middle; */
}
.test-header-box{
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #ececec;
  padding: 15px 20px;
}
.test-header-box .test-name,
.test-header-box .test-time,
.test-header-box .test-user-name{
  color: #597bda;
  font-weight: bold;
}
.test-header-box .test-name{
  font-size: 17px;
  padding-left: 280px;
  /* text-align: center; */
}
.test-header-box::after{
  display: block;
  content: '';
  clear: both;
  overflow: hidden;
}
.test-header-box .test-name{
  float: left;
}
.test-header-box .test-user-name{
  float: right;
  padding-right: 25px;
}
.test-header-box .test-time{
  float: right;
}
.question-type-title{
  font-weight: bold;
  border-bottom: 1px solid #ececec;
  padding: 10px 20px;
  color: #597bda;
}
.each-question-content{
  padding: 20px;
  border-bottom: 1px solid #ececec
}
.question-text,
.error-question-text{
  font-weight: bold;
}
.el-radio.is-bordered,
.el-checkbox.is-bordered{
  width: 550px!important;
  margin: 10px 0 10px 25px!important;
}
.subjective-input-box,
.standard-answer-box{
  width: 550px;
  margin: 10px 0 0 25px;
}
.test-btn{
  text-align: center;
  padding: 18px 0;
}
.el-radio__label{
  /* font-size: 16px!important;
  color: red; */
}
.result-text{
  font-size: 16px;
  padding-left: 15px
}
.error-question-text{
  color: red;
}
.standard-answer-title{
  color: green;
  padding-bottom: 10px;
  font-weight: bold;
}
.standard-answer-box >>> .el-textarea__inner{
  color: red !important;
}


</style>