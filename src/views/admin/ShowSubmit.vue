<template>
  <div>
    <el-table
      :data="submitUser"
      style="width: 100%"
      height="250">
      <el-table-column
        fixed
        prop="name"
        label="名字"
        width="150">
      </el-table-column>
      <el-table-column
        
        label="成绩"
        width="120">

      </el-table-column>
      <el-table-column
        
        label="省份"
        width="120">
      </el-table-column>
      <el-table-column
        
        label="市区"
        width="120">
      </el-table-column>
      <el-table-column
        
        label="地址"
        width="300">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <!-- <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small">
            移除
          </el-button>
        </template> -->
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data(){
    return{
      rescruitId:'',
      submitUser:{}

    }
  },
  created(){
    this.rescruitId=this.$route.query._id;
    // console.log("岗位id")
    // console.log(this.rescruitId)
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
      // console.log(res)
      this.submitUser=res.data
      console.log("投递人信息")
      console.log(this.submitUser)
    }
  }
  
}
</script>