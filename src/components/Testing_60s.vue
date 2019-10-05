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
      <button class="btn" @click="toNext(item)">{{ nextButtonText }}</button>
    </div>

    <div class="resultbox" v-if="finishQuestion">
      <div >恭喜完成所有測驗,您的成績如下: </div>
      <div>答題正確率 : {{ a.length - (a.length - answerNum) - wrongs.length }} / {{ a.length}}</div>
      <div v-if="a.length - answerNum > 0">未達題數 : {{ a.length - answerNum }}</div>
      <div v-if="wrongs.length > 0" v-for="(wrong, index) in wrongs" >
        <div class="wrongTitle">
          {{ wrong.countIndex }}. {{ wrong.title }}  
          <span class="urAnswer">你的答案: {{ wrong.urAnswer }}</span>
          <span class="currentAnswer">正確答案: {{ wrong.currentAnswer }}</span>
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

      questions : [
        {
          id: 1,
          title: 'Sort Question',
          description: 'The sorting in the algorithm is the ',
          question: 'With Algorithm, many kinds of sort methods that we usually used, one of the famous sort method called "Quick Sort", the most quickly solution with the time complexity and space complexity, which one is current ?',
          options: [
            'O(nlog2n), O(n2)',
            'O(nlog2n), O(nlog2n)',
            'O(n), O(nlog2n)',
            'O(1), O(nlog2n)'
          ],
          answer: 'O(nlog2n), O(nlog2n)',
        },
        {
          id: 2,
          title: 'Sort Question',
          description: 'The sorting in the algorithm is the ',
          question: 'With Algorithm, many kinds of sort methods that we usually used, one of the famous sort method called "Quick Sort", the most quickly solution with the time complexity and space complexity, which one is current ?',
          options: [
            'O(nlog2n), O(n2)',
            'O(nlog2n), O(nlog2n)',
            'O(n), O(nlog2n)',
            'O(1), O(nlog2n)'
          ],
          answer: 'O(nlog2n), O(nlog2n)',
        },
      ],
      a: [],
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
        this.loading = true;
        // $.ajax({
        // }).then(function(result) {
          setTimeout(() => {
            // this.loading = false;
            if (!isEmpty(this.questions)) { // questions = result
              this.showQuestion = true;
              this.hiddenSetting = false;
              // success to get data
              this.questions.forEach((question, i) => {
                question.count = i;
                question.name = this.createRandomWord(4) + this.createRandomWord(4); // 重複機率 兩千億分之一
              })
              this.a = [...this.questions]; // this.questions = result
              // console.log(this.a)
              // 設定時間
              this.second = Number(this.picked);
              setTimeout(() => {
                this.runSecond();
              }, 1000);
              
            } else {
              this.showFailAlert = true;
              // fail to get data
            }
          }, 1000);
        // })
      }
    },
    toNext: function(question) {
      if (this.count < this.a.length && this.count !== this.a.length - 1) {
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
        if (this.count == this.a.length - 1) this.nextButtonText = '完成';
      } else if (this.count == this.a.length - 1) {
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
        // this.a = []; // reset data // 等結束結果頁面在清空
        // this.count = 0; // reset count
        // this.wrongs = []; // reset wrongs
      }
      this.answerNum++ // 無論答對與否都要++ 
    },
  },
  computed: {
    shuffleOptions() {
      this.a.forEach((item) => {
        this.shuffle(item.options);
      })
      return this.a;
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
  #setting, .questionBox, .resultbox, .clock {
     width: 95%;
    margin: auto;
  }
  .questionBox, .resultbox {
    padding: 5px 10px;
    border: 1px solid black;
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
