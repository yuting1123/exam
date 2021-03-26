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
// 题库所有题目页面
import Question from '../views/Question.vue'
// 题库真题页面
import TestPaper from '../views/TestPaper.vue'
// 题库面经宝典页面
import Interview from '../views/Interview.vue'
// 进入考试页面
import Examination from '../views/Examination.vue'
// 进入练习题目详情页面
import DeatilQuestion from '../views/DetailQuestion.vue'
// 管理员查看投递情况页面首页
import AdminShowSubmit from '../views/AdminShowSubmit.vue'
// 管理员创建试卷、考试页面
import AdminCreateTest from '../views/AdminCreateTest.vue'
import CreateTestPaper from '../views/admin/CreateTestPaper.vue'
// import EditTestPaper from '../views/admin/EditTestPaper.vue'
import ListTestPaper from '../views/admin/ListTestPaper.vue'
import ListExam from '../views/admin/ListExam.vue'
import CreateExam from '../views/admin/CreateExam.vue'
// 管理员创建题目页面
import CreateQuestion from '../views/admin/CreateQuestion.vue'
import ListQuestion from '../views/admin/ListQuestion.vue'

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
    path:'/testpaper',
    name:'TestPaper',
    component:TestPaper
  },
  {
    path:'/interview',
    name:'Interview',
    component:Interview
  },
  {
    path:'/examination',
    name:'Examination',
    component:Examination
  },
  {
    path:'/detailquestion',
    name:'DeatilQuestion',
    component:DeatilQuestion
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
    component:AdminCreateTest,
    redirect:'/createtest/welcome',
    children:[
      {
        path:'/createtest/welcome',
        name:'WelcomeToTest',
        component:WelcomeToResctuit
      },
      {
        path:'/createtest/create',
        name:'CreateTestPaper',
        component:CreateTestPaper
      },
      {
        path:'/createtest/list',
        name:'ListTestPaper',
        component:ListTestPaper
      },
      {
        path:'/createexam/list',
        name:'ListExam',
        component:ListExam
      },
      {
        path:'/createexam/create',
        name:'CreateExam',
        component:CreateExam
      },
      {
        path:'/question/list',
        name:'ListQuestion',
        component:ListQuestion
      },
      {
        path:'/question/create',
        name:'CreateQuestion',
        component:CreateQuestion
      }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
