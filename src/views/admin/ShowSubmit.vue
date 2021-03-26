 <template>
  <div>
    <el-table
      :data="submitUser"
      height="250"
      border
      style="width: 100%"
      >
      <el-table-column
        prop="name"
        fixed
        label="名字"
        >
      </el-table-column>
      <el-table-column
        fixed
        label="成绩"
        prop="test_answer.score"
        >
        <template slot-scope="scope">
          <p v-if="!scope.row.test_answer">无</p>
          <p v-else>{{scope.row.test_answer.score}}</p>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="答题详情">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.test_answer"
           @click="showAnswer(scope.row)">查看</el-button>
          <span v-else>无答卷</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="简历详情">
        <template slot-scope="scope">
          <el-button type="text" @click="showResume(scope.row.vitae)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="是否通过"
        width="250">
        <template slot-scope="scope">
          <div v-if="scope.row.test_answer">
            <div v-if="scope.row.test_answer.pass!='0'">
              <el-button type="text" v-if="scope.row.test_answer.pass=='1'">
              通过</el-button>
              <el-button type="text" v-if="scope.row.test_answer.pass=='-1'">
              不通过</el-button>
              <el-button type="primary" size="mini" @click="submitPass(scope.row.test_answer)">
              修改</el-button>
            </div>

            <div v-else>
              <el-button type="primary" @click="submitPass(scope.row.test_answer)" 
              size="mini">评价</el-button>
            </div>
          </div>
          <div v-else>
            <el-button type="text">
            不通过</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed
        label="是否接受offer"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.test_answer">
            <!-- {{scope.row.test_answer.accept}} -->
            <div v-if="scope.row.test_answer.accept!='0'">
              <el-button type="text" v-if="scope.row.test_answer.accept=='1'">
              接受</el-button>
              <el-button type="text" v-if="scope.row.test_answer.accept=='-1'">
              拒绝</el-button>
            </div>

            <div v-else>
              <el-button type="text" size="mini">未回复</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

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
      </div>
    </el-dialog>

    <!-- 显示答卷情况对话框 -->
    <el-dialog
      :title="testName"
      :visible.sync="answerDialogVisible"
      width="55%"
      >
      <div v-if="JSON.stringify(activeAnswer)=='{}'">
        无答卷
      </div>
      <div v-else>
        <!-- 单选 -->
        <div class="question-type-box" v-if="activeAnswer.single_choice.length">
          <div class="question-type-title" >
            ·单选题({{eachScore['single_choice']}}分×
            {{activeAnswer.single_choice.length}})
          </div>
          
          <div class="each-question-content" v-for="(item1,index1) in activeAnswer.single_choice" :key="index1">
            <div :class="item1.choose==questionList[item1.question].right?'question-text':'error-question-text'">
              {{index1+1}}、{{questionList[item1.question].name}}
              <span class="result-text" style="color:green"
              v-if="item1.choose==questionList[item1.question].right">[√正确]</span>
              <span class="result-text" style="color:red" v-else>
                [×错误] 他的选择：{{choiceName[item1.choose]}},
                正确答案：{{choiceName[questionList[item1.question].right]}}
              </span>
            </div>
            <el-radio-group v-model="item1.choose" disabled
              v-for="(subItem1,subIndex1) in questionList[item1.question].answers" :key="subIndex1">
              <el-radio :label="subIndex1" border>
                {{subItem1.name}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 多选 -->
        <div class="question-type-box" v-if="activeAnswer.multiple_choice.length">
          <div class="question-type-title" v-if="activeAnswer.multiple_choice.length">
            ·多选题({{eachScore['multiple_choice']}}分×
            {{activeAnswer.multiple_choice.length}})
          </div>

          <div class="each-question-content" v-for="(item2,index2) in activeAnswer.multiple_choice" :key="index2">
            <div :class="[judgeMultiple(item2.choose,questionList[item2.question].right)?'question-text':'error-question-text']">
              {{index2+1}}、{{questionList[item2.question].name}}
              <!-- {{judgeMultiple(item2.choose,questionList[item2.question].right)}} -->
              <span class="result-text" style="color:green"
              v-if="judgeMultiple(item2.choose,questionList[item2.question].right)">[√正确]</span>
              <span class="result-text" style="color:red" v-else>
                [×错误] 你的选择：{{arrayToString(item2.choose)}},
                正确答案：{{toResultString(questionList[item2.question].right)}}
              </span>
            </div>  
            <el-checkbox-group v-model="item2.choose" disabled>
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
        <div class="question-type-box" v-if="activeAnswer.ture_or_false.length">
          <div class="question-type-title" >
            ·判断题({{eachScore['ture_or_false']}}分×
            {{activeAnswer.ture_or_false.length}})
          </div>
          <div class="each-question-content" v-for="(item3,index3) in activeAnswer.ture_or_false" :key="index3">
            <div class="item3.choose==questionList[item3.question].right?'question-text':'error-question-text'">
              {{index3+1}}、{{questionList[item3.question].name}}
              <span class="result-text" style="color:green"
              v-if="item3.choose==questionList[item3.question].right">[√正确]</span>
              <span class="result-text" style="color:red" v-else>
                [×错误] 你的选择：{{choiceName[item3.choose]}},
                正确答案：{{choiceName[questionList[item3.question].right]}}
              </span>
            </div>
            <el-radio-group v-model="item3.choose" disabled
              v-for="(subItem3,subIndex3) in questionList[item3.question].answers" :key="subIndex3">
              <el-radio :label="subIndex3" border>
                {{subItem3.name}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 主观 -->
        <div class="question-type-box" v-if="activeAnswer.subjective.length">
          <div class="question-type-title" >
            ·主观题
            ({{eachScore['subjective']}}分×
            {{activeAnswer.subjective.length}})
          </div>
          <div class="each-question-content" v-for="(item4,index4) in activeAnswer.subjective" :key="index4">
            <div class="question-text">
              {{index4+1}}、{{questionList[item4.question].name}}
            </div>
            <div class="subjective-input-box">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5}"
                v-model="item4.choose"
                disabled
              >
              </el-input>
            </div>
            <div class="standard-answer-box" v-if="questionList[item4.question].right">
              <div class="standard-answer-title">标准答案:</div>
              <el-input 
                disabled
                type="textarea"
                :autosize="{ minRows: 3}"
                v-model="questionList[item4.question].right"></el-input>
            </div>
          </div>
        </div>
        <div class="comment">
          <div class="question-type-title" >
            评价:
          </div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2}"
            v-model="activeAnswer.comment">
          </el-input>
        </div>
        <div class="comment-sava-box">
          <el-button type="primary" @click="saveComment">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 显示是否通过对话框 -->
    <el-dialog
      title="学生是否通过笔试"
      :visible.sync="passDialogVisible"
      width="30%"
      center
      >
      <!-- <span></span> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="toGivePass('yes')">通过</el-button>
        <el-button type="primary" @click="toGivePass('no')">不通过</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data(){
    return{
      // choice:'1',
      rescruitId:'',
      submitUser:[],
      // 当前行投递人的简历数据
      resume:{},
      // 查看简历对话框显示与否
      ResumeDialogVisible:false,
      // 查看答卷详情对话库显示与否
      answerDialogVisible:false,
      // 显示评价对话框与否
      passDialogVisible:false,
      choiceName:['A','B','C','D','E','F','G','H','I'],
      // 点击查看的答卷信息
      activeAnswer:{},
      // activeTest:{},
      testName:'',
      // 每道题的分数
      eachScore:{},
      // 所有题目的数组
      questionList:{},
      activePassId:''

    }
  },
  computed:{
    getEachTime(){
      // 处理时间
      return function(sTime){
        // console.log(typeof(sTime))
        // console.log(sTime)
        return sTime.split('T')[0];
      }
    }
  },
  created(){
    this.rescruitId=this.$route.query._id;
    console.log("岗位id")
    console.log(this.rescruitId)
    this.getSubmitUser(this.rescruitId)

  },
  watch:{
    '$route'(to,from){
      if(to.query._id!=from.query._id){
        this.rescruitId=to.query._id
        console.log('子页面的参数变化了')
        console.log(this.rescruitId)
        this.getSubmitUser(this.rescruitId)
      }
    },
  },
  methods:{
    // 通过岗位id获取投递的人
    async getSubmitUser(rescruitId){
      const res=await this.$http.get(
        `recruit_item/${rescruitId}`)
      console.log(res)
      this.submitUser=res.data
      console.log("投递人信息")
      console.log(this.submitUser)
    },
    // 点击查看简历事件
    async showResume(resumeId){
      console.log(resumeId)
      const res=await this.$http.get(`rest/vitaes/${resumeId}`)
      if(res.status!==200){
        return
      }
      this.resume=res.data
      this.ResumeDialogVisible=true
      console.log(this.resume)
      
    },
    // 点击查看答卷详情
    async showAnswer(answer){
      console.log(answer)
      if(!answer.test_answer){
        this.answerDialogVisible=true
        console.log("无答卷")
        return
      }
      
      const res=await this.$http.get(`rest/tests/${answer.test_item.test}`)
      // 考试名
      this.testName=res.data.name
      // 单选
      if(res.data.single_choice.id.length!==0){
        this.eachScore['single_choice']=res.data.single_choice.score
        res.data.single_choice.id.forEach(question=>{
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
          this.questionList[question._id]={
            name:question.name,
            answers:question.answers,
            right:question.right,
          }
        })
      }

      console.log("输出测试卷的数据")
      console.log(this.questionList)
      console.log(this.eachScore)
      console.log("输出测试卷的数据")
      this.answerDialogVisible=true

      const answerRes=await this.$http.get(
        `rest/answers/${answer.test_answer._id}`)
      console.log(answerRes)
      this.activeAnswer=answerRes.data
      answerRes.data.single_choice.forEach(value=>{
        value.choose=parseInt(value.choose)
      })
      answerRes.data.multiple_choice.forEach(value1=>{
        var chooseArray=[]
        value1.choose.forEach(value11=>{
          chooseArray.push(parseInt(value11))
        })
        value1.choose=chooseArray
      })
      this.activeAnswer=answerRes.data
      answerRes.data.ture_or_false.forEach(value=>{
        value.choose=parseInt(value.choose)
      })
      console.log("答卷数据")
      console.log(this.activeAnswer)
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
    },
    // 保存评价
    async saveComment(){
      console.log(this.activeAnswer.comment)
      const res=await this.$http.put(
        `rest/answers/${this.activeAnswer._id}`,
        {comment:this.activeAnswer.comment})
        console.log(res)
      this.activeAnswer.comment=res.data.comment
      this.answerDialogVisible=false
    },
    // 是否通过的评价按钮
    async submitPass(test_answer){
      this.passDialogVisible=true
      this.activePassId=test_answer._id
      // console.log('是否通过的评价按钮')
      // console.log(test_answer)
      // const confirm=await this.$confirm('学生是否通过笔试', '提示', {
      //     confirmButtonText: '通过',
      //     cancelButtonText: '不通过',
      //     type: 'warning'
      //   }).catch(err=>err)
      // if(confirm=='cancel'){
      //   console.log(confirm)
      //   //  await this.$http.put(
      //   //    `rest/answers/${test_answer._id}`,
      //   //    {pass:'-1'})
      //   // this.getSubmitUser(this.rescruitId)
      //   return 
      // }
      // if(confirm=='confirm'){
      //   await this.$http.put(
      //     `rest/answers/${test_answer._id}`,
      //     {pass:'0'})
      //   this.getSubmitUser(this.rescruitId)
      //   console.log("tongguo")
      // }
      
    },
    // 修改评价
    // async editPass(test_answer){
    //   this.
    //   // await this.$http.put(
    //   //      `rest/answers/${test_answer._id}`,
    //   //      {pass:'0'})
    //   //   this.getSubmitUser(this.rescruitId)
    // },
    // 通过与不通过请求后台
    async toGivePass(str){
      // 通过
      if(str=='yes'){
        console.log('通过')
        const yesRes= await this.$http.put(
          `rest/answers/${this.activePassId}`,
          {pass:'1'})
        if(yesRes.status==200){
          this.getSubmitUser(this.rescruitId)
          this.activePassId=''
          this.passDialogVisible=false
        }  
      }
      else{
        console.log('不通过')
        const noRes= await this.$http.put(
          `rest/answers/${this.activePassId}`,
          {pass:'-1'})
        this.getSubmitUser(this.rescruitId)
        if(noRes.status==200){
          this.getSubmitUser(this.rescruitId)
          this.activePassId=''
          this.passDialogVisible=false
        }  
      }
    }
  }
  
}
</script>
<style scoped>
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

/* 答卷弹窗 */
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
.el-radio.is-bordered.is-checked,
.el-checkbox.is-bordered.is-checked{
  border-color: teal!important;
}
.question-type-box>>>.el-radio__label,
.question-type-box>>>.el-checkbox__label,
.question-type-box>>>.el-textarea__inner
{
  color: rgb(134, 133, 133)!important;
}
.comment-sava-box{
  margin: 15px 0 0 0;
  text-align: center;
}
</style>