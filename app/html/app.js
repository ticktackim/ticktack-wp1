const nest = require('depnest')
const values = require('lodash/values')
const insertCss = require('insert-css')

exports.gives = nest('app.html.app')

exports.needs = nest({
  'history.sync.push': 'first',
  'history.obs.location': 'first',
  'history.obs.store': 'first',
  'router.sync.router': 'first',
  'styles.css': 'first'
})

exports.create = (api) => {
  return nest('app.html.app', app)

  function app () {
    const css = values(api.styles.css()).join('\n')
    insertCss(css)

    api.history.obs.location()(render)
    api.history.sync.push({ page: 'home' })
  }

  function render (location) {
    const newView = api.router.sync.router(location)

    if (!newView) {
      api.history.obs.store().pop() // remove bogus location
      return
    }

    const oldView = document.body.firstChild
    oldView
      ? document.body.replaceChild(newView, oldView)
      : document.body.appendChild(newView)
  }
}




