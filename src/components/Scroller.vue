<template>
  <div class="hello">
    <h1>{{ title }}</h1>
    <LinkBar />
<!-- https://vuejsexamples.com/use-vue-component-that-highlights-menu-items-as-you-scroll-the-page/ -->
    <scrollactive
      class="my-nav"
      v-on:itemchanged="onItemChanged"
      active-class="active"
      :offset="80"
      :duration="800"
      bezier-easing-value=".5,0,.35,1"
    >
      <a href="#home" class="scrollactive-item">Home</a>
      <a href="#about-us" class="scrollactive-item">About Us</a>
      <a href="#portfolio" class="scrollactive-item">Portfolio</a>
      <a href="#contact" class="scrollactive-item">Contact</a>
    </scrollactive>
    <div id="home" class="test">
      <div>home</div>
    </div>
    <div id="about-us" class="test">
      <div>about-use</div>
    </div>
    <div id="portfolio" class="test">
      <div>protfolio</div>
    </div>
    <div id="contact" class="test">
      <div>contact</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueScrollactive from 'vue-scrollactive'
import LinkBar from './LinkBar'

Vue.use(VueScrollactive)
export default {
  name: 'Scroller',
  components: {
    LinkBar
  },
  data () {
    return {
      title: 'Scroller'
    }
  },
  methods: {
    onItemChanged(event, currentItem, lastActiveItem) {
      console.log(event)
    }
  },
  Options: {
    activeClass: {
      type: String,
      default: 'is-active',
    },

    /**
     * Amount of space between top of screen and the section to highlight. (Usually your fixed
     * header's height)
     *
     * @default 20
     * @type {Number}
     */
    offset: {
      type: Number,
      default: 20,
    },

    /**
     * Amount of space between the top of the screen and the section to highlight when clicking a
     * scrollactive item to scroll. It will use the value of the `offset` prop if none is provided
     * here. Usefull when you want to use the `offset` prop to make an item be active as soon as
     * it shows on the screen but still scroll to the top of the section when clicking the item.
     */
    scrollOffset: {
      type: Number,
      default: null,
    },

    /**
     * The selector string of the scroll container element you'd like to use. It defaults to the
     * window object (most common), but you might want to change in case you're using an element
     * as the overflow container.
     *
     * @type {String}
     */
    scrollContainerSelector: {
      type: String,
      default: '',
    },

    /**
     * Enables/disables the scrolling when clicking in a menu item.
     * Disable if you'd like to handle the scrolling by your own.
     *
     * @default true
     * @type {Boolean}
     */
    clickToScroll: {
      type: Boolean,
      default: true,
    },

    /**
     * The duration of the scroll animation when clicking to scroll is activated.
     *
     * @default 600
     * @type {Number}
     */
    duration: {
      type: Number,
      default: 600,
    },

    /**
     * Defines if the plugin should track the section change when clicking an item to scroll to
     * its section. If set to true, it will always keep track and change the active class to the
     * current section while scrolling, if false, the active class will be immediately applied to
     * the clicked menu item, ignoring the passed sections until the scrolling is over.
     *
     * @default false
     * @type {Boolean}
     */
    alwaysTrack: {
      type: Boolean,
      default: false,
    },

    /**
     * Your custom easing value for the click to scroll functionality.
     * It must be a string with 4 values separated by commas in a cubic bezier format.
     *
     * @default '.5,0,.35,1'
     * @type {String}
     */
    bezierEasingValue: {
      type: String,
      default: '.5,0,.35,1',
    },

    /**
     * Decides if the URL should be modified with the section id when clicking a scrollactive
     * item.
     *
     * @default true
     * @type {Boolean}
     */
    modifyUrl: {
      type: Boolean,
      default: true,
    },

    /**
     * If true the active class will only be applied when a section matches exactly one of the
     * scrollactive items, meaning it will be highlighted when scrolling exactly inside the
     * section. If false (default) it will always highlight the last item which was matched
     * in a section, even if it is already outside that section (and not inside another that's
     * being tracked).
     *
     * @default false
     * @type {Boolean}
     */
    exact: {
      type: Boolean,
      default: false,
    },

    /**
     * If true the active class will be applied to the first scrollactive-item before you scroll
     * past it (even if you didn't reach it yet).
     */
    highlightFirstItem: {
      type: Boolean,
      default: false,
    },

    /**
     * Change the scroll active component html tag.
     *
     * @default nav
     * @type {String}
     */
    tag: {
      type: String,
      default: 'nav',
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  .test {
    height: 100vh;
    background: pink;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid black;
    box-sizing: border-box;
  }
  .scrollactive-item {
    color: white;
    text-shadow: 1px 1px black;
  }
  .my-nav {
    position: fixed;
    top: 0;
    left: 0;
  }
  .my-nav .active {
    color: #42b983
  }
</style>
