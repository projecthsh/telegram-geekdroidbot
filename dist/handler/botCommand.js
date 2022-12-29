'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _core = require('../core');

var _commandHandler = require('./commandHandler');

var _commandHandler2 = _interopRequireDefault(_commandHandler);

var _msgControl = require('./msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 解除对用户的封锁
 * @param  {[type]} /\/unban (.+)|\/unban/ [description]
 * @param  {[type]} (msg,    match)        [description]
 * @return {[type]}          [description]
 */
(0, _commandHandler2.default)(/\/unban (.+)|\/unban/, function (_ref) {
  var rep = _ref.rep,
      msg = _ref.msg,
      match = _ref.match,
      repMsg = _ref.repMsg;

  if (_core.helper.isPrivate(msg)) {
    return console.warn('不能运行在Private私聊状态下');
  }
  var userId = match[1];
  if (!repMsg && !userId) {
    return rep(_core.lang.get('blacklist_unban_err_noparams'));
  }
  return rep(userId ? _core.blacklist.unbanWithUserId(userId) : _core.blacklist.unbanWithMessage(repMsg));
});

/**
 * 查看更多管理员命令
 * @param  {[type]} /\/pwshelp/ [description]
 * @param  {[type]} ({         rep,          msg } [description]
 * @return {[type]}             [description]
 */
(0, _commandHandler2.default)(/\/pwshelp/, function (_ref2) {
  var rep = _ref2.rep,
      msg = _ref2.msg;

  if (_core.helper.isPrivate(msg)) {
    return console.warn('不能运行在Private私聊状态下');
  }
  return rep(_core.lang.get('pwshelp'));
});

/**
 * 管理员在审稿群解除用户的会话状态
 * @param  {[type]} /\/unre (.+)|\/unre/  [description]
 * @param  {[type]} ({     rep,          msg,          match, repMsg } [description]
 * @return {[type]}         [description]
 */
(0, _commandHandler2.default)(/\/unre (.+)|\/unre/, function (_ref3) {
  var rep = _ref3.rep,
      msg = _ref3.msg,
      match = _ref3.match,
      repMsg = _ref3.repMsg;

  if (_core.helper.isPrivate(msg)) {
    return console.warn('不能运行在Private私聊状态下');
  }
  var userId = match[1];
  if (!repMsg && !userId) {
    return rep(_core.lang.get('unre_err_noparams'));
  }
  var message = _core.subs.getMsgWithReply(repMsg);

  if (!userId) {
    if (!message) {
      if (!repMsg.forward_from) {
        throw { message: _core.lang.get('unre_err_unknown') }; // 既没有稿件，回复的也不是转发而来的信息，则报错
      } else {
        message = { chat: repMsg.forward_from, from: repMsg.forward_from };
      }
    }
    userId = message.from.id;
  }
  if (!_core.re.has(userId)) {
    throw { message: _core.lang.get('unre_err_not_exists') }; // 用户不存在于会话列表
  }
  message ? _core.re.end(message) : _core.re.endWithId(userId);
  rep(_core.lang.get('unre_success'));
});

/**
 * 封锁一个用户
 * @param  {[type]} /\/ban  (.+)|\/ban/   [description]
 * @param  {[type]} ({msg, match,        repMsg,       rep} [description]
 * @return {[type]}         [description]
 */
(0, _commandHandler2.default)(/\/ban (.+)|\/ban/, function (_ref4) {
  var msg = _ref4.msg,
      match = _ref4.match,
      repMsg = _ref4.repMsg,
      rep = _ref4.rep;

  if (_core.helper.isPrivate(msg)) {
    return false;
  }
  var userId = match[1];
  if (!repMsg && !userId) {
    return rep(_core.lang.get('blacklist_ban_err_noparams'));
  }
  return rep(userId ? _core.blacklist.banWithUserId(userId) : _core.blacklist.banWithMessage(repMsg));
});

/**
 * 在审稿群拒绝一个稿件
 * @param  {[type]} /\/no (.+)|\/no/    [description]
 * @param  {[type]} async ({           msg,          match, rep, repMsg, chatId } [description]
 * @return {[type]}       [description]
 */
(0, _commandHandler2.default)(/\/no (.+)|\/no/, function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref6) {
    var msg = _ref6.msg,
        match = _ref6.match,
        rep = _ref6.rep,
        repMsg = _ref6.repMsg,
        chatId = _ref6.chatId;
    var reason, message;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!_core.helper.isPrivate(msg)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt('return', false);

          case 2:
            reason = match[1];

            if (reason) {
              _context.next = 5;
              break;
            }

            throw { message: _core.lang.get('err_reject_reason') };

          case 5:
            // 没有理由则驳回请求
            message = _core.subs.getMsgWithReply(repMsg);

            if (message) {
              _context.next = 8;
              break;
            }

            throw { message: _core.lang.get('err_no_sub') };

          case 8:
            if (!message.receive_date) {
              _context.next = 10;
              break;
            }

            throw { message: _core.lang.get('err_repeat') };

          case 10:
            _context.next = 12;
            return _msgControl2.default.rejectMessage(message, msg.from, reason);

          case 12:
            rep(_core.lang.get('admin_reject_finish', { reason: reason }));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref5.apply(this, arguments);
  };
}());

