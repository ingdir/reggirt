/*
* jQuery plugin for partial captured events emulation; provides .reggirt(), the reverse of "trigger" :-)
*
* (c) Max Shirshin, max.shirshin@gmail.com
* Licensed under MIT License
*
*/
(function($) {
    $.fn.reggirt = function(triggerTarget, e) {
        var arg = arguments;

        return this.each(function() {
            var root = this,
                $elem = (typeof triggerTarget === 'string') ?
                  $(root).find(triggerTarget).add(root) :
                  $(triggerTarget).filter(function() {
                      return root === this || $.contains(root, this);
                  });

            $elem.each(function() {
                var chain = [this].concat( $(this).parents().get() ),
                    parentNotFound = true,
                    stopAll = function(e) {
                        e.stopImmediatePropagation();
                    };

                for (var i = chain.length - 1; i >= 0; i--) {
                    if (parentNotFound && chain[i] !== root) {
                        continue;
                    } else {
                        parentNotFound = false;
                    }

                    var extra = {
                            stopCapturing: false,
                            capturingOrigin: root,
                            capturingTarget: this
                        },
                        eventObj = e instanceof $.Event ? $.extend(e, extra) : $.Event(e, extra),
                        $parent = $(chain[i]);

                    $parent
                        .on(e, stopAll)
                        .trigger.apply($parent, [eventObj].concat( $.makeArray(arg).slice(2) ))
                        .off(e, stopAll);

                    if (eventObj.stopCapturing) break;
                }
            });
        });
    };
})(jQuery);
