<template>
  <div class="create-question-box">
    <el-form :model="addQuestionForm" :rules="addQuestionFormRules" 
    ref="addQuestionFormRef" label-width="100px">
      <el-form-item label="题目" prop="name">
        <el-input v-model="addQuestionForm.name"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categories">
          <el-select v-model="addQuestionForm.categories[0]" 
            placeholder="请选择分类" clearable>
            <el-option
              v-for="item in cate"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="答案" prop="answers">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2}"
          v-model="addQuestionForm.answers">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="!quesId" @click="createQuestion">立即创建</el-button>
        <el-button type="primary" v-else @click="saveQuestion">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data(){
    return{
      quesId:'',
      // 分类id及名称
      cate:[
        {
          value:'603d9f23fc781741efe8a981',
          label:'前端'
        },
        {
          value:'603d9f45fc781741efe8a982',
          label:'后台'
        },
        {
          value:'603e1f95d2f7244421f3df2e',
          label:'算法'
        },
        {
          value:'603e1fb1d2f7244421f3df2f',
          label:'产品'
        }
      ],
      addQuestionForm:{
        answers:'',
        categories:[],
        name:''
      },
      // 验证规则
      addQuestionFormRules:{
        name:[
          {required: true, message: '请输入题目', trigger: 'blur'}
        ],
        categories:[
          {required: true, message: '请选择分类', trigger: ["blur",'change']}
        ],
        answers:[
          {required: true, message: '请输入答案', trigger: 'blur'}
        ]
        
      }
    }
  },
  created(){
    this.quesId=this.$route.query.quesId
    if(this.quesId){
      this.getQuestion()
    }

  },
  methods:{
    // 获取
    async getQuestion(){
      const res=await this.$http.get(`rest/interviews/${this.quesId}`)
      this.addQuestionForm=res.data
      console.log(this.addQuestionForm)
    },
    // 创建
    createQuestion(){
      console.log(this.addQuestionForm)
      this.$refs.addQuestionFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        const res=await this.$http.post('rest/interviews',this.addQuestionForm)
        if(res.status==200){
          this.$message.success("创建成功!")
          this.$router.push('/question/list')
        }
      })
    },
    saveQuestion(){
      this.$refs.addQuestionFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        const res=await this.$http.put(`rest/interviews/${this.quesId}`,this.addQuestionForm)
        if(res.status==200){
          this.$message.success("保存成功!")
          this.$router.push('/question/list')
        }
      })
    },


  },

}
</script>
<style scoped>
  
</style>