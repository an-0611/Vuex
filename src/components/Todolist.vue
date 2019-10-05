<template>
  <div id="todoSection" class="hello">
    <h1>{{ title }}</h1>
    <LinkBar />

    <v-app id="inspire" style="background: #ffc78e;">
			<v-container fluid >
				<v-row>
					<v-col cols="12" sm="12">
						<v-sheet elevation="12" class="pa-8">
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
                  <div style="display: inline-block; position: absolute; top: -25px; right: 8px;">
                    <!-- <input class="inputstyle" type="text" :placeholder="searchPlaceholder" v-model="searchBarText" v-on:blur="searchBarBlur"> -->
                    <v-text-field type="text" color="success" :placeholder="searchPlaceholder" v-model="searchBarText" @blur="searchBarBlur" :loading="searchLoading" @keyup="searching"></v-text-field>
                    <button v-bind:class="{ sortBtn: sortType == 'asc' }" class="btn" v-on:click="changeSortType('asc')">asc</button>
                    

                    <div class="switch-button-control" style="vertical-align: middle;">
                      <div class="switch-button" :class="{ enabled: isEnabled }" @click="toggle" :style="{'--color': color}">
                        <div class="button"></div>
                      </div>
                      <div class="switch-button-label">
                        <slot></slot>
                      </div>
                    </div>

                    <button v-bind:class="{ sortBtn: sortType == 'desc' }" class="btn" v-on:click="changeSortType('desc')">desc</button>
                    <!-- <input type="checkbox" v-model="showDone">
                    <label class="btn btn-noborder" v-bind:class="{ reddd: showDone }">只顯示已完成</label> -->
                  </div>
                </div>
                <div class="bot">
                  <div class="bot-box" v-for="item in listItems" v-bind:key="item.id">
						        <input type="checkbox" v-model="item.completed" v-on:click="cancelCheckbox(item)">
						        <label v-bind:class="{ complete: item.completed}" v-if="!item.ableChangeText || !item.completed" v-on:click="showChangeTextInput(item)" > {{item.id + 1}}. {{item.text}} ( 新增於{{ item.createTime | transform }} )</label>
						        <input class="inputstyle" type="text" v-if="item.ableChangeText && item.completed" v-model="item.text" v-on:keyup.enter="changeInputText(item)">
						        <button class="btn" v-if="item.completed && item.ableChangeText" v-on:click="changeInputText(item)">確定修改</button>
										<button class="btn" v-if="item.completed && item.ableChangeText" v-on:click="cancelChangeInputText(item)">取消修改</button>
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
      searchLoading: false,
      isEnabled: false,
      color: '#4D4D4D',
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
    add: function(e) {
      if (!this.inputValue) {
        this.hint = '待辦事項不可為空';
        return;
      }
      var cacheHint = this.hint;
      this.loading = true;
      this.hint = '新增中 請稍候...';
      setTimeout(() => {
        this.loading = false;
        if (!engIntOnly(this.inputValue) && !chineseOnly(this.inputValue)) {
          this.hint = '含有非法字元 請重新輸入';
          return;
        }
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].text === this.inputValue) {
            this.hint = '已有相同待辦事項';
            return;
            break;
          }
        }
        // savetoLocalStorage
        if (this.inputValue && this.inputValue.trim().length) {
          this.items.push({
            id: this.listItems.length,
            text: this.inputValue,
            completed: false,
            ableChangeText: false,
            createTime: new Date().getTime(),
          });
        }
        this.inputValue = '';
        this.hint = cacheHint;
        e.target.blur();
        setTimeout(() => {
            document.querySelector('.bot').scrollTo(0, document.querySelector('.bot').scrollHeight);
        }, 0);
      }, 1800)
    },
    remove: function(todo) {
		  this.items.splice(this.items.indexOf(todo), 1);
    },
    cancelCheckbox: function(todo) {
      if (todo.completed) {
		  	this.items[this.items.indexOf(todo)].ableChangeText = false;
		  	this.items[this.items.indexOf(todo)].completed = false;
		  }
    },
    showChangeTextInput: function(todo) {
      if (!todo.completed) return;
      todo.ableChangeText = true;
      this.cacheValue = todo.text;
    },
    changeInputText: function(todo) {
      todo.ableChangeText = false;
      todo.completed = false;
      this.cacheValue = '';
    },
    cancelChangeInputText: function(todo) {
		  todo.text = this.cacheValue;
		  todo.ableChangeText = false;
		  this.cacheValue = '';
		},
    inputBlur: function() {
      this.inputValue = '';
      this.hint = '請輸入待辦事項';
    },
    searching: function() {
      if (this.searchBarText && !this.searchLoading) {
        this.searchLoading = true;
        // searchBarText
        setTimeout(() => {
          this.searchLoading = false;
        }, 980);
      }
    },
    searchBarBlur: function() {
		  this.searchPlaceholder = '請輸入搜尋文字';
    },
    toggle: function() {
      this.isEnabled = !this.isEnabled;
      this.sortType = this.isEnabled ? 'desc' : 'asc'
    },
    changeSortType: function(type) {
      if (type == 'asc') {
        this.sortType = 'asc';
        this.isEnabled = false;
      } else if (type == 'desc') {
        this.sortType = 'desc';
        this.isEnabled = true;
      }
    },
    sortList: function (todos) { // 抽出來邏輯不要寫在這 耗效能 每次都會重新渲染 https://ithelp.ithome.com.tw/articles/10187537
		  return _.orderBy(todos, 'createTime', this.sortType);  
    },
    setFilter: function(text) {
      this.filter = text;
      this.showDone = text == '已完成' ? true : false;
      this.showNoDone = text == '未完成' ? true : false;
    }
  },
  computed: {
    listItems() {
      if (this.searchBarText && this.showDone) { // 有搜尋文字以及只開啟完成list
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 && item.completed; })
        return this.sortList(mappingSearchList);
      } else if (this.searchBarText && this.showNoDone){
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 && !item.completed; })
        return this.sortList(mappingSearchList);
      } else if(this.searchBarText && !this.showDone && !this.showNoDone) {
        var mappingSearchList = this.items.filter((item) => { return item.text.indexOf(this.searchBarText) > -1 })
        return this.sortList(mappingSearchList);
      } else if (!(this.searchBarText) && this.showDone) {
        var showTodos = this.items.filter((item) => { return item.completed; });
        return this.sortList(showTodos); 
      } else if (!(this.searchBarText) && this.showNoDone) {
        var showTodos = this.items.filter((item) => { return !item.completed; });
        return this.sortList(showTodos);
      } else {
        return this.sortList(this.items); // only desc || asc
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
    items: {
      handler: function(items){
        storage.save(items)
      },
      deep: true
    },
  },
  mounted() {
    // console.log('mounted')
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
  .inputstyle {
    padding: 0 5px;
    border-radius: 4px;
    border: 1px solid black;
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

  .inputstyle {
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
  .v-input{
    display: inline-block;
  }

  .switch-button {
    margin: 10px 0;
  }
  .bottom-message {
    margin-top: 20px;
    font-size: 125%;
  }

  .switch-button-control {
    display: inline-block;
    flex-direction: row;
    align-items: center;
  }
  .switch-button-control .switch-button {
    height: 1.6em;
    width: calc(1.6em * 2);
    border: 2px solid var(--color);
    box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.33);
    border-radius: 1.6em;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
  }
  .switch-button-control .switch-button .button {
    height: calc( 1.6em - (2 * 2px) );
    width: calc( 1.6em - (2 * 2px) );
    border: 2px solid var(--color);
    border-radius: calc( 1.6em - (2 * 2px) );
    background: var(--color);
    transition: all 0.3s ease-in-out;
  }
  .switch-button-control .switch-button.enabled {
    background-color: var(--color);
    box-shadow: none;
  }
  .switch-button-control .switch-button.enabled .button {
    background: white;
    transform: translateX(calc(calc( 1.6em - (2 * 2px) ) + (2 *2px)));
  }
  .switch-button-control .switch-button-label {
    margin-left: 10px;
  }

</style>
