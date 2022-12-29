'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _core = require('../core');

var _msgControl = require('../handler/msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

var _Db2 = require('./Db');

var _Db3 = _interopRequireDefault(_Db2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Re = function (_Db) {
  (0, _inherits3.default)(Re, _Db);

  function Re() {
    (0, _classCallCheck3.default)(this, Re);
    return (0, _possibleConstructorReturn3.default)(this, (Re.__proto__ || (0, _getPrototypeOf2.default)(Re)).apply(this, arguments));
  }

  (0, _createClass3.default)(Re, [{
    key: 'end',

    /**
     * 结束对话模式
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function end(message) {
      this.del({ id: message.from.id });
      _msgControl2.default.sendCurrentMessage(_core.lang.get('re_end_tips'), message, {
        reply_markup: { remove_keyboard: true }
      });
    }
  }, {
    key: 'endWithId',

    /**
     * 透过userID结束会话
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    value: function endWithId(userId) {
      var id = parseInt(userId);
      this.end({
        from: { id: id },
        chat: { id: id }
      });
    }
  }, {
    key: 'has',
    value: function has(userId) {
      var uid = parseInt(userId);
      return (0, _get3.default)(Re.prototype.__proto__ || (0, _getPrototypeOf2.default)(Re.prototype), 'has', this).call(this, { id: uid });
    }
  }, {
    key: 'start',

    /**
     * 进入对话模式
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(message) {
        var condition;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                condition = { id: message.from.id };

                if (this.has(message.from.id)) {
                  _context.next = 6;
                  break;
                }

                this.add(condition);
                // 给用户发送含有KeyboardButton的消息，告知已进入会话模式
                _context.next = 5;
                return _msgControl2.default.sendCurrentMessage(_core.lang.get('re_start', { re_end: _core.lang.get('re_end') }), message, {
                  resize_keyboard: true,
                  one_time_keyboard: true,
                  reply_markup: { keyboard: [[{ text: _core.lang.get('re_end') }]] }
                });

              case 5:
                return _context.abrupt('return', true);

              case 6:
                return _context.abrupt('return', true);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function start(_x) {
        return _ref.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return Re;
}(_Db3.default);

var re = new Re('re');

exports.default = re;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9SZS5qcyJdLCJuYW1lcyI6WyJSZSIsIm1lc3NhZ2UiLCJkZWwiLCJpZCIsImZyb20iLCJtc2dDb250cm9sIiwic2VuZEN1cnJlbnRNZXNzYWdlIiwibGFuZyIsImdldCIsInJlcGx5X21hcmt1cCIsInJlbW92ZV9rZXlib2FyZCIsInVzZXJJZCIsInBhcnNlSW50IiwiZW5kIiwiY2hhdCIsInVpZCIsImNvbmRpdGlvbiIsImhhcyIsImFkZCIsInJlX2VuZCIsInJlc2l6ZV9rZXlib2FyZCIsIm9uZV90aW1lX2tleWJvYXJkIiwia2V5Ym9hcmQiLCJ0ZXh0IiwiRGIiLCJyZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7SUFFTUEsRTs7Ozs7Ozs7Ozs7QUFFSjs7Ozs7d0JBS0tDLE8sRUFBUztBQUNaLFdBQUtDLEdBQUwsQ0FBUyxFQUFFQyxJQUFJRixRQUFRRyxJQUFSLENBQWFELEVBQW5CLEVBQVQ7QUFDQUUsMkJBQVdDLGtCQUFYLENBQThCQyxXQUFLQyxHQUFMLENBQVMsYUFBVCxDQUE5QixFQUF1RFAsT0FBdkQsRUFBZ0U7QUFDOURRLHNCQUFjLEVBQUVDLGlCQUFpQixJQUFuQjtBQURnRCxPQUFoRTtBQUdEOzs7O0FBQ0Q7Ozs7OzhCQUtXQyxNLEVBQVE7QUFDakIsVUFBSVIsS0FBS1MsU0FBU0QsTUFBVCxDQUFUO0FBQ0EsV0FBS0UsR0FBTCxDQUFTO0FBQ1BULGNBQU0sRUFBRUQsTUFBRixFQURDO0FBRVBXLGNBQU0sRUFBRVgsTUFBRjtBQUZDLE9BQVQ7QUFJRDs7O3dCQUNJUSxNLEVBQVE7QUFDWCxVQUFJSSxNQUFNSCxTQUFTRCxNQUFULENBQVY7QUFDQSwrSEFBaUIsRUFBRVIsSUFBSVksR0FBTixFQUFqQjtBQUNEOzs7O0FBQ0Q7Ozs7OzsyR0FLYWQsTzs7Ozs7O0FBQ1BlLHlCLEdBQVksRUFBRWIsSUFBSUYsUUFBUUcsSUFBUixDQUFhRCxFQUFuQixFOztvQkFDWCxLQUFLYyxHQUFMLENBQVNoQixRQUFRRyxJQUFSLENBQWFELEVBQXRCLEM7Ozs7O0FBQ0gscUJBQUtlLEdBQUwsQ0FBU0YsU0FBVDtBQUNBOzt1QkFDTVgscUJBQVdDLGtCQUFYLENBQThCQyxXQUFLQyxHQUFMLENBQVMsVUFBVCxFQUFxQixFQUFDVyxRQUFRWixXQUFLQyxHQUFMLENBQVMsUUFBVCxDQUFULEVBQXJCLENBQTlCLEVBQWtGUCxPQUFsRixFQUEyRjtBQUMvRm1CLG1DQUFpQixJQUQ4RTtBQUUvRkMscUNBQW1CLElBRjRFO0FBRy9GWixnQ0FBYyxFQUFDYSxVQUFVLENBQUMsQ0FBQyxFQUFDQyxNQUFNaEIsV0FBS0MsR0FBTCxDQUFTLFFBQVQsQ0FBUCxFQUFELENBQUQsQ0FBWDtBQUhpRixpQkFBM0YsQzs7O2lEQUtDLEk7OztpREFFRixJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE5Q01nQixZOztBQWtEakIsSUFBTUMsS0FBSyxJQUFJekIsRUFBSixDQUFPLElBQVAsQ0FBWDs7a0JBRWV5QixFIiwiZmlsZSI6IlJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbGFuZywgdmFycywgaGVscGVyLCBzdWJzIH0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgbXNnQ29udHJvbCBmcm9tICcuLi9oYW5kbGVyL21zZ0NvbnRyb2wnO1xuaW1wb3J0IERiIGZyb20gJy4vRGInO1xuXG5jbGFzcyBSZSBleHRlbmRzIERiXG57XG4gIC8qKlxuICAgKiDnu5PmnZ/lr7nor53mqKHlvI9cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGVuZCAobWVzc2FnZSkge1xuICAgIHRoaXMuZGVsKHsgaWQ6IG1lc3NhZ2UuZnJvbS5pZCB9KTtcbiAgICBtc2dDb250cm9sLnNlbmRDdXJyZW50TWVzc2FnZShsYW5nLmdldCgncmVfZW5kX3RpcHMnKSwgbWVzc2FnZSwge1xuICAgICAgcmVwbHlfbWFya3VwOiB7IHJlbW92ZV9rZXlib2FyZDogdHJ1ZSB9XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiDpgI/ov4d1c2VySUTnu5PmnZ/kvJror51cbiAgICogQHBhcmFtICB7W3R5cGVdfSB1c2VySWQgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBlbmRXaXRoSWQgKHVzZXJJZCkge1xuICAgIGxldCBpZCA9IHBhcnNlSW50KHVzZXJJZClcbiAgICB0aGlzLmVuZCh7XG4gICAgICBmcm9tOiB7IGlkIH0sXG4gICAgICBjaGF0OiB7IGlkIH0sXG4gICAgfSlcbiAgfTtcbiAgaGFzICh1c2VySWQpIHtcbiAgICBsZXQgdWlkID0gcGFyc2VJbnQodXNlcklkKVxuICAgIHJldHVybiBzdXBlci5oYXMoeyBpZDogdWlkIH0pO1xuICB9O1xuICAvKipcbiAgICog6L+b5YWl5a+56K+d5qih5byPXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhc3luYyBzdGFydCAobWVzc2FnZSkge1xuICAgIGxldCBjb25kaXRpb24gPSB7IGlkOiBtZXNzYWdlLmZyb20uaWQgfTtcbiAgICBpZiAoIXRoaXMuaGFzKG1lc3NhZ2UuZnJvbS5pZCkpIHtcbiAgICAgIHRoaXMuYWRkKGNvbmRpdGlvbik7XG4gICAgICAvLyDnu5nnlKjmiLflj5HpgIHlkKvmnIlLZXlib2FyZEJ1dHRvbueahOa2iOaBr++8jOWRiuefpeW3sui/m+WFpeS8muivneaooeW8j1xuICAgICAgYXdhaXQgbXNnQ29udHJvbC5zZW5kQ3VycmVudE1lc3NhZ2UobGFuZy5nZXQoJ3JlX3N0YXJ0Jywge3JlX2VuZDogbGFuZy5nZXQoJ3JlX2VuZCcpfSksIG1lc3NhZ2UsIHtcbiAgICAgICAgcmVzaXplX2tleWJvYXJkOiB0cnVlLFxuICAgICAgICBvbmVfdGltZV9rZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgcmVwbHlfbWFya3VwOiB7a2V5Ym9hcmQ6IFtbe3RleHQ6IGxhbmcuZ2V0KCdyZV9lbmQnKX1dXSB9XG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xufVxuXG5jb25zdCByZSA9IG5ldyBSZSgncmUnKTtcblxuZXhwb3J0IGRlZmF1bHQgcmU7Il19