<template>
  <div>
    管理员创建试卷
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  created(){
    this.getDepartment();
  },
  methods:{
    // 获取部门分类信息
    async getDepartment(){
      const res=await this.$http.get('departments')
      console.log("huoqubumen")
      console.log(res)
    }

  }
}
</script>
<style scoped>
  
</style>