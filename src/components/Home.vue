<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <LinkBar />
  </div>
</template>

<script>
import LinkBar from './LinkBar'
export default {
  name: 'Home',
  components: {
    LinkBar
  },
  data () {
    return {
      title: 'Home'
    }
  }
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
