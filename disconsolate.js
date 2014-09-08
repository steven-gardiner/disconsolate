var module = module || {};

module.exports = (function() {
  var disconsolate = {};

  disconsolate.defaults = {};
  disconsolate.defaults.levels = [
    "trace",
    "debug",
    "info",
    "timing",
    "warning",
    "severe",
    "fatal"
  ];
  disconsolate.defaults.eventprefix = "log_";

  disconsolate.logger = function(spec) {
    var self = {};

    spec = spec || {};

    self.eventprefix = spec.eventprefix || disconsolate.defaults.eventprefix;
    self.levels = spec.levels || disconsolate.defaults.levels;

    self.minlevel = spec.minlevel;

    self.eventq = spec.eventq || process;
    
    self.eventq.on('disconsolate.config', function(spec) {
      self.minlevel = spec.minlevel;
      self.init();
    });

    self.listeners = {};

    self.logEvent = function(lvl, event) {
      console.error.apply(null, [event.text].concat(event.subs));
    };

    self.init = function() {
      var minIndex = self.levels.indexOf(self.minlevel);
      if (minIndex >= 0) {
        var levels = self.levels.slice(minIndex);
        levels.forEach(function(lvl) {
          if (self.listeners[lvl]) { return; }
          self.listeners[lvl] = function(event) {
            self.logEvent(lvl, event);
          };
          var eventname = [self.eventprefix, lvl].join("");
          self.eventq.on(eventname, self.listeners[lvl]);
          self[lvl] = self.listeners[lvl];
        });
      }
    };

    self.init();

    return self;
  };

  return disconsolate;
}());
