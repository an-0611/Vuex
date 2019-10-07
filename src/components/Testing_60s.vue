<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <LinkBar />
    <div v-if="showFailAlert">
      <h2>無法取得資料,請稍候再試一次</h2>
      <button @click="resetWeb">確認並重整</button>
    </div>
    <div id="setting" v-if="!showFailAlert && second == 0 && !finishQuestion">
        <h2>Setting</h2>
        <input id="five" type="radio" v-model="picked" value="5" :checked="picked == '5'">
        <label for="thirty">5s</label>
        <input id="thirty" type="radio" v-model="picked" value="30" :checked="picked == '30'">
        <label for="thirty">30s</label>
        <input type="radio" v-model="picked" value="60" :checked="picked == '60'">
        <label for="sixty">60s</label>
        <input type="radio" v-model="picked" value="90" :checked="picked == '90'">
        <label for="ninety">90s</label>
        <button class="btn" @click="startTest">Start</button>
        <div v-if="showError && errorMsg">{{ errorMsg }}</div>
    </div>
    
    <!-- loading 3 2 1 component -->
    <div class="clock" v-if="second > 0 && !finishQuestion">{{ second }}</div>
    <div class="questionBox" v-for="item in shuffleOptions" v-if="item.count == count && !finishQuestion">
      <div class="title">{{ item.title }}</div>
      <div class="description">{{ item.description }}</div>
      <div class="question">{{ item.question }}</div>

      <label for="item.name" v-for="(option, index) in item.options">
        <input type="radio" name="item.name" :value="option" v-model="userAnswer">
        {{ index + 1}}. {{ option }}
      </label>

      <div class="alertbox" v-if="noChooseAnswer">請先選擇一個答案</div>
      <div>userAnswer: {{ userAnswer }}</div>
      <button class="btn" @click="toNext(item)" @keyup.enter="toNext(item)">{{ nextButtonText }}</button>
    </div>

    <div class="resultbox" v-if="finishQuestion">
      <div >恭喜完成所有測驗,您的成績如下: </div>
      <div>答題正確率 : {{ questions.length - (questions.length - answerNum) - wrongs.length }} / {{ questions.length}}</div>
      <div v-if="questions.length - answerNum > 0">未達題數 : {{ questions.length - answerNum }}</div>
      <div class="resultboxDiv" v-if="wrongs.length > 0" v-for="(wrong, index) in wrongs" >
        <div class="wrongTitle">
          <p>{{ wrong.countIndex }}. {{ wrong.title }}</p>
          <p class="urAnswer">你的答案: {{ wrong.urAnswer }}</p>
          <p class="currentAnswer">正確答案: {{ wrong.currentAnswer }}</p>
        </div>
      </div>
      <div>是否保存本次測驗資料以利下次查詢?</div>
      <button class="btn">是</button>
      <button class="btn" @click="resetWeb">否</button>
    </div>

  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import LinkBar from './LinkBar'

