---
title: Vue.js
lang: zh-CN
sidebarDepth: 1
---

## 基础

## 深入
### data
vue组件中data中定义的数组，对象，实际类型是Proxy，都使用了代理。

### 全局变量
```js
const app = createApp(App)
app.config.globalProperties.$foo = 'bar';
```

或使用provide/inject  
父组件中用provide选项提供数据，子组件中用inject选项使用该数据。  
```js
/*
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
*/

const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
        user: 'John Doe'
    }
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- rest of the template -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > Injected property: John Doe
  }
})
```

### router-link
* 当router-link的目标路径可以和当前路径匹配(例如，当前/foo/bar，可以匹配/,/foo,/foo/bar三个目标路径)时，该router-link标签会自动添加类.router-link-active
* 当router-link的目标路径可以和当前路径完全匹配(一模一样)时，该router-link标签会自动添加类.router-link-exact-active
* 可以在router-link标签上加exact属性，这样只有在完全匹配时才会添加类.router-link-active。通常会用于to='/'的router-link
* `<router-link to="/foo/bar"></router-link>` 普通的router-link写法
* `<router-link :to="{name = 'Foo', params = {id : 'bar'}}"></router-link>` 转到已命名的路由的router-link写法
* 另一种动态链接写法
```html
<router-link :to="`/foo/${id}`"></router-link> 
```

### nested router-view
Home组件中有一个router-view，这个router-view对应的组件中还有一个router-view。则内层router-view可以声明如下。
```js
{
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    children: [
      {
        path: ':id', // 匹配/home/:id
        name: 'Main',
        component: () => import('@/views/Main.vue'),
        props: true // 让Home组件中的router-link中的路径参数可以传入Main组件，用Main的props接收。
      },
    ],
  },
```

### named router-view
普通的`<router-view />`默认使用routes中的component指定的组件。如果一个页面要有多个router-view，每个router-view对应不同的组件，则需要为router-view指定name。
```js
<router-view />
<router-view name='a' />
<router-view name='b' />

// 在routes中，要为每个router-view指定好组件。
{
  path: 'xxx',
  name: 'yyy',
  component: {
    default: ComponentDefault,
    a: ComponentA,
    b: ComponentB,
  }
}
```

### route路径参数(动态链接)
```js
const router = new VueRouter({
  routes: [
    // dynamic segments start with a colon
    { path: '/user/:id', component: User, props: true }
  ]
})
```
path中的:id称为dynamic segment。如果path匹配到了，则可以通过$route.params.id访问匹配到的id值。  
如果路由对象的props设为true，则可由component的props属性接收路径参数。

### 如何获取事件的event对象
`@event="onEvent($event)`，`$event`为原生DOM的事件对象。

