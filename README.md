# an-vue

> Vuex's application

## Build Setup



``` bash
# install dependencies
npm install
// npm install (dep dev都會載入)
// npm install -production || npm install --save (only dep)
// npm install --save-dev (only dev)
// --save 當開發完後依舊需要此套件 會在發布後繼續使用
// 放在此處的套件不用在放在dev 系統會自動套用
// 當執行 npm install –production 或是註明 NODE_ENV 變量值为為 production 時，只會下載 dependencies 中的套件。
// https://chriskang028.wordpress.com/2017/07/05/%E5%BC%84%E6%87%82-npm-install-%E7%9A%84-dependencies-v-s-devdependencies/
// --save-dev // 使用在開發中的環境下

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
