<template>
  <div class="resume-box">
    <div class="personal-info-box">
      基础信息
    </div>
    <div class="teach-info-box">
      教育信息
    </div>
    <div class="project-info-box">
      项目经历
    </div>
    <div class="awards-info-box">
      获奖经历
    </div>
    <div class="self-evalute-box">
      自我评价
    </div>
    <div class="edit-btn">
      <el-button type="primary">修改</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 简历id
      resume_id:'603ee7448a0f9b1098e7971e',
      // 简历信息
      resume:{
        
      }
    }
  },
  created(){
    this.resume_id=this.$route.query._id
    console.log(this.resume_id)
    this.getResume(this.resume_id)
  },
  methods:{
    // 通过简历id获取简历信息
    async getResume(resume_id){
      const res=await this.$http.get(`rest/vitaes/${resume_id}`)
      this.resume=res.data
      console.log(this.resume)
    },

  }
}
</script>
<style scoped>

/* .resume-box{
  width: 70%;
  background-color:white;
  margin: 0 auto;
  border:2px solid #e0dede;
  box-shadow: darkgrey 0px 0px 30px 5px;
} */
</style>