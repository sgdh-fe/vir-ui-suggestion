
/*!
 * vir-ui-suggestion v1.0.0
 * (c) 2017 cjg
 * Released under the MIT License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vir'), require('jquery')) :
	typeof define === 'function' && define.amd ? define(['vir', 'jquery'], factory) :
	(global.VirUiSuggestion = factory(global.Vir,global.jQuery));
}(this, (function (Vir,$) { 'use strict';

Vir = 'default' in Vir ? Vir['default'] : Vir;
$ = 'default' in $ ? $['default'] : $;

var index = function () {

  return Vir({
    data: {
      index: -1,
      keyword: '',
      data: [],
      show: false
    },
    watch: {
      index: function index(result) {
        var old = result.old,
            value = result.value;


        var $el = this.$$('li');

        if (old > -1) {
          $el.eq(old).removeClass('cur');
        }
        if (value > -1) {
          $el.eq(value).addClass('cur');
        }
      },
      keyword: function keyword(result) {
        var _this = this;

        var value = result.value;

        this.fetch(function (data) {
          _this.set('data', data);
        });
      },
      data: function data(result) {
        var value = result.value;

        this.render(value);
        // render 后 需要清除之前的 dom 缓存 以及重置状态
        this.$$('li', false);
        this.set({
          show: !!value.length,
          index: -1
        });
      },
      show: function show(result) {
        var $el = this.$$('.sugglist');
        if (result.value) {
          $el.show();
        } else {
          setTimeout(function () {
            $el.hide();
          }, 60);
        }
      }
    },
    events: {
      'input propertychange->input': 'oninput',
      'keydown->input': 'toggle enter',
      'blur->input': 'onblur',
      'click->input': 'onclick', // click 代替 focus
      'mouseenter->.sugglist li': 'highlight',
      'mouseleave->.sugglist': 'highlight',
      'click->.sugglist li': 'toggle'
    },
    methods: {
      highlight: function highlight(event) {
        if (event.type == 'mouseleave') {
          this.set('index', -1);
          return;
        }
        var $el = $(event.currentTarget);
        var index = $el.attr('data-index') || $el.index();
        this.set('index', index);
      },
      index: function index(n) {
        var index = this.get('index') + n;
        var len = this.get('data').length;
        return -1 > index ? len - 1 : index < len ? index : -1;
      },
      toggle: function toggle(event) {
        // click 切换
        var data = this.get('data');
        if (event.type == 'click') {
          var $el = $(event.currentTarget);
          var _index = $el.attr('data-index') || $el.index();
          var _value = data[_index];
          this.set('flag', true);
          this.$$('input').val(_value);
          this.submit();
          return;
        }
        // 上、下、tab键切换高亮
        var code = event.which;
        if (!(code == 38 || code == 40 || code == 9)) {
          return;
        }
        event.preventDefault();
        if (data.length == 0) {
          return;
        }
        var index = this.index(code == 38 ? -1 : 1);
        var value = data[index];
        if (index == -1) {
          value = this.get('keyword');
        }
        this.set('index', index);
        this.set('flag', true);
        this.$$('input').val(value);
      },
      enter: function enter(event) {
        var code = event.which;
        if (code == 13) {
          // 回车提交
          this.submit();
        }
      },
      oninput: function oninput() {
        var _this2 = this;

        // ie 非用户主动输入会触发 propertychange 事件
        // 利用一个标记来判断
        if (this.get('flag')) {
          this.set('flag', false);
          return;
        }
        clearTimeout(this.get('timeout')); // throttle
        this.set('timeout', setTimeout(function () {
          _this2.set('keyword', _this2.$$('input').val());
        }, 300));
      },
      onblur: function onblur() {
        this.set('show', false);
      },
      onclick: function onclick(event) {
        var keyword = this.get('keyword');
        var val = this.$$('input').val();
        var len = this.get('data').length;
        if (len && keyword == val) {
          this.set('show', true);
        } else {
          // 重新 fetch
          this.set('keyword', this.$$('input').val());
        }
      },
      fetch: function fetch(done) {},
      render: function render(data) {},
      submit: function submit() {}
    }
  });
};

return index;

})));
//# sourceMappingURL=index.js.map
