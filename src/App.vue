<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'PingFangSC-Regular', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    background: #f8f8fc;
    box-sizing: border-box;
  }
  textarea::-webkit-input-placeholder,input::-webkit-input-placeholder { /*WebKit browsers*/
    color: #C4CACD;
    line-height: normal;
  }
  textarea::-moz-input-placeholder,input::-moz-input-placeholder{ /*Mozilla Firefox*/
    color: #C4CACD;
    line-height: normal;
  }
  textarea::-ms-input-placeholder,input::-ms-input-placeholder{ /*Internet Explorer*/
    color: #C4CACD;
    line-height: normal;
  }
  textarea:-webkit-autofill,input:-webkit-autofill{
    -webkit-box-shadow: 0 0 0 1000px white inset !important
  }
</style>
