var epochTicks = 621355968000000000;
        var ticksPerMillisecond = 10000; // whoa!
        var maxDateMilliseconds = 8640000000000000; // via http://ecma-international.org/ecma-262/5.1/#sec-15.9.1.1
        var congratulationsTimer;

        var ticksToDateString = function (ticks) {
            if (isNaN(ticks)) {
                //      0001-01-01T00:00:00.000Z
                return "NANA-NA-NATNA:NA:BA.TMAN";
            }

            // convert the ticks into something javascript understands
            var ticksSinceEpoch = ticks - epochTicks + 324000000000;
            var millisecondsSinceEpoch = ticksSinceEpoch / ticksPerMillisecond;

            if (millisecondsSinceEpoch > maxDateMilliseconds) {
                //      +035210-09-17T07:18:31.111Z
                return "+WHOAWH-OA-ISTOO:FA:RA.WAYZ";
            }

            // output the result in something the human understands
            var date = new Date(millisecondsSinceEpoch);
            return date.toISOString();
        };

        // the event handler that runs on page load and when the input changes
        var doWork = function () {
            var dateTimeOutput = document.getElementById("datetime");
            var congratulations = document.getElementById("congratulations");

            var ticks = parseInt(this.value || 0, 10);
            var dateString = ticksToDateString(ticks);

            // split the output at the "T" so we can treat that
            // character specially
            var firstTIndex = dateString.indexOf("T");
            var datePart = dateString.slice(0, firstTIndex);
            var timePart = dateString.slice(firstTIndex + 1);

            var goodParts = /([A-Z0-9]+)/g;
            var wrapParts = "<b>$1</b>";

            // wrap everything but the separators in <b> tags and pad the "T" separator with spaces 
            // and prepend it with a zero-width space so the line will break there on small screens
            var output = datePart.replace(goodParts, wrapParts)
                + "<span class='pad'>&#8203;T</span>"
                + timePart.replace(goodParts, wrapParts);

            dateTimeOutput.innerHTML = output;

            var ticksLength = this.value.length;
            if (ticksLength != this.size) {
                this.size = Math.max(17, Math.min(ticksLength, 30));
            }

            // hat tip: newguid.com
            if (congratulationsTimer) {
                clearTimeout(congratulationsTimer);
            }
            if (ticks != 0) {
                congratulationsTimer = setTimeout(function () { congratulations.className = "show"; }, 1000);
            }
        };

        // bind to the first supported event (listed in order of preference)
        var possibleEvents = ["oninput", "onpropertychange", "onkeyup", "onchange"];

        window.onload = function () {
            var ticksInput = document.getElementById("ticks");
            doWork.call(ticksInput);

            // for/each is deprecated, but alternatives like array.foreach isn't _widely_ supported yet :/
            for (var i = 0; i < possibleEvents.length; ++i) {
                var eventName = possibleEvents[i];
                if (eventName in ticksInput) {
                    ticksInput[eventName] = doWork;
                    break;
                }
            }

            // hack for IE, which doesn't fire the preferred events on backspace/delete
            if (navigator.appName == 'Microsoft Internet Explorer') {
                ticksInput.onkeyup = function (e) {
                    if (e.keyCode == 8 || e.keyCode == 46) {
                        doWork.call(this);
                    }
                };
            }
        };