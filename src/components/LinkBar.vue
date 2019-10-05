
<template>
  <ul>
    <li>
      <router-link to="/">Home</router-link>
    </li>
    <li>
      <router-link to="/Todolist">Todolist</router-link>
    </li>
    <li>
      <router-link to="/ChatRoom">ChatRoom</router-link>
    </li>
    <li>
      <router-link to="/Testing_60s">Testing_60s</router-link>
    </li>
    <li>
      <router-link to="/Scroller">Scroller</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LinkBar',
  // data () {
  //   return {
  //     title: 'T'
  //   }
  // }
}
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
