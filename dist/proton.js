'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.protonStyle = exports.Electron = exports.protonize = exports.ProtonProvider = exports.Proton = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Proton = exports.Proton = function () {
    function Proton() {
        var _this = this;

        var protonNameMin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'xxs';
        var breakpoints = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { xs: 280, s: 340, m: 576, l: 768, xl: 992, xxl: 1200 };
        (0, _classCallCheck3.default)(this, Proton);
        this.subscriptionId = 1;
        this.subscriptions = {};
        this.protonName = 'unknown';
        this.protonFactor = 0;

        this.protonNameMin = protonNameMin;

        var keys = (0, _keys2.default)(breakpoints);
        if (keys.length < 2) {
            throw new Error('At least 2 breakpoints must be given. ' + keys.length + ' given');
        }

        this.minBreakpoint = keys.reduce(function (acc, key) {
            return acc !== undefined ? Math.min(acc, breakpoints[key]) : breakpoints[key];
        }, undefined);
        this.maxBreakpoint = keys.reduce(function (acc, key) {
            return acc !== undefined ? Math.max(acc, breakpoints[key]) : breakpoints[key];
        }, undefined);

        this.breakpoints = keys.map(function (key) {
            var name = key;
            var breakpoint = breakpoints[key];

            return { name: name, breakpoint: breakpoint };
        });

        this.breakpoints.sort(function (a, b) {
            if (a.breakpoint < b.breakpoint) {
                return -1;
            }

            if (a.breakpoint > b.breakpoint) {
                return 1;
            }

            throw new Error('breakpoints should not have identical values: ' + a.name + ':' + a.breakpoint + ' vs. ' + b.name + ':' + b.breakpoint);
        });

        this.breakpointNameToIndex = (0, _defineProperty3.default)({}, protonNameMin, -1);
        this.breakpoints.forEach(function (breakpoint, index) {
            _this.breakpointNameToIndex[breakpoint.name] = index;
        });
    }

    (0, _createClass3.default)(Proton, [{
        key: 'subscribe',
        value: function subscribe(cb) {
            var _this2 = this;

            var id = this.subscriptionId++;
            this.subscriptions[id] = cb;
            this.callBack(cb);

            return function () {
                return delete _this2.subscriptions[id];
            };
        }
    }, {
        key: 'callBack',
        value: function callBack(cb) {
            cb(this.protonFactor);
        }
    }, {
        key: 'setSize',
        value: function setSize(size) {
            var _this3 = this;

            this.size = size;
            this.update();

            var keys = (0, _keys2.default)(this.subscriptions);
            keys.forEach(function (key) {
                return _this3.callBack(_this3.subscriptions[key]);
            });
        }
    }, {
        key: 'factor',
        value: function factor(w, min, max) {
            return Math.min(1, Math.max(0, (w - min) / (max - min)));
        }
    }, {
        key: 'update',
        value: function update() {
            this.protonName = this.protonNameMin;
            for (var i = 0; i < this.breakpoints.length; i++) {
                var breakpoint = this.breakpoints[i];

                if (this.size < breakpoint.breakpoint) {
                    break;
                }

                this.protonName = breakpoint.name;
            }

            this.protonFactor = this.factor(this.size, this.minBreakpoint, this.maxBreakpoint);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.subscriptions = {};
        }
    }]);
    return Proton;
}();

var ProtonProvider = exports.ProtonProvider = function (_React$Component) {
    (0, _inherits3.default)(ProtonProvider, _React$Component);

    function ProtonProvider() {
        (0, _classCallCheck3.default)(this, ProtonProvider);
        return (0, _possibleConstructorReturn3.default)(this, (ProtonProvider.__proto__ || (0, _getPrototypeOf2.default)(ProtonProvider)).apply(this, arguments));
    }

    (0, _createClass3.default)(ProtonProvider, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.proton.clear();
        }
    }, {
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                proton: this.props.proton
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return this.props.children;
        }
    }]);
    return ProtonProvider;
}(_react2.default.Component);

ProtonProvider.childContextTypes = {
    proton: _react2.default.PropTypes.any.isRequired
};

process.env.NODE_ENV !== "production" ? ProtonProvider.propTypes = {
    proton: _react2.default.PropTypes.object.isRequired
} : void 0;

var protonize = exports.protonize = function protonize(Component) {
    var Protonized = function (_React$Component2) {
        (0, _inherits3.default)(Protonized, _React$Component2);

        function Protonized(props, context) {
            (0, _classCallCheck3.default)(this, Protonized);

            var _this5 = (0, _possibleConstructorReturn3.default)(this, (Protonized.__proto__ || (0, _getPrototypeOf2.default)(Protonized)).call(this, props, context));

            _this5.state = {
                protonFactor: 1
            };
            return _this5;
        }

        (0, _createClass3.default)(Protonized, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this6 = this;

                this.unsubscribe = this.context.proton.subscribe(function (protonFactor) {
                    return _this6.setState({ protonFactor: protonFactor });
                });
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.unsubscribe();
            }
        }, {
            key: 'render',
            value: function render() {

                return _react2.default.createElement(Component, (0, _extends3.default)({}, this.props, {
                    proton: this.context.proton,
                    protonFactor: this.state.protonFactor
                }));
            }
        }]);
        return Protonized;
    }(_react2.default.Component);

    Protonized.contextTypes = {
        proton: _react2.default.PropTypes.any.isRequired
    };

    return Protonized;
};

var Electron_ = function Electron_(props, context) {
    var style = (0, _extends3.default)({}, protonStyle(props.style, context.proton), {
        display: 'inline-block'
    });

    if (props.cols) {
        var protonName = props.proton.protonName;
        var protonIndex = context.proton.breakpointNameToIndex[protonName];

        if (protonIndex !== undefined) {
            while (!(protonName in props.cols)) {
                if (protonIndex === -1) {
                    break;
                }

                protonName = context.proton.breakpoints[protonIndex].name;
                protonIndex--;
            }

            var factor = protonIndex !== -1 ? props.cols[protonName] : 1;
            style.width = factor * 100 + '%';
        }
    }

    return _react2.default.createElement(
        'div',
        { style: style },
        props.children
    );
};

Electron_.contextTypes = {
    proton: _react2.default.PropTypes.any.isRequired
};

var Electron = exports.Electron = protonize(Electron_);

var protonStyle = exports.protonStyle = function protonStyle(protonStyle_, proton) {
    if (!protonStyle_) {
        return null;
    }

    var style = {};
    var keys = (0, _keys2.default)(protonStyle_);
    keys.forEach(function (key) {
        var attr = protonStyle_[key];

        if (Array.isArray(attr)) {
            style[key] = interpolate(attr[0], attr[1], attr[2], proton.protonFactor);
        } else if ((typeof attr === 'undefined' ? 'undefined' : (0, _typeof3.default)(attr)) === 'object') {
            var protonName = proton.protonName;
            var protonIndex = proton.breakpointNameToIndex[protonName];

            if (protonIndex !== undefined) {
                while (!(protonName in attr)) {

                    if (protonIndex === -1) {
                        protonName = proton.protonNameMin;
                        break;
                    }

                    protonName = proton.breakpoints[protonIndex].name;
                    protonIndex--;
                }

                if (protonName in attr) {
                    style[key] = attr[protonName];
                }
            }
        } else if (typeof attr === 'function') {
            style[key] = attr(proton.protonFactor);
        } else {
            style[key] = attr;
        }
    });

    return style;
};

var interpolate = function interpolate(a, b, u, f) {

    // number check
    {
        var na = +a;
        var nb = +b;

        if (!isNaN(na) && !isNaN(nb)) {
            var number = interpolateNumber(na, nb, f);
            if (!u) {
                return number;
            }

            return '' + number + u;
        }
    }

    // color check
    {
        var ca = '' + a;
        var cb = '' + b;

        if ((ca.length === 4 || ca.length === 7) && (cb.length === 4 || cb.length === 7) && ca[0] === '#' && cb[0] === '#') {
            return interpolateColor(ca, cb, f);
        }
    }

    return 'unknown';
};

var interpolateNumber = function interpolateNumber(na, nb, f) {
    return na + f * (nb - na);
};

var interpolateColor = function interpolateColor(ca, cb, f) {
    var caNum = parseInt(ca.substring(1), 16);

    var caNumRed = void 0;
    var caNumGreen = void 0;
    var caNumBlue = void 0;

    if (ca.length === 4) {
        caNumRed = caNum >> 8 & 0xf;
        caNumGreen = caNum >> 4 & 0xf;
        caNumBlue = caNum & 0xf;

        caNumRed += 16 * caNumRed;
        caNumGreen += 16 * caNumGreen;
        caNumBlue += 16 * caNumBlue;
    } else {
        caNumRed = caNum >> 16 & 0xff;
        caNumGreen = caNum >> 8 & 0xff;
        caNumBlue = caNum & 0xff;
    }

    var cbNum = parseInt(cb.substring(1), 16);

    var cbNumRed = void 0;
    var cbNumGreen = void 0;
    var cbNumBlue = void 0;

    if (cb.length === 4) {
        cbNumRed = cbNum >> 8 & 0xf;
        cbNumGreen = cbNum >> 4 & 0xf;
        cbNumBlue = cbNum & 0xf;

        cbNumRed += 16 * cbNumRed;
        cbNumGreen += 16 * cbNumGreen;
        cbNumBlue += 16 * cbNumBlue;
    } else {
        cbNumRed = cbNum >> 16 & 0xff;
        cbNumGreen = cbNum >> 8 & 0xff;
        cbNumBlue = cbNum & 0xff;
    }

    var red = Math.round(caNumRed + f * (cbNumRed - caNumRed));
    var green = Math.round(caNumGreen + f * (cbNumGreen - caNumGreen));
    var blue = Math.round(caNumBlue + f * (cbNumBlue - caNumBlue));

    var number = (red << 16) + (green << 8) + blue;
    return '#' + number.toString(16);
};

var shortHexNumToLong = function shortHexNumToLong(shortHexNum) {
    var caRed = shortHexNum >> 8 & 0xf;
    caRed += 16 * caRed;

    var caGreen = shortHexNum >> 4 & 0xf;
    caGreen += 16 * caGreen;

    var caBlue = shortHexNum & 0xf;
    caBlue += 16 * caBlue;

    return (caRed << 16) + (caGreen << 8) + caBlue;
};

var interpolateUnit = function interpolateUnit(ua, ub, f) {};