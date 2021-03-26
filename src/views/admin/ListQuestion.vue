<template>
  <el-table
    :data="questionList"
    border
    style="width: 100%">
    <el-table-column type="index" align="center" width="100px">
    </el-table-column>
    <el-table-column
      prop="name"
      label="题目名称"
    >
    </el-table-column>
    
    <el-table-column
      label="操作"
      width="180"
      >
      <template slot-scope="scope">
        <el-button @click="editClick(scope.row._id)" type="text" size="small">编辑</el-button>
        <el-button @click="deleteClick(scope.row._id)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data(){
    return{
      questionList:[],
    }
  },
  created(){
    this.getQuestion()

  },
  methods:{
    async getQuestion(){
      const res=await this.$http.get('rest/interviews')
      this.questionList=res.data
      console.log(this.questionList)
    },
    // 编辑试卷
    editClick(quesId){
      this.$router.push({
        path:'/question/create',
        query:{quesId:quesId}
      })
      console.log(quesId)
    },
    // 删除试卷
    async deleteClick(quesId){
      const confirmDelete=await this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      console.log(confirmDelete)
      if(confirmDelete!=='confirm'){
        return
      }
      const res=await this.$http.delete(`rest/interviews/${quesId}`)
      console.log(res)
      if(res.status==!200){
        return this.$message.error("删除失败")
      }
      this.getQuestion()
      this.$message.success("删除成功")
    },
  }
}
</script>