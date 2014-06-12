var xtend = require('xtend')

module.exports = ShareDialog

function ShareDialog(url) {
  this._url = url
}

ShareDialog.prototype._config = 
  { toolbar: 0
  , status: 0
  , width: 650
  , height: 306
  , top: function(config)
    { return screen.availHeight/2 - config.height/2 }
  , left: function(config)
    { return screen.availWidth/2  - config.width/2  }  
}

ShareDialog.prototype.params = function(params) {
  if (arguments.length===0) return this._params
  this._params = xtend(this._params, params)
  return this
}

ShareDialog.prototype.config = function(config) {
  if (arguments.length===0) return this._config
  this._config = xtend(this._config, config)
  return this
}

ShareDialog.prototype.get = function() {
  var params = join(this._params, '&', encodeURIComponent)
  return this._url + '?' + params
}

ShareDialog.prototype.open = function() {
  var url = this.get()
  var config =  join(this._config, ',')

  window.open(url, 'sharer', config)
};

ShareDialog.tumblr = {
  link: function(url, name, description) {
    var dialog = new ShareDialog('https://www.tumblr.com/share/link')

    return dialog.params({
      url: url || required,
      name: name || null,
      description: description || null
    })
  },

  photo: function(source, caption, clickthru) {
    var dialog = new ShareDialog('https://www.tumblr.com/share/photo')

    return dialog.params({
      source: source || required,
      caption: caption || null,
      clickthru: clickthru || null
    })
  }
}

ShareDialog.gplus = function(url) {
  var dialog = new ShareDialog('https://plus.google.com/u/0/share')
  return dialog.params({url: url || required})
}

ShareDialog.pinterest = function(url, media, description) {
  var dialog = new ShareDialog('https://pinterest.com/pin/create/button/')

  return dialog.params({
    url: url || required,
    media: media || required,
    description: description || null
  })
}

ShareDialog.twitter = function(url, text, via, in_reply_to, hashtags, related) {
  var dialog = new ShareDialog('https://twitter.com/intent/tweet')

  dialog.params({
    url: url || required,
    via: via || null,
    text: text || null,
    in_reply_to: in_reply_to || null,
    hashtags: hashtags || null, // array -> csv
    related: related || null //array -> csv
  })

  return dialog.config({width: 550, height: 420})
}

ShareDialog.facebook = function(app_id, href, redirect_uri) {
  var dialog = new ShareDialog('https://facebook.com/dialog/share')

  return dialog.params({
    display: 'popup',
    href: href || required,
    app_id: app_id || required,
    redirect_uri: redirect_uri || required
  })
}

function required(object, key) {
  throw new Error('Required: '+key)
}

function join(obj, glue, encode) {
  var result = []

  for(var k in obj) {
    var v = obj[k]

    if (typeof v === 'function')
      v = v(obj, k)
    if (v === null)
      continue
    if (typeof v === 'array' || v instanceof Array)
      v = v.join(',')
    if (typeof v === 'object')
      v = JSON.stringify(v)
    if (encode)
      v = encode(v)

    result.push(k + '=' + v)
  }

  return result.join(glue)
}