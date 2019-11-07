// module.exports = {
//   baseUrl: './'
// }

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Vuex/'
    : '/'
}


// // 發佈的程式如果要在瀏覽器使用本地端 file:// 的方式訪問，必須將資源 (CSS 的 <link> 和 JavaScript 的 <script>) 預設的絕對路徑 / 改為相對路徑 ./ 的方式：
// // https://footmark.info/programming-language/vuejs/vue-cli3-seting/

// module.exports = {
//   devServer: {
//       public: '172.18.212.35:8888'
//   },
//   baseUrl: './'
// }