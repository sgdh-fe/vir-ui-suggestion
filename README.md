# vir-ui-suggestion

## 依赖安装

### npm

```sh
npm install Vir
```
### script 标签

```html
<script src="https://unpkg.com/vir"></script>
```

## 安装

### npm

```sh
npm install vir-ui-suggestion
```

### script 标签

```html
<script src="https://unpkg.com/vir-ui-suggestion"></script>
<!-- 全局变量 VirUiSuggestion -->
```

## 基本使用
```html
  <div class="container">
    <input type="text" autocomplete="off">
    <div class="sugglist"></div>
  </div>
```

```js
  var App = VirUiSuggestion()

  new App({
    el: '.container',
    methods: {
      fetch: function (done) {
        $.ajax({
          url: 'https://www.sogou.com/suggnew/ajajjson',
          data: {
            type: 'web',
            key: this.get('keyword')
          },
          dataType: 'jsonp',
          jsonp: 'm'
        }).done(function (data) {
          done(data[1])
        })
      },
      render: function (data) {
        var str = '<ul>'
        for (var i = 0, item; item = data[i++];) {
          str += '<li>' + item + '</li>'
        }
        str += '</ul>'
        this.$$('.sugglist').html(str)
      },
      submit() {
        window.open('https://www.sogou.com/sie?query=' + decodeURIComponent(this.$$('input').val()))
      }
    }
  })
)
```

## 例子

<a href="http://htmlpreview.github.io/?https://github.com/sgdh-fe/vir-ui-suggestion/blob/master/examples/index.html" target="_blank">base</a>