export default {
  name: 'Testing-60s',
  components: {
    LinkBar
  },
  data () {
    return {
      title: '60s testing',
      picked: '',
      showError: false,
      errorMsg: '',

      loading: false,
      showQuestion: false,
      hiddenSetting: false,
      showFailAlert: false,

      questions: [],
      count: 0, // 顯示第幾題 點一下 count++ 就會秀下一題
      nextButtonText: '下一題',
      finishQuestion: false,
      currentAnswer: '',
      userAnswer: '',
      noChooseAnswer: false,
      wrongs: [],
      second: 0,
      answerNum: 0,
    }
  },
  methods: {
    getData: function() {
      const config = {
        apiKey: "AIzaSyCJqM9Ya50eU16uH5Y-gHDnHqw55WMLJiA",
        authDomain: "an-Vuex-quicktest.firebaseapp.com",
        databaseURL: "https://an-Vuex-quicktest.firebaseio.com",
        messagingSenderId: "6837591005",
        projectId: "an-Vuex-quicktest",
        storageBucket: "",
      };

      var firebase = window.firebase;
      firebase.initializeApp(config);
      return firebase.database().ref("/").once("value").then(function(data) {
        return data.val().questions;
      });
      // var sendPaintToFirebase = function(paintInfo, ID) {
      //   db.ref("/" + ID).set(Object.assign({}, paintInfo)).then(function(res) {
      //       console.log("success save to firebase");
      //   });
      // };
    },
    shuffle: function(arr) {
      arr.sort(() => Math.random() - 0.5);
    },
    createRandomWord: function(num) {
      var char = 'abcdefghijklmnopqrstuvwxyz'
      var str = ''
      for(let i = 0; i < num; i++) {
        str += char[Math.floor(Math.random() * char.length)]
      }
      return str;
    },
    resetWeb: function() {
      // this.picked = '';
      // this.showFailAlert = false;
      window.location.reload();
    },
    runSecond: function() {
      this.second--; 
      if (this.second > 0) setTimeout(this.runSecond, 1000);
      if (this.second == 0) this.finishQuestion = true;
    },
    startTest: function() {
      if (!this.picked) {
        this.showError = true;
        this.errorMsg = '請先選擇測驗秒數'
      } else {
        const _this = this;
        this.loading = true;
        this.getData().then(function(result) {
          setTimeout(() => {
            _this.loading = false;
            if (!isEmpty(result)) {
              _this.showQuestion = true;
              _this.hiddenSetting = false;
              result.forEach((question, i) => {
                question.count = i;
                question.name = _this.createRandomWord(4) + _this.createRandomWord(4); // 重複機率 兩千億分之一
              })
              _this.questions = [...result];
              // 設定時間
              _this.second = Number(_this.picked);
              setTimeout(() => {
                _this.runSecond();
              }, 1000);
            } else { // fail to get data
              this.showFailAlert = true;
            }
          }, 1000);
        })
      }
    },
    toNext: function(question) {
      if (this.count < this.questions.length && this.count !== this.questions.length - 1) {
        if (isEmpty(this.userAnswer)) {
          this.noChooseAnswer = true;
          return;
        } else {
          if (this.userAnswer !== question.answer) {
            this.wrongs.push({
              countIndex: question.count + 1,
              title: question.title,
              currentAnswer: question.answer,
              urAnswer: this.userAnswer,
            });
          }
          this.noChooseAnswer = false;
          this.userAnswer = '';
        }
        this.count++;
        if (this.count == this.questions.length - 1) this.nextButtonText = '完成';
      } else if (this.count == this.questions.length - 1) {
        if (isEmpty(this.userAnswer)) {
          this.noChooseAnswer = true;
          return;
        } else {
          if (this.userAnswer !== question.answer) {
            this.wrongs.push({
              countIndex: question.count + 1,
              title: question.title,
              currentAnswer: question.answer,
              urAnswer: this.userAnswer,
            });
          }
          this.noChooseAnswer = false;
          this.userAnswer = '';
        }
        this.finishQuestion = true;
        // this.questions = []; // reset data // 等結束結果頁面在清空
        // this.count = 0; // reset count
        // this.wrongs = []; // reset wrongs
      }
      this.answerNum++ // 無論答對與否都要++ 
    },
  },
  computed: {
    shuffleOptions() {
      this.questions.forEach((item) => {
        if (item.options.indexOf('All of the above') == -1) this.shuffle(item.options);
      })
      this.shuffle(this.questions);
      this.questions.forEach((question, index, array) => {
        question.count = array.indexOf(question);
      })
      // function shuffleObject(o){ 
      //   for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      //   return o;
      // };
      // shuffleObject(this.questions);
      return this.questions;
    },
  },
  watch: {
    picked: {
      handler: function(item){
        this.showError = false;
        this.errorMsg = '';
      },
      deep: true
    },
  },
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
  p {
    margin: 0
  }
  #setting, .questionBox, .resultbox, .clock {
     width: 95%;
    margin: auto;
  }
  .questionBox, .resultbox, .resultboxDiv {
    padding: 5px 10px;
    border: 1px solid black;
  }
  .resultboxDiv {
    margin: 5px 0;
  }
  .questionBox label {
    display: block;
  }
  .questionBox .alertbox, .currentAnswer {
    color: red;
  }
  .btn {
    padding: 5px 10px;
    border: 1px solid black;
    border-radius: 5px;
  }
</style>
