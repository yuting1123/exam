<template>
  <div class="create-exam-box">
    <el-form :model="addExamForm" :rules="addTestFormRules" 
      ref="addExamFormRef" label-width="120px">
      <div class="test-paper-title">
        考试基本信息
      </div>
      
      <el-form-item label="考试名称" prop="name">
        <el-input v-model="addExamForm.name"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="author">
        <el-select v-model="addExamForm.author" clearable>
          <el-option
            v-for="item in cresteAuthor"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试时间" prop="time">
        <el-date-picker
          v-model="addExamForm.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="岗位" prop="recruit">
        <el-select v-model="addExamForm.recruit._id" clearable>
          <el-option
            v-for="item in recruitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
          <!-- <el-cascader :options="recruitOptions"
           v-model="addExamForm.recruit._id" clearable
           :props="defaultParams">
          </el-cascader> -->
      </el-form-item>
      <el-form-item label="选择试卷">
        <el-button v-if="addExamForm.test">{{addExamForm.test.name}}</el-button>
        <el-button type="primary" @click="chooseExamPaper">选择试卷</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="!examId" @click="submitExam">立即创建</el-button>
        <el-button type="primary" v-else @click="saveInfo">保存</el-button>
        <el-button @click="cancleCreate">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data(){
    var checkRecruit=(rule,value,callback)=>{
      if(!value._id){
        return callback(new Error("请选择岗位"))
      }
    }
    return{
      examId:'',
      // 岗位级联选择器
      recruitOptions:[
      ],
      // 创建人
      cresteAuthor:[],
      addExamForm:{
        author:'',
        name:'',
        recruit:{},
        time:[]
      },
      addTestFormRules:{
        name:[
          {required: true, message: '请输入考试名称', trigger: 'blur'}
        ],
        author:[
          {required: true, message: '请选择创建人', trigger: ["blur",'change']}
        ],
        recruit:[
          { required:true,validator:checkRecruit,trigger: ["blur",'change']}
        ],
      }
    }
  },
  created(){
    this.cresteAuthor.push({
      value:sessionStorage.getItem('user_id'),
      label:sessionStorage.getItem('username')
    })
    this.getDepartment()
    this.examId=this.$route.query.examId
    if(this.examId){
      this.getExam()
    }
  },
  methods:{
    async getExam(){
      const res=await this.$http.get(`rest/test_items/${this.examId}`);
      this.addExamForm=res.data
      console.log(this.addExamForm)
    },
    // 获取岗位列表
    async getDepartment(){
      const res=await this.$http.get('departments')
      res.data.forEach(value=>{
        value.recruitList.forEach(value1=>{
          this.recruitOptions.push({
            value:value1._id,
            label:value1.name+'('+value.name+')'
          })
        })
      })
      console.log(this.recruitOptions)
    },
    // 创建考试
    async submitExam(){
      console.log('创建考试')
      // this.$refs.addExamFormRef.validate(async valid=>{
      //   console.log('11111')
      //   console.log(valid)
      //   if(!valid){
      //     return
      //   }
        console.log(this.addExamForm)
        const res=await this.$http.post('rest/test_items',this.addExamForm)
        if(res.status===200){
          console.log(res)
          this.examId=res.data._id
          return this.$message.success("创建成功！")
        } 
      // })

    },  
    // 保存试卷信息
    async saveInfo(){
      // this.$refs.addExamFormRef.validate(async valid=>{
      //   if(!valid){
      //     return
      //   }
        const res=await this.$http.put(
          `rest/test_items/${this.examId}`,
          this.addExamForm
        )
        this.addTestFormRef=res.data
        console.log(this.addExamForm)
        this.$message.success('保存成功！')
        this.$router.push('/createexam/list')
      // })
    },
    // 重置
    cancleCreate(){
      this.$refs.addExamFormRef.resetFields()
    },
    // 点击选择试卷
    async chooseExamPaper(){
      const res=await this.$http.post('rest/test_items',this.addExamForm)
      if(res.status===200){
        console.log(res)
        this.examId=res.data._id
        this.$router.push({path:'/testpaper',query:{examId:this.examId}})
      } 
    }


  }
}
</script>
<style scoped>
.create-exam-box >>> .el-input__inner{
  width: 360px;
}
</style>