/**
 * 在审稿群对用户稿件进行回复
 * !只能回复文本
 * @param  {[type]} /\/re (.+)|\/re/    [description]
 * @param  {[type]} ({   msg,          match,        rep, repMsg } [description]
 * @return {[type]}       [description]
 */
(0, _commandHandler2.default)(/\/re (.+)|\/re/, function (p) {
  return _msgControl2.default.replyMessageWithCommand(p, '/re');
});

/**
 * 回复用户一些信息，但不进入对话模式
 * @param  {[type]} /\/echo (.+)|\/echo/  [description]
 * @param  {[type]} async   ({           msg,          match, rep, repMsg } [description]
 * @return {[type]}         [description]
 */
(0, _commandHandler2.default)(/\/echo (.+)|\/echo/, function (p) {
  return _msgControl2.default.replyMessageWithCommand(p, '/echo');
});

/**
 * 使用评论并采纳稿件
 * @param  {[type]} /\/ok (.+)|\/ok/    [description]
 * @param  {[type]} ({msg, match}         [description]
 * @return {[type]}       [description]
 */
(0, _commandHandler2.default)(/\/ok (.+)|\/ok/, function (_ref7) {
  var msg = _ref7.msg,
      match = _ref7.match,
      rep = _ref7.rep,
      repMsg = _ref7.repMsg;

  if (_core.helper.isPrivate(msg)) {
    return false;
  }
  var comment = match[1];
  var message = _core.subs.getMsgWithReply(repMsg); // 找到稿件
  if (!message) {
    throw { message: _core.lang.get('err_no_sub') };
  } // 稿件不存在
  _msgControl2.default.receiveMessage(message, msg.from, { comment: comment }); // 采纳稿件
});

/**
 * 设置审稿群
 * @param  {String} /\/setgroup$|\/setgroup@/ 
 */
(0, _commandHandler2.default)(/\/setgroup$|\/setgroup@/, function (_ref8) {
  var msg = _ref8.msg,
      chatId = _ref8.chatId,
      rep = _ref8.rep;

  if (_core.helper.isPrivate(msg)) {
    return false;
  }
  if (!_core.helper.isAdmin(msg)) {
    return console.warn('设置审稿群，但操作者不是配置文件中配置的Admin！');
  } else if (!_core.helper.isMe(msg)) {
    return console.log('设置审稿群：不是本机器人！');
  }
  // 设置审稿群
  _core.helper.updateConfig({ Group: msg.chat.id });
  // 回复用户
  rep(_core.lang.get('command_setgroup_tip'));
});

