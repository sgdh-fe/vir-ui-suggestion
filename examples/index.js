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