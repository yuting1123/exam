import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import '../assets/global.css'
// 完善简介页面
import Resume from '../views/Resume.vue'
// 我的申请页面
import MyApply from '../views/MyApply.vue'
// 新建简历页面
import NewResume from '../views/NewResume.vue'
// 登录页面
import Login from '../views/Login.vue'
// 题库页面
import Question from '../views/Question.vue'
// 管理员查看投递情况页面
import AdminShowSubmit from '../views/AdminShowSubmit.vue'
// 管理员创建试卷、考试页面
import AdminCreateTest from '../views/AdminCreateTest.vue'
// 查看岗位投递人信息的页面
import WelcomeToResctuit from '../views/admin/WelcomeToResctuit.vue'
import ShowSubmit from '../views/admin/ShowSubmit.vue'

//菜单项重复点报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/login',
    name:'Login',
    component:Login
  },
  {
    path:'/resume',
    name:'Resume',
    component:Resume
  },
  {
    path:'/myapply',
    name:'MyApply',
    component:MyApply
  },
  {
    path:'/newresume',
    name:'NewResume',
    component:NewResume
  },
  {
    path:'/question',
    name:'Question',
    component:Question
  },
  {
    path:'/resumesubmit',
    name:'AdminShowSubmit',
    component:AdminShowSubmit,
    redirect:'/resumesubmit/welcome',
    children:[
      {
        path:'/resumesubmit/welcome',
        name:'WelcomeToResctuit',
        component:WelcomeToResctuit
      },
      {
        path:'/resumesubmit/show',
        name:'ShowSubmit',
        component:ShowSubmit
      }
      


    ]
  },
  {
    path:'/createtest',
    name:'AdminCreateTest',
    component:AdminCreateTest
  }
]

const router = new VueRouter({
  routes
})

export default router
