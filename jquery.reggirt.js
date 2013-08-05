/*
* jQuery plugin for partial captured events emulation; provides .reggirt(), the reverse of "trigger" :-)
*
* (c) Max Shirshin, max.shirshin@gmail.com
* Licensed under MIT License
*
*/
(function($, undefined) {
    $.fn.reggirt = function(targetElem, e, data) {
        var argLength = arguments.length;

        return this.each(function() {
            var root = this,
                $elem;  // target elements to get the emulated capturing event

            // now we specify $elem and rearrange arguments when necessary
            if (argLength === 1) {
                // simple syntax; event should be triggered on the current collection
                e = targetElem;
                $elem = $(root);

            } else if (argLength === 2
                && typeof e !== 'string'
                && !(e instanceof $.Event)) {

                // the same as above but extra data obj should be passed to handlers
                data = e;
                e = targetElem;
                $elem = $(root);

            } else if (typeof targetElem === 'string') {
                // target is a jQuery selector
                $elem = $(root).find(targetElem).add(root);

            } else {
                // target is a jQuery collection
                // (or an object that can be converted into jQuery collection)
                $elem = $(targetElem).filter(function() {
                    return root === this || $.contains(root, this);
                });
            }

            $elem.each(function() {
                var chain = [this].concat( $(this).parents().get() ),
                    parentFound = false,
                    stopAll = function(e) {
                        e.stopImmediatePropagation();
                    };

                // we iterate over element parents, starting from the topmost one,
                // until we hit our root element (or the chain ends)
                for (var i = chain.length - 1; i >= 0; i--) {
                    if (! parentFound && chain[i] !== root) {
                        continue;
                    } else {
                        parentFound = true;
                    }

                    var $parent = $(chain[i]),
                        // extra event API
                        extra = {
                            stopCapturing: false,
                            capturingOrigin: root,
                            capturingTarget: this
                        },
                        // we always use jQuery Event constructor to extend it with extra fields
                        eventObj = e instanceof $.Event ? $.extend(e, extra) : $.Event(e, extra),
                        triggerArgs = data === undefined ? [eventObj] : [eventObj, data];

                    $parent
                        .on(e, stopAll)
                        .trigger.apply($parent, triggerArgs)  // returns the same collection!
                        .off(e, stopAll);

                    if (eventObj.stopCapturing) break;  // capturing chain stopped externally
                }
            });
        });
    };
})(jQuery);
