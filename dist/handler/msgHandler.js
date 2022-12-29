'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('../core');

var _msgControl = require('./msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 接收到来自Telegram的普通私聊消息
 * @type {[type]}
 */
exports.default = {
  process: function process(message) {
    _core.subs.optimize(); // 利用消息事件主动触发优化函式
    this.message = message;
    if (_core.helper.isCommand(message)) {
      return false; // 此处不处理command
    } else if (_core.helper.isNewJoin(message)) {
      var chatId = message.chat.id;
      // 是否是本机器人新进群的提示信息
      if (_core.config.Group && _core.config.Group != chatId) {
        return _msgControl2.default.sendMessage(chatId, _core.lang.get('reject_intro_tips')).then(function () {
          _core.bot.leaveChat(chatId);
        });
      }
      _core.bot.sendMessage(message.chat.id, _core.lang.get('intro_new_group', { command: '/setgroup' }));
    } else if (_core.helper.isPrivate(message)) {
      // 是私信渠道的投稿
      if (_core.helper.isBlock(message, true)) {
        return false;
      }
      // 如果用户发送了 "结束对话"
      if (message.text && message.text == _core.lang.get('re_end')) {
        return _core.re.end(message);
      } else if (_core.re.has(message.from.id)) {
        // 进入会话模式，将用户之所有讯息转发到审稿群
        _core.bot.forwardMessage(_core.config.Group, message.chat.id, message.message_id); // 转发至审稿群
      } else {
        _core.subs.process(message, function (message) {
          _msgControl2.default.subAsk(message);
        });
      }
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVyL21zZ0hhbmRsZXIuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsIm1lc3NhZ2UiLCJzdWJzIiwib3B0aW1pemUiLCJoZWxwZXIiLCJpc0NvbW1hbmQiLCJpc05ld0pvaW4iLCJjaGF0SWQiLCJjaGF0IiwiaWQiLCJjb25maWciLCJHcm91cCIsIm1zZ0NvbnRyb2wiLCJzZW5kTWVzc2FnZSIsImxhbmciLCJnZXQiLCJ0aGVuIiwiYm90IiwibGVhdmVDaGF0IiwiY29tbWFuZCIsImlzUHJpdmF0ZSIsImlzQmxvY2siLCJ0ZXh0IiwicmUiLCJlbmQiLCJoYXMiLCJmcm9tIiwiZm9yd2FyZE1lc3NhZ2UiLCJtZXNzYWdlX2lkIiwic3ViQXNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7a0JBS0E7QUFDRUEsU0FERixtQkFDV0MsT0FEWCxFQUNvQjtBQUNoQkMsZUFBS0MsUUFBTCxHQURnQixDQUNBO0FBQ2hCLFNBQUtGLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFFBQUlHLGFBQU9DLFNBQVAsQ0FBaUJKLE9BQWpCLENBQUosRUFBK0I7QUFDN0IsYUFBTyxLQUFQLENBRDZCLENBQ2hCO0FBQ2QsS0FGRCxNQUVPLElBQUlHLGFBQU9FLFNBQVAsQ0FBaUJMLE9BQWpCLENBQUosRUFBK0I7QUFDcEMsVUFBSU0sU0FBU04sUUFBUU8sSUFBUixDQUFhQyxFQUExQjtBQUNBO0FBQ0EsVUFBSUMsYUFBT0MsS0FBUCxJQUFnQkQsYUFBT0MsS0FBUCxJQUFnQkosTUFBcEMsRUFBNEM7QUFDMUMsZUFBT0sscUJBQVdDLFdBQVgsQ0FBdUJOLE1BQXZCLEVBQStCTyxXQUFLQyxHQUFMLENBQVMsbUJBQVQsQ0FBL0IsRUFBOERDLElBQTlELENBQW1FLFlBQU07QUFDN0VDLG9CQUFJQyxTQUFKLENBQWNYLE1BQWQ7QUFDRixTQUZNLENBQVA7QUFHRDtBQUNEVSxnQkFBSUosV0FBSixDQUFnQlosUUFBUU8sSUFBUixDQUFhQyxFQUE3QixFQUFpQ0ssV0FBS0MsR0FBTCxDQUFTLGlCQUFULEVBQTRCLEVBQUNJLFNBQVMsV0FBVixFQUE1QixDQUFqQztBQUNELEtBVE0sTUFTQSxJQUFJZixhQUFPZ0IsU0FBUCxDQUFpQm5CLE9BQWpCLENBQUosRUFBK0I7QUFDcEM7QUFDQSxVQUFJRyxhQUFPaUIsT0FBUCxDQUFlcEIsT0FBZixFQUF3QixJQUF4QixDQUFKLEVBQW1DO0FBQUUsZUFBTyxLQUFQO0FBQWM7QUFDbkQ7QUFDQSxVQUFJQSxRQUFRcUIsSUFBUixJQUFnQnJCLFFBQVFxQixJQUFSLElBQWdCUixXQUFLQyxHQUFMLENBQVMsUUFBVCxDQUFwQyxFQUF3RDtBQUN0RCxlQUFPUSxTQUFHQyxHQUFILENBQU92QixPQUFQLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSXNCLFNBQUdFLEdBQUgsQ0FBT3hCLFFBQVF5QixJQUFSLENBQWFqQixFQUFwQixDQUFKLEVBQTZCO0FBQ2xDO0FBQ0FRLGtCQUFJVSxjQUFKLENBQW1CakIsYUFBT0MsS0FBMUIsRUFBaUNWLFFBQVFPLElBQVIsQ0FBYUMsRUFBOUMsRUFBa0RSLFFBQVEyQixVQUExRCxFQUZrQyxDQUVvQztBQUN2RSxPQUhNLE1BR0E7QUFDTDFCLG1CQUFLRixPQUFMLENBQWFDLE9BQWIsRUFBc0IsVUFBQ0EsT0FBRCxFQUFhO0FBQUVXLCtCQUFXaUIsTUFBWCxDQUFrQjVCLE9BQWxCO0FBQTRCLFNBQWpFO0FBQ0Q7QUFDRjtBQUNGO0FBNUJILEMiLCJmaWxlIjoibXNnSGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29uZmlnLCBib3QsIGhlbHBlciwgbGFuZywgc3VicywgYmxhY2tsaXN0LCByZX0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgbXNnQ29udHJvbCBmcm9tICcuL21zZ0NvbnRyb2wnO1xuXG4vKipcbiAqIOaOpeaUtuWIsOadpeiHqlRlbGVncmFt55qE5pmu6YCa56eB6IGK5raI5oGvXG4gKiBAdHlwZSB7W3R5cGVdfVxuICovXG5leHBvcnQgZGVmYXVsdFxue1xuICBwcm9jZXNzIChtZXNzYWdlKSB7XG4gICAgc3Vicy5vcHRpbWl6ZSgpOy8vIOWIqeeUqOa2iOaBr+S6i+S7tuS4u+WKqOinpuWPkeS8mOWMluWHveW8j1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgaWYgKGhlbHBlci5pc0NvbW1hbmQobWVzc2FnZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTsvLyDmraTlpITkuI3lpITnkIZjb21tYW5kXG4gICAgfSBlbHNlIGlmIChoZWxwZXIuaXNOZXdKb2luKG1lc3NhZ2UpKSB7XG4gICAgICBsZXQgY2hhdElkID0gbWVzc2FnZS5jaGF0LmlkO1xuICAgICAgLy8g5piv5ZCm5piv5pys5py65Zmo5Lq65paw6L+b576k55qE5o+Q56S65L+h5oGvXG4gICAgICBpZiAoY29uZmlnLkdyb3VwICYmIGNvbmZpZy5Hcm91cCAhPSBjaGF0SWQpIHtcbiAgICAgICAgcmV0dXJuIG1zZ0NvbnRyb2wuc2VuZE1lc3NhZ2UoY2hhdElkLCBsYW5nLmdldCgncmVqZWN0X2ludHJvX3RpcHMnKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgIGJvdC5sZWF2ZUNoYXQoY2hhdElkKTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGJvdC5zZW5kTWVzc2FnZShtZXNzYWdlLmNoYXQuaWQsIGxhbmcuZ2V0KCdpbnRyb19uZXdfZ3JvdXAnLCB7Y29tbWFuZDogJy9zZXRncm91cCd9KSk7XG4gICAgfSBlbHNlIGlmIChoZWxwZXIuaXNQcml2YXRlKG1lc3NhZ2UpKSB7XG4gICAgICAvLyDmmK/np4Hkv6HmuKDpgZPnmoTmipXnqL9cbiAgICAgIGlmIChoZWxwZXIuaXNCbG9jayhtZXNzYWdlLCB0cnVlKSkgeyByZXR1cm4gZmFsc2UgfVxuICAgICAgLy8g5aaC5p6c55So5oi35Y+R6YCB5LqGIFwi57uT5p2f5a+56K+dXCJcbiAgICAgIGlmIChtZXNzYWdlLnRleHQgJiYgbWVzc2FnZS50ZXh0ID09IGxhbmcuZ2V0KCdyZV9lbmQnKSkge1xuICAgICAgICByZXR1cm4gcmUuZW5kKG1lc3NhZ2UpO1xuICAgICAgfSBlbHNlIGlmIChyZS5oYXMobWVzc2FnZS5mcm9tLmlkKSkge1xuICAgICAgICAvLyDov5vlhaXkvJror53mqKHlvI/vvIzlsIbnlKjmiLfkuYvmiYDmnInorq/mga/ovazlj5HliLDlrqHnqL/nvqRcbiAgICAgICAgYm90LmZvcndhcmRNZXNzYWdlKGNvbmZpZy5Hcm91cCwgbWVzc2FnZS5jaGF0LmlkLCBtZXNzYWdlLm1lc3NhZ2VfaWQpOy8vIOi9rOWPkeiHs+Wuoeeov+e+pFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vicy5wcm9jZXNzKG1lc3NhZ2UsIChtZXNzYWdlKSA9PiB7IG1zZ0NvbnRyb2wuc3ViQXNrKG1lc3NhZ2UpIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19