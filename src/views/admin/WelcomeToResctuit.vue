<template>
  <div class="welcome">
    Welcome!
  </div>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  created(){
    sessionStorage.setItem('activeRecruitId','')
  },
  watch:{
    '$route'(e){
      console.log(e)
    }
  }

}
</script>
<style scoped>
.welcome{
  font-weight:bold;
  padding-left: 20px;
}
</style>