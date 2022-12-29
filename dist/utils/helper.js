'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _core = require('./../core');

var _updateDotenv = require('update-dotenv');

var _updateDotenv2 = _interopRequireDefault(_updateDotenv);

var _msgControl = require('../handler/msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 通常会用到的一些函式
 * @type {[type]}
 */
exports.default = {
  /**
   * 检查消息是否是命令
   * @param  {Object}  message Message
   * @return {Boolean}
   */
  isCommand: function isCommand(message) {
    return message.entities && message.entities[0].type == 'bot_command' ? true : false;
  },

  /**
   * 检查是否是私聊状态
   * @param  {Object}  message message
   * @return {Boolean}
   */
  isPrivate: function isPrivate(message) {
    return message.chat.type == 'private' ? true : false;
  },

  /**
   * 消息来自管理员吗
   * @param  {[type]}  message [description]
   * @return {Boolean}         [description]
   */
  isAdmin: function isAdmin(message) {
    return message.from.id == _core.config.Admin ? true : false;
  },

  /**
   * 是本机器人吗
   * @param  {[type]}  message [description]
   * @return {Boolean}         [description]
   */
  isMe: function isMe(message) {
    var match = message.text.split('@');
    return match[1] && match[1] != _core.config.BotUserName ? false : true;
  },

  /**
   * 检查此条消息是否是将机器人新加到群的提示
   * @param  {Object}  message Message
   * @return {Boolean}
   */
  isNewJoin: function isNewJoin(message) {
    return message.new_chat_member && message.new_chat_member.id == _core.config.BotID ? true : false;
  },
  updateConfig: function updateConfig(params) {
    var _this = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var k, v;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              for (k in params) {
                v = params[k];

                _core.config[k] = v;
                if (typeof v == 'number') {
                  params[k] = v.toString();
                }
              }
              _context.next = 3;
              return (0, _updateDotenv2.default)(params);

            case 3:
              return _context.abrupt('return', true);

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },

  /**
   * 获取10位的时间戳
   * @return {number} 时间戳
   */
  getTimestamp: function getTimestamp() {
    return Math.floor(Date.now() / 1000);
  },

  /**
   * 检查文本中是否含有URL
   * @param  {[type]}  text [description]
   * @return {Boolean}      [description]
   */
  hasUrl: function hasUrl(text) {
    var preg = /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g;
    return preg.test(text);
  },

  /**
   * 检查现在是否需要静音
   * @return {Boolean} [description]
   */
  isMute: function isMute() {
    if (_core.config.AutoMute) {
      var hours = new Date().getHours();
      if (hours > 23 || hours < 7) {
        // 夜间静音
        return true;
      }
    }
    return false;
  },

  /**
   * 传入用户消息，检查此人是否被封锁
   * @param  {[type]}  message  [description]
   * @param  {Boolean}  showTips 回复被封锁消息
   * @return {Boolean}          [description]
   */
  isBlock: function isBlock(message) {
    var showTips = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (_core.blacklist.has({ id: message.from.id })) {
      if (showTips) {
        _msgControl2.default.sendMessage(message.chat.id, _core.lang.get('blacklist_ban_tips'));
      }
      return true;
    }
    return false;
  },

  /**
   * 延迟执行
   * @param  {[type]} delay [description]
   * @return {[type]}       [description]
   */
  sleep: function sleep(delay) {
    return new _promise2.default(function (resolve) {
      setTimeout(resolve, delay);
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9oZWxwZXIuanMiXSwibmFtZXMiOlsiaXNDb21tYW5kIiwibWVzc2FnZSIsImVudGl0aWVzIiwidHlwZSIsImlzUHJpdmF0ZSIsImNoYXQiLCJpc0FkbWluIiwiZnJvbSIsImlkIiwiY29uZmlnIiwiQWRtaW4iLCJpc01lIiwibWF0Y2giLCJ0ZXh0Iiwic3BsaXQiLCJCb3RVc2VyTmFtZSIsImlzTmV3Sm9pbiIsIm5ld19jaGF0X21lbWJlciIsIkJvdElEIiwidXBkYXRlQ29uZmlnIiwicGFyYW1zIiwiayIsInYiLCJ0b1N0cmluZyIsImdldFRpbWVzdGFtcCIsIk1hdGgiLCJmbG9vciIsIkRhdGUiLCJub3ciLCJoYXNVcmwiLCJwcmVnIiwidGVzdCIsImlzTXV0ZSIsIkF1dG9NdXRlIiwiaG91cnMiLCJnZXRIb3VycyIsImlzQmxvY2siLCJzaG93VGlwcyIsImJsYWNrbGlzdCIsImhhcyIsIm1zZ0NvbnRyb2wiLCJzZW5kTWVzc2FnZSIsImxhbmciLCJnZXQiLCJzbGVlcCIsImRlbGF5IiwicmVzb2x2ZSIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7O2tCQUllO0FBQ2I7Ozs7O0FBS0FBLFdBTmEscUJBTUZDLE9BTkUsRUFNTztBQUNsQixXQUFRQSxRQUFRQyxRQUFSLElBQ0hELFFBQVFDLFFBQVIsQ0FBaUIsQ0FBakIsRUFBb0JDLElBQXBCLElBQTRCLGFBRDFCLEdBQzJDLElBRDNDLEdBQ2tELEtBRHpEO0FBRUQsR0FUWTs7QUFVYjs7Ozs7QUFLQUMsV0FmYSxxQkFlRkgsT0FmRSxFQWVPO0FBQ2xCLFdBQVFBLFFBQVFJLElBQVIsQ0FBYUYsSUFBYixJQUFxQixTQUF0QixHQUFtQyxJQUFuQyxHQUEwQyxLQUFqRDtBQUNELEdBakJZOztBQWtCYjs7Ozs7QUFLQUcsU0F2QmEsbUJBdUJKTCxPQXZCSSxFQXVCSztBQUNoQixXQUFRQSxRQUFRTSxJQUFSLENBQWFDLEVBQWIsSUFBbUJDLGFBQU9DLEtBQTNCLEdBQW9DLElBQXBDLEdBQTJDLEtBQWxEO0FBQ0QsR0F6Qlk7O0FBMEJiOzs7OztBQUtBQyxNQS9CYSxnQkErQlBWLE9BL0JPLEVBK0JFO0FBQ2IsUUFBSVcsUUFBUVgsUUFBUVksSUFBUixDQUFhQyxLQUFiLENBQW1CLEdBQW5CLENBQVo7QUFDQSxXQUFRRixNQUFNLENBQU4sS0FBWUEsTUFBTSxDQUFOLEtBQVlILGFBQU9NLFdBQWhDLEdBQStDLEtBQS9DLEdBQXVELElBQTlEO0FBQ0QsR0FsQ1k7O0FBbUNiOzs7OztBQUtBQyxXQXhDYSxxQkF3Q0ZmLE9BeENFLEVBd0NPO0FBQ2xCLFdBQU9BLFFBQVFnQixlQUFSLElBQ0ZoQixRQUFRZ0IsZUFBUixDQUF3QlQsRUFBeEIsSUFBOEJDLGFBQU9TLEtBRG5DLEdBQzJDLElBRDNDLEdBQ2tELEtBRHpEO0FBRUQsR0EzQ1k7QUE0Q1BDLGNBNUNPLHdCQTRDT0MsTUE1Q1AsRUE0Q2U7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDMUIsbUJBQVNDLENBQVQsSUFBY0QsTUFBZCxFQUFzQjtBQUNoQkUsaUJBRGdCLEdBQ1pGLE9BQU9DLENBQVAsQ0FEWTs7QUFFcEJaLDZCQUFPWSxDQUFQLElBQVlDLENBQVo7QUFDQSxvQkFBSSxPQUFPQSxDQUFQLElBQVksUUFBaEIsRUFBMEI7QUFDeEJGLHlCQUFPQyxDQUFQLElBQVlDLEVBQUVDLFFBQUYsRUFBWjtBQUNEO0FBQ0Y7QUFQeUI7QUFBQSxxQkFRcEIsNEJBQVdILE1BQVgsQ0FSb0I7O0FBQUE7QUFBQSwrQ0FTbkIsSUFUbUI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVM0IsR0F0RFk7O0FBdURiOzs7O0FBSUFJLGNBM0RhLDBCQTJERztBQUNkLFdBQU9DLEtBQUtDLEtBQUwsQ0FBV0MsS0FBS0MsR0FBTCxLQUFhLElBQXhCLENBQVA7QUFDRCxHQTdEWTs7QUE4RGI7Ozs7O0FBS0FDLFFBbkVhLGtCQW1FTGhCLElBbkVLLEVBbUVDO0FBQ1osUUFBSWlCLE9BQU8sdUVBQVg7QUFDQSxXQUFPQSxLQUFLQyxJQUFMLENBQVVsQixJQUFWLENBQVA7QUFDRCxHQXRFWTs7QUF1RWI7Ozs7QUFJQW1CLFFBM0VhLG9CQTJFSDtBQUNSLFFBQUl2QixhQUFPd0IsUUFBWCxFQUFxQjtBQUNuQixVQUFJQyxRQUFRLElBQUlQLElBQUosR0FBV1EsUUFBWCxFQUFaO0FBQ0EsVUFBSUQsUUFBUSxFQUFSLElBQWNBLFFBQVEsQ0FBMUIsRUFBNkI7QUFDM0I7QUFDQSxlQUFPLElBQVA7QUFDRDtBQUNGO0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0FwRlk7O0FBcUZiOzs7Ozs7QUFNQUUsU0EzRmEsbUJBMkZKbkMsT0EzRkksRUEyRnVCO0FBQUEsUUFBbEJvQyxRQUFrQix1RUFBUCxLQUFPOztBQUNsQyxRQUFJQyxnQkFBVUMsR0FBVixDQUFjLEVBQUMvQixJQUFJUCxRQUFRTSxJQUFSLENBQWFDLEVBQWxCLEVBQWQsQ0FBSixFQUEwQztBQUN4QyxVQUFJNkIsUUFBSixFQUFjO0FBQ1pHLDZCQUFXQyxXQUFYLENBQXVCeEMsUUFBUUksSUFBUixDQUFhRyxFQUFwQyxFQUF3Q2tDLFdBQUtDLEdBQUwsQ0FBUyxvQkFBVCxDQUF4QztBQUNEO0FBQ0QsYUFBTyxJQUFQO0FBQ0Q7QUFDRCxXQUFPLEtBQVA7QUFDRCxHQW5HWTs7QUFvR2I7Ozs7O0FBS0FDLE9BekdhLGlCQXlHTkMsS0F6R00sRUF5R0M7QUFDWixXQUFPLHNCQUFZLFVBQVNDLE9BQVQsRUFBa0I7QUFDakNDLGlCQUFXRCxPQUFYLEVBQW9CRCxLQUFwQjtBQUNILEtBRk0sQ0FBUDtBQUdEO0FBN0dZLEMiLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25maWcsIGJsYWNrbGlzdCwgbGFuZ30gZnJvbSAnLi8uLi9jb3JlJztcbmltcG9ydCBzYXZlY29uZmlnIGZyb20gJ3VwZGF0ZS1kb3RlbnYnO1xuaW1wb3J0IG1zZ0NvbnRyb2wgZnJvbSAnLi4vaGFuZGxlci9tc2dDb250cm9sJztcblxuLyoqXG4gKiDpgJrluLjkvJrnlKjliLDnmoTkuIDkupvlh73lvI9cbiAqIEB0eXBlIHtbdHlwZV19XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIOajgOafpea2iOaBr+aYr+WQpuaYr+WRveS7pFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICBtZXNzYWdlIE1lc3NhZ2VcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQ29tbWFuZCAobWVzc2FnZSkge1xuICAgIHJldHVybiAobWVzc2FnZS5lbnRpdGllc1xuICAgICAgJiYgbWVzc2FnZS5lbnRpdGllc1swXS50eXBlID09ICdib3RfY29tbWFuZCcpID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuICAvKipcbiAgICog5qOA5p+l5piv5ZCm5piv56eB6IGK54q25oCBXG4gICAqIEBwYXJhbSAge09iamVjdH0gIG1lc3NhZ2UgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNQcml2YXRlIChtZXNzYWdlKSB7XG4gICAgcmV0dXJuIChtZXNzYWdlLmNoYXQudHlwZSA9PSAncHJpdmF0ZScpID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuICAvKipcbiAgICog5raI5oGv5p2l6Ieq566h55CG5ZGY5ZCXXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gIG1lc3NhZ2UgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGlzQWRtaW4gKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gKG1lc3NhZ2UuZnJvbS5pZCA9PSBjb25maWcuQWRtaW4pID8gdHJ1ZSA6IGZhbHNlO1xuICB9LFxuICAvKipcbiAgICog5piv5pys5py65Zmo5Lq65ZCXXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gIG1lc3NhZ2UgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGlzTWUgKG1lc3NhZ2UpIHtcbiAgICBsZXQgbWF0Y2ggPSBtZXNzYWdlLnRleHQuc3BsaXQoJ0AnKTtcbiAgICByZXR1cm4gKG1hdGNoWzFdICYmIG1hdGNoWzFdICE9IGNvbmZpZy5Cb3RVc2VyTmFtZSkgPyBmYWxzZSA6IHRydWU7XG4gIH0sXG4gIC8qKlxuICAgKiDmo4Dmn6XmraTmnaHmtojmga/mmK/lkKbmmK/lsIbmnLrlmajkurrmlrDliqDliLDnvqTnmoTmj5DnpLpcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgbWVzc2FnZSBNZXNzYWdlXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc05ld0pvaW4gKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5uZXdfY2hhdF9tZW1iZXJcbiAgICAgICYmIG1lc3NhZ2UubmV3X2NoYXRfbWVtYmVyLmlkID09IGNvbmZpZy5Cb3RJRCA/IHRydWUgOiBmYWxzZTtcbiAgfSxcbiAgYXN5bmMgdXBkYXRlQ29uZmlnIChwYXJhbXMpIHtcbiAgICBmb3IgKGxldCBrIGluIHBhcmFtcykge1xuICAgICAgbGV0IHYgPSBwYXJhbXNba107XG4gICAgICBjb25maWdba10gPSB2O1xuICAgICAgaWYgKHR5cGVvZiB2ID09ICdudW1iZXInKSB7XG4gICAgICAgIHBhcmFtc1trXSA9IHYudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXdhaXQgc2F2ZWNvbmZpZyhwYXJhbXMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICAvKipcbiAgICog6I635Y+WMTDkvY3nmoTml7bpl7TmiLNcbiAgICogQHJldHVybiB7bnVtYmVyfSDml7bpl7TmiLNcbiAgICovXG4gIGdldFRpbWVzdGFtcCAoKSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApO1xuICB9LFxuICAvKipcbiAgICog5qOA5p+l5paH5pys5Lit5piv5ZCm5ZCr5pyJVVJMXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gIHRleHQgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGhhc1VybCAodGV4dCkge1xuICAgIGxldCBwcmVnID0gLygoaHR0cHxodHRwc3xmdHB8ZnRwcylcXDpcXC9cXC9bYS16QS1aMC05XFwtXFwuXStcXC5bYS16QS1aXXsyLDN9KFxcL1xcUyopPykvZztcbiAgICByZXR1cm4gcHJlZy50ZXN0KHRleHQpO1xuICB9LFxuICAvKipcbiAgICog5qOA5p+l546w5Zyo5piv5ZCm6ZyA6KaB6Z2Z6Z+zXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGlzTXV0ZSAoKSB7XG4gICAgaWYgKGNvbmZpZy5BdXRvTXV0ZSkge1xuICAgICAgbGV0IGhvdXJzID0gbmV3IERhdGUoKS5nZXRIb3VycygpO1xuICAgICAgaWYgKGhvdXJzID4gMjMgfHwgaG91cnMgPCA3KSB7XG4gICAgICAgIC8vIOWknOmXtOmdmemfs1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICAvKipcbiAgICog5Lyg5YWl55So5oi35raI5oGv77yM5qOA5p+l5q2k5Lq65piv5ZCm6KKr5bCB6ZSBXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gIG1lc3NhZ2UgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7Qm9vbGVhbn0gIHNob3dUaXBzIOWbnuWkjeiiq+WwgemUgea2iOaBr1xuICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBpc0Jsb2NrIChtZXNzYWdlLCBzaG93VGlwcyA9IGZhbHNlKSB7XG4gICAgaWYgKGJsYWNrbGlzdC5oYXMoe2lkOiBtZXNzYWdlLmZyb20uaWR9KSkge1xuICAgICAgaWYgKHNob3dUaXBzKSB7XG4gICAgICAgIG1zZ0NvbnRyb2wuc2VuZE1lc3NhZ2UobWVzc2FnZS5jaGF0LmlkLCBsYW5nLmdldCgnYmxhY2tsaXN0X2Jhbl90aXBzJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgLyoqXG4gICAqIOW7tui/n+aJp+ihjFxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGRlbGF5IFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBzbGVlcCAoZGVsYXkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KTtcbiAgICB9KVxuICB9XG59XG4iXX0=