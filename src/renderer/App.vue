<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electronapp'
  }
</script>

<style>
  /* CSS */
  html {
    background: radial-gradient(ellipse at top, #89fffb 0%,#04a7f8 100%);
    min-height: 100vh;
  }
</style>
