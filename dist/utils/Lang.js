"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 用于翻译文案的工具
 */
var Lang = function () {
  function Lang(langName, vars) {
    (0, _classCallCheck3.default)(this, Lang);
    this.langName = null;
    this.lang = null;

    this.langName = langName;
    this.vars = vars;
  }

  (0, _createClass3.default)(Lang, [{
    key: "get",

    /**
     * 得到翻译内容
     * @param  {String} key     键名，对于Langjson
     * @param  {Object} context 包含变数的对象
     * @return {[type]}         [description]
     */
    value: function get(key, context) {
      var text = this.language[key];
      if (!text) {
        throw new Error("\u4E0D\u5B58\u5728\u7684Key\uFF0C\u8BED\u8A00\uFF1A" + this.langName + "\uFF0C\u952E\uFF1A" + key + "\uFF0C\u8BF7\u68C0\u67E5\u7FFB\u8BD1\u6587\u4EF6\uFF01");
      }
      return text.replace(/{{(.*?)}}/g, function (match, key) {
        return context[key.trim()];
      });
    }
  }, {
    key: "getAdminActionFinish",

    /**
     * 获取管理员准许投稿后，审稿群的actionMsg文案
     * @param  {Object} message Message   稿件
     * @return {[type]}         [description]
     */
    value: function getAdminActionFinish(message) {
      var text = this.getAdminCommonHeader(message);
      text += "\n" + this.getAdminreader(message);
      text += "\n" + this.get('admin_finish_label');
      var comment = this.getAdminComment(message);
      if (comment) {
        text += "\n\n" + this.get('admin_finish_comment', { comment: comment });
      }
      return text;
    }
  }, {
    key: "getAdminComment",

    /**
     * 获取管理员对消息的评语
     * @param  {[type]} message [description]
     * @return {string}         存在则返回，没有则返回空
     */
    value: function getAdminComment(message) {
      var params = message.receive_params;
      return params ? params.comment : false;
    }
  }, {
    key: "getAdminActionReject",
    value: function getAdminActionReject(message, reason) {
      var text = this.getAdminCommonHeader(message);
      text += "\n" + this.getAdminReject(message);
      text += "\n" + this.get('admin_reject_label', { reason: reason });
      return text;
    }
  }, {
    key: "getAdminReject",
    value: function getAdminReject(message) {
      var userinfo = this.getUser(message.reject);
      return this.get('admin_reject', userinfo);
    }
  }, {
    key: "getAdminreader",
    value: function getAdminreader(message) {
      var userinfo = this.getUser(message.receive);
      return this.get('admin_reader', userinfo);
    }
  }, {
    key: "getViaInfo",

    /**
     * 获取推送到频道内容的页脚版权文本
     * via xxxx
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getViaInfo(message) {
      var msgInfo = this.getMessageFwdFromInfo(message);
      var text = '';
      if (msgInfo.type == 'channel_private') {
        text = this.get('via_channel_private', msgInfo);
      } else if (msgInfo.type == 'channel') {
        text = this.get('via_channel', msgInfo);
      } else if (msgInfo.type == 'forward_user' || msgInfo.type == 'user') {
        text = this.get('via_user', msgInfo);
      }
      return text;
    }
  }, {
    key: "getUser",

    /**
     * 获取投稿人username, userid
     * @param  {[type]} message [description]
     * @return {Object}        {username, userid}
     */
    value: function getUser(user) {
      var lastName = user.last_name || '';
      var firstName = user.first_name || '';
      var username = firstName + ' ' + lastName;

      if (!username) {
        if (user.username) {
          username = user.username;
        } else {
          username = 'NoName';
        }
      }
      var userid = user.id;
      return { username: username, userid: userid };
    }
  }, {
    key: "getMessageFwdFromInfo",

    /**
     * 获取转发信息的来源
     * 是转发个人的，还是频道的，还是私人频道的，得到这个信息
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getMessageFwdFromInfo(message) {
      var resp = {};
      // 投稿者转发频道
      var fwdChannel = message.forward_from_chat;
      var fwdUser = message.forward_from;
      var user = message.from;
      if (fwdChannel) {
        var username = fwdChannel.username;
        if (!username) {
          resp = { type: 'channel_private', channel: fwdChannel.title };
        } else {
          resp = { type: 'channel', username: username, channel: fwdChannel.title, id: message.forward_from_message_id };
        }
      } else if (fwdUser) {
        // 投稿者转发自别人
        resp = this.getUser(fwdUser);
        resp.type = 'forward_user';
      } else {
        resp = this.getUser(user);
        resp.type = 'user';
      }
      return resp;
    }
  }, {
    key: "getFromText",

    /**
     * 获取来源(如果是转发别人的信息): @xxx 一行
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getFromText(message) {
      var fwdInfo = this.getMessageFwdFromInfo(message);
      var text = '';
      if (fwdInfo.type == 'channel_private') {
        text = this.get('sub_from_channel_private', fwdInfo);
      } else if (fwdInfo.type == 'channel') {
        text = this.get('sub_from_channel', fwdInfo);
      } else if (fwdInfo.type == 'forward_user') {
        text = this.get('sub_from', fwdInfo);
      }
      return text;
    }
  }, {
    key: "getFromReserve",

    /**
     * 得到 来源保留：保留/匿名 这一行
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    value: function getFromReserve(type) {
      var text = this.get('from_real');
      if (type == this.vars.SUB_ANY) {
        text = this.get('from_anonymous');
      }
      text = this.get('sub_from_reserve', { reserve: text });
      return text;
    }
  }, {
    key: "getSubUser",

    /**
     * 获取投稿人:@xxx 一行
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getSubUser(message) {
      return this.get('sub_people', this.getUser(message.from));
    }
  }, {
    key: "getMoreHelp",

    /**
     * 获取一行： 更多帮助 [/command] 的文本
     * @return {[type]} [description]
     */
    value: function getMoreHelp() {
      return this.get('admin_morehelp', { command: '/pwshelp' });
    }
  }, {
    key: "getAdminCommonHeader",

    /**
     * 获取审稿群通用头部
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getAdminCommonHeader(message) {
      var text = this.get('sub_new') + "\n" + this.getSubUser(message);
      // 是投稿人转发的信息，获取消息之来源
      if (message.forward_date) {
        text += "\n" + this.getFromText(message);
      }
      text += "\n" + this.getFromReserve(message.sub_type);
      return text;
    }
  }, {
    key: "getAdminAction",

    /**
     * 机器人将稿件转发至审稿群后，询问管理员如何操作的文案
     * 如 新投稿\n投稿人:xx\n...
     * @param  {String} type    操作类型
     * @param  {Object} message 稿件
     * @return {[type]}         [description]
     */
    value: function getAdminAction(message) {
      var text = this.getAdminCommonHeader(message);
      text += "\n\n" + this.getMoreHelp();
      return text;
    }
  }, {
    key: "language",

    /**
     * 获取语言包JSON
     * @return {[type]} [description]
     */
    get: function get() {
      if (!this.lang) {
        this.lang = require("../lang/" + this.langName + ".json");
      }
      return this.lang;
    }
  }]);
  return Lang;
}();

exports.default = Lang;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9MYW5nLmpzIl0sIm5hbWVzIjpbIkxhbmciLCJsYW5nTmFtZSIsInZhcnMiLCJsYW5nIiwia2V5IiwiY29udGV4dCIsInRleHQiLCJsYW5ndWFnZSIsIkVycm9yIiwicmVwbGFjZSIsIm1hdGNoIiwidHJpbSIsIm1lc3NhZ2UiLCJnZXRBZG1pbkNvbW1vbkhlYWRlciIsImdldEFkbWlucmVhZGVyIiwiZ2V0IiwiY29tbWVudCIsImdldEFkbWluQ29tbWVudCIsInBhcmFtcyIsInJlY2VpdmVfcGFyYW1zIiwicmVhc29uIiwiZ2V0QWRtaW5SZWplY3QiLCJ1c2VyaW5mbyIsImdldFVzZXIiLCJyZWplY3QiLCJyZWNlaXZlIiwibXNnSW5mbyIsImdldE1lc3NhZ2VGd2RGcm9tSW5mbyIsInR5cGUiLCJ1c2VyIiwibGFzdE5hbWUiLCJsYXN0X25hbWUiLCJmaXJzdE5hbWUiLCJmaXJzdF9uYW1lIiwidXNlcm5hbWUiLCJ1c2VyaWQiLCJpZCIsInJlc3AiLCJmd2RDaGFubmVsIiwiZm9yd2FyZF9mcm9tX2NoYXQiLCJmd2RVc2VyIiwiZm9yd2FyZF9mcm9tIiwiZnJvbSIsImNoYW5uZWwiLCJ0aXRsZSIsImZvcndhcmRfZnJvbV9tZXNzYWdlX2lkIiwiZndkSW5mbyIsIlNVQl9BTlkiLCJyZXNlcnZlIiwiY29tbWFuZCIsImdldFN1YlVzZXIiLCJmb3J3YXJkX2RhdGUiLCJnZXRGcm9tVGV4dCIsImdldEZyb21SZXNlcnZlIiwic3ViX3R5cGUiLCJnZXRNb3JlSGVscCIsInJlcXVpcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0lBR01BLEk7QUFLSixnQkFBYUMsUUFBYixFQUF1QkMsSUFBdkIsRUFBNkI7QUFBQTtBQUFBLFNBSDdCRCxRQUc2QixHQUhsQixJQUdrQjtBQUFBLFNBRjdCRSxJQUU2QixHQUZ0QixJQUVzQjs7QUFDM0IsU0FBS0YsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxTQUFLQyxJQUFMLEdBQVlBLElBQVo7QUFDRDs7Ozs7QUFXRDs7Ozs7O3dCQU1LRSxHLEVBQUtDLE8sRUFBUztBQUNqQixVQUFJQyxPQUFPLEtBQUtDLFFBQUwsQ0FBY0gsR0FBZCxDQUFYO0FBQ0EsVUFBSSxDQUFDRSxJQUFMLEVBQVc7QUFDVCxjQUFNLElBQUlFLEtBQUoseURBQXdCLEtBQUtQLFFBQTdCLDBCQUEyQ0csR0FBM0MsNERBQU47QUFDRDtBQUNELGFBQU9FLEtBQUtHLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLFVBQUNDLEtBQUQsRUFBUU4sR0FBUjtBQUFBLGVBQWdCQyxRQUFRRCxJQUFJTyxJQUFKLEVBQVIsQ0FBaEI7QUFBQSxPQUEzQixDQUFQO0FBQ0Q7Ozs7QUFDRDs7Ozs7eUNBS3NCQyxPLEVBQVM7QUFDN0IsVUFBSU4sT0FBTyxLQUFLTyxvQkFBTCxDQUEwQkQsT0FBMUIsQ0FBWDtBQUNBTixjQUFRLE9BQU8sS0FBS1EsY0FBTCxDQUFvQkYsT0FBcEIsQ0FBZjtBQUNBTixjQUFRLE9BQU8sS0FBS1MsR0FBTCxDQUFTLG9CQUFULENBQWY7QUFDQSxVQUFJQyxVQUFVLEtBQUtDLGVBQUwsQ0FBcUJMLE9BQXJCLENBQWQ7QUFDQSxVQUFJSSxPQUFKLEVBQWE7QUFDWFYsZ0JBQVEsU0FBUyxLQUFLUyxHQUFMLENBQVMsc0JBQVQsRUFBaUMsRUFBRUMsZ0JBQUYsRUFBakMsQ0FBakI7QUFDRDtBQUNELGFBQU9WLElBQVA7QUFDRDs7OztBQUNEOzs7OztvQ0FLaUJNLE8sRUFBUztBQUN4QixVQUFJTSxTQUFTTixRQUFRTyxjQUFyQjtBQUNBLGFBQU9ELFNBQVNBLE9BQU9GLE9BQWhCLEdBQTBCLEtBQWpDO0FBQ0Q7Ozt5Q0FDcUJKLE8sRUFBU1EsTSxFQUFRO0FBQ3JDLFVBQUlkLE9BQU8sS0FBS08sb0JBQUwsQ0FBMEJELE9BQTFCLENBQVg7QUFDQU4sY0FBUSxPQUFPLEtBQUtlLGNBQUwsQ0FBb0JULE9BQXBCLENBQWY7QUFDQU4sY0FBUSxPQUFPLEtBQUtTLEdBQUwsQ0FBUyxvQkFBVCxFQUErQixFQUFFSyxjQUFGLEVBQS9CLENBQWY7QUFDQSxhQUFPZCxJQUFQO0FBQ0Q7OzttQ0FDZU0sTyxFQUFTO0FBQ3ZCLFVBQUlVLFdBQVcsS0FBS0MsT0FBTCxDQUFhWCxRQUFRWSxNQUFyQixDQUFmO0FBQ0EsYUFBTyxLQUFLVCxHQUFMLENBQVMsY0FBVCxFQUF5Qk8sUUFBekIsQ0FBUDtBQUNEOzs7bUNBQ2VWLE8sRUFBUztBQUN2QixVQUFJVSxXQUFXLEtBQUtDLE9BQUwsQ0FBYVgsUUFBUWEsT0FBckIsQ0FBZjtBQUNBLGFBQU8sS0FBS1YsR0FBTCxDQUFTLGNBQVQsRUFBeUJPLFFBQXpCLENBQVA7QUFDRDs7OztBQUNEOzs7Ozs7K0JBTVlWLE8sRUFBUztBQUNuQixVQUFJYyxVQUFVLEtBQUtDLHFCQUFMLENBQTJCZixPQUEzQixDQUFkO0FBQ0EsVUFBSU4sT0FBTyxFQUFYO0FBQ0EsVUFBSW9CLFFBQVFFLElBQVIsSUFBZ0IsaUJBQXBCLEVBQXVDO0FBQ3JDdEIsZUFBTyxLQUFLUyxHQUFMLENBQVMscUJBQVQsRUFBZ0NXLE9BQWhDLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSUEsUUFBUUUsSUFBUixJQUFnQixTQUFwQixFQUErQjtBQUNwQ3RCLGVBQU8sS0FBS1MsR0FBTCxDQUFTLGFBQVQsRUFBd0JXLE9BQXhCLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSUEsUUFBUUUsSUFBUixJQUFnQixjQUFoQixJQUFrQ0YsUUFBUUUsSUFBUixJQUFnQixNQUF0RCxFQUE4RDtBQUNuRXRCLGVBQU8sS0FBS1MsR0FBTCxDQUFTLFVBQVQsRUFBcUJXLE9BQXJCLENBQVA7QUFDRDtBQUNELGFBQU9wQixJQUFQO0FBQ0Q7Ozs7QUFDRDs7Ozs7NEJBS1N1QixJLEVBQU07QUFDYixVQUFJQyxXQUFXRCxLQUFLRSxTQUFMLElBQWtCLEVBQWpDO0FBQ0EsVUFBSUMsWUFBWUgsS0FBS0ksVUFBTCxJQUFtQixFQUFuQztBQUNBLFVBQUlDLFdBQVdGLFlBQVksR0FBWixHQUFrQkYsUUFBakM7O0FBRUEsVUFBSSxDQUFDSSxRQUFMLEVBQWU7QUFDYixZQUFJTCxLQUFLSyxRQUFULEVBQW1CO0FBQ2pCQSxxQkFBV0wsS0FBS0ssUUFBaEI7QUFDRCxTQUZELE1BRU87QUFDTEEscUJBQVcsUUFBWDtBQUNEO0FBQ0Y7QUFDRCxVQUFJQyxTQUFTTixLQUFLTyxFQUFsQjtBQUNBLGFBQU8sRUFBQ0Ysa0JBQUQsRUFBV0MsY0FBWCxFQUFQO0FBQ0Q7Ozs7QUFDRDs7Ozs7OzBDQU11QnZCLE8sRUFBUztBQUM5QixVQUFJeUIsT0FBTyxFQUFYO0FBQ0E7QUFDQSxVQUFJQyxhQUFhMUIsUUFBUTJCLGlCQUF6QjtBQUNBLFVBQUlDLFVBQVU1QixRQUFRNkIsWUFBdEI7QUFDQSxVQUFJWixPQUFPakIsUUFBUThCLElBQW5CO0FBQ0EsVUFBSUosVUFBSixFQUFnQjtBQUNkLFlBQUlKLFdBQVdJLFdBQVdKLFFBQTFCO0FBQ0EsWUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDYkcsaUJBQU8sRUFBQ1QsTUFBTSxpQkFBUCxFQUEwQmUsU0FBU0wsV0FBV00sS0FBOUMsRUFBUDtBQUNELFNBRkQsTUFFTztBQUNMUCxpQkFBTyxFQUFDVCxNQUFNLFNBQVAsRUFBa0JNLGtCQUFsQixFQUE0QlMsU0FBU0wsV0FBV00sS0FBaEQsRUFBdURSLElBQUl4QixRQUFRaUMsdUJBQW5FLEVBQVA7QUFDRDtBQUNGLE9BUEQsTUFPTyxJQUFJTCxPQUFKLEVBQWE7QUFDbEI7QUFDQUgsZUFBTyxLQUFLZCxPQUFMLENBQWFpQixPQUFiLENBQVA7QUFDQUgsYUFBS1QsSUFBTCxHQUFZLGNBQVo7QUFDRCxPQUpNLE1BSUE7QUFDTFMsZUFBTyxLQUFLZCxPQUFMLENBQWFNLElBQWIsQ0FBUDtBQUNBUSxhQUFLVCxJQUFMLEdBQVksTUFBWjtBQUNEO0FBQ0QsYUFBT1MsSUFBUDtBQUNEOzs7O0FBQ0Q7Ozs7O2dDQUthekIsTyxFQUFTO0FBQ3BCLFVBQUlrQyxVQUFVLEtBQUtuQixxQkFBTCxDQUEyQmYsT0FBM0IsQ0FBZDtBQUNBLFVBQUlOLE9BQU8sRUFBWDtBQUNBLFVBQUl3QyxRQUFRbEIsSUFBUixJQUFnQixpQkFBcEIsRUFBdUM7QUFDckN0QixlQUFPLEtBQUtTLEdBQUwsQ0FBUywwQkFBVCxFQUFxQytCLE9BQXJDLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSUEsUUFBUWxCLElBQVIsSUFBZ0IsU0FBcEIsRUFBK0I7QUFDcEN0QixlQUFPLEtBQUtTLEdBQUwsQ0FBUyxrQkFBVCxFQUE2QitCLE9BQTdCLENBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSUEsUUFBUWxCLElBQVIsSUFBZ0IsY0FBcEIsRUFBb0M7QUFDekN0QixlQUFPLEtBQUtTLEdBQUwsQ0FBUyxVQUFULEVBQXFCK0IsT0FBckIsQ0FBUDtBQUNEO0FBQ0QsYUFBT3hDLElBQVA7QUFDRDs7OztBQUNEOzs7OzttQ0FLZ0JzQixJLEVBQU07QUFDcEIsVUFBSXRCLE9BQU8sS0FBS1MsR0FBTCxDQUFTLFdBQVQsQ0FBWDtBQUNBLFVBQUlhLFFBQVEsS0FBSzFCLElBQUwsQ0FBVTZDLE9BQXRCLEVBQStCO0FBQzdCekMsZUFBTyxLQUFLUyxHQUFMLENBQVMsZ0JBQVQsQ0FBUDtBQUNEO0FBQ0RULGFBQU8sS0FBS1MsR0FBTCxDQUFTLGtCQUFULEVBQTZCLEVBQUNpQyxTQUFTMUMsSUFBVixFQUE3QixDQUFQO0FBQ0EsYUFBT0EsSUFBUDtBQUNEOzs7O0FBQ0Q7Ozs7OytCQUtZTSxPLEVBQVM7QUFDbkIsYUFBTyxLQUFLRyxHQUFMLENBQVMsWUFBVCxFQUF1QixLQUFLUSxPQUFMLENBQWFYLFFBQVE4QixJQUFyQixDQUF2QixDQUFQO0FBQ0Q7Ozs7QUFDRDs7OztrQ0FJZTtBQUNiLGFBQU8sS0FBSzNCLEdBQUwsQ0FBUyxnQkFBVCxFQUEyQixFQUFDa0MsU0FBUyxVQUFWLEVBQTNCLENBQVA7QUFDRDs7OztBQUNEOzs7Ozt5Q0FLc0JyQyxPLEVBQVM7QUFDN0IsVUFBSU4sT0FBTyxLQUFLUyxHQUFMLENBQVMsU0FBVCxJQUFzQixJQUF0QixHQUE2QixLQUFLbUMsVUFBTCxDQUFnQnRDLE9BQWhCLENBQXhDO0FBQ0E7QUFDQSxVQUFJQSxRQUFRdUMsWUFBWixFQUEwQjtBQUN4QjdDLGdCQUFRLE9BQU8sS0FBSzhDLFdBQUwsQ0FBaUJ4QyxPQUFqQixDQUFmO0FBQ0Q7QUFDRE4sY0FBUSxPQUFPLEtBQUsrQyxjQUFMLENBQW9CekMsUUFBUTBDLFFBQTVCLENBQWY7QUFDQSxhQUFPaEQsSUFBUDtBQUNEOzs7O0FBQ0Q7Ozs7Ozs7bUNBT2dCTSxPLEVBQVM7QUFDdkIsVUFBSU4sT0FBTyxLQUFLTyxvQkFBTCxDQUEwQkQsT0FBMUIsQ0FBWDtBQUNBTixjQUFRLFNBQVMsS0FBS2lELFdBQUwsRUFBakI7QUFDQSxhQUFPakQsSUFBUDtBQUNEOzs7O0FBdE1EOzs7O3dCQUlnQjtBQUNkLFVBQUksQ0FBQyxLQUFLSCxJQUFWLEVBQWdCO0FBQ2QsYUFBS0EsSUFBTCxHQUFZcUQscUJBQW1CLEtBQUt2RCxRQUF4QixXQUFaO0FBQ0Q7QUFDRCxhQUFPLEtBQUtFLElBQVo7QUFDRDs7Ozs7a0JBZ01ZSCxJIiwiZmlsZSI6IkxhbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIOeUqOS6jue/u+ivkeaWh+ahiOeahOW3peWFt1xuICovXG5jbGFzcyBMYW5nIHtcblxuICBsYW5nTmFtZSA9IG51bGw7XG4gIGxhbmcgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yIChsYW5nTmFtZSwgdmFycykge1xuICAgIHRoaXMubGFuZ05hbWUgPSBsYW5nTmFtZTtcbiAgICB0aGlzLnZhcnMgPSB2YXJzO1xuICB9O1xuICAvKipcbiAgICog6I635Y+W6K+t6KiA5YyFSlNPTlxuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldCBsYW5ndWFnZSAoKSB7XG4gICAgaWYgKCF0aGlzLmxhbmcpIHtcbiAgICAgIHRoaXMubGFuZyA9IHJlcXVpcmUoYC4uL2xhbmcvJHt0aGlzLmxhbmdOYW1lfS5qc29uYCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxhbmc7XG4gIH07XG4gIC8qKlxuICAgKiDlvpfliLDnv7vor5HlhoXlrrlcbiAgICogQHBhcmFtICB7U3RyaW5nfSBrZXkgICAgIOmUruWQje+8jOWvueS6jkxhbmdqc29uXG4gICAqIEBwYXJhbSAge09iamVjdH0gY29udGV4dCDljIXlkKvlj5jmlbDnmoTlr7nosaFcbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldCAoa2V5LCBjb250ZXh0KSB7XG4gICAgbGV0IHRleHQgPSB0aGlzLmxhbmd1YWdlW2tleV07XG4gICAgaWYgKCF0ZXh0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYOS4jeWtmOWcqOeahEtlee+8jOivreiogO+8miR7dGhpcy5sYW5nTmFtZX3vvIzplK7vvJoke2tleX3vvIzor7fmo4Dmn6Xnv7vor5Hmlofku7bvvIFgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgve3soLio/KX19L2csIChtYXRjaCwga2V5KSA9PiBjb250ZXh0W2tleS50cmltKCldKTtcbiAgfTtcbiAgLyoqXG4gICAqIOiOt+WPlueuoeeQhuWRmOWHhuiuuOaKleeov+WQju+8jOWuoeeov+e+pOeahGFjdGlvbk1zZ+aWh+ahiFxuICAgKiBAcGFyYW0gIHtPYmplY3R9IG1lc3NhZ2UgTWVzc2FnZSAgIOeov+S7tlxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0QWRtaW5BY3Rpb25GaW5pc2ggKG1lc3NhZ2UpIHtcbiAgICBsZXQgdGV4dCA9IHRoaXMuZ2V0QWRtaW5Db21tb25IZWFkZXIobWVzc2FnZSk7XG4gICAgdGV4dCArPSBcIlxcblwiICsgdGhpcy5nZXRBZG1pbnJlYWRlcihtZXNzYWdlKTtcbiAgICB0ZXh0ICs9IFwiXFxuXCIgKyB0aGlzLmdldCgnYWRtaW5fZmluaXNoX2xhYmVsJyk7XG4gICAgbGV0IGNvbW1lbnQgPSB0aGlzLmdldEFkbWluQ29tbWVudChtZXNzYWdlKVxuICAgIGlmIChjb21tZW50KSB7XG4gICAgICB0ZXh0ICs9IFwiXFxuXFxuXCIgKyB0aGlzLmdldCgnYWRtaW5fZmluaXNoX2NvbW1lbnQnLCB7IGNvbW1lbnQgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9O1xuICAvKipcbiAgICog6I635Y+W566h55CG5ZGY5a+55raI5oGv55qE6K+E6K+tXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICDlrZjlnKjliJnov5Tlm57vvIzmsqHmnInliJnov5Tlm57nqbpcbiAgICovXG4gIGdldEFkbWluQ29tbWVudCAobWVzc2FnZSkge1xuICAgIGxldCBwYXJhbXMgPSBtZXNzYWdlLnJlY2VpdmVfcGFyYW1zO1xuICAgIHJldHVybiBwYXJhbXMgPyBwYXJhbXMuY29tbWVudCA6IGZhbHNlO1xuICB9O1xuICBnZXRBZG1pbkFjdGlvblJlamVjdCAobWVzc2FnZSwgcmVhc29uKSB7XG4gICAgbGV0IHRleHQgPSB0aGlzLmdldEFkbWluQ29tbW9uSGVhZGVyKG1lc3NhZ2UpO1xuICAgIHRleHQgKz0gXCJcXG5cIiArIHRoaXMuZ2V0QWRtaW5SZWplY3QobWVzc2FnZSk7XG4gICAgdGV4dCArPSBcIlxcblwiICsgdGhpcy5nZXQoJ2FkbWluX3JlamVjdF9sYWJlbCcsIHsgcmVhc29uIH0pO1xuICAgIHJldHVybiB0ZXh0O1xuICB9O1xuICBnZXRBZG1pblJlamVjdCAobWVzc2FnZSkge1xuICAgIGxldCB1c2VyaW5mbyA9IHRoaXMuZ2V0VXNlcihtZXNzYWdlLnJlamVjdCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdhZG1pbl9yZWplY3QnLCB1c2VyaW5mbyk7XG4gIH07XG4gIGdldEFkbWlucmVhZGVyIChtZXNzYWdlKSB7XG4gICAgbGV0IHVzZXJpbmZvID0gdGhpcy5nZXRVc2VyKG1lc3NhZ2UucmVjZWl2ZSk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdhZG1pbl9yZWFkZXInLCB1c2VyaW5mbyk7XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5bmjqjpgIHliLDpopHpgZPlhoXlrrnnmoTpobXohJrniYjmnYPmlofmnKxcbiAgICogdmlhIHh4eHhcbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldFZpYUluZm8gKG1lc3NhZ2UpIHtcbiAgICBsZXQgbXNnSW5mbyA9IHRoaXMuZ2V0TWVzc2FnZUZ3ZEZyb21JbmZvKG1lc3NhZ2UpO1xuICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgaWYgKG1zZ0luZm8udHlwZSA9PSAnY2hhbm5lbF9wcml2YXRlJykge1xuICAgICAgdGV4dCA9IHRoaXMuZ2V0KCd2aWFfY2hhbm5lbF9wcml2YXRlJywgbXNnSW5mbylcbiAgICB9IGVsc2UgaWYgKG1zZ0luZm8udHlwZSA9PSAnY2hhbm5lbCcpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgndmlhX2NoYW5uZWwnLCBtc2dJbmZvKVxuICAgIH0gZWxzZSBpZiAobXNnSW5mby50eXBlID09ICdmb3J3YXJkX3VzZXInIHx8IG1zZ0luZm8udHlwZSA9PSAndXNlcicpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgndmlhX3VzZXInLCBtc2dJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5bmipXnqL/kurp1c2VybmFtZSwgdXNlcmlkXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgIHt1c2VybmFtZSwgdXNlcmlkfVxuICAgKi9cbiAgZ2V0VXNlciAodXNlcikge1xuICAgIGxldCBsYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lIHx8ICcnO1xuICAgIGxldCBmaXJzdE5hbWUgPSB1c2VyLmZpcnN0X25hbWUgfHwgJyc7XG4gICAgbGV0IHVzZXJuYW1lID0gZmlyc3ROYW1lICsgJyAnICsgbGFzdE5hbWU7XG5cbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICB1c2VybmFtZSA9IHVzZXIudXNlcm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1c2VybmFtZSA9ICdOb05hbWUnO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgdXNlcmlkID0gdXNlci5pZDtcbiAgICByZXR1cm4ge3VzZXJuYW1lLCB1c2VyaWR9XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5bovazlj5Hkv6Hmga/nmoTmnaXmupBcbiAgICog5piv6L2s5Y+R5Liq5Lq655qE77yM6L+Y5piv6aKR6YGT55qE77yM6L+Y5piv56eB5Lq66aKR6YGT55qE77yM5b6X5Yiw6L+Z5Liq5L+h5oGvXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRNZXNzYWdlRndkRnJvbUluZm8gKG1lc3NhZ2UpIHtcbiAgICBsZXQgcmVzcCA9IHt9O1xuICAgIC8vIOaKleeov+iAhei9rOWPkemikemBk1xuICAgIGxldCBmd2RDaGFubmVsID0gbWVzc2FnZS5mb3J3YXJkX2Zyb21fY2hhdDtcbiAgICBsZXQgZndkVXNlciA9IG1lc3NhZ2UuZm9yd2FyZF9mcm9tO1xuICAgIGxldCB1c2VyID0gbWVzc2FnZS5mcm9tO1xuICAgIGlmIChmd2RDaGFubmVsKSB7XG4gICAgICBsZXQgdXNlcm5hbWUgPSBmd2RDaGFubmVsLnVzZXJuYW1lO1xuICAgICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgICByZXNwID0ge3R5cGU6ICdjaGFubmVsX3ByaXZhdGUnLCBjaGFubmVsOiBmd2RDaGFubmVsLnRpdGxlfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3AgPSB7dHlwZTogJ2NoYW5uZWwnLCB1c2VybmFtZSwgY2hhbm5lbDogZndkQ2hhbm5lbC50aXRsZSwgaWQ6IG1lc3NhZ2UuZm9yd2FyZF9mcm9tX21lc3NhZ2VfaWR9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmd2RVc2VyKSB7XG4gICAgICAvLyDmipXnqL/ogIXovazlj5Hoh6rliKvkurpcbiAgICAgIHJlc3AgPSB0aGlzLmdldFVzZXIoZndkVXNlcik7XG4gICAgICByZXNwLnR5cGUgPSAnZm9yd2FyZF91c2VyJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcCA9IHRoaXMuZ2V0VXNlcih1c2VyKTtcbiAgICAgIHJlc3AudHlwZSA9ICd1c2VyJztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3A7XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5bmnaXmupAo5aaC5p6c5piv6L2s5Y+R5Yir5Lq655qE5L+h5oGvKTogQHh4eCDkuIDooYxcbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldEZyb21UZXh0IChtZXNzYWdlKSB7XG4gICAgbGV0IGZ3ZEluZm8gPSB0aGlzLmdldE1lc3NhZ2VGd2RGcm9tSW5mbyhtZXNzYWdlKTtcbiAgICBsZXQgdGV4dCA9ICcnO1xuICAgIGlmIChmd2RJbmZvLnR5cGUgPT0gJ2NoYW5uZWxfcHJpdmF0ZScpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgnc3ViX2Zyb21fY2hhbm5lbF9wcml2YXRlJywgZndkSW5mbylcbiAgICB9IGVsc2UgaWYgKGZ3ZEluZm8udHlwZSA9PSAnY2hhbm5lbCcpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgnc3ViX2Zyb21fY2hhbm5lbCcsIGZ3ZEluZm8pXG4gICAgfSBlbHNlIGlmIChmd2RJbmZvLnR5cGUgPT0gJ2ZvcndhcmRfdXNlcicpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgnc3ViX2Zyb20nLCBmd2RJbmZvKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH07XG4gIC8qKlxuICAgKiDlvpfliLAg5p2l5rqQ5L+d55WZ77ya5L+d55WZL+WMv+WQjSDov5nkuIDooYxcbiAgICogQHBhcmFtICB7W3R5cGVdfSB0eXBlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldEZyb21SZXNlcnZlICh0eXBlKSB7XG4gICAgbGV0IHRleHQgPSB0aGlzLmdldCgnZnJvbV9yZWFsJyk7XG4gICAgaWYgKHR5cGUgPT0gdGhpcy52YXJzLlNVQl9BTlkpIHtcbiAgICAgIHRleHQgPSB0aGlzLmdldCgnZnJvbV9hbm9ueW1vdXMnKTtcbiAgICB9XG4gICAgdGV4dCA9IHRoaXMuZ2V0KCdzdWJfZnJvbV9yZXNlcnZlJywge3Jlc2VydmU6IHRleHR9KTtcbiAgICByZXR1cm4gdGV4dDtcbiAgfTtcbiAgLyoqXG4gICAqIOiOt+WPluaKleeov+S6ujpAeHh4IOS4gOihjFxuICAgKiBAcGFyYW0gIHtbdHlwZV19IG1lc3NhZ2UgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZ2V0U3ViVXNlciAobWVzc2FnZSkge1xuICAgIHJldHVybiB0aGlzLmdldCgnc3ViX3Blb3BsZScsIHRoaXMuZ2V0VXNlcihtZXNzYWdlLmZyb20pKTtcbiAgfTtcbiAgLyoqXG4gICAqIOiOt+WPluS4gOihjO+8miDmm7TlpJrluK7liqkgWy9jb21tYW5kXSDnmoTmlofmnKxcbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRNb3JlSGVscCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KCdhZG1pbl9tb3JlaGVscCcsIHtjb21tYW5kOiAnL3B3c2hlbHAnfSk7XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5blrqHnqL/nvqTpgJrnlKjlpLTpg6hcbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldEFkbWluQ29tbW9uSGVhZGVyIChtZXNzYWdlKSB7XG4gICAgbGV0IHRleHQgPSB0aGlzLmdldCgnc3ViX25ldycpICsgXCJcXG5cIiArIHRoaXMuZ2V0U3ViVXNlcihtZXNzYWdlKTtcbiAgICAvLyDmmK/mipXnqL/kurrovazlj5HnmoTkv6Hmga/vvIzojrflj5bmtojmga/kuYvmnaXmupBcbiAgICBpZiAobWVzc2FnZS5mb3J3YXJkX2RhdGUpIHtcbiAgICAgIHRleHQgKz0gXCJcXG5cIiArIHRoaXMuZ2V0RnJvbVRleHQobWVzc2FnZSk7XG4gICAgfVxuICAgIHRleHQgKz0gXCJcXG5cIiArIHRoaXMuZ2V0RnJvbVJlc2VydmUobWVzc2FnZS5zdWJfdHlwZSk7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH07XG4gIC8qKlxuICAgKiDmnLrlmajkurrlsIbnqL/ku7bovazlj5Hoh7PlrqHnqL/nvqTlkI7vvIzor6Lpl67nrqHnkIblkZjlpoLkvZXmk43kvZznmoTmlofmoYhcbiAgICog5aaCIOaWsOaKleeov1xcbuaKleeov+S6ujp4eFxcbi4uLlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHR5cGUgICAg5pON5L2c57G75Z6LXG4gICAqIEBwYXJhbSAge09iamVjdH0gbWVzc2FnZSDnqL/ku7ZcbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldEFkbWluQWN0aW9uIChtZXNzYWdlKSB7XG4gICAgbGV0IHRleHQgPSB0aGlzLmdldEFkbWluQ29tbW9uSGVhZGVyKG1lc3NhZ2UpO1xuICAgIHRleHQgKz0gXCJcXG5cXG5cIiArIHRoaXMuZ2V0TW9yZUhlbHAoKTtcbiAgICByZXR1cm4gdGV4dDtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFuZztcbiJdfQ==