const nest = require('depnest')
const { onceTrue } = require('mutant')
const path = require('path')
const fs = require('fs')
const os = require('os')
const config = require('../../config').create().config.sync.load()
const peersFile = path.join(config.path, "gossip.json")
const secretFile = path.join(config.path, "secret")


exports.gives = nest('backup.async.exportIdentity')


exports.needs = nest({
  'keys.sync.id': 'first',
  'sbot.obs.connection': 'first'
})

exports.create = function (api) {
  return nest('backup.async.exportIdentity', (password, filename, cb) => {
    if ("undefined" == typeof filename) {
      cb()
    } else {

      console.log(`should export identity to file ${filename}`)

      let peers = JSON.parse(fs.readFileSync(peersFile))
      let secret = fs.readFileSync(secretFile, "utf8")

      onceTrue(api.sbot.obs.connection, sbot => {

        let feedId = api.keys.sync.id()

        sbot.latestSequence(feedId, (err, sequence) => {

          if (err) throw err

          let data = {
            exportDate: new Date(),
            latestSequence: sequence,
            peers: peers,
            secret: secret
          }

          fs.writeFileSync(filename, JSON.stringify(data), "utf8")

          cb()
        })
      })
    }
    return true
  })
}
