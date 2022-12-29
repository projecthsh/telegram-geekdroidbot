'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = function (preg, cb) {
  var _this = this;

  _core.bot.onText(preg, function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(msg, match) {
      var chatId, repMsg, errText, params;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              chatId = msg.chat.id;
              repMsg = msg.reply_to_message;
              _context.next = 5;
              return cb({
                /**
                 * 此函式可直接回复用户指令
                 * @param  {[type]} text [description]
                 * @return {[type]}      [description]
                 */
                rep: function rep(text) {
                  return _msgControl2.default.sendCurrentMessage(text, msg, {
                    reply_to_message_id: msg.message_id
                  });
                },
                chatId: chatId, // 会话ID
                repMsg: repMsg, // 被回复的信息
                match: match, // 匹配到的消息
                msg: msg // 用户指令消息本身
              });

            case 5:
              _context.next = 12;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);
              errText = _context.t0.message;

              if (msg) {
                params = msg ? { reply_to_message_id: msg.message_id } : {};

                if (errText == _core.vars.BOT_BLOCK) {
                  errText = _core.lang.get('re_send_err');
                }
                _msgControl2.default.sendCurrentMessage(errText, msg, params);
              }
              throw { err: _context.t0, msg: msg };

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[0, 7]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _core = require('../core');

var _msgControl = require('./msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVyL2NvbW1hbmRIYW5kbGVyLmpzIl0sIm5hbWVzIjpbInByZWciLCJjYiIsImJvdCIsIm9uVGV4dCIsIm1zZyIsIm1hdGNoIiwiY2hhdElkIiwiY2hhdCIsImlkIiwicmVwTXNnIiwicmVwbHlfdG9fbWVzc2FnZSIsInJlcCIsIm1zZ0NvbnRyb2wiLCJzZW5kQ3VycmVudE1lc3NhZ2UiLCJ0ZXh0IiwicmVwbHlfdG9fbWVzc2FnZV9pZCIsIm1lc3NhZ2VfaWQiLCJlcnJUZXh0IiwibWVzc2FnZSIsInBhcmFtcyIsInZhcnMiLCJCT1RfQkxPQ0siLCJsYW5nIiwiZ2V0IiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQkFTZSxVQUFVQSxJQUFWLEVBQWdCQyxFQUFoQixFQUNmO0FBQUE7O0FBQ0VDLFlBQUlDLE1BQUosQ0FBV0gsSUFBWDtBQUFBLHdGQUFpQixpQkFBT0ksR0FBUCxFQUFZQyxLQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRVBDLG9CQUZPLEdBRUVGLElBQUlHLElBQUosQ0FBU0MsRUFGWDtBQUdQQyxvQkFITyxHQUdFTCxJQUFJTSxnQkFITjtBQUFBO0FBQUEscUJBSVBULEdBQUc7QUFDUDs7Ozs7QUFLQVUscUJBQUssbUJBQVE7QUFDWCx5QkFBT0MscUJBQVdDLGtCQUFYLENBQThCQyxJQUE5QixFQUFvQ1YsR0FBcEMsRUFBeUM7QUFDOUNXLHlDQUFxQlgsSUFBSVk7QUFEcUIsbUJBQXpDLENBQVA7QUFHRCxpQkFWTTtBQVdQViw4QkFYTyxFQVdBO0FBQ1BHLDhCQVpPLEVBWUE7QUFDUEosNEJBYk8sRUFhRDtBQUNORCx3QkFkTyxDQWNKO0FBZEksZUFBSCxDQUpPOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFxQlRhLHFCQXJCUyxHQXFCQyxZQUFJQyxPQXJCTDs7QUFzQmIsa0JBQUlkLEdBQUosRUFBUztBQUNIZSxzQkFERyxHQUNNZixNQUFNLEVBQUNXLHFCQUFxQlgsSUFBSVksVUFBMUIsRUFBTixHQUE4QyxFQURwRDs7QUFFUCxvQkFBSUMsV0FBV0csV0FBS0MsU0FBcEIsRUFBK0I7QUFDN0JKLDRCQUFVSyxXQUFLQyxHQUFMLENBQVMsYUFBVCxDQUFWO0FBQ0Q7QUFDRFgscUNBQVdDLGtCQUFYLENBQThCSSxPQUE5QixFQUF1Q2IsR0FBdkMsRUFBNENlLE1BQTVDO0FBQ0Q7QUE1Qlksb0JBNkJQLEVBQUNLLGdCQUFELEVBQU1wQixRQUFOLEVBN0JPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQWpCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0NELEM7O0FBM0NEOztBQUNBIiwiZmlsZSI6ImNvbW1hbmRIYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYm90LCB2YXJzLCBsYW5nIH0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgbXNnQ29udHJvbCBmcm9tICcuL21zZ0NvbnRyb2wnO1xuXG4vKipcbiAqIG9uVGV4dOWRveS7pOmXreWMheWHveW8j1xuICogQHBhcmFtICB7T2JqZWN0fSAgIG1zZyDlvZPliY3nmoRNc2flr7nosaFcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYiAg5Zue6LCD5Ye95pWw77yMcmVw5Lyg5Zue5LiA5LiqcmVw5Ye95pWw77yM6L6T5YWl5paH5pys5Y2z5Y+v5Zue5aSN5b2T5YmN55So5oi35paH5pysO2NoYXRJZDtyZXBNc2flm57lpI3nmoTkv6Hmga8o6Iul5pyJKVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChwcmVnLCBjYikgXG57XG4gIGJvdC5vblRleHQocHJlZywgYXN5bmMgKG1zZywgbWF0Y2gpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2hhdElkID0gbXNnLmNoYXQuaWQ7XG4gICAgICBjb25zdCByZXBNc2cgPSBtc2cucmVwbHlfdG9fbWVzc2FnZTtcbiAgICAgIGF3YWl0IGNiKHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOatpOWHveW8j+WPr+ebtOaOpeWbnuWkjeeUqOaIt+aMh+S7pFxuICAgICAgICAgKiBAcGFyYW0gIHtbdHlwZV19IHRleHQgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgICAgICAgKi9cbiAgICAgICAgcmVwOiB0ZXh0ID0+IHtcbiAgICAgICAgICByZXR1cm4gbXNnQ29udHJvbC5zZW5kQ3VycmVudE1lc3NhZ2UodGV4dCwgbXNnLCB7IFxuICAgICAgICAgICAgcmVwbHlfdG9fbWVzc2FnZV9pZDogbXNnLm1lc3NhZ2VfaWQgXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY2hhdElkLC8vIOS8muivnUlEXG4gICAgICAgIHJlcE1zZywvLyDooqvlm57lpI3nmoTkv6Hmga9cbiAgICAgICAgbWF0Y2gsLy8g5Yy56YWN5Yiw55qE5raI5oGvXG4gICAgICAgIG1zZy8vIOeUqOaIt+aMh+S7pOa2iOaBr+acrOi6q1xuICAgICAgfSlcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGxldCBlcnJUZXh0ID0gZXJyLm1lc3NhZ2U7XG4gICAgICBpZiAobXNnKSB7XG4gICAgICAgIGxldCBwYXJhbXMgPSBtc2cgPyB7cmVwbHlfdG9fbWVzc2FnZV9pZDogbXNnLm1lc3NhZ2VfaWR9IDoge31cbiAgICAgICAgaWYgKGVyclRleHQgPT0gdmFycy5CT1RfQkxPQ0spIHtcbiAgICAgICAgICBlcnJUZXh0ID0gbGFuZy5nZXQoJ3JlX3NlbmRfZXJyJyk7XG4gICAgICAgIH1cbiAgICAgICAgbXNnQ29udHJvbC5zZW5kQ3VycmVudE1lc3NhZ2UoZXJyVGV4dCwgbXNnLCBwYXJhbXMpO1xuICAgICAgfVxuICAgICAgdGhyb3cge2VyciwgbXNnfTtcbiAgICB9XG4gIH0pXG59Il19