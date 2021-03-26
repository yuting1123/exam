<template>
  <el-table
    :data="examList"
    border
    style="width: 100%">
    <el-table-column type="index" align="center" width="100px">
    </el-table-column>
    <el-table-column
      prop="name"
      label="考试名称"
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
      examList:[],
    }
  },
  created(){
    this.getExam()

  },
  methods:{
    async getExam(){
      const res=await this.$http.get('rest/test_items')
      this.examList=res.data
      console.log(this.examList)
    },
    // 编辑试卷
    editClick(examId){
      this.$router.push({
        path:'/createexam/create',
        query:{examId:examId}
      })
      console.log(examId)
    },
    // 删除试卷
    async deleteClick(examId){
      const confirmDelete=await this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      console.log(confirmDelete)
      if(confirmDelete!=='confirm'){
        return
      }
      const res=await this.$http.delete(`/rest/test_items/${examId}`)
      console.log(res)
      if(res.status==!200){
        return this.$message.error("删除失败")
      }
      this.getExam()
      this.$message.success("删除成功")
    },
  }
}
</script>