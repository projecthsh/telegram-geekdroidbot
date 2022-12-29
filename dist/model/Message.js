'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _core = require('../core');

var _Db2 = require('./Db');

var _Db3 = _interopRequireDefault(_Db2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Message = function (_Db) {
  (0, _inherits3.default)(Message, _Db);

  function Message() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Message);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Message.__proto__ || (0, _getPrototypeOf2.default)(Message)).call.apply(_ref, [this].concat(args))), _this), _this.header = 0, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Message, [{
    key: 'process',

    /**
     * 存储Message
     * 当处理完毕时，会调用回调函式传回消息
     * @param  {Object} message Message
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    value: function process(message, callback) {
      // 针对MediaGroup
      if (message.media_group_id) {
        var groupMsg = this.processMediaMessage(message);
        clearTimeout(this.handler);
        this.handler = setTimeout(function () {
          return callback(groupMsg);
        }, 500);
      } else {
        this.push(message);
        callback(message);
      }
    }
  }, {
    key: 'getReplytoMessageId',

    /**
     * 获取回复的MessageID
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getReplytoMessageId(message) {
      return message.media_group_id ? message.media[0].message_id : message.message_id;
    }
  }, {
    key: 'getCaption',

    /**
     * 获取Caption文本
     * @param  {Object} message 稿件
     * @param  {String} comment 评论
     * @return {String}         返回Caption文本，同样可以使用在SendTextMessage
     */
    value: function getCaption(message, params) {
      var comment = params ? params.comment : '';
      var caption = message.caption ? message.caption + "\n" : '';
      // 添加评语
      if (comment) {
        caption += _core.lang.get('comment_label', { comment: comment }) + "\n";
      }
      // 若是实名投稿，则附加版权信息
      if (message.sub_type == _core.vars.SUB_REAL) {
        caption += "\n" + _core.lang.getViaInfo(message);
      }
      if (message.text) {
        caption = message.text + ('\n\n' + caption);
      }
      return caption;
    }
  }, {
    key: 'getOptions',

    /**
     * 获取sendChannel的Option额外参数
     * @param  {[type]} message         [description]
     * @param  {[type]} caption         [description]
     * @param  {[type]} options.comment [description]
     * @param  {[type]} options.isMute  [description]
     * @return {[type]}                 [description]
     */
    value: function getOptions(message, caption, params) {
      var comment = params ? params.comment : '';
      var isMute = params ? params.isMute : false;
      // 支援markdown和默认关闭链接预览
      var options = { parse_mode: 'Markdown', disable_web_page_preview: true, caption: caption
        // 若文本或comment含有URL，则开启链接预览
      };if (_core.helper.hasUrl(message.text) || _core.helper.hasUrl(comment)) {
        options.disable_web_page_preview = false;
      }
      if (isMute) {
        options.disable_notification = true;
      }
      return options;
    }
  }, {
    key: 'withoutKeys',

    /**
     * 排除一些key，得到一个新对象
     * @param  {[type]} obj  [description]
     * @param  {[type]} keys [description]
     * @return {[type]}      [description]
     */
    value: function withoutKeys(obj, keys) {
      var nobj = (0, _assign2.default)({}, obj);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          delete nobj[key];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return nobj;
    }
  }, {
    key: 'processMediaMessage',

    /**
     * 合并mediaGroup消息为新的格式
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function processMediaMessage(message) {
      var groupMsg = this.one({ media_group_id: message.media_group_id });
      if (!groupMsg) {
        // 排除这些键
        groupMsg = this.withoutKeys(message, ['caption', 'photo', 'video', 'message_id']);
        groupMsg.media = [];
      } else {
        // 若已经存在此项，则返回
        var ids = (0, _keys2.default)(groupMsg.media).map(function (f) {
          return groupMsg.media[f].message_id;
        });
        if (ids.includes(message.message_id)) {
          return groupMsg;
        }
      }
      var mediaRow = {};
      if (message.photo) {
        // 选择最清晰的那张图
        mediaRow = { message_id: message.message_id, type: 'photo', media: message.photo[message.photo.length - 1].file_id };
      } else if (message.video) {
        mediaRow = { message_id: message.message_id, type: 'video', media: message.video.file_id };
      }
      if (message.caption) {
        mediaRow.caption = message.caption;
      }
      mediaRow.parse_mode = 'Markdown';
      groupMsg.media.push(mediaRow);
      // 第一个媒体的描述将作为稿件描述
      if (groupMsg.media[0].caption) {
        groupMsg.caption = groupMsg.media[0].caption;
      }
      this.pushMediaGroup(groupMsg);
      return groupMsg;
    }
  }, {
    key: 'getFwdMsgCondition',

    /**
     * 从审稿群的稿件消息得到原稿件对象的查询条件
     * @param  {[type]} fwdMsg 审稿群的稿件
     * @return {[type]}         [description]
     */
    value: function getFwdMsgCondition(fwdMsg) {
      if (fwdMsg.media_group_id) {
        return { fwdMsgGroupId: fwdMsg.media_group_id };
      } else if (fwdMsg.message_id) {
        return { fwdMsgId: fwdMsg.message_id };
      } else {
        throw new Error('getMsgFromFwd: 很抱歉，message消息格式不正确！');
      }
    }
  }, {
    key: 'getMsgCondition',

    /**
     * 从稿件中得到原始稿件的查询条件
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    value: function getMsgCondition(message) {
      if (message.media_group_id) {
        return { media_group_id: message.media_group_id };
      } else if (message.message_id) {
        return { message_id: message.message_id };
      } else {
        throw new Error('getMsgFromFwd: 很抱歉，message消息格式不正确！');
      }
    }
  }, {
    key: 'getMsgWithReply',

    /**
     * 透过用户回复的命令来获取稿件
     * @param  {[type]} fwdMsg 审稿群中的信息
     * @return {[type]}         [description]
     */
    value: function getMsgWithReply(fwdMsg) {
      if (!fwdMsg) {
        return false;
      }
      var media_group_id = fwdMsg.media_group_id;
      var message_id = fwdMsg.message_id;
      var message = null;
      if (media_group_id) {
        message = this.one({ fwdMsgGroupId: media_group_id });
      } else {
        message = this.one({ fwdMsgId: message_id }) || this.one({ actionMsgId: message_id });
      }
      return message;
    }
  }, {
    key: 'optimize',

    /**
     * 定时优化掉过期的数据
     * @return {[type]} [description]
     */
    value: function optimize() {
      // 计算出10天前的时间戳
      var tenday = _core.helper.getTimestamp() - 60 * 60 * 24 * 10;
      var msgs = this.db.get(this.table).filter(function (e) {
        return e.date < tenday;
      }).value();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(msgs), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var e = _step2.value;

          this.del(e);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'pushMediaGroup',

    /**
     * 保存一个MediaGroup
     * @param  {[type]} groupMsg
     * @return {[type]}         [description]
     */
    value: function pushMediaGroup(groupMsg) {
      var condition = { media_group_id: groupMsg.media_group_id };
      if (!this.has(condition)) {
        this.add(groupMsg);
      } else {
        this.update(condition, groupMsg);
      }
    }
  }, {
    key: 'push',

    /**
     * 保存一个Message
     * @param {[type]} message [description]
     */
    value: function push(message) {
      if (!this.has({ message_id: message.message_id })) {
        this.add(message);
      }
    }
  }]);
  return Message;
}(_Db3.default);

exports.default = Message;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9NZXNzYWdlLmpzIl0sIm5hbWVzIjpbIk1lc3NhZ2UiLCJoZWFkZXIiLCJtZXNzYWdlIiwiY2FsbGJhY2siLCJtZWRpYV9ncm91cF9pZCIsImdyb3VwTXNnIiwicHJvY2Vzc01lZGlhTWVzc2FnZSIsImNsZWFyVGltZW91dCIsImhhbmRsZXIiLCJzZXRUaW1lb3V0IiwicHVzaCIsIm1lZGlhIiwibWVzc2FnZV9pZCIsInBhcmFtcyIsImNvbW1lbnQiLCJjYXB0aW9uIiwibGFuZyIsImdldCIsInN1Yl90eXBlIiwidmFycyIsIlNVQl9SRUFMIiwiZ2V0VmlhSW5mbyIsInRleHQiLCJpc011dGUiLCJvcHRpb25zIiwicGFyc2VfbW9kZSIsImRpc2FibGVfd2ViX3BhZ2VfcHJldmlldyIsImhlbHBlciIsImhhc1VybCIsImRpc2FibGVfbm90aWZpY2F0aW9uIiwib2JqIiwia2V5cyIsIm5vYmoiLCJrZXkiLCJvbmUiLCJ3aXRob3V0S2V5cyIsImlkcyIsIm1hcCIsImYiLCJpbmNsdWRlcyIsIm1lZGlhUm93IiwicGhvdG8iLCJ0eXBlIiwibGVuZ3RoIiwiZmlsZV9pZCIsInZpZGVvIiwicHVzaE1lZGlhR3JvdXAiLCJmd2RNc2ciLCJmd2RNc2dHcm91cElkIiwiZndkTXNnSWQiLCJFcnJvciIsImFjdGlvbk1zZ0lkIiwidGVuZGF5IiwiZ2V0VGltZXN0YW1wIiwibXNncyIsImRiIiwidGFibGUiLCJmaWx0ZXIiLCJlIiwiZGF0ZSIsInZhbHVlIiwiZGVsIiwiY29uZGl0aW9uIiwiaGFzIiwiYWRkIiwidXBkYXRlIiwiRGIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztJQUNNQSxPOzs7Ozs7Ozs7Ozs7Ozs4TUFFSkMsTSxHQUFTLEM7Ozs7OztBQUNUOzs7Ozs7OzRCQU9TQyxPLEVBQVNDLFEsRUFBVTtBQUMxQjtBQUNBLFVBQUlELFFBQVFFLGNBQVosRUFB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QU4sR0FBUyxFQUEvQztBQUNBLFVBQUlDLE9BQU8sS0FBS0MsRUFBTCxDQUFRdEMsR0FBUixDQUFZLEtBQUt1QyxLQUFqQixFQUF3QkMsTUFBeEIsQ0FBK0IsYUFBSztBQUM3QyxlQUFPQyxFQUFFQyxJQUFGLEdBQVNQLE1BQWhCO0FBQ0QsT0FGVSxFQUVSUSxLQUZRLEVBQVg7QUFIVTtBQUFBO0FBQUE7O0FBQUE7QUFNVix5REFBY04sSUFBZCxpSEFBb0I7QUFBQSxjQUFYSSxDQUFXOztBQUNsQixlQUFLRyxHQUFMLENBQVNILENBQVQ7QUFDRDtBQVJTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTWDs7OztBQUNEOzs7OzttQ0FLZ0JyRCxRLEVBQVU7QUFDeEIsVUFBSXlELFlBQVksRUFBQzFELGdCQUFnQkMsU0FBU0QsY0FBMUIsRUFBaEI7QUFDQSxVQUFJLENBQUMsS0FBSzJELEdBQUwsQ0FBU0QsU0FBVCxDQUFMLEVBQTBCO0FBQUUsYUFBS0UsR0FBTCxDQUFTM0QsUUFBVDtBQUFvQixPQUFoRCxNQUFzRDtBQUFFLGFBQUs0RCxNQUFMLENBQVlILFNBQVosRUFBdUJ6RCxRQUF2QjtBQUFrQztBQUMzRjs7OztBQUNEOzs7O3lCQUlNSCxPLEVBQVM7QUFDYixVQUFJLENBQUMsS0FBSzZELEdBQUwsQ0FBUyxFQUFDbkQsWUFBWVYsUUFBUVUsVUFBckIsRUFBVCxDQUFMLEVBQWlEO0FBQy9DLGFBQUtvRCxHQUFMLENBQVM5RCxPQUFUO0FBQ0Q7QUFDRjs7O0VBN0xtQmdFLFk7O2tCQWdNUGxFLE8iLCJmaWxlIjoiTWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxhbmcsIHZhcnMsIGhlbHBlciwgcmUgfSBmcm9tICcuLi9jb3JlJztcbmltcG9ydCBEYiBmcm9tICcuL0RiJztcbmNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBEYlxue1xuICBoZWFkZXIgPSAwO1xuICAvKipcbiAgICog5a2Y5YKoTWVzc2FnZVxuICAgKiDlvZPlpITnkIblrozmr5Xml7bvvIzkvJrosIPnlKjlm57osIPlh73lvI/kvKDlm57mtojmga9cbiAgICogQHBhcmFtICB7T2JqZWN0fSBtZXNzYWdlIE1lc3NhZ2VcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByb2Nlc3MgKG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgLy8g6ZKI5a+5TWVkaWFHcm91cFxuICAgIGlmIChtZXNzYWdlLm1lZGlhX2dyb3VwX2lkKSB7XG4gICAgICBsZXQgZ3JvdXBNc2cgPSB0aGlzLnByb2Nlc3NNZWRpYU1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oYW5kbGVyKTtcbiAgICAgIHRoaXMuaGFuZGxlciA9IHNldFRpbWVvdXQoKCkgPT4gY2FsbGJhY2soZ3JvdXBNc2cpLCA1MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2gobWVzc2FnZSk7XG4gICAgICBjYWxsYmFjayhtZXNzYWdlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiDojrflj5blm57lpI3nmoRNZXNzYWdlSURcbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGdldFJlcGx5dG9NZXNzYWdlSWQgKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5tZWRpYV9ncm91cF9pZCA/IG1lc3NhZ2UubWVkaWFbMF0ubWVzc2FnZV9pZCA6IG1lc3NhZ2UubWVzc2FnZV9pZDtcbiAgfTtcbiAgLyoqXG4gICAqIOiOt+WPlkNhcHRpb27mlofmnKxcbiAgICogQHBhcmFtICB7T2JqZWN0fSBtZXNzYWdlIOeov+S7tlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGNvbW1lbnQg6K+E6K66XG4gICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICDov5Tlm55DYXB0aW9u5paH5pys77yM5ZCM5qC35Y+v5Lul5L2/55So5ZyoU2VuZFRleHRNZXNzYWdlXG4gICAqL1xuICBnZXRDYXB0aW9uIChtZXNzYWdlLCBwYXJhbXMpIHtcbiAgICBsZXQgY29tbWVudCA9IHBhcmFtcyA/IHBhcmFtcy5jb21tZW50IDogJyc7XG4gICAgbGV0IGNhcHRpb24gPSBtZXNzYWdlLmNhcHRpb24gPyBtZXNzYWdlLmNhcHRpb24gKyBcIlxcblwiIDogJyc7XG4gICAgLy8g5re75Yqg6K+E6K+tXG4gICAgaWYgKGNvbW1lbnQpIHtjYXB0aW9uICs9IGxhbmcuZ2V0KCdjb21tZW50X2xhYmVsJywgeyBjb21tZW50IH0pICsgXCJcXG5cIiB9XG4gICAgLy8g6Iul5piv5a6e5ZCN5oqV56i/77yM5YiZ6ZmE5Yqg54mI5p2D5L+h5oGvXG4gICAgaWYgKG1lc3NhZ2Uuc3ViX3R5cGUgPT0gdmFycy5TVUJfUkVBTCkgeyBjYXB0aW9uICs9IFwiXFxuXCIgKyBsYW5nLmdldFZpYUluZm8obWVzc2FnZSkgfVxuICAgIGlmIChtZXNzYWdlLnRleHQpIHtcbiAgICAgIGNhcHRpb24gPSBtZXNzYWdlLnRleHQgKyBgXFxuXFxuJHtjYXB0aW9ufWA7XG4gICAgfVxuICAgIHJldHVybiBjYXB0aW9uO1xuICB9O1xuICAvKipcbiAgICog6I635Y+Wc2VuZENoYW5uZWznmoRPcHRpb27pop3lpJblj4LmlbBcbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGNhcHRpb24gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gb3B0aW9ucy5jb21tZW50IFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBvcHRpb25zLmlzTXV0ZSAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRPcHRpb25zIChtZXNzYWdlLCBjYXB0aW9uLCBwYXJhbXMpIHtcbiAgICBsZXQgY29tbWVudCA9IHBhcmFtcyA/IHBhcmFtcy5jb21tZW50IDogJyc7XG4gICAgbGV0IGlzTXV0ZSA9IHBhcmFtcyA/IHBhcmFtcy5pc011dGUgOiBmYWxzZTtcbiAgICAvLyDmlK/mj7RtYXJrZG93buWSjOm7mOiupOWFs+mXremTvuaOpemihOiniFxuICAgIGxldCBvcHRpb25zID0ge3BhcnNlX21vZGU6ICdNYXJrZG93bicsIGRpc2FibGVfd2ViX3BhZ2VfcHJldmlldzogdHJ1ZSwgY2FwdGlvbn1cbiAgICAvLyDoi6XmlofmnKzmiJZjb21tZW505ZCr5pyJVVJM77yM5YiZ5byA5ZCv6ZO+5o6l6aKE6KeIXG4gICAgaWYgKGhlbHBlci5oYXNVcmwobWVzc2FnZS50ZXh0KSB8fCBoZWxwZXIuaGFzVXJsKGNvbW1lbnQpKSB7IG9wdGlvbnMuZGlzYWJsZV93ZWJfcGFnZV9wcmV2aWV3ID0gZmFsc2UgfVxuICAgIGlmIChpc011dGUpIHtvcHRpb25zLmRpc2FibGVfbm90aWZpY2F0aW9uID0gdHJ1ZX1cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfTtcbiAgLyoqXG4gICAqIOaOkumZpOS4gOS6m2tlee+8jOW+l+WIsOS4gOS4quaWsOWvueixoVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IG9iaiAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGtleXMgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgd2l0aG91dEtleXMgKG9iaiwga2V5cykge1xuICAgIGxldCBub2JqID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcbiAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgZGVsZXRlIG5vYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIG5vYmpcbiAgfTtcbiAgLyoqXG4gICAqIOWQiOW5tm1lZGlhR3JvdXDmtojmga/kuLrmlrDnmoTmoLzlvI9cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHByb2Nlc3NNZWRpYU1lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICBsZXQgZ3JvdXBNc2cgPSB0aGlzLm9uZSh7bWVkaWFfZ3JvdXBfaWQ6IG1lc3NhZ2UubWVkaWFfZ3JvdXBfaWR9KTtcbiAgICBpZiAoIWdyb3VwTXNnKSB7XG4gICAgICAvLyDmjpLpmaTov5nkupvplK5cbiAgICAgIGdyb3VwTXNnID0gdGhpcy53aXRob3V0S2V5cyhtZXNzYWdlLCBbJ2NhcHRpb24nLCAncGhvdG8nLCAndmlkZW8nLCAnbWVzc2FnZV9pZCddKTtcbiAgICAgIGdyb3VwTXNnLm1lZGlhID0gW107XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOiLpeW3sue7j+WtmOWcqOatpOmhue+8jOWImei/lOWbnlxuICAgICAgbGV0IGlkcyA9IE9iamVjdC5rZXlzKGdyb3VwTXNnLm1lZGlhKS5tYXAoZj0+Z3JvdXBNc2cubWVkaWFbZl0ubWVzc2FnZV9pZCk7XG4gICAgICBpZiAoaWRzLmluY2x1ZGVzKG1lc3NhZ2UubWVzc2FnZV9pZCkpIHsgcmV0dXJuIGdyb3VwTXNnIH1cbiAgICB9XG4gICAgbGV0IG1lZGlhUm93ID0ge307XG4gICAgaWYgKG1lc3NhZ2UucGhvdG8pIHtcbiAgICAgIC8vIOmAieaLqeacgOa4heaZsOeahOmCo+W8oOWbvlxuICAgICAgbWVkaWFSb3cgPSB7IG1lc3NhZ2VfaWQ6IG1lc3NhZ2UubWVzc2FnZV9pZCwgdHlwZTogJ3Bob3RvJywgbWVkaWE6IG1lc3NhZ2UucGhvdG9bbWVzc2FnZS5waG90by5sZW5ndGggLSAxXS5maWxlX2lkIH1cbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudmlkZW8pIHtcbiAgICAgIG1lZGlhUm93ID0geyBtZXNzYWdlX2lkOiBtZXNzYWdlLm1lc3NhZ2VfaWQsIHR5cGU6ICd2aWRlbycsIG1lZGlhOiBtZXNzYWdlLnZpZGVvLmZpbGVfaWQgfVxuICAgIH1cbiAgICBpZiAobWVzc2FnZS5jYXB0aW9uKSB7IFxuICAgICAgbWVkaWFSb3cuY2FwdGlvbiA9IG1lc3NhZ2UuY2FwdGlvbiBcbiAgICB9XG4gICAgbWVkaWFSb3cucGFyc2VfbW9kZSA9ICdNYXJrZG93bic7XG4gICAgZ3JvdXBNc2cubWVkaWEucHVzaChtZWRpYVJvdyk7XG4gICAgLy8g56ys5LiA5Liq5aqS5L2T55qE5o+P6L+w5bCG5L2c5Li656i/5Lu25o+P6L+wXG4gICAgaWYgKGdyb3VwTXNnLm1lZGlhWzBdLmNhcHRpb24pIHtcbiAgICAgIGdyb3VwTXNnLmNhcHRpb24gPSBncm91cE1zZy5tZWRpYVswXS5jYXB0aW9uO1xuICAgIH1cbiAgICB0aGlzLnB1c2hNZWRpYUdyb3VwKGdyb3VwTXNnKTtcbiAgICByZXR1cm4gZ3JvdXBNc2c7XG4gIH07XG4gIC8qKlxuICAgKiDku47lrqHnqL/nvqTnmoTnqL/ku7bmtojmga/lvpfliLDljp/nqL/ku7blr7nosaHnmoTmn6Xor6LmnaHku7ZcbiAgICogQHBhcmFtICB7W3R5cGVdfSBmd2RNc2cg5a6h56i/576k55qE56i/5Lu2XG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRGd2RNc2dDb25kaXRpb24gKGZ3ZE1zZykge1xuICAgIGlmIChmd2RNc2cubWVkaWFfZ3JvdXBfaWQpIHtcbiAgICAgIHJldHVybiB7ZndkTXNnR3JvdXBJZDogZndkTXNnLm1lZGlhX2dyb3VwX2lkfTtcbiAgICB9IGVsc2UgaWYgKGZ3ZE1zZy5tZXNzYWdlX2lkKSB7XG4gICAgICByZXR1cm4ge2Z3ZE1zZ0lkOiBmd2RNc2cubWVzc2FnZV9pZH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdnZXRNc2dGcm9tRndkOiDlvojmirHmrYnvvIxtZXNzYWdl5raI5oGv5qC85byP5LiN5q2j56Gu77yBJyk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICog5LuO56i/5Lu25Lit5b6X5Yiw5Y6f5aeL56i/5Lu255qE5p+l6K+i5p2h5Lu2XG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRNc2dDb25kaXRpb24gKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZS5tZWRpYV9ncm91cF9pZCkge1xuICAgICAgcmV0dXJuIHttZWRpYV9ncm91cF9pZDogbWVzc2FnZS5tZWRpYV9ncm91cF9pZH07XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLm1lc3NhZ2VfaWQpIHtcbiAgICAgIHJldHVybiB7bWVzc2FnZV9pZDogbWVzc2FnZS5tZXNzYWdlX2lkfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2dldE1zZ0Zyb21Gd2Q6IOW+iOaKseatie+8jG1lc3NhZ2Xmtojmga/moLzlvI/kuI3mraPnoa7vvIEnKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiDpgI/ov4fnlKjmiLflm57lpI3nmoTlkb3ku6TmnaXojrflj5bnqL/ku7ZcbiAgICogQHBhcmFtICB7W3R5cGVdfSBmd2RNc2cg5a6h56i/576k5Lit55qE5L+h5oGvXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXRNc2dXaXRoUmVwbHkgKGZ3ZE1zZykge1xuICAgIGlmICghZndkTXNnKSB7cmV0dXJuIGZhbHNlfVxuICAgIGxldCBtZWRpYV9ncm91cF9pZCA9IGZ3ZE1zZy5tZWRpYV9ncm91cF9pZDtcbiAgICBsZXQgbWVzc2FnZV9pZCA9IGZ3ZE1zZy5tZXNzYWdlX2lkO1xuICAgIGxldCBtZXNzYWdlID0gbnVsbDtcbiAgICBpZiAobWVkaWFfZ3JvdXBfaWQpIHtcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLm9uZSh7IGZ3ZE1zZ0dyb3VwSWQ6IG1lZGlhX2dyb3VwX2lkIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gdGhpcy5vbmUoe2Z3ZE1zZ0lkOiBtZXNzYWdlX2lkfSkgfHwgdGhpcy5vbmUoe2FjdGlvbk1zZ0lkOiBtZXNzYWdlX2lkfSlcbiAgICB9XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH07XG4gIC8qKlxuICAgKiDlrprml7bkvJjljJbmjonov4fmnJ/nmoTmlbDmja5cbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBvcHRpbWl6ZSAoKSB7XG4gICAgLy8g6K6h566X5Ye6MTDlpKnliY3nmoTml7bpl7TmiLNcbiAgICBsZXQgdGVuZGF5ID0gaGVscGVyLmdldFRpbWVzdGFtcCgpIC0gKDYwKjYwKjI0KjEwKVxuICAgIGxldCBtc2dzID0gdGhpcy5kYi5nZXQodGhpcy50YWJsZSkuZmlsdGVyKGUgPT4ge1xuICAgICAgcmV0dXJuIGUuZGF0ZSA8IHRlbmRheVxuICAgIH0pLnZhbHVlKCk7XG4gICAgZm9yIChsZXQgZSBvZiBtc2dzKSB7XG4gICAgICB0aGlzLmRlbChlKTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiDkv53lrZjkuIDkuKpNZWRpYUdyb3VwXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZ3JvdXBNc2dcbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHB1c2hNZWRpYUdyb3VwIChncm91cE1zZykge1xuICAgIGxldCBjb25kaXRpb24gPSB7bWVkaWFfZ3JvdXBfaWQ6IGdyb3VwTXNnLm1lZGlhX2dyb3VwX2lkfTtcbiAgICBpZiAoIXRoaXMuaGFzKGNvbmRpdGlvbikpIHsgdGhpcy5hZGQoZ3JvdXBNc2cpIH0gZWxzZSB7IHRoaXMudXBkYXRlKGNvbmRpdGlvbiwgZ3JvdXBNc2cpIH1cbiAgfTtcbiAgLyoqXG4gICAqIOS/neWtmOS4gOS4qk1lc3NhZ2VcbiAgICogQHBhcmFtIHtbdHlwZV19IG1lc3NhZ2UgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgcHVzaCAobWVzc2FnZSkge1xuICAgIGlmICghdGhpcy5oYXMoe21lc3NhZ2VfaWQ6IG1lc3NhZ2UubWVzc2FnZV9pZH0pKSB7XG4gICAgICB0aGlzLmFkZChtZXNzYWdlKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2U7XG4iXX0=