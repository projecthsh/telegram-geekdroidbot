'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _core = require('../core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * (主动)消息发送控制器
 * @type {Array}
 */
exports.default = {
  /**
   * 向用户发送投稿确认信息
   * @param  {Object} message Message
   * @return {[type]}         [description]
   */
  subAsk: function subAsk(message) {
    var yeslabel = message.forward_date ? _core.lang.get('yes_only') : _core.lang.get('yes');
    var inline_keyboard = [[{ text: yeslabel, callback_data: _core.vars.SUB_REAL }]];
    var reply_to_message_id = message.message_id ? message.message_id : message.media[0].message_id;
    var text = _core.lang.get('sub_confirm_tip');
    // 干掉匿名投稿
    //if (!message.forward_date) {
    // 如果是转发的讯息，则投稿者无权选择匿名
    //  inline_keyboard[0].push({ text: lang.get('no'), callback_data: vars.SUB_ANY });
    //} else {
    // 投稿者转发别处的消息，不显示否按钮，并且文案也有所不同
    //  text = lang.get('sub_confirm_tip_fwd');
    //}

    //这是小板取消按钮
    inline_keyboard[0].push({ text: _core.lang.get('sub_button_cancel'), callback_data: _core.vars.SUB_CANCEL });
    //这是大版取消按钮 
    //inline_keyboard.push([{ text: lang.get('sub_button_cancel'), callback_data: vars.SUB_CANCEL }]);
    _core.bot.sendMessage(message.chat.id, text, {
      reply_to_message_id: reply_to_message_id,
      reply_markup: { inline_keyboard: inline_keyboard }
    });
  },

  /**
   * 编辑一条信息
   * @param  {[type]} text    [description]
   * @param  {[type]} params  {message_id, chat_id}
   * @return {[type]}         [description]
   */
  editMessage: function editMessage(text) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _params = (0, _assign2.default)({
      parse_mode: 'Markdown'
    }, params);
    return _core.bot.editMessageText(text, _params);
  },

  /**
   * 编辑当前的消息
   * @param  {[type]} text    [description]
   * @param  {[type]} message [description]
   * @param  {Object} params  [description]
   * @return {[type]}         [description]
   */
  editCurrentMessage: function editCurrentMessage(text, message) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var _params = (0, _assign2.default)({
      chat_id: message.chat.id,
      message_id: message.message_id
    }, params);
    return this.editMessage(text, _params);
  },

  /**
   * 使用现有结构发送消息
   * @param  {[type]} text    [description]
   * @param  {[type]} message [description]
   * @param  {Object} params  [description]
   * @return {[type]}         [description]
   */
  sendCurrentMessage: function sendCurrentMessage(text, message) {
    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return this.sendMessage(message.chat.id, text, params);
  },

  /**
   * 发送消息,默认使用markdown
   * @param  {[type]} chatId [description]
   * @param  {[type]} text   [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  sendMessage: function sendMessage(chatId, text, params) {
    var _params = (0, _assign2.default)({
      parse_mode: 'Markdown'
    }, params);
    return _core.bot.sendMessage(chatId, text, _params);
  },

  /**
   * 将消息转发到审稿群
   * @param  {Object}  reply_to_message Message
   * @param  {String}  type    投稿类型
   * @return {Promise}         成功后返回转发后的Message对象
   * {reply_to_message_id: 审稿群actionMsg应该回复的稿件消息ID，message，稿件}
   */
  forwardMessage: function forwardMessage(reply_to_message, type) {
    var _this = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var condition, message, fwdMsg, respMsg;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              condition = _core.subs.getMsgCondition(reply_to_message);
              message = _core.subs.one(condition);
              fwdMsg = {}, respMsg = {};
              // 若是mediagroup消息

              if (!message.media_group_id) {
                _context.next = 10;
                break;
              }

              _context.next = 6;
              return _core.bot.sendMediaGroup(_core.config.Group, message.media);

            case 6:
              fwdMsg = _context.sent[0];

              // 将审稿群的mediagroupId写到mediaGroup消息的fwdMsgGroupId节点
              respMsg = _core.subs.update(condition, { fwdMsgGroupId: fwdMsg.media_group_id, sub_type: type });
              _context.next = 14;
              break;

            case 10:
              _context.next = 12;
              return _core.bot.forwardMessage(_core.config.Group, message.chat.id, message.message_id);

            case 12:
              fwdMsg = _context.sent;
              // 转发至审稿群
              respMsg = _core.subs.update(condition, { fwdMsgId: fwdMsg.message_id, sub_type: type });

            case 14:
              return _context.abrupt('return', { reply_to_message_id: fwdMsg.message_id, message: respMsg });

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },

  /**
   * 询问管理员如何处理稿件
   * @param  {Object} {reply_to_message_id: 审稿群actionMsg应该回复的稿件消息ID，message，稿件}
   * @return {[type]}         [description]
   */
  askAdmin: function askAdmin(_ref) {
    var _this2 = this;

    var reply_to_message_id = _ref.reply_to_message_id,
        message = _ref.message;
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var condition, text, from, actionMsg;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              condition = _core.subs.getMsgCondition(message);
              text = _core.lang.getAdminAction(message);
              from = message.sub_type == _core.vars.SUB_ANY ? 'anonymous' : 'real';
              _context2.next = 5;
              return _core.bot.sendMessage(_core.config.Group, text, {
                reply_to_message_id: reply_to_message_id,
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                reply_markup: {
                  resize_keyboard: true,
                  inline_keyboard: [[{ text: _core.lang.get('button_receive'), callback_data: 'receive:' + from }]]
                }
              });

            case 5:
              actionMsg = _context2.sent;

              _core.subs.update(condition, { actionMsgId: actionMsg.message_id }); // 更新actionMsgId

            case 7:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }))();
  },


  /**
   * 推送频道消息
   * @param  {[type]} message [description]
   * @param  {[type]} params  comment=评论, isMute=是否静音
   * @return {[type]}         [description]
   */
  sendChannel: function sendChannel(message, params) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var resp, caption, options;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              resp = null;
              caption = _core.subs.getCaption(message, params);
              options = _core.subs.getOptions(message, caption, params);

              if (!message.media_group_id) {
                _context3.next = 10;
                break;
              }

              message.media[0].caption = caption;
              _context3.next = 7;
              return _core.bot.sendMediaGroup(_core.config.Channel, message.media);

            case 7:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 10:
              if (!message.audio) {
                _context3.next = 16;
                break;
              }

              _context3.next = 13;
              return _core.bot.sendAudio(_core.config.Channel, message.audio.file_id, options);

            case 13:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 16:
              if (!message.document) {
                _context3.next = 22;
                break;
              }

              _context3.next = 19;
              return _core.bot.sendDocument(_core.config.Channel, message.document.file_id, options);

            case 19:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 22:
              if (!message.voice) {
                _context3.next = 28;
                break;
              }

              _context3.next = 25;
              return _core.bot.sendVoice(_core.config.Channel, message.voice.file_id, options);

            case 25:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 28:
              if (!message.video) {
                _context3.next = 34;
                break;
              }

              _context3.next = 31;
              return _core.bot.sendVideo(_core.config.Channel, message.video.file_id, options);

            case 31:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 34:
              if (!message.photo) {
                _context3.next = 40;
                break;
              }

              _context3.next = 37;
              return _core.bot.sendPhoto(_core.config.Channel, message.photo[0].file_id, options);

            case 37:
              resp = _context3.sent;
              _context3.next = 43;
              break;

            case 40:
              _context3.next = 42;
              return _core.bot.sendMessage(_core.config.Channel, caption, options);

            case 42:
              resp = _context3.sent;

            case 43:
              return _context3.abrupt('return', resp);

            case 44:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this3);
    }))();
  },

  /**
   * 审核稿件
   * @param  {Object} message             稿件，查询出来的
   * @param  {Object} receive             审稿人对象，一般是message.from
   * @param  {String} comment             附加评论
   * @param  {Boolean} isMute             是否静音推送
   */
  receiveMessage: function receiveMessage(message, receive) {
    var _this4 = this;

    var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var resp, condition, text, reply_to_message_id;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!message.receive_date) {
                _context4.next = 2;
                break;
              }

              return _context4.abrupt('return', _core.bot.sendMessage(_core.config.Group, _core.lang.get('err_repeat'), {
                reply_to_message_id: message.fwdMsgId
              }));

            case 2:
              if (_core.helper.isMute()) {
                params.isMute = true;
              }
              _context4.next = 5;
              return _this4.sendChannel(message, params);

            case 5:
              resp = _context4.sent;
              condition = _core.subs.getMsgCondition(message);
              // 记录审稿人和时间

              message = _core.subs.update(condition, { receive: receive, receive_date: _core.helper.getTimestamp(), receive_params: params });
              // 获取审稿群通过审核文案
              text = _core.lang.getAdminActionFinish(message);
              // 编辑审稿群actionMsg

              _context4.next = 11;
              return _this4.editMessage(text, { chat_id: _core.config.Group, message_id: message.actionMsgId, disable_web_page_preview: true });

            case 11:
              reply_to_message_id = _core.subs.getReplytoMessageId(message);
              // 向用户发送稿件过审信息

              _context4.next = 14;
              return _core.bot.sendMessage(message.chat.id, _core.lang.get('sub_finish_tip'), { reply_to_message_id: reply_to_message_id });

            case 14:
              return _context4.abrupt('return', resp);

            case 15:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this4);
    }))();
  },

  /**
   * 拒绝投稿
   * @param  {[type]} message [description]
   * @param  {Object} reject  是谁操作的
   * @param  {String} reason  理由
   * @return {[type]}         [description]
   */
  rejectMessage: function rejectMessage(message, reject, reason) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var condition, rejectText, text, reply_to_message_id;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!message.reject_date) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt('return', _core.bot.sendMessage(_core.config.Group, _core.lang.get('err_repeat_reject'), {
                reply_to_message_id: message.fwdMsgId
              }));

            case 2:
              condition = _core.subs.getMsgCondition(message);
              // 记录操作人和拒绝理由及时间

              message = _core.subs.update(condition, { reject: reject, reject_date: _core.helper.getTimestamp(), reject_reason: reason });
              rejectText = _core.lang.get('reject_tips', { reason: reason });
              // 获取审稿群拒绝审核文案

              text = _core.lang.getAdminActionReject(message, reason);
              // 编辑审稿群actionMsg

              reply_to_message_id = _core.subs.getReplytoMessageId(message);
              _context5.next = 9;
              return _this5.editMessage(text, { chat_id: _core.config.Group, message_id: message.actionMsgId, disable_web_page_preview: true });

            case 9:
              _context5.next = 11;
              return _core.bot.sendMessage(message.chat.id, rejectText, { reply_to_message_id: reply_to_message_id, parse_mode: 'Markdown' });

            case 11:
              return _context5.abrupt('return', message);

            case 12:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this5);
    }))();
  },

  /**
   * 回复用户消息，同时用户将进入聊天状态
   * 用户可透过KeyboardButton退出聊天，管理员可透过/endre 结束会话
   * @param  {[type]} message 稿件
   * @param  {String} comment  管理员回复给用户的消息
   * @return {[type]}         [description]
   */
  replyMessage: function replyMessage(message, comment) {
    var _this6 = this;

    var reMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!reMode) {
                _context6.next = 3;
                break;
              }

              _context6.next = 3;
              return _core.re.start(message);

            case 3:
              _context6.next = 5;
              return _this6.sendCurrentMessage(_core.lang.get('re_comment', { comment: comment }), message);

            case 5:
              return _context6.abrupt('return', true);

            case 6:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this6);
    }))();
  },

  /**
   * 回复用户信息
   * @param  {[type]} options.msg    [description]
   * @param  {[type]} options.match  [description]
   * @param  {[type]} options.rep    [description]
   * @param  {[type]} options.repMsg [description]
   * @param  {String} command        /re 或者 /echo 
   * re 会进入会话状态， echo 只是发送，不进入会话
   * @return {[type]}                [description]
   */
  replyMessageWithCommand: function replyMessageWithCommand(_ref2) {
    var _this7 = this;

    var msg = _ref2.msg,
        match = _ref2.match,
        rep = _ref2.rep,
        repMsg = _ref2.repMsg;
    var command = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/re';
    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var comment, message, chatMode, respMsg;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!_core.helper.isPrivate(msg)) {
                _context7.next = 2;
                break;
              }

              return _context7.abrupt('return', false);

            case 2:
              comment = match[1];

              if (comment) {
                _context7.next = 5;
                break;
              }

              throw { message: _core.lang.get('admin_reply_err', { command: command }) };

            case 5:
              // 没有输入消息
              message = _core.subs.getMsgWithReply(repMsg);

              if (!(!message && !repMsg.forward_from)) {
                _context7.next = 8;
                break;
              }

              return _context7.abrupt('return', false);

            case 8:
              // 无从回复
              if (!message) {
                message = { chat: repMsg.forward_from, from: repMsg.forward_from };
              }
              chatMode = command == '/re' ? true : false;
              _context7.next = 12;
              return _this7.replyMessage(message, comment, chatMode);

            case 12:
              _context7.next = 14;
              return rep(_core.lang.get('re_send_success'));

            case 14:
              respMsg = _context7.sent;
              _context7.next = 17;
              return _core.helper.sleep(1000);

            case 17:
              _this7.editCurrentMessage("...", respMsg);
              _context7.next = 20;
              return _core.helper.sleep(2000);

            case 20:
              _core.bot.deleteMessage(respMsg.chat.id, respMsg.message_id);

            case 21:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this7);
    }))();
  },

  /**
   * 管理员点击采纳稿件(从actionMsg点击按钮)
   * @param  {Object}  query callback data
   * @return {Promise}       [description]
   */
  receive: function receive(query) {
    var _this8 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var fwdMsg, condition, message;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              fwdMsg = query.message.reply_to_message; // 审稿群的稿件

              condition = _core.subs.getFwdMsgCondition(fwdMsg); // 得到查询条件

              message = _core.subs.one(condition); // 得到真实稿件

              _this8.receiveMessage(message, query.from);

            case 4:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, _this8);
    }))();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVyL21zZ0NvbnRyb2wuanMiXSwibmFtZXMiOlsic3ViQXNrIiwibWVzc2FnZSIsInllc2xhYmVsIiwiZm9yd2FyZF9kYXRlIiwibGFuZyIsImdldCIsImlubGluZV9rZXlib2FyZCIsInRleHQiLCJjYWxsYmFja19kYXRhIiwidmFycyIsIlNVQl9SRUFMIiwicmVwbHlfdG9fbWVzc2FnZV9pZCIsIm1lc3NhZ2VfaWQiLCJtZWRpYSIsInB1c2giLCJTVUJfQ0FOQ0VMIiwiYm90Iiwic2VuZE1lc3NhZ2UiLCJjaGF0IiwiaWQiLCJyZXBseV9tYXJrdXAiLCJlZGl0TWVzc2FnZSIsInBhcmFtcyIsIl9wYXJhbXMiLCJwYXJzZV9tb2RlIiwiZWRpdE1lc3NhZ2VUZXh0IiwiZWRpdEN1cnJlbnRNZXNzYWdlIiwiY2hhdF9pZCIsInNlbmRDdXJyZW50TWVzc2FnZSIsImNoYXRJZCIsImZvcndhcmRNZXNzYWdlIiwicmVwbHlfdG9fbWVzc2FnZSIsInR5cGUiLCJjb25kaXRpb24iLCJzdWJzIiwiZ2V0TXNnQ29uZGl0aW9uIiwib25lIiwiZndkTXNnIiwicmVzcE1zZyIsIm1lZGlhX2dyb3VwX2lkIiwic2VuZE1lZGlhR3JvdXAiLCJjb25maWciLCJHcm91cCIsInVwZGF0ZSIsImZ3ZE1zZ0dyb3VwSWQiLCJzdWJfdHlwZSIsImZ3ZE1zZ0lkIiwiYXNrQWRtaW4iLCJnZXRBZG1pbkFjdGlvbiIsImZyb20iLCJTVUJfQU5ZIiwiZGlzYWJsZV93ZWJfcGFnZV9wcmV2aWV3IiwicmVzaXplX2tleWJvYXJkIiwiYWN0aW9uTXNnIiwiYWN0aW9uTXNnSWQiLCJzZW5kQ2hhbm5lbCIsInJlc3AiLCJjYXB0aW9uIiwiZ2V0Q2FwdGlvbiIsIm9wdGlvbnMiLCJnZXRPcHRpb25zIiwiQ2hhbm5lbCIsImF1ZGlvIiwic2VuZEF1ZGlvIiwiZmlsZV9pZCIsImRvY3VtZW50Iiwic2VuZERvY3VtZW50Iiwidm9pY2UiLCJzZW5kVm9pY2UiLCJ2aWRlbyIsInNlbmRWaWRlbyIsInBob3RvIiwic2VuZFBob3RvIiwicmVjZWl2ZU1lc3NhZ2UiLCJyZWNlaXZlIiwicmVjZWl2ZV9kYXRlIiwiaGVscGVyIiwiaXNNdXRlIiwiZ2V0VGltZXN0YW1wIiwicmVjZWl2ZV9wYXJhbXMiLCJnZXRBZG1pbkFjdGlvbkZpbmlzaCIsImdldFJlcGx5dG9NZXNzYWdlSWQiLCJyZWplY3RNZXNzYWdlIiwicmVqZWN0IiwicmVhc29uIiwicmVqZWN0X2RhdGUiLCJyZWplY3RfcmVhc29uIiwicmVqZWN0VGV4dCIsImdldEFkbWluQWN0aW9uUmVqZWN0IiwicmVwbHlNZXNzYWdlIiwiY29tbWVudCIsInJlTW9kZSIsInJlIiwic3RhcnQiLCJyZXBseU1lc3NhZ2VXaXRoQ29tbWFuZCIsIm1zZyIsIm1hdGNoIiwicmVwIiwicmVwTXNnIiwiY29tbWFuZCIsImlzUHJpdmF0ZSIsImdldE1zZ1dpdGhSZXBseSIsImZvcndhcmRfZnJvbSIsImNoYXRNb2RlIiwic2xlZXAiLCJkZWxldGVNZXNzYWdlIiwicXVlcnkiLCJnZXRGd2RNc2dDb25kaXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7a0JBS0E7QUFDRTs7Ozs7QUFLQUEsUUFORixrQkFNVUMsT0FOVixFQU1tQjtBQUNmLFFBQUlDLFdBQVdELFFBQVFFLFlBQVIsR0FBdUJDLFdBQUtDLEdBQUwsQ0FBUyxVQUFULENBQXZCLEdBQThDRCxXQUFLQyxHQUFMLENBQVMsS0FBVCxDQUE3RDtBQUNBLFFBQUlDLGtCQUFrQixDQUFDLENBQUMsRUFBQ0MsTUFBTUwsUUFBUCxFQUFpQk0sZUFBZUMsV0FBS0MsUUFBckMsRUFBRCxDQUFELENBQXRCO0FBQ0EsUUFBSUMsc0JBQXVCVixRQUFRVyxVQUFULEdBQXVCWCxRQUFRVyxVQUEvQixHQUE0Q1gsUUFBUVksS0FBUixDQUFjLENBQWQsRUFBaUJELFVBQXZGO0FBQ0EsUUFBSUwsT0FBT0gsV0FBS0MsR0FBTCxDQUFTLGlCQUFULENBQVg7QUFD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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWM1RSxHQWxQSDs7QUFtUEU7Ozs7O0FBS004RCxTQXhQUixtQkF3UGlCZ0MsS0F4UGpCLEVBd1B3QjtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNoQnJFLG9CQURnQixHQUNQcUUsTUFBTXpHLE9BQU4sQ0FBYzhCLGdCQURQLEVBQ3dCOztBQUN4Q0UsdUJBRmdCLEdBRUpDLFdBQUt5RSxrQkFBTCxDQUF3QnRFLE1BQXhCLENBRkksRUFFNEI7O0FBQzVDcEMscUJBSGdCLEdBR05pQyxXQUFLRSxHQUFMLENBQVNILFNBQVQsQ0FITSxFQUdjOztBQUNsQyxxQkFBS3dDLGNBQUwsQ0FBb0J4RSxPQUFwQixFQUE2QnlHLE1BQU16RCxJQUFuQzs7QUFKb0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLckI7QUE3UEgsQyIsImZpbGUiOiJtc2dDb250cm9sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25maWcsIGJvdCwgdmFycywgbGFuZywgc3VicywgaGVscGVyLCByZX0gZnJvbSAnLi4vY29yZSc7XG5cbi8qKlxuICogKOS4u+WKqCnmtojmga/lj5HpgIHmjqfliLblmahcbiAqIEB0eXBlIHtBcnJheX1cbiAqL1xuZXhwb3J0IGRlZmF1bHRcbntcbiAgLyoqXG4gICAqIOWQkeeUqOaIt+WPkemAgeaKleeov+ehruiupOS/oeaBr1xuICAgKiBAcGFyYW0gIHtPYmplY3R9IG1lc3NhZ2UgTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc3ViQXNrIChtZXNzYWdlKSB7XG4gICAgbGV0IHllc2xhYmVsID0gbWVzc2FnZS5mb3J3YXJkX2RhdGUgPyBsYW5nLmdldCgneWVzX29ubHknKSA6IGxhbmcuZ2V0KCd5ZXMnKTtcbiAgICBsZXQgaW5saW5lX2tleWJvYXJkID0gW1t7dGV4dDogeWVzbGFiZWwsIGNhbGxiYWNrX2RhdGE6IHZhcnMuU1VCX1JFQUx9XV07XG4gICAgbGV0IHJlcGx5X3RvX21lc3NhZ2VfaWQgPSAobWVzc2FnZS5tZXNzYWdlX2lkKSA/IG1lc3NhZ2UubWVzc2FnZV9pZCA6IG1lc3NhZ2UubWVkaWFbMF0ubWVzc2FnZV9pZDtcbiAgICBsZXQgdGV4dCA9IGxhbmcuZ2V0KCdzdWJfY29uZmlybV90aXAnKTtcbiAgICAvLyDlubLmjonljL/lkI3mipXnqL9cbiAgICAvL2lmICghbWVzc2FnZS5mb3J3YXJkX2RhdGUpIHtcbiAgICAgIC8vIOWmguaenOaYr+i9rOWPkeeahOiur+aBr++8jOWImeaKleeov+iAheaXoOadg+mAieaLqeWMv+WQjVxuICAgIC8vICBpbmxpbmVfa2V5Ym9hcmRbMF0ucHVzaCh7IHRleHQ6IGxhbmcuZ2V0KCdubycpLCBjYWxsYmFja19kYXRhOiB2YXJzLlNVQl9BTlkgfSk7XG4gICAgLy99IGVsc2Uge1xuICAgICAgLy8g5oqV56i/6ICF6L2s5Y+R5Yir5aSE55qE5raI5oGv77yM5LiN5pi+56S65ZCm5oyJ6ZKu77yM5bm25LiU5paH5qGI5Lmf5pyJ5omA5LiN5ZCMXG4gICAgLy8gIHRleHQgPSBsYW5nLmdldCgnc3ViX2NvbmZpcm1fdGlwX2Z3ZCcpO1xuICAgIC8vfVxuICAgIFxuICAgIC8v6L+Z5piv5bCP5p2/5Y+W5raI5oyJ6ZKuXG4gICAgaW5saW5lX2tleWJvYXJkWzBdLnB1c2goeyB0ZXh0OiBsYW5nLmdldCgnc3ViX2J1dHRvbl9jYW5jZWwnKSwgY2FsbGJhY2tfZGF0YTogdmFycy5TVUJfQ0FOQ0VMIH0pO1xuICAgIC8v6L+Z5piv5aSn54mI5Y+W5raI5oyJ6ZKuIFxuICAgIC8vaW5saW5lX2tleWJvYXJkLnB1c2goW3sgdGV4dDogbGFuZy5nZXQoJ3N1Yl9idXR0b25fY2FuY2VsJyksIGNhbGxiYWNrX2RhdGE6IHZhcnMuU1VCX0NBTkNFTCB9XSk7XG4gICAgYm90LnNlbmRNZXNzYWdlKG1lc3NhZ2UuY2hhdC5pZCwgdGV4dCwge1xuICAgICAgcmVwbHlfdG9fbWVzc2FnZV9pZCxcbiAgICAgIHJlcGx5X21hcmt1cDogeyBpbmxpbmVfa2V5Ym9hcmQgfVxuICAgIH0pXG4gIH0sXG4gIC8qKlxuICAgKiDnvJbovpHkuIDmnaHkv6Hmga9cbiAgICogQHBhcmFtICB7W3R5cGVdfSB0ZXh0ICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgIHttZXNzYWdlX2lkLCBjaGF0X2lkfVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgZWRpdE1lc3NhZ2UgKHRleHQsIHBhcmFtcyA9IHt9KSB7XG4gICAgbGV0IF9wYXJhbXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHBhcnNlX21vZGU6ICdNYXJrZG93bicsXG4gICAgfSwgcGFyYW1zKVxuICAgIHJldHVybiBib3QuZWRpdE1lc3NhZ2VUZXh0KHRleHQsIF9wYXJhbXMpO1xuICB9LFxuICAvKipcbiAgICog57yW6L6R5b2T5YmN55qE5raI5oGvXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gdGV4dCAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gbWVzc2FnZSBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge09iamVjdH0gcGFyYW1zICBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBlZGl0Q3VycmVudE1lc3NhZ2UgKHRleHQsIG1lc3NhZ2UsIHBhcmFtcyA9IHt9KSB7XG4gICAgbGV0IF9wYXJhbXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGNoYXRfaWQ6IG1lc3NhZ2UuY2hhdC5pZCxcbiAgICAgIG1lc3NhZ2VfaWQ6IG1lc3NhZ2UubWVzc2FnZV9pZFxuICAgIH0sIHBhcmFtcyk7XG4gICAgcmV0dXJuIHRoaXMuZWRpdE1lc3NhZ2UodGV4dCwgX3BhcmFtcyk7XG4gIH0sXG4gIC8qKlxuICAgKiDkvb/nlKjnjrDmnInnu5PmnoTlj5HpgIHmtojmga9cbiAgICogQHBhcmFtICB7W3R5cGVdfSB0ZXh0ICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSBwYXJhbXMgIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIHNlbmRDdXJyZW50TWVzc2FnZSAodGV4dCwgbWVzc2FnZSwgcGFyYW1zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kTWVzc2FnZShtZXNzYWdlLmNoYXQuaWQsIHRleHQsIHBhcmFtcyk7XG4gIH0sXG4gIC8qKlxuICAgKiDlj5HpgIHmtojmga8s6buY6K6k5L2/55SobWFya2Rvd25cbiAgICogQHBhcmFtICB7W3R5cGVdfSBjaGF0SWQgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IHRleHQgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gcGFyYW1zIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgc2VuZE1lc3NhZ2UgKGNoYXRJZCwgdGV4dCwgcGFyYW1zKSB7XG4gICAgbGV0IF9wYXJhbXMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHBhcnNlX21vZGU6ICdNYXJrZG93bicsXG4gICAgfSwgcGFyYW1zKVxuICAgIHJldHVybiBib3Quc2VuZE1lc3NhZ2UoY2hhdElkLCB0ZXh0LCBfcGFyYW1zKTtcbiAgfSxcbiAgLyoqXG4gICAqIOWwhua2iOaBr+i9rOWPkeWIsOWuoeeov+e+pFxuICAgKiBAcGFyYW0gIHtPYmplY3R9ICByZXBseV90b19tZXNzYWdlIE1lc3NhZ2VcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgdHlwZSAgICDmipXnqL/nsbvlnotcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICDmiJDlip/lkI7ov5Tlm57ovazlj5HlkI7nmoRNZXNzYWdl5a+56LGhXG4gICAqIHtyZXBseV90b19tZXNzYWdlX2lkOiDlrqHnqL/nvqRhY3Rpb25Nc2flupTor6Xlm57lpI3nmoTnqL/ku7bmtojmga9JRO+8jG1lc3NhZ2XvvIznqL/ku7Z9XG4gICAqL1xuICBhc3luYyBmb3J3YXJkTWVzc2FnZSAocmVwbHlfdG9fbWVzc2FnZSwgdHlwZSkge1xuICAgIGxldCBjb25kaXRpb24gPSBzdWJzLmdldE1zZ0NvbmRpdGlvbihyZXBseV90b19tZXNzYWdlKTtcbiAgICBsZXQgbWVzc2FnZSA9IHN1YnMub25lKGNvbmRpdGlvbik7XG4gICAgbGV0IGZ3ZE1zZyA9IHt9LCByZXNwTXNnID0ge307XG4gICAgLy8g6Iul5pivbWVkaWFncm91cOa2iOaBr1xuICAgIGlmIChtZXNzYWdlLm1lZGlhX2dyb3VwX2lkKSB7XG4gICAgICBmd2RNc2cgPSAoYXdhaXQgYm90LnNlbmRNZWRpYUdyb3VwKGNvbmZpZy5Hcm91cCwgbWVzc2FnZS5tZWRpYSkpWzBdO1xuICAgICAgLy8g5bCG5a6h56i/576k55qEbWVkaWFncm91cElk5YaZ5YiwbWVkaWFHcm91cOa2iOaBr+eahGZ3ZE1zZ0dyb3VwSWToioLngrlcbiAgICAgIHJlc3BNc2cgPSBzdWJzLnVwZGF0ZShjb25kaXRpb24sIHtmd2RNc2dHcm91cElkOiBmd2RNc2cubWVkaWFfZ3JvdXBfaWQsIHN1Yl90eXBlOiB0eXBlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOmZhOWKoOWuoeeov+e+pOeahOa2iOaBr0lE5Yiw56i/5Lu2XG4gICAgICBmd2RNc2cgPSBhd2FpdCBib3QuZm9yd2FyZE1lc3NhZ2UoY29uZmlnLkdyb3VwLCBtZXNzYWdlLmNoYXQuaWQsIG1lc3NhZ2UubWVzc2FnZV9pZCk7Ly8g6L2s5Y+R6Iez5a6h56i/576kXG4gICAgICByZXNwTXNnID0gc3Vicy51cGRhdGUoY29uZGl0aW9uLCB7ZndkTXNnSWQ6IGZ3ZE1zZy5tZXNzYWdlX2lkLCBzdWJfdHlwZTogdHlwZX0pO1xuICAgIH1cbiAgICByZXR1cm4ge3JlcGx5X3RvX21lc3NhZ2VfaWQ6IGZ3ZE1zZy5tZXNzYWdlX2lkLCBtZXNzYWdlOiByZXNwTXNnfTtcbiAgfSxcbiAgLyoqXG4gICAqIOivoumXrueuoeeQhuWRmOWmguS9leWkhOeQhueov+S7tlxuICAgKiBAcGFyYW0gIHtPYmplY3R9IHtyZXBseV90b19tZXNzYWdlX2lkOiDlrqHnqL/nvqRhY3Rpb25Nc2flupTor6Xlm57lpI3nmoTnqL/ku7bmtojmga9JRO+8jG1lc3NhZ2XvvIznqL/ku7Z9XG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhc3luYyBhc2tBZG1pbiAoe3JlcGx5X3RvX21lc3NhZ2VfaWQsIG1lc3NhZ2V9KSB7XG4gICAgbGV0IGNvbmRpdGlvbiA9IHN1YnMuZ2V0TXNnQ29uZGl0aW9uKG1lc3NhZ2UpO1xuICAgIGxldCB0ZXh0ID0gbGFuZy5nZXRBZG1pbkFjdGlvbihtZXNzYWdlKTtcbiAgICBsZXQgZnJvbSA9IG1lc3NhZ2Uuc3ViX3R5cGUgPT0gdmFycy5TVUJfQU5ZID8gJ2Fub255bW91cycgOiAncmVhbCc7XG4gICAgbGV0IGFjdGlvbk1zZyA9IGF3YWl0IGJvdC5zZW5kTWVzc2FnZShjb25maWcuR3JvdXAsIHRleHQsIHtcbiAgICAgIHJlcGx5X3RvX21lc3NhZ2VfaWQsXG4gICAgICBwYXJzZV9tb2RlOiAnTWFya2Rvd24nLFxuICAgICAgZGlzYWJsZV93ZWJfcGFnZV9wcmV2aWV3OiB0cnVlLFxuICAgICAgcmVwbHlfbWFya3VwOiB7XG4gICAgICAgIHJlc2l6ZV9rZXlib2FyZDogdHJ1ZSxcbiAgICAgICAgaW5saW5lX2tleWJvYXJkOiBbW3t0ZXh0OiBsYW5nLmdldCgnYnV0dG9uX3JlY2VpdmUnKSwgY2FsbGJhY2tfZGF0YTogYHJlY2VpdmU6JHtmcm9tfWB9XV1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBzdWJzLnVwZGF0ZShjb25kaXRpb24sIHthY3Rpb25Nc2dJZDogYWN0aW9uTXNnLm1lc3NhZ2VfaWR9KTsvLyDmm7TmlrBhY3Rpb25Nc2dJZFxuICB9LFxuXG4gIC8qKlxuICAgKiDmjqjpgIHpopHpgZPmtojmga9cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBwYXJhbXMgIGNvbW1lbnQ96K+E6K66LCBpc011dGU95piv5ZCm6Z2Z6Z+zXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhc3luYyBzZW5kQ2hhbm5lbCAobWVzc2FnZSwgcGFyYW1zKSB7XG4gICAgbGV0IHJlc3AgPSBudWxsO1xuICAgIGxldCBjYXB0aW9uID0gc3Vicy5nZXRDYXB0aW9uKG1lc3NhZ2UsIHBhcmFtcyk7XG4gICAgbGV0IG9wdGlvbnMgPSBzdWJzLmdldE9wdGlvbnMobWVzc2FnZSwgY2FwdGlvbiwgcGFyYW1zKTtcbiAgICBpZiAobWVzc2FnZS5tZWRpYV9ncm91cF9pZCkge1xuICAgICAgbWVzc2FnZS5tZWRpYVswXS5jYXB0aW9uID0gY2FwdGlvbjtcbiAgICAgIHJlc3AgPSBhd2FpdCBib3Quc2VuZE1lZGlhR3JvdXAoY29uZmlnLkNoYW5uZWwsIG1lc3NhZ2UubWVkaWEpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS5hdWRpbykge1xuICAgICAgcmVzcCA9IGF3YWl0IGJvdC5zZW5kQXVkaW8oY29uZmlnLkNoYW5uZWwsIG1lc3NhZ2UuYXVkaW8uZmlsZV9pZCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmRvY3VtZW50KSB7XG4gICAgICByZXNwID0gYXdhaXQgYm90LnNlbmREb2N1bWVudChjb25maWcuQ2hhbm5lbCwgbWVzc2FnZS5kb2N1bWVudC5maWxlX2lkLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2Uudm9pY2UpIHtcbiAgICAgIHJlc3AgPSBhd2FpdCBib3Quc2VuZFZvaWNlKGNvbmZpZy5DaGFubmVsLCBtZXNzYWdlLnZvaWNlLmZpbGVfaWQsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS52aWRlbykge1xuICAgICAgcmVzcCA9IGF3YWl0IGJvdC5zZW5kVmlkZW8oY29uZmlnLkNoYW5uZWwsIG1lc3NhZ2UudmlkZW8uZmlsZV9pZCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLnBob3RvKSB7XG4gICAgICByZXNwID0gYXdhaXQgYm90LnNlbmRQaG90byhjb25maWcuQ2hhbm5lbCwgbWVzc2FnZS5waG90b1swXS5maWxlX2lkLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcCA9IGF3YWl0IGJvdC5zZW5kTWVzc2FnZShjb25maWcuQ2hhbm5lbCwgY2FwdGlvbiwgb3B0aW9ucykgXG4gICAgfVxuICAgIHJldHVybiByZXNwO1xuICB9LFxuICAvKipcbiAgICog5a6h5qC456i/5Lu2XG4gICAqIEBwYXJhbSAge09iamVjdH0gbWVzc2FnZSAgICAgICAgICAgICDnqL/ku7bvvIzmn6Xor6Llh7rmnaXnmoRcbiAgICogQHBhcmFtICB7T2JqZWN0fSByZWNlaXZlICAgICAgICAgICAgIOWuoeeov+S6uuWvueixoe+8jOS4gOiIrOaYr21lc3NhZ2UuZnJvbVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGNvbW1lbnQgICAgICAgICAgICAg6ZmE5Yqg6K+E6K66XG4gICAqIEBwYXJhbSAge0Jvb2xlYW59IGlzTXV0ZSAgICAgICAgICAgICDmmK/lkKbpnZnpn7PmjqjpgIFcbiAgICovXG4gIGFzeW5jIHJlY2VpdmVNZXNzYWdlIChtZXNzYWdlLCByZWNlaXZlLCBwYXJhbXMgPSB7fSkge1xuICAgIC8vIOiLpeeov+S7tuW3sue7j+WPkeW4g++8jOWImemps+WbnuaTjeS9nFxuICAgIGlmIChtZXNzYWdlLnJlY2VpdmVfZGF0ZSkgeyBcbiAgICAgIHJldHVybiBib3Quc2VuZE1lc3NhZ2UoY29uZmlnLkdyb3VwLCBsYW5nLmdldCgnZXJyX3JlcGVhdCcpLCB7XG4gICAgICAgIHJlcGx5X3RvX21lc3NhZ2VfaWQ6IG1lc3NhZ2UuZndkTXNnSWRcbiAgICAgIH0pIFxuICAgIH1cbiAgICBpZiAoaGVscGVyLmlzTXV0ZSgpKSB7cGFyYW1zLmlzTXV0ZSA9IHRydWV9XG4gICAgbGV0IHJlc3AgPSBhd2FpdCB0aGlzLnNlbmRDaGFubmVsKG1lc3NhZ2UsIHBhcmFtcyk7XG4gICAgbGV0IGNvbmRpdGlvbiA9IHN1YnMuZ2V0TXNnQ29uZGl0aW9uKG1lc3NhZ2UpO1xuICAgIC8vIOiusOW9leWuoeeov+S6uuWSjOaXtumXtFxuICAgIG1lc3NhZ2UgPSBzdWJzLnVwZGF0ZShjb25kaXRpb24sIHsgcmVjZWl2ZSwgcmVjZWl2ZV9kYXRlOiBoZWxwZXIuZ2V0VGltZXN0YW1wKCksIHJlY2VpdmVfcGFyYW1zOiBwYXJhbXMgfSlcbiAgICAvLyDojrflj5blrqHnqL/nvqTpgJrov4flrqHmoLjmlofmoYhcbiAgICBsZXQgdGV4dCA9IGxhbmcuZ2V0QWRtaW5BY3Rpb25GaW5pc2gobWVzc2FnZSk7XG4gICAgLy8g57yW6L6R5a6h56i/576kYWN0aW9uTXNnXG4gICAgYXdhaXQgdGhpcy5lZGl0TWVzc2FnZSh0ZXh0LCB7Y2hhdF9pZDogY29uZmlnLkdyb3VwLCBtZXNzYWdlX2lkOiBtZXNzYWdlLmFjdGlvbk1zZ0lkLCBkaXNhYmxlX3dlYl9wYWdlX3ByZXZpZXc6IHRydWV9KTtcbiAgICBsZXQgcmVwbHlfdG9fbWVzc2FnZV9pZCA9IHN1YnMuZ2V0UmVwbHl0b01lc3NhZ2VJZChtZXNzYWdlKTtcbiAgICAvLyDlkJHnlKjmiLflj5HpgIHnqL/ku7bov4flrqHkv6Hmga9cbiAgICBhd2FpdCBib3Quc2VuZE1lc3NhZ2UobWVzc2FnZS5jaGF0LmlkLCBsYW5nLmdldCgnc3ViX2ZpbmlzaF90aXAnKSwgeyByZXBseV90b19tZXNzYWdlX2lkIH0pXG4gICAgcmV0dXJuIHJlc3A7XG4gIH0sXG4gIC8qKlxuICAgKiDmi5Lnu53mipXnqL9cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7T2JqZWN0fSByZWplY3QgIOaYr+iwgeaTjeS9nOeahFxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlYXNvbiAg55CG55SxXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhc3luYyByZWplY3RNZXNzYWdlIChtZXNzYWdlLCByZWplY3QsIHJlYXNvbikge1xuICAgIC8vIOiLpeeov+S7tuW3sue7j+aLkue7ne+8jOWImemps+WbnlxuICAgIGlmIChtZXNzYWdlLnJlamVjdF9kYXRlKSB7IFxuICAgICAgcmV0dXJuIGJvdC5zZW5kTWVzc2FnZShjb25maWcuR3JvdXAsIGxhbmcuZ2V0KCdlcnJfcmVwZWF0X3JlamVjdCcpLCB7XG4gICAgICAgIHJlcGx5X3RvX21lc3NhZ2VfaWQ6IG1lc3NhZ2UuZndkTXNnSWRcbiAgICAgIH0pIFxuICAgIH1cbiAgICBsZXQgY29uZGl0aW9uID0gc3Vicy5nZXRNc2dDb25kaXRpb24obWVzc2FnZSk7XG4gICAgLy8g6K6w5b2V5pON5L2c5Lq65ZKM5ouS57ud55CG55Sx5Y+K5pe26Ze0XG4gICAgbWVzc2FnZSA9IHN1YnMudXBkYXRlKGNvbmRpdGlvbiwgeyByZWplY3QsIHJlamVjdF9kYXRlOiBoZWxwZXIuZ2V0VGltZXN0YW1wKCksIHJlamVjdF9yZWFzb246IHJlYXNvbiB9KVxuICAgIGxldCByZWplY3RUZXh0ID0gbGFuZy5nZXQoJ3JlamVjdF90aXBzJywgeyByZWFzb24gfSk7XG4gICAgLy8g6I635Y+W5a6h56i/576k5ouS57ud5a6h5qC45paH5qGIXG4gICAgbGV0IHRleHQgPSBsYW5nLmdldEFkbWluQWN0aW9uUmVqZWN0KG1lc3NhZ2UsIHJlYXNvbik7XG4gICAgLy8g57yW6L6R5a6h56i/576kYWN0aW9uTXNnXG4gICAgbGV0IHJlcGx5X3RvX21lc3NhZ2VfaWQgPSBzdWJzLmdldFJlcGx5dG9NZXNzYWdlSWQobWVzc2FnZSk7XG4gICAgYXdhaXQgdGhpcy5lZGl0TWVzc2FnZSh0ZXh0LCB7Y2hhdF9pZDogY29uZmlnLkdyb3VwLCBtZXNzYWdlX2lkOiBtZXNzYWdlLmFjdGlvbk1zZ0lkLCBkaXNhYmxlX3dlYl9wYWdlX3ByZXZpZXc6IHRydWV9KVxuICAgIGF3YWl0IGJvdC5zZW5kTWVzc2FnZShtZXNzYWdlLmNoYXQuaWQsIHJlamVjdFRleHQsIHsgcmVwbHlfdG9fbWVzc2FnZV9pZCwgcGFyc2VfbW9kZTogJ01hcmtkb3duJyB9KTtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfSxcbiAgLyoqXG4gICAqIOWbnuWkjeeUqOaIt+a2iOaBr++8jOWQjOaXtueUqOaIt+Wwhui/m+WFpeiBiuWkqeeKtuaAgVxuICAgKiDnlKjmiLflj6/pgI/ov4dLZXlib2FyZEJ1dHRvbumAgOWHuuiBiuWkqe+8jOeuoeeQhuWRmOWPr+mAj+i/hy9lbmRyZSDnu5PmnZ/kvJror51cbiAgICogQHBhcmFtICB7W3R5cGVdfSBtZXNzYWdlIOeov+S7tlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGNvbW1lbnQgIOeuoeeQhuWRmOWbnuWkjee7meeUqOaIt+eahOa2iOaBr1xuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgYXN5bmMgcmVwbHlNZXNzYWdlIChtZXNzYWdlLCBjb21tZW50LCByZU1vZGUgPSB0cnVlKSB7XG4gICAgaWYgKHJlTW9kZSkge1xuICAgICAgYXdhaXQgcmUuc3RhcnQobWVzc2FnZSk7Ly8g6L+b5YWl5Lya6K+d5qih5byPXG4gICAgfVxuICAgIGF3YWl0IHRoaXMuc2VuZEN1cnJlbnRNZXNzYWdlKGxhbmcuZ2V0KCdyZV9jb21tZW50JywgeyBjb21tZW50IH0pLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLyoqXG4gICAqIOWbnuWkjeeUqOaIt+S/oeaBr1xuICAgKiBAcGFyYW0gIHtbdHlwZV19IG9wdGlvbnMubXNnICAgIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBvcHRpb25zLm1hdGNoICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gb3B0aW9ucy5yZXAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IG9wdGlvbnMucmVwTXNnIFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7U3RyaW5nfSBjb21tYW5kICAgICAgICAvcmUg5oiW6ICFIC9lY2hvIFxuICAgKiByZSDkvJrov5vlhaXkvJror53nirbmgIHvvIwgZWNobyDlj6rmmK/lj5HpgIHvvIzkuI3ov5vlhaXkvJror51cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhc3luYyByZXBseU1lc3NhZ2VXaXRoQ29tbWFuZCAoeyBtc2csIG1hdGNoLCByZXAsIHJlcE1zZyB9LCBjb21tYW5kID0gJy9yZScpIHtcbiAgICBpZiAoaGVscGVyLmlzUHJpdmF0ZShtc2cpKSB7IHJldHVybiBmYWxzZSB9XG4gICAgY29uc3QgY29tbWVudCA9IG1hdGNoWzFdO1xuICAgIGlmICghY29tbWVudCkge3Rocm93IHttZXNzYWdlOiBsYW5nLmdldCgnYWRtaW5fcmVwbHlfZXJyJywgeyBjb21tYW5kIH0pfX0vLyDmsqHmnInovpPlhaXmtojmga9cbiAgICBsZXQgbWVzc2FnZSA9IHN1YnMuZ2V0TXNnV2l0aFJlcGx5KHJlcE1zZyk7XG4gICAgaWYgKCFtZXNzYWdlICYmICFyZXBNc2cuZm9yd2FyZF9mcm9tKSB7IHJldHVybiBmYWxzZSB9Ly8g5peg5LuO5Zue5aSNXG4gICAgaWYgKCFtZXNzYWdlKSB7IG1lc3NhZ2UgPSB7IGNoYXQ6IHJlcE1zZy5mb3J3YXJkX2Zyb20sIGZyb206IHJlcE1zZy5mb3J3YXJkX2Zyb20gfSB9XG4gICAgbGV0IGNoYXRNb2RlID0gY29tbWFuZCA9PSAnL3JlJyA/IHRydWUgOiBmYWxzZTtcbiAgICBhd2FpdCB0aGlzLnJlcGx5TWVzc2FnZShtZXNzYWdlLCBjb21tZW50LCBjaGF0TW9kZSk7XG4gICAgbGV0IHJlc3BNc2cgPSBhd2FpdCByZXAobGFuZy5nZXQoJ3JlX3NlbmRfc3VjY2VzcycpKTtcbiAgICBhd2FpdCBoZWxwZXIuc2xlZXAoMTAwMCk7XG4gICAgdGhpcy5lZGl0Q3VycmVudE1lc3NhZ2UoXCIuLi5cIiwgcmVzcE1zZyk7XG4gICAgYXdhaXQgaGVscGVyLnNsZWVwKDIwMDApO1xuICAgIGJvdC5kZWxldGVNZXNzYWdlKHJlc3BNc2cuY2hhdC5pZCwgcmVzcE1zZy5tZXNzYWdlX2lkKTtcbiAgfSxcbiAgLyoqXG4gICAqIOeuoeeQhuWRmOeCueWHu+mHh+e6s+eov+S7tijku45hY3Rpb25Nc2fngrnlh7vmjInpkq4pXG4gICAqIEBwYXJhbSAge09iamVjdH0gIHF1ZXJ5IGNhbGxiYWNrIGRhdGFcbiAgICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgYXN5bmMgcmVjZWl2ZSAocXVlcnkpIHtcbiAgICBsZXQgZndkTXNnID0gcXVlcnkubWVzc2FnZS5yZXBseV90b19tZXNzYWdlOy8vIOWuoeeov+e+pOeahOeov+S7tlxuICAgIGxldCBjb25kaXRpb24gPSBzdWJzLmdldEZ3ZE1zZ0NvbmRpdGlvbihmd2RNc2cpOy8vIOW+l+WIsOafpeivouadoeS7tlxuICAgIGxldCBtZXNzYWdlID0gc3Vicy5vbmUoY29uZGl0aW9uKTsvLyDlvpfliLDnnJ/lrp7nqL/ku7ZcbiAgICB0aGlzLnJlY2VpdmVNZXNzYWdlKG1lc3NhZ2UsIHF1ZXJ5LmZyb20pO1xuICB9XG59XG4iXX0=