const nest = require('depnest')
const { isMsg, isFeed, isBlob } = require('ssb-ref')
exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.page.error': 'first',
  'app.page.home': 'first',
  'app.page.channel': 'first',
  'app.page.settings': 'first',
  'app.page.groupFind': 'first',
  'app.page.groupIndex': 'first',
  'app.page.groupNew': 'first',
  'app.page.groupShow': 'first',
  'app.page.userFind': 'first',
  'app.page.userShow': 'first',
  'app.page.threadNew': 'first',
  'app.page.threadShow': 'first',
  'app.page.image': 'first',
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page
    // route format: [ routeValidator, routeFunction ]
 
    const routes = [
      // Group pages
      [ location => location.page === 'groupFind', pages.groupFind ],
      [ location => location.page === 'groupIndex', pages.groupIndex ],
      [ location => location.page === 'groupNew', pages.groupNew ],
      [ location => location.type === 'groupShow' && isMsg(location.key), pages.groupShow ],

      // Thread pages
      // QUESTION - should this be for private threads + group threads?
      [ location => location.page === 'threadNew' && isFeed(location.feed), pages.threadNew ],
      [ location => location.page === 'threadNew' && location.channel, pages.threadNew ],
      [ location => isMsg(location.key), pages.threadShow ],

      // User pages
      [ location => location.page === 'userFind', pages.userFind ],
      [ location => isFeed(location.feed), pages.userShow ],

      [ location => location.page === 'home', pages.home ],
      [ location => location.page === 'settings', pages.settings ],
      [ location => isBlob(location.blob), pages.image ],
      [ location => location.channel , pages.channel ],

      // Error page
      [ location => true, pages.error ]
    ]

    return [...routes, ...sofar]
  })
}

