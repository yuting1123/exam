import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import less from 'less'

// 引入管理员页面显示投递人员组件
import showSubmit from './components/showsubmit'
Vue.use(showSubmit)
Vue.use(less)




Vue.config.productionTip = false
// window.sessionStorage.setItem('token','');
// window.sessionStorage.setItem('username','')

// 时间过滤器
Vue.filter('dateFormat',function(originVal){
  const dt= new Date(originVal);
  const y=dt.getFullYear();
  // 月份不足两位时用0补充——先转成字符串
  // 用padstart判断不足两位则用0在前面填充
  const m=(dt.getMonth()+1+'').padStart(2,'0');
  const d=(dt.getDate()+'').padStart(2,'0');

  const hh=(dt.getHours()+'').padStart(2,'0');
  const mm=(dt.getMinutes()+'').padStart(2,'0');
  const ss=(dt.getSeconds()+'').padStart(2,'0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

Vue.prototype.$http=axios
axios.defaults.baseURL=('http://shuwa.alinyuan.com/admin/api/')

// 响应处理前的拦截器
axios.interceptors.response.use(res=>{
  return res;
},err=>{
  if(err.response.data.message){
      Vue.prototype.$message({
          type:'error',
          message:err.response.data.message
      })
      if(err.response.status ===401){
          router.push('/login')
      }
  }
  return Promise.reject(err);
})
// 请求前的拦截器
axios.interceptors.request.use(config=>{
  // console.log(111);
  // console.log(config);
  // console.log(111);
  if(sessionStorage.token){
    config.headers.Authorization = 'Bearer ' + sessionStorage.token
  }
  return config
},error=>{
  return Promise.reject(error);
}
)

Vue.mixin({
  computed: {
    uploadUrl(){
      return this.$http.defaults.baseURL + 'upload'
    }
  },
  methods: {
    getAuthHeaders(){
      return {
        Authorization: `Bearer ${ sessionStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
