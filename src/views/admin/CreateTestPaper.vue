<template>
<div class="test-form-box">
  <el-form :model="addTestForm" :rules="addTestFormRules" 
      ref="addTestFormRef" label-width="120px">
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane label="试卷基本信息" name="1" >
      <div class="test-paper-title">
        试卷基本信息
      </div>
      
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="addTestForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categories">
          <el-select v-model="addTestForm.categories[0]" 
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
        <el-form-item label="创建人" prop="author">
          <el-select v-model="addTestForm.author" clearable>
            <el-option
              v-for="item in cresteAuthor"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否公开试卷" prop="public">
          <el-radio-group v-model="addTestForm.public">
            <el-radio label="0">公开</el-radio>
            <el-radio label="1">私密</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="!testId" @click="submitTestPaper">立即创建</el-button>
          <el-button type="primary" v-else @click="saveInfo('next')">保存，下一页</el-button>
          <el-button @click="cancleCreate">重置</el-button>
        </el-form-item>
      
    </el-tab-pane>
    <el-tab-pane label="单选题" name="2" >
      <div class="test-paper-title">
        单选题(请输入题目、选项、并选择正确答案)
      </div>
      <div class="no-question-box" v-if="addTestForm.single_choice.id.length===0">
        未添加单选题
      </div>
      <el-form-item label="单选题分值" v-if="addTestForm.single_choice.id.length">
        <el-input v-model="addTestForm.single_choice.score"></el-input>
      </el-form-item>
      <div v-if="addTestForm.single_choice.id.length">
        <div class="each-question-box" v-for="(item1,index1) in addTestForm.single_choice.id" 
      :key="index1" >
          <el-form-item label="题目">
            <el-input 
            type="textarea"
            :autosize="{ minRows: 1}"
            v-model="item1.name"></el-input>
            <el-radio-group v-model="item1.right" :key="subIndex1"
            v-for="(subItem1,subIndex1) in item1.answers">
              <el-radio :label="subIndex1">
                <el-input v-model="subItem1.name"></el-input>
              </el-radio>
            </el-radio-group>
            <div class="delete-question-btn">
              <el-button type="primary" @click="deleteQuestion('单选',index1)">删除</el-button>
            </div>
          </el-form-item>
        </div>
      </div>

      <el-form-item>
        <div @click="addQuestion('单选')">
          <i class="el-icon-plus add-project-text"></i>
          <span class="add-project-text">继续添加</span>
        </div>
        <div>
          <el-button type="primary" @click="saveInfo('up')">上一页</el-button>
          <el-button type="primary" @click="saveInfo('next')">保存，下一页</el-button>
        </div>
      </el-form-item>
    </el-tab-pane>

    <el-tab-pane label="多选题" name="3">
      <div class="test-paper-title">
        多选题(请输入题目、选项、并选择正确答案)
      </div>
      <div class="no-question-box" v-if="addTestForm.multiple_choice.id.length===0">
        未添加多选题
      </div>
      <el-form-item label="多选题分值" v-if="addTestForm.multiple_choice.id.length">
        <el-input v-model="addTestForm.multiple_choice.score"></el-input>
      </el-form-item>
       <div v-if="addTestForm.multiple_choice.id.length">
        <div class="each-question-box" v-for="(item2,index2) in addTestForm.multiple_choice.id" 
      :key="index2" >
          <el-form-item label="题目">
            <el-input 
            type="textarea"
            :autosize="{ minRows: 1}"
            v-model="item2.name"></el-input>
            <el-checkbox-group v-model="item2.right">
              <el-checkbox 
              :label="subIndex2" :key="subIndex2"
              v-for="(subItem2,subIndex2) in item2.answers">
              <el-input v-model="subItem2.name"></el-input>
            </el-checkbox>
            </el-checkbox-group>
            <div class="delete-question-btn">
              <span class="add-project-text" @click="addChoice(item2.answers)">
                <i class="el-icon-plus add-project-text"></i>
                添加选项</span>
              <el-button type="primary" @click="deleteQuestion('多选',index2)">删除</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <div @click="addQuestion('多选')">
          <span class="add-project-text">
            <i class="el-icon-plus add-project-text"></i>
            继续添加</span>
        </div>
        <div>
          <el-button type="primary" @click="saveInfo('up')">上一页</el-button>
          <el-button type="primary" @click="saveInfo('next')">保存，下一页</el-button>
        </div>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="判断题" name="4">
      <div class="test-paper-title">
        判断题(请输入题目、选项、并选择正确答案)
      </div>
      <div class="no-question-box" v-if="addTestForm.ture_or_false.id.length===0">
        未添加判断题
      </div>
      <el-form-item label="判断题分值" v-if="addTestForm.ture_or_false.id.length">
        <el-input v-model="addTestForm.ture_or_false.score"></el-input>
      </el-form-item>
      <div v-if="addTestForm.ture_or_false.id.length">
        <div class="each-question-box" v-for="(item3,index3) in addTestForm.ture_or_false.id" 
      :key="index3" >
          <el-form-item label="题目">
            <el-input 
            type="textarea"
            :autosize="{ minRows: 1}"
            v-model="item3.name"></el-input>
            <el-radio-group v-model="item3.right" :key="subIndex3"
            v-for="(subItem3,subIndex3) in item3.answers">
              <el-radio :label="subIndex3">
                <el-input v-model="subItem3.name"></el-input>
              </el-radio>
            </el-radio-group>
            <div class="delete-question-btn">
              <el-button type="primary" @click="deleteQuestion('判断',index3)">删除</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <div @click="addQuestion('判断')">
          <span class="add-project-text">
            <i class="el-icon-plus add-project-text"></i>
            继续添加</span>
        </div>
        <div>
          <el-button type="primary" @click="saveInfo('up')">上一页</el-button>
          <el-button type="primary" @click="saveInfo('next')">保存，下一页</el-button>
        </div>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="主观题" name="5">
      <div class="test-paper-title">
        主观题(请输入题目及标准答案)
      </div>
      <div class="no-question-box" v-if="addTestForm.subjective.id.length===0">
        未添加主观题
      </div>
      <el-form-item label="主观题分值" v-if="addTestForm.subjective.id.length">
        <el-input v-model="addTestForm.subjective.score"></el-input>
      </el-form-item>
      <div v-if="addTestForm.subjective.id.length">
        <div class="each-question-box" v-for="(item4,index4) in addTestForm.subjective.id" 
      :key="index4" >
          <el-form-item label="题目">
            <el-input 
            type="textarea"
            :autosize="{ minRows: 1}"
            v-model="item4.name"></el-input>
            <el-input 
            type="textarea"
            :autosize="{ minRows: 3}"
            v-model="item4.right" class="subjective-textarea"></el-input>
            <div class="delete-question-btn">
              <el-button type="primary" @click="deleteQuestion('主观',index4)">删除</el-button>
            </div>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <div style="padding:7px 0;" @click="addQuestion('主观')">
          <span class="add-project-text">
            <i class="el-icon-plus"></i>
          继续添加</span>
        </div>
        <div>
          <el-button type="primary" @click="saveInfo('up')">上一页</el-button>
          <el-button type="primary" @click="saveInfo('next')">保存</el-button>
        </div>
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
</el-form>
  
  
</div>
</template>
<script>
export default {
  data(){
    return{
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
      // 题型分类名及id
      questionCate:[
        
      ],
      testId:"604b73af3023545fd9ce8fe5",
      // testId:'60438f983100f0798a5d6e27',
      // 当前活跃的页签
      activeName:'1',
      // 创建人
      cresteAuthor:[],
      addTestForm:{
        name:'',
        author:'',
        public:'',
        categories:[''],
        multiple_choice:{
          id:[],
          score:'5'
        },
        single_choice:{
          id:[],
          score:''
        },
        subjective:{
          id:[],
          score:''
        },
        ture_or_false:{
          id:[],
          score:''
        }
      },
      // 表单验证规则
      addTestFormRules:{
        name:[
          {required: true, message: '请输入考试名称', trigger: 'blur'}
        ],
        categories:[
          {required: true, message: '请选择分类', trigger: ["blur",'change']}
        ],
        author:[
          {required: true, message: '请选择创建人', trigger: ["blur",'change']}
        ],
        public:[
          {required: true, message: '请选择是否公开试卷', trigger: ["blur",'change']}
        ],
      }
    }
  },
  created(){
    this.cresteAuthor.push({
      value:sessionStorage.getItem('user_id'),
      label:sessionStorage.getItem('username')
      
    })
    this.testId=this.$route.query.testId
    if(this.testId){
      this.getTestPaper()
    }
  },
  methods:{
    // 判断是否有有试卷id,有则编辑试卷，根据试卷id获取试卷信息
    async getTestPaper(){
      const res=await this.$http.get(`rest/tests/${this.testId}`)
      console.log("编辑试卷，试卷信息")
      console.log(res)
      this.addTestForm=res.data
      if(this.addTestForm.multiple_choice.id.length){
        this.addTestForm.multiple_choice.id.forEach(value=>{
          value.right=value.right.split(',')
        })
      }
      console.log(this.addTestForm)
    },
    // 立即创建按钮
    submitTestPaper(){
      this.$refs.addTestFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        console.log(this.addTestForm)
        const res=await this.$http.post('rest/tests',this.addTestForm)
        if(res.status===200){
          console.log(res)
          this.testId=res.data._id
          this.addTestForm=res.data
          return this.$message.success("创建成功！")
        } 
      })
    },
    // 重置按钮
    cancleCreate(){
      this.$refs.addTestFormRef.resetFields()
    },
    // 保存并跳下一页
    async saveInfo(str){
      // 如果当前页是1，跳编辑put考试接口
      if(this.activeName==='1'){
        console.log(this.addTestForm)
        const res=await this.$http.put(`rest/tests/${this.addTestForm._id}`,this.addTestForm)
        console.log(res.data)
        this.addTestForm=res.data
        this.activeName=(parseInt(this.activeName)+1).toString()
        console.log(this.activeName)
        return
      }
      // 如果当前页是5（最后一页），先保存主观题（put题目）
      // 然后调编辑put考试接口
      if(this.activeName==='5'){
        this.addTestForm.subjective.id.forEach(value=>{
          if(!value.categories.length){
            value.categories.push('603e1f85d2f7244421f3df2d')
          }
        })
        console.log(this.addTestForm.subjective.id)
        const subRes=await this.$http.put('questions/test',this.addTestForm.subjective.id)
        this.addTestForm.subjective.id=subRes.data
        // 提交试卷
        const res=await this.$http.put(`rest/tests/${this.addTestForm._id}`,this.addTestForm)
        if(res.status===200){
          this.$message.success("保存成功")
          console.log(res)
        }

      }
      
      if(this.activeName==='2'){
        console.log('22222222222222222222')
        this.addTestForm.single_choice.id.forEach(value=>{
          if(!value.categories.length){
            value.categories.push('603101a15366ebf854108253')
          }
        })
        console.log(this.addTestForm.single_choice)
        const singleRes=await this.$http.put('questions/test',this.addTestForm.single_choice.id)
        this.addTestForm.single_choice.id=singleRes.data
        if(str==='up'){
          this.activeName=(parseInt(this.activeName)-1).toString()
        }
        else{
          this.activeName=(parseInt(this.activeName)+1).toString()
        }
        return
      }
      if(this.activeName==='3'){
        this.addTestForm.multiple_choice.id.forEach(value=>{
          if(!value.categories.length){
            value.categories.push('603e1f14d2f7244421f3df2b')
          }
        })
        console.log(this.addTestForm.multiple_choice)
        // const multiRes=await
        this.addTestForm.multiple_choice.id.forEach(value=>{
          var right=value.right.join(',')
          value.right=right
        })
        const multiRes=await this.$http.put('questions/test',this.addTestForm.multiple_choice.id)
        this.addTestForm.multiple_choice.id=multiRes.data
        if(str==='up'){
          this.activeName=(parseInt(this.activeName)-1).toString()
        }
        else{
          this.activeName=(parseInt(this.activeName)+1).toString()
        }
        return
      }
      if(this.activeName==='4'){
        this.addTestForm.ture_or_false.id.forEach(value=>{
          if(!value.categories.length){
            value.categories.push('603e1f31d2f7244421f3df2c')
          }
        })
        console.log(this.addTestForm.ture_or_false)
        const tfRes=await this.$http.put('questions/test',this.addTestForm.ture_or_false.id)
        this.addTestForm.ture_or_false.id=tfRes.data
        if(str==='up'){
          this.activeName=(parseInt(this.activeName)-1).toString()
        }
        else{
          this.activeName=(parseInt(this.activeName)+1).toString()
        }
        return
      }
      
    },
    // 删除题目
    deleteQuestion(questionType,index){
      console.log(questionType,index)
      if(questionType==='单选'){
        this.addTestForm.single_choice.id.splice(index,1)
      }
      if(questionType==='多选'){
        this.addTestForm.multiple_choice.id.splice(index,1)
      }
      if(questionType==='判断'){
        this.addTestForm.ture_or_false.id.splice(index,1)
      }
      if(questionType==='主观'){
        this.addTestForm.subjective.id.splice(index,1)
      }
    },
    // 多选题添加选项
    addChoice(choice){
      choice.push({
        _id:'',
        name:''
      })
    },
    // 添加题目
    addQuestion(str){
      if(str==='单选'){
        this.addTestForm.single_choice.id.push({
          answers:[
            {name:''},
            {name:''},
            {name:''},
            {name:''}
          ],
          categories:[],
          name:'',
          right:'',
        })
      }
      if(str==='多选'){
        this.addTestForm.multiple_choice.id.push({
          answers:[
            {name:''},
            {name:''},
            {name:''},
            {name:''}
          ],
          categories:[],
          name:'',
          right:[],
        })
      }
      if(str==='判断'){
        this.addTestForm.ture_or_false.id.push({
          answers:[
            {name:''},
            {name:''},
          ],
          categories:[],
          name:'',
          right:'',
        })
      }
      if(str==='主观'){
        this.addTestForm.subjective.id.push({
          categories:[],
          name:'',
          right:'',
        })
      }
    }

  }
}
</script>