/**
 * start命令
 * @param  {String} /\/start/ 
 */
(0, _commandHandler2.default)(/\/start/, function (_ref9) {
  var msg = _ref9.msg,
      rep = _ref9.rep;

  if (!_core.helper.isPrivate(msg)) {
    return false;
  } // 仅私聊可用
  if (_core.helper.isBlock(msg)) {
    return false;
  } // 被封锁者不可用
  if (_core.re.has(msg.from.id)) {
    _core.re.end(msg); // 若已经是编辑模式，则退出
  }
  rep(_core.lang.get('start'));
});

/**
 * help命令
 * @param  {String} /\/help/ 
 */
(0, _commandHandler2.default)(/\/version/, function (_ref10) {
  var rep = _ref10.rep;

  rep(_core.lang.get('help', { ver: '1.0', link: 'https://github.com/axiref/telegram-pwsbot' }));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVyL2JvdENvbW1hbmQuanMiXSwibmFtZXMiOlsicmVwIiwibXNnIiwibWF0Y2giLCJyZXBNc2ciLCJoZWxwZXIiLCJpc1ByaXZhdGUiLCJjb25zb2xlIiwid2FybiIsInVzZXJJZCIsImxhbmciLCJnZXQiLCJibGFja2xpc3QiLCJ1bmJhbldpdGhVc2VySWQiLCJ1bmJhbldpdGhNZXNzYWdlIiwibWVzc2FnZSIsInN1YnMiLCJnZXRNc2dXaXRoUmVwbHkiLCJmb3J3YXJkX2Zyb20iLCJjaGF0IiwiZnJvbSIsImlkIiwicmUiLCJoYXMiLCJlbmQiLCJlbmRXaXRoSWQiLCJiYW5XaXRoVXNlcklkIiwiYmFuV2l0aE1lc3NhZ2UiLCJjaGF0SWQiLCJyZWFzb24iLCJyZWNlaXZlX2RhdGUiLCJtc2dDb250cm9sIiwicmVqZWN0TWVzc2FnZSIsInJlcGx5TWVzc2FnZVdpdGhDb21tYW5kIiwicCIsImNvbW1lbnQiLCJyZWNlaXZlTWVzc2FnZSIsImlzQWRtaW4iLCJpc01lIiwibG9nIiwidXBkYXRlQ29uZmlnIiwiR3JvdXAiLCJpc0Jsb2NrIiwidmVyIiwibGluayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNQSw4QkFBTyxzQkFBUCxFQUErQixnQkFBaUM7QUFBQSxNQUE5QkEsR0FBOEIsUUFBOUJBLEdBQThCO0FBQUEsTUFBekJDLEdBQXlCLFFBQXpCQSxHQUF5QjtBQUFBLE1BQXBCQyxLQUFvQixRQUFwQkEsS0FBb0I7QUFBQSxNQUFiQyxNQUFhLFFBQWJBLE1BQWE7O0FBQzlELE1BQUlDLGFBQU9DLFNBQVAsQ0FBaUJKLEdBQWpCLENBQUosRUFBMkI7QUFBRSxXQUFPSyxRQUFRQyxJQUFSLENBQWEsbUJBQWIsQ0FBUDtBQUEwQztBQUN2RSxNQUFNQyxTQUFTTixNQUFNLENBQU4sQ0FBZjtBQUNBLE1BQUksQ0FBQ0MsTUFBRCxJQUFXLENBQUNLLE1BQWhCLEVBQXdC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QixFQUFDZ0MsS0FBSyxLQUFOLEVBQWFDLE1BQU0sMkNBQW5CLEVBQWpCLENBQUo7QUFDRCxDQUZEIiwiZmlsZSI6ImJvdENvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NvbmZpZywgYm90LCBoZWxwZXIsIGxhbmcsIHN1YnMsIGJsYWNrbGlzdCwgcmV9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IG9uVGV4dCBmcm9tICcuL2NvbW1hbmRIYW5kbGVyJztcbmltcG9ydCBtc2dDb250cm9sIGZyb20gJy4vbXNnQ29udHJvbCc7XG5cbi8qKlxuICog6Kej6Zmk5a+555So5oi355qE5bCB6ZSBXG4gKiBAcGFyYW0gIHtbdHlwZV19IC9cXC91bmJhbiAoLispfFxcL3VuYmFuLyBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IChtc2csICAgIG1hdGNoKSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbm9uVGV4dCgvXFwvdW5iYW4gKC4rKXxcXC91bmJhbi8sICh7IHJlcCwgbXNnLCBtYXRjaCwgcmVwTXNnIH0pID0+IHtcbiAgaWYgKGhlbHBlci5pc1ByaXZhdGUobXNnKSkgeyByZXR1cm4gY29uc29sZS53YXJuKCfkuI3og73ov5DooYzlnKhQcml2YXRl56eB6IGK54q25oCB5LiLJykgfVxuICBjb25zdCB1c2VySWQgPSBtYXRjaFsxXTtcbiAgaWYgKCFyZXBNc2cgJiYgIXVzZXJJZCkgeyByZXR1cm4gcmVwKGxhbmcuZ2V0KCdibGFja2xpc3RfdW5iYW5fZXJyX25vcGFyYW1zJykpIH1cbiAgcmV0dXJuIHJlcCAodXNlcklkID8gYmxhY2tsaXN0LnVuYmFuV2l0aFVzZXJJZCh1c2VySWQpIDogYmxhY2tsaXN0LnVuYmFuV2l0aE1lc3NhZ2UocmVwTXNnKSk7XG59KVxuXG4vKipcbiAqIOafpeeci+abtOWkmueuoeeQhuWRmOWRveS7pFxuICogQHBhcmFtICB7W3R5cGVdfSAvXFwvcHdzaGVscC8gW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSAoeyAgICAgICAgIHJlcCwgICAgICAgICAgbXNnIH0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbm9uVGV4dCgvXFwvcHdzaGVscC8sICh7IHJlcCwgbXNnIH0pID0+IHtcbiAgaWYgKGhlbHBlci5pc1ByaXZhdGUobXNnKSkgeyByZXR1cm4gY29uc29sZS53YXJuKCfkuI3og73ov5DooYzlnKhQcml2YXRl56eB6IGK54q25oCB5LiLJykgfVxuICByZXR1cm4gcmVwKGxhbmcuZ2V0KCdwd3NoZWxwJykpO1xufSlcblxuLyoqXG4gKiDnrqHnkIblkZjlnKjlrqHnqL/nvqTop6PpmaTnlKjmiLfnmoTkvJror53nirbmgIFcbiAqIEBwYXJhbSAge1t0eXBlXX0gL1xcL3VucmUgKC4rKXxcXC91bnJlLyAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSAoeyAgICAgcmVwLCAgICAgICAgICBtc2csICAgICAgICAgIG1hdGNoLCByZXBNc2cgfSBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5vblRleHQoL1xcL3VucmUgKC4rKXxcXC91bnJlLywgKHsgcmVwLCBtc2csIG1hdGNoLCByZXBNc2cgfSkgPT4ge1xuICBpZiAoaGVscGVyLmlzUHJpdmF0ZShtc2cpKSB7IHJldHVybiBjb25zb2xlLndhcm4oJ+S4jeiDvei/kOihjOWcqFByaXZhdGXnp4HogYrnirbmgIHkuIsnKSB9XG4gIGxldCB1c2VySWQgPSBtYXRjaFsxXTtcbiAgaWYgKCFyZXBNc2cgJiYgIXVzZXJJZCkgeyByZXR1cm4gcmVwKGxhbmcuZ2V0KCd1bnJlX2Vycl9ub3BhcmFtcycpKSB9XG4gIGxldCBtZXNzYWdlID0gc3Vicy5nZXRNc2dXaXRoUmVwbHkocmVwTXNnKTtcblxuICBpZiAoIXVzZXJJZCkge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgaWYgKCFyZXBNc2cuZm9yd2FyZF9mcm9tKSB7XG4gICAgICAgIHRocm93IHttZXNzYWdlOiBsYW5nLmdldCgndW5yZV9lcnJfdW5rbm93bicpfTsvLyDml6LmsqHmnInnqL/ku7bvvIzlm57lpI3nmoTkuZ/kuI3mmK/ovazlj5HogIzmnaXnmoTkv6Hmga/vvIzliJnmiqXplJlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3NhZ2UgPSB7IGNoYXQ6IHJlcE1zZy5mb3J3YXJkX2Zyb20sIGZyb206IHJlcE1zZy5mb3J3YXJkX2Zyb20gfVxuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSBtZXNzYWdlLmZyb20uaWQ7XG4gIH1cbiAgaWYgKCFyZS5oYXModXNlcklkKSkge1xuICAgIHRocm93IHttZXNzYWdlOiBsYW5nLmdldCgndW5yZV9lcnJfbm90X2V4aXN0cycpfTsvLyDnlKjmiLfkuI3lrZjlnKjkuo7kvJror53liJfooahcbiAgfVxuICBtZXNzYWdlID8gcmUuZW5kKG1lc3NhZ2UpOiByZS5lbmRXaXRoSWQodXNlcklkKTtcbiAgcmVwKGxhbmcuZ2V0KCd1bnJlX3N1Y2Nlc3MnKSlcbn0pXG5cbi8qKlxuICog5bCB6ZSB5LiA5Liq55So5oi3XG4gKiBAcGFyYW0gIHtbdHlwZV19IC9cXC9iYW4gICguKyl8XFwvYmFuLyAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gKHttc2csIG1hdGNoLCAgICAgICAgcmVwTXNnLCAgICAgICByZXB9IFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbm9uVGV4dCgvXFwvYmFuICguKyl8XFwvYmFuLywgKHttc2csIG1hdGNoLCByZXBNc2csIHJlcH0pID0+IHtcbiAgaWYgKGhlbHBlci5pc1ByaXZhdGUobXNnKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgY29uc3QgdXNlcklkID0gbWF0Y2hbMV07XG4gIGlmICghcmVwTXNnICYmICF1c2VySWQpIHsgcmV0dXJuIHJlcChsYW5nLmdldCgnYmxhY2tsaXN0X2Jhbl9lcnJfbm9wYXJhbXMnKSkgfVxuICByZXR1cm4gcmVwKHVzZXJJZCA/IGJsYWNrbGlzdC5iYW5XaXRoVXNlcklkKHVzZXJJZCkgOiBibGFja2xpc3QuYmFuV2l0aE1lc3NhZ2UocmVwTXNnKSlcbn0pXG5cbi8qKlxuICog5Zyo5a6h56i/576k5ouS57ud5LiA5Liq56i/5Lu2XG4gKiBAcGFyYW0gIHtbdHlwZV19IC9cXC9ubyAoLispfFxcL25vLyAgICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGFzeW5jICh7ICAgICAgICAgICBtc2csICAgICAgICAgIG1hdGNoLCByZXAsIHJlcE1zZywgY2hhdElkIH0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbm9uVGV4dCgvXFwvbm8gKC4rKXxcXC9uby8sIGFzeW5jICh7IG1zZywgbWF0Y2gsIHJlcCwgcmVwTXNnLCBjaGF0SWQgfSkgPT4ge1xuICBpZiAoaGVscGVyLmlzUHJpdmF0ZShtc2cpKSB7IHJldHVybiBmYWxzZSB9XG4gIGNvbnN0IHJlYXNvbiA9IG1hdGNoWzFdO1xuICBpZiAoIXJlYXNvbikge3Rocm93IHttZXNzYWdlOiBsYW5nLmdldCgnZXJyX3JlamVjdF9yZWFzb24nKX19Ly8g5rKh5pyJ55CG55Sx5YiZ6amz5Zue6K+35rGCXG4gIGxldCBtZXNzYWdlID0gc3Vicy5nZXRNc2dXaXRoUmVwbHkocmVwTXNnKTtcbiAgaWYgKCFtZXNzYWdlKSB7IHRocm93IHttZXNzYWdlOiBsYW5nLmdldCgnZXJyX25vX3N1YicpfSB9Ly8g5rKh5om+5Yiw56i/5Lu2XG4gIC8vIOiLpeeov+S7tuW3sue7j+WPkeW4g++8jOWImemps+WbnuaTjeS9nFxuICBpZiAobWVzc2FnZS5yZWNlaXZlX2RhdGUpIHsgXG4gICAgdGhyb3cge21lc3NhZ2U6IGxhbmcuZ2V0KCdlcnJfcmVwZWF0Jyl9XG4gIH1cbiAgYXdhaXQgbXNnQ29udHJvbC5yZWplY3RNZXNzYWdlKG1lc3NhZ2UsIG1zZy5mcm9tLCByZWFzb24pO1xuICByZXAobGFuZy5nZXQoJ2FkbWluX3JlamVjdF9maW5pc2gnLCB7IHJlYXNvbiB9KSk7XG59KVxuXG4vKipcbiAqIOWcqOWuoeeov+e+pOWvueeUqOaIt+eov+S7tui/m+ihjOWbnuWkjVxuICogIeWPquiDveWbnuWkjeaWh+acrFxuICogQHBhcmFtICB7W3R5cGVdfSAvXFwvcmUgKC4rKXxcXC9yZS8gICAgW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSAoeyAgIG1zZywgICAgICAgICAgbWF0Y2gsICAgICAgICByZXAsIHJlcE1zZyB9IFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5vblRleHQoL1xcL3JlICguKyl8XFwvcmUvLCBwID0+IG1zZ0NvbnRyb2wucmVwbHlNZXNzYWdlV2l0aENvbW1hbmQocCwgJy9yZScpKVxuXG4vKipcbiAqIOWbnuWkjeeUqOaIt+S4gOS6m+S/oeaBr++8jOS9huS4jei/m+WFpeWvueivneaooeW8j1xuICogQHBhcmFtICB7W3R5cGVdfSAvXFwvZWNobyAoLispfFxcL2VjaG8vICBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19IGFzeW5jICAgKHsgICAgICAgICAgIG1zZywgICAgICAgICAgbWF0Y2gsIHJlcCwgcmVwTXNnIH0gW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqL1xub25UZXh0KC9cXC9lY2hvICguKyl8XFwvZWNoby8sIHAgPT4gbXNnQ29udHJvbC5yZXBseU1lc3NhZ2VXaXRoQ29tbWFuZChwLCAnL2VjaG8nKSlcblxuLyoqXG4gKiDkvb/nlKjor4Torrrlubbph4fnurPnqL/ku7ZcbiAqIEBwYXJhbSAge1t0eXBlXX0gL1xcL29rICguKyl8XFwvb2svICAgIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gKHttc2csIG1hdGNofSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICovXG5vblRleHQoL1xcL29rICguKyl8XFwvb2svLCAoeyBtc2csIG1hdGNoLCByZXAsIHJlcE1zZyB9KSA9PiB7XG4gIGlmIChoZWxwZXIuaXNQcml2YXRlKG1zZykpIHsgcmV0dXJuIGZhbHNlOyB9XG4gIGNvbnN0IGNvbW1lbnQgPSBtYXRjaFsxXTtcbiAgbGV0IG1lc3NhZ2UgPSBzdWJzLmdldE1zZ1dpdGhSZXBseShyZXBNc2cpOy8vIOaJvuWIsOeov+S7tlxuICBpZiAoIW1lc3NhZ2UpIHsgdGhyb3cge21lc3NhZ2U6IGxhbmcuZ2V0KCdlcnJfbm9fc3ViJyl9IH0vLyDnqL/ku7bkuI3lrZjlnKhcbiAgbXNnQ29udHJvbC5yZWNlaXZlTWVzc2FnZShtZXNzYWdlLCBtc2cuZnJvbSwgeyBjb21tZW50IH0pOy8vIOmHh+e6s+eov+S7tlxufSlcblxuLyoqXG4gKiDorr7nva7lrqHnqL/nvqRcbiAqIEBwYXJhbSAge1N0cmluZ30gL1xcL3NldGdyb3VwJHxcXC9zZXRncm91cEAvIFxuICovXG5vblRleHQoL1xcL3NldGdyb3VwJHxcXC9zZXRncm91cEAvLCAoeyBtc2csIGNoYXRJZCwgcmVwIH0pID0+IHtcbiAgaWYgKGhlbHBlci5pc1ByaXZhdGUobXNnKSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgaWYgKCFoZWxwZXIuaXNBZG1pbihtc2cpKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUud2Fybign6K6+572u5a6h56i/576k77yM5L2G5pON5L2c6ICF5LiN5piv6YWN572u5paH5Lu25Lit6YWN572u55qEQWRtaW7vvIEnKTtcbiAgfSBlbHNlIGlmICghaGVscGVyLmlzTWUobXNnKSkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZygn6K6+572u5a6h56i/576k77ya5LiN5piv5pys5py65Zmo5Lq677yBJyk7XG4gIH1cbiAgLy8g6K6+572u5a6h56i/576kXG4gIGhlbHBlci51cGRhdGVDb25maWcoeyBHcm91cDogbXNnLmNoYXQuaWQgfSk7XG4gIC8vIOWbnuWkjeeUqOaIt1xuICByZXAobGFuZy5nZXQoJ2NvbW1hbmRfc2V0Z3JvdXBfdGlwJykpXG59KVxuXG4vKipcbiAqIHN0YXJ05ZG95LukXG4gKiBAcGFyYW0gIHtTdHJpbmd9IC9cXC9zdGFydC8gXG4gKi9cbm9uVGV4dCgvXFwvc3RhcnQvLCAoeyBtc2csIHJlcCB9KSA9PiB7XG4gIGlmICghaGVscGVyLmlzUHJpdmF0ZShtc2cpKSB7IHJldHVybiBmYWxzZSB9Ly8g5LuF56eB6IGK5Y+v55SoXG4gIGlmIChoZWxwZXIuaXNCbG9jayhtc2cpKSB7IHJldHVybiBmYWxzZSB9Ly8g6KKr5bCB6ZSB6ICF5LiN5Y+v55SoXG4gIGlmIChyZS5oYXMobXNnLmZyb20uaWQpKSB7XG4gICAgcmUuZW5kKG1zZyk7Ly8g6Iul5bey57uP5piv57yW6L6R5qih5byP77yM5YiZ6YCA5Ye6XG4gIH1cbiAgcmVwIChsYW5nLmdldCgnc3RhcnQnKSk7XG59KVxuXG4vKipcbiAqIGhlbHDlkb3ku6RcbiAqIEBwYXJhbSAge1N0cmluZ30gL1xcL2hlbHAvIFxuICovXG5vblRleHQoL1xcL3ZlcnNpb24vLCAoeyByZXAgfSkgPT4ge1xuICByZXAobGFuZy5nZXQoJ2hlbHAnLCB7dmVyOiAnMS4wJywgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9heGlyZWYvdGVsZWdyYW0tcHdzYm90J30pKTtcbn0pXG4iXX0=