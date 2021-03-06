module.exports = loadUid

var getUid = require('uid-number')

// Call in the context of a npmconf object

function loadUid (cb) {
  // if we're not in unsafe-perm mode, then figure out who
  // to run stuff as.  Do this first, to support `npm update npm -g`
  if (!this.get('unsafe-perm')) {
    var global = this.get("global");
    getUid(this.get("user"), this.get("group"), function(er) {

      if (!er)
        return cb()

      if (process.platform === 'android' && global && process.getuid() === 0) {
        // jxcore error support for case when root executes `jx install -g module_name`
        var cc = typeof jxcore === "undefined" ? console : jxcore.utils.console;
        cc.error('Global installation of modules on Android requires --unsafe-perm option.');
        process.exit(1);
      }

      cb(er)
    })
  } else {
    process.nextTick(cb)
  }
}