<style scoped>
.test-form-box{
  width: 95%;
  margin: 0 auto;
}
.test-paper-title{
  padding: 10px 0 15px 120px;
  font-weight: bold;
  font-size: 18px;
  color: #597bda;
}
.no-question-box{
  padding:10px 0 10px 120px;
  border-bottom: 2px solid #ececec;
}
/* 每个问题div样式 */
.each-question-box{
  border-bottom: 2px solid #ececec;
  padding-top: 15px;
}
.test-form-box >>> .el-tabs__item{
  padding: 0 72px!important;
}
.test-form-box >>> .el-input__inner,
.test-form-box >>> .el-textarea__inner{
  width: 600px;
  padding: 10px 0;
  padding-left: 10px;
}
.test-form-box >>> .el-tabs__content{
  width: 80%;
  /* background-color: red; */
  margin: 0 auto;
}
.test-form-box >>> .el-checkbox,
.test-form-box >>> .el-radio{
  margin: 10px 0;
}
.test-form-box >>> .el-radio-group .el-input__inner,
.test-form-box >>> .el-checkbox-group .el-input__inner{
  width: 575px;
}
.subjective-textarea >>> .el-textarea__inner{
  margin: 10px 0;
}
.delete-question-btn{
  display: flex;
  justify-content: center;
  margin-left: -200px;
}
.delete-question-btn >>>.el-button{
  margin-left: 15px;
}
.add-project-text:hover{
  cursor: pointer;
}
.add-project-text{
  padding: 20px 0;
  color: #597bda;
}
</style>