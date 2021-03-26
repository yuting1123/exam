<template>
  <el-table
    :data="testList"
    border
    style="width: 100%">
    <el-table-column type="index" align="center" width="100px">
    </el-table-column>
    <el-table-column
      prop="name"
      label="试卷名称"
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
      testList:[],

    }
  },
  created(){
    this.getTestPaper()

  },
  methods:{
    // 获取所有试卷信息
    async getTestPaper(){
      // console.log("11111")
      const res= await this.$http.get('/rest/tests')
      this.testList=res.data
      console.log("所有试卷信息")
      console.log(this.testList)
      console.log(res)
    },
    // 点击编辑按钮
    editClick(paperId){
      this.$router.push({
        path:'/createtest/create',
        query:{testId:paperId}
      })
      console.log(paperId)
    },
    // 点击删除按钮
    async deleteClick(paperId){
      const confirmDelete=await this.$confirm('此操作将永久删除该试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      console.log(confirmDelete)
      if(confirmDelete!=='confirm'){
        return
      }
      const res=await this.$http.delete(`/rest/tests/${paperId}`)
      console.log(res)
      if(res.status==!200){
        return this.$message.error("删除失败")
      }
      this.getTestPaper()
      this.$message.success("删除成功")
    }
  }
}
</script>