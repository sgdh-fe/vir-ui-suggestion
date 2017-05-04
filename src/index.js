import Vir from 'vir'
import $ from 'jquery'

export default function () {

  return Vir({
    data: {
      index: -1,
      keyword: '',
      data: [],
      show: false
    },
    watch: {
      index(result) {
        let {
          old,
          value
        } = result

        let $el = this.$$('li')

        if (old > -1) {
          $el.eq(old).removeClass('cur')
        }
        if (value > -1) {
          $el.eq(value).addClass('cur')
        }
      },
      keyword(result) {
        let {
          value
        } = result
        this.fetch((data) => {
          this.set('data', data)
        })
      },
      data(result) {
        let {
          value
        } = result
        this.render(value)
        // render 后 需要清除之前的 dom 缓存 以及重置状态
        this.$$('li', false)
        this.set({
          show: !!value.length,
          index: -1
        })
      },
      show(result) {
        let $el = this.$$('.sugglist')
        if (result.value) {
          $el.show()
        } else {
          setTimeout(() => {
            $el.hide()
          }, 60)
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
      highlight(event) {
        if (event.type == 'mouseleave') {
          this.set('index', -1)
          return
        }
        let $el = $(event.currentTarget)
        let index = $el.attr('data-index') || $el.index()
        this.set('index', index)
      },
      index(n) {
        let index = this.get('index') + n
        let len = this.get('data').length
        return -1 > index ? len - 1 : index < len ? index : -1
      },
      toggle(event) {
        // click 切换
        let data = this.get('data')
        if (event.type == 'click') {
          let $el = $(event.currentTarget)
          let index = $el.attr('data-index') || $el.index()
          let value = data[index]
          this.set('flag', true)
          this.$$('input').val(value)
          this.submit()
          return
        }
        // 上、下、tab键切换高亮
        let code = event.which
        if (!(code == 38 || code == 40 || code == 9)) {
          return
        }
        event.preventDefault()
        if (data.length == 0) {
          return
        }
        let index = this.index(code == 38 ? -1 : 1)
        let value = data[index]
        if (index == -1) {
          value = this.get('keyword')
        }
        this.set('index', index)
        this.set('flag', true)
        this.$$('input').val(value)
      },
      enter(event) {
        let code = event.which
        if (code == 13) { // 回车提交
          this.submit()
        }
      },
      oninput() {
        // ie 非用户主动输入会触发 propertychange 事件
        // 利用一个标记来判断
        if (this.get('flag')) {
          this.set('flag', false)
          return
        }
        clearTimeout(this.get('timeout')) // throttle
        this.set('timeout', setTimeout(() => {
          this.set('keyword', this.$$('input').val())
        }, 300))
      },
      onblur() {
        this.set('show', false)
      },
      onclick(event) {
        let keyword = this.get('keyword')
        let val = this.$$('input').val()
        let len = this.get('data').length
        if (len && keyword == val) {
          this.set('show', true)
        } else {
          // 重新 fetch
          this.set('keyword', this.$$('input').val())
        }
      },
      fetch(done) {},
      render(data) {},
      submit() {}
    }
  })
}