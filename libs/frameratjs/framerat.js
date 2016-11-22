/** MIT License
* 
* Copyright (c) 2011 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://framerat.lcluber.com
*/
var FRAMERAT = {
    revision: "0.2.1",
    id: null,
    onAnimate: function() {},
    frameNumber: 0,
    fsm: {},
    clock: {},
    frameId: 0,
    create: function(onAnimate) {
        var _this = Object.create(this);
        _this.onAnimate = onAnimate;
        _this.createFSM();
        _this.clock = FRAMERAT.Clock.create();
        return _this;
    },
    createFSM: function() {
        this.fsm = TAIPAN.create([ {
            name: "play",
            from: "paused",
            to: "running"
        }, {
            name: "pause",
            from: "running",
            to: "paused"
        } ]);
    },
    play: function(scope) {
        if (this.fsm.play()) {
            this.clock.start();
            this.requestNewFrame(scope);
        }
        return this.fsm.getStatus();
    },
    pause: function() {
        if (this.fsm.pause()) this.cancelAnimation();
        return this.fsm.getStatus();
    },
    stop: function() {
        this.pause();
        this.clock.init();
        this.frameNumber = 0;
    },
    getTotalTime: function(decimals) {
        return this.clock.getTotal(decimals);
    },
    getFrameNumber: function() {
        return this.frameNumber;
    },
    getRoundedDelta: function(refreshRate, decimals) {
        this.computeRoundedDelta(refreshRate, decimals);
        return this.clock.getRoundedDelta();
    },
    computeRoundedDelta: function(refreshRate, decimals) {
        if (this.frameNumber % refreshRate === 0) this.clock.computeRoundedDelta(decimals);
    },
    getDelta: function() {
        return this.clock.getDelta();
    },
    getFramePerSecond: function(refreshRate, decimals) {
        if (this.frameNumber % refreshRate === 0) this.clock.computeFramePerSecond(decimals);
        return this.clock.getFramePerSecond();
    },
    newFrame: function(scope) {
        this.requestNewFrame(scope);
        this.clock.tick();
    },
    requestNewFrame: function(scope) {
        if (!scope) this.frameId = window.requestAnimationFrame(this.onAnimate); else this.frameId = window.requestAnimationFrame(this.onAnimate.bind(scope));
        this.frameNumber++;
    },
    cancelAnimation: function() {
        window.cancelAnimationFrame(this.frameId);
    }
};

FRAMERAT.Time = {
    millisecond: 0,
    second: 0,
    create: function(millisecond) {
        var _this = Object.create(this);
        _this.set(millisecond, 0);
        return _this;
    },
    set: function(x, min) {
        this.millisecond = Math.max(x, min);
        this.second = this.millisecondToSecond(this.millisecond);
    },
    getSecond: function() {
        return this.second;
    },
    getMillisecond: function() {
        return this.millisecond;
    },
    millisecondToSecond: function(millisecond) {
        return millisecond * .001;
    }
};

FRAMERAT.Clock = {
    revision: "0.1.0",
    minimumTick: 16,
    old: performance.now(),
    "new": performance.now(),
    total: 0,
    fps: 0,
    delta: FRAMERAT.Time.create(0),
    roundedDelta: FRAMERAT.Time.create(0),
    create: function() {
        var _this = Object.create(this);
        _this.init();
        return _this;
    },
    init: function() {
        this.total = 0;
        this.fps = 0;
        this.delta.set(0, this.minimumTick);
    },
    start: function() {
        this.old = performance.now();
    },
    tick: function() {
        this.new = performance.now();
        this.delta.set(this.new - this.old, this.minimumTick);
        this.old = this.new;
        this.total += this.delta.second;
    },
    getTotal: function(decimals) {
        return this.round(this.total, decimals);
    },
    computeRoundedDelta: function(decimals) {
        this.roundedDelta.second = this.delta.second ? this.round(this.delta.second, decimals) : 0;
        this.roundedDelta.millisecond = this.delta.millisecond ? this.round(this.delta.millisecond, decimals) : 0;
    },
    getRoundedDelta: function() {
        return this.roundedDelta;
    },
    getDelta: function() {
        return this.delta;
    },
    computeFramePerSecond: function(decimals) {
        this.fps = this.round(1e3 / this.delta.millisecond, decimals);
    },
    getFramePerSecond: function() {
        return this.fps;
    },
    round: function(x, decimals) {
        decimals = Math.pow(10, decimals);
        return Math.round(x * decimals) / decimals;
    }
};

(function() {
    if ("performance" in window === false) {
        window.performance = {};
    }
    Date.now = Date.now || function() {
        return new Date().getTime();
    };
    if ("now" in window.performance === false) {
        var nowOffset = Date.now();
        if (performance.timing && performance.timing.navigationStart) {
            nowOffset = performance.timing.navigationStart;
        }
        window.performance.now = function now() {
            return Date.now() - nowOffset;
        };
    }
})();

(function() {
    var lastTime = 0;
    var vendors = [ "ms", "moz", "webkit", "o" ];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
})();
/** Copyright (c) 2015 Ludovic Cluber.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute copies of the Software,
* and to permit persons to whom the Software is furnished to do so, 
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://www.taipanjs.com
*/
var TAIPAN = {
    revision: "0.2.0",
    create: function(config) {
        var _this = Object.create(this);
        _this.config = config;
        _this.status = TAIPAN.States.create(_this.config);
        _this.createEvents();
        return _this;
    },
    createEvents: function() {
        for (var i = 0; i < this.config.length; i++) {
            var event = this.config[i];
            if (!this.hasOwnProperty(event.name)) this[event.name] = this.setStatus(event.from, event.to);
        }
    },
    getStatus: function() {
        for (var property in this.status) if (this.status[property] === true) return property;
        return false;
    },
    setStatus: function(from, to) {
        return function() {
            if (this.status[from] === true) {
                this.status[from] = false;
                this.status[to] = true;
                return true;
            } else return false;
        };
    }
};

TAIPAN.States = {
    create: function(config) {
        var _this = Object.create(this);
        for (var i = 0; i < config.length; i++) {
            var event = config[i];
            if (!this.hasOwnProperty(event.from)) this[event.from] = i ? false : true;
            if (!this.hasOwnProperty(event.to)) this[event.to] = false;
        }
        return _this;
    }
};