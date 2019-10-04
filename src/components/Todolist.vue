<template>
  <div id="todoSection" class="hello">
    <h1>{{ title }}</h1>
    <LinkBar />

    <v-app id="inspire" style="background: #ffc78e;">
			<v-container fluid >
				<v-row>
					<v-col cols="12" sm="12">
						<v-sheet elevation="12" class="pa-7">
							<v-text-field
                v-model="inputValue"
                label="新增待辦事項"
                :maxlength="maxlength"
                :clearable="clearable"
                :loading="loading"
                :outlined="outlined"
                :rounded="rounded"
                :hint="hint"
                v-on:keyup="checkInput"
                v-on:keyup.enter="add($event)"
                v-on:blur="inputBlur"
					    ></v-text-field>
					    <v-row>
              <v-col>
                <div class="top">
                  <span v-if='listItems.length > 0'>{{listItems.length}} 筆符合結果</span>
                  <span v-if="listItems.length == 0">無符合結果</span>
                  <div style="display: inline-block; position: absolute; right: 8%; padding-bottom: 20px;">
                    <input class="inputstyle" type="text" :placeholder="searchPlaceholder" v-model="searchBarText" v-on:keyup="searching(items)" v-on:blur="searchBarBlur">
                    <button v-bind:class="{ sortBtn: sortType == 'asc' }" class="btn" v-on:click="sort('asc')">asc</button>
                    <button v-bind:class="{ sortBtn: sortType == 'desc' }" class="btn" v-on:click="sort('desc')">desc</button>
                    <!-- <input type="checkbox" v-model="showDone">
                    <label class="btn btn-noborder" v-bind:class="{ reddd: showDone }">只顯示已完成</label> -->
                  </div>
                </div>
                <div class="bot">
                  <div class="bot-box" v-for="item in listItems" v-bind:key="item.id">
						        <input type="checkbox" v-model="item.completed" v-on:click="cancelCheckbox(item)">
						        <label v-bind:class="{ complete: item.completed}" v-if="!item.ableChangeText || !item.completed" v-on:click="showChangeInput(item)" > {{item.id + 1}}. {{item.text}} ( 新增於{{ item.createTime | transform }} )</label>
						        <input class="inputstyle" type="text" v-if="item.ableChangeText && item.completed" v-model="item.text" v-on:keyup.enter="sendChangeInput(item)">
						        <button class="btn" v-if="item.completed && item.ableChangeText" v-on:click="sendChangeInput(item)">確定修改</button>
										<button class="btn" v-if="item.completed && item.ableChangeText" v-on:click="cancelChangeInput(item)">取消修改</button>
										<button class="btn" v-on:click="remove(item)" v-if="item.completed">刪除</button>
						      </div>
					      </div>
                <div class="filter">
					      <!-- <input type="radio" v-on:click="changeActive(item)" name="filter" :checked="picked == item.text" v-model="picked"> -->
					        <button class="filterItem" v-for="item in newFilterItems" :class="{ 'filterActive' : filter == item.text }" @click="setFilter(item.text)" >{{ item.text }} ( {{ item.count }} )</button>
					      </div>
					    </v-col>
					    </v-row>
					  </v-sheet>
				          <!-- https://segmentfault.com/q/1010000006917530 -->
				          <!-- <input v-on:keyup.enter="$event.target.nextElementSibling.focus()" type="text"> -->
				  </v-col>
				</v-row>
			</v-container>
		</v-app>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetify from 'vuetify';
Vue.use(Vuetify);
import { isEmpty } from 'lodash'
import { intOnly, chineseOnly, engIntOnly, engOnly } from '../common/verification'
import LinkBar from './LinkBar'


var KEY = 'todos-vuejs';
var storage = {
  fetch: function() {
    let todos = JSON.parse(localStorage.getItem(KEY)) || [];
    todos.forEach((todo, index) => {
      todo.id = index;
      todo.ableChangeText = false;
      todo.completed = false;
    });
    return todos;
  },
  save: function(todos) { // for watch listener
    localStorage.setItem(KEY, JSON.stringify(todos));
  }
};

// Vue.use(Vuetify)
Vue.filter('transform', function (value) {
    if (!value) return ''
    var newValue = new Date(value).toJSON().slice(0, 10) + " " + new Date(new Date(value)).toString().split(' ')[4];
    return newValue
});

export default {
  name: 'Todolist',
  vuetify: new Vuetify(),
  components: {
    LinkBar
  },
  data () {
    return {
      title: 'Todolist',
      hint: '請輸入待辦事項',
      maxlength: 20,  // persistentHint=true ( onfocus show hint)
      clearable: true,
      loading: false,
      outlined: false,
      rounded: false,

      searchBarText: '',
      items: storage.fetch(),
      inputValue: '',
      cacheValue: '',
      sortType: 'asc', // 排序預設值
      showDone: false,
      showNoDone: false,
      searchPlaceholder: '請輸入搜尋文字',
      filterItems: [{	text: '全部', active: true, id: 0 }, { text: '未完成', active: false, id: 1 }, {text: '已完成', active: false, id: 2 }],
      filter: '全部',
    }
  },
  methods: {
    checkInput: function() {
      var len = this.inputValue.length;
      if (len && (len < this.maxlength)) {
        this.hint = '還可以輸入' + (this.maxlength - len) + '個字';
      } else if (len == this.maxlength) {
        this.hint = '不可超過二十個字';
      } else {
        this.hint = '請輸入待辦事項';
      }
    },
    inputBlur: function() {
      this.inputValue = '';
      this.hint = '請輸入待辦事項';
    },
    searchBarBlur: function() {
		  this.searchPlaceholder = '請輸入搜尋文字';
	  },
    sortFunc: function (todos) { // 抽出來邏輯不要寫在這 耗效能 每次都會重新渲染 https://ithelp.ithome.com.tw/articles/10187537
		  return _.orderBy(todos, 'createTime', this.sortType);  
		},
  },
  computed: {
    listItems() {
      if (this.searchBarText && this.showDone) { // 有搜尋文字以及只開啟完成list
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 && item.completed; })
        return this.sortFunc(mappingSearchList);
      } else if (this.searchBarText && this.showNoDone){
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 && !item.completed; })
        return this.sortFunc(mappingSearchList);
      } else if(this.searchBarText && !this.showDone && !this.showNoDone) {
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 })
        return this.sortFunc(mappingSearchList);
      } else if (!(this.searchBarText) && this.showDone) {
        var showTodos = this.items.filter((item) => { return item.completed; });
        return this.sortFunc(showTodos); 
      } else if (!(this.searchBarText) && this.showNoDone) {
        var showTodos = this.items.filter((item) => { return !item.completed; });
        return this.sortFunc(showTodos);
      } else {
        return this.sortFunc(this.items); // only desc || asc
      }
    },
    newFilterItems() {
      this.filterItems.forEach((item) => {
        if (item.text == '全部') {
          item.count = this.items.length;
        } else if (item.text == '未完成') {
          var incompleteCount = this.items.filter((item) => {
            return !item.completed;
          });
          item.count = incompleteCount.length;
        } else if (item.text == '已完成') {
          var completeCount = this.items.filter((item) => {
            return item.completed;
          });
          item.count = completeCount.length;
        }
      });
      return this.filterItems;
    },
  },
  watch: {

  },
}
</script>

<style>
  h1, h2 { font-weight: normal; }
  ul { list-style-type: none; padding: 0; }
  li { display: inline-block; margin: 0 10px; }
  a { color: #42b983; }
  .v-application--wrap {
    min-height: 70vh;
  }
  .btn {
    padding: 2px;
    border: 1px solid black;
    border-radius: 4px;
    box-sizing: border-box;
	}
  .sortBtn {
    color: red;
    border: 1px solid red;
  }
  .btn-noborder {
    border: none;
  }
  .reddd {
    color: red;
  }

  #test .inputstyle {
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid black;
  }
  .bot {
    margin-top: 20px;
    height: 170px;
    overflow-x: scroll;
    border: 1px solid #ffc78e;
    padding: 10px;
  }
  .bot-box {
    margin: 10px 0;
  }
  .filter{
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .filterItem {
    display: inline-block;
    padding: 5px 10px;
    margin: 10px;
    border: 1px solid black;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .filter .filterActive {
    color: white;
    background: red;
  }
</style>
