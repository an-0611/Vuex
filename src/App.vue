<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <h1>{{ msg }}</h1>
    <h2>Essential Links</h2> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  // data () {
  //   return {
  //     msg: 'Welcome to Your Vue.js App'
  //   }
  // }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 35px;
}

h1, h2 {
  font-weight: normal;
  text-align: center;
}

ul {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
