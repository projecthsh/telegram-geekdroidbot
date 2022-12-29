'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _core = require('../core');

var _msgControl = require('./msgControl');

var _msgControl2 = _interopRequireDefault(_msgControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 点击actionMsg后会产生回调函式
 * @type
 */
exports.default = {
  process: function process(query) {
    var _this = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var actionMsg, data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              actionMsg = query.message; // 操作的actionMsg

              data = query.data;

              if (!_this.isAdminReceiveAction(data)) {
                _context.next = 8;
                break;
              }

              _context.next = 6;
              return _msgControl2.default.receive(query);

            case 6:
              _context.next = 9;
              break;

            case 8:
              _this.processSubmission(data, actionMsg);

            case 9:
              _core.bot.answerCallbackQuery(query.id);
              _context.next = 17;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context['catch'](0);

              if (_context.t0.message == _core.vars.BOT_NOAUTH_KICK) {
                _context.t0.message = _core.lang.get('err_no_auth_kick');
              } else if (_context.t0.message == _core.vars.BOT_NOAUTH) {
                _context.t0.message = _core.lang.get('err_no_auth');
              }
              _core.bot.answerCallbackQuery(query.id, { text: _context.t0.message, show_alert: true });
              throw _context.t0;

            case 17:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[0, 12]]);
    }))();
  },

  /**
   * 处理用户点击投稿事件
   * @param  {String} type    投稿类型，vars_SUB*
   * @param  {Object} actionMsg ActionMsg 动作信息
   */
  processSubmission: function processSubmission(type, actionMsg) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var message, resp;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              message = actionMsg.reply_to_message; // 稿件

              if (!_core.helper.isBlock(message, true)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt('return', false);

            case 3:
              if (!(type == _core.vars.SUB_CANCEL)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt('return', _msgControl2.default.editCurrentMessage(_core.lang.get('sub_cancel_tip'), actionMsg));

            case 5:
              _msgControl2.default.editCurrentMessage(_core.lang.get('sub_submit_tip'), actionMsg);
              _context2.next = 8;
              return _msgControl2.default.forwardMessage(message, type);

            case 8:
              resp = _context2.sent;
              // 转发到审稿群
              _msgControl2.default.askAdmin(resp); // 询问管理员如何操作

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }))();
  },

  /**
   * 是管理员点击了采纳吗
   * @param  {String}  data query.data
   * @return {Boolean}
   */
  isAdminReceiveAction: function isAdminReceiveAction(data) {
    return data == _core.vars.REC_ANY || data == _core.vars.REC_REAL ? true : false;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVyL3F1ZXJ5SGFuZGxlci5qcyJdLCJuYW1lcyI6WyJwcm9jZXNzIiwicXVlcnkiLCJhY3Rpb25Nc2ciLCJtZXNzYWdlIiwiZGF0YSIsImlzQWRtaW5SZWNlaXZlQWN0aW9uIiwibXNnQ29udHJvbCIsInJlY2VpdmUiLCJwcm9jZXNzU3VibWlzc2lvbiIsImJvdCIsImFuc3dlckNhbGxiYWNrUXVlcnkiLCJpZCIsInZhcnMiLCJCT1RfTk9BVVRIX0tJQ0siLCJsYW5nIiwiZ2V0IiwiQk9UX05PQVVUSCIsInRleHQiLCJzaG93X2FsZXJ0IiwidHlwZSIsInJlcGx5X3RvX21lc3NhZ2UiLCJoZWxwZXIiLCJpc0Jsb2NrIiwiU1VCX0NBTkNFTCIsImVkaXRDdXJyZW50TWVzc2FnZSIsImZvcndhcmRNZXNzYWdlIiwicmVzcCIsImFza0FkbWluIiwiUkVDX0FOWSIsIlJFQ19SRUFMIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7QUFFQTs7OztrQkFLQTtBQUNRQSxTQURSLG1CQUNpQkMsS0FEakIsRUFDd0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVaQyx1QkFGWSxHQUVBRCxNQUFNRSxPQUZOLEVBRWM7O0FBQzFCQyxrQkFIWSxHQUdMSCxNQUFNRyxJQUhEOztBQUFBLG1CQUlkLE1BQUtDLG9CQUFMLENBQTBCRCxJQUExQixDQUpjO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEscUJBSTJCRSxxQkFBV0MsT0FBWCxDQUFtQk4sS0FBbkIsQ0FKM0I7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBS1gsb0JBQUtPLGlCQUFMLENBQXVCSixJQUF2QixFQUE2QkYsU0FBN0I7O0FBTFc7QUFNbEJPLHdCQUFJQyxtQkFBSixDQUF3QlQsTUFBTVUsRUFBOUI7QUFOa0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBUWxCLGtCQUFJLFlBQUlSLE9BQUosSUFBZVMsV0FBS0MsZUFBeEIsRUFBeUM7QUFDdkMsNEJBQUlWLE9BQUosR0FBY1csV0FBS0MsR0FBTCxDQUFTLGtCQUFULENBQWQ7QUFDRCxlQUZELE1BRU8sSUFBSSxZQUFJWixPQUFKLElBQWVTLFdBQUtJLFVBQXhCLEVBQW9DO0FBQ3pDLDRCQUFJYixPQUFKLEdBQWNXLFdBQUtDLEdBQUwsQ0FBUyxhQUFULENBQWQ7QUFDRDtBQUNETix3QkFBSUMsbUJBQUosQ0FBd0JULE1BQU1VLEVBQTlCLEVBQWtDLEVBQUVNLE1BQU0sWUFBSWQsT0FBWixFQUFxQmUsWUFBWSxJQUFqQyxFQUFsQztBQWJrQjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdCckIsR0FqQkg7O0FBa0JFOzs7OztBQUtNVixtQkF2QlIsNkJBdUIyQlcsSUF2QjNCLEVBdUJpQ2pCLFNBdkJqQyxFQXVCNEM7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDcENDLHFCQURvQyxHQUMxQkQsVUFBVWtCLGdCQURnQixFQUNDOztBQURELG1CQUVwQ0MsYUFBT0MsT0FBUCxDQUFlbkIsT0FBZixFQUF3QixJQUF4QixDQUZvQztBQUFBO0FBQUE7QUFBQTs7QUFBQSxnREFHL0IsS0FIK0I7O0FBQUE7QUFBQSxvQkFLcENnQixRQUFRUCxXQUFLVyxVQUx1QjtBQUFBO0FBQUE7QUFBQTs7QUFBQSxnREFPL0JqQixxQkFBV2tCLGtCQUFYLENBQThCVixXQUFLQyxHQUFMLENBQVMsZ0JBQVQsQ0FBOUIsRUFBMERiLFNBQTFELENBUCtCOztBQUFBO0FBU3hDSSxtQ0FBV2tCLGtCQUFYLENBQThCVixXQUFLQyxHQUFMLENBQVMsZ0JBQVQsQ0FBOUIsRUFBMERiLFNBQTFEO0FBVHdDO0FBQUEscUJBVXZCSSxxQkFBV21CLGNBQVgsQ0FBMEJ0QixPQUExQixFQUFtQ2dCLElBQW5DLENBVnVCOztBQUFBO0FBVXBDTyxrQkFWb0M7QUFVa0I7QUFDMURwQixtQ0FBV3FCLFFBQVgsQ0FBb0JELElBQXBCLEVBWHdDLENBV2Q7O0FBWGM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFZekMsR0FuQ0g7O0FBb0NFOzs7OztBQUtBckIsc0JBekNGLGdDQXlDd0JELElBekN4QixFQXlDOEI7QUFDMUIsV0FBUUEsUUFBUVEsV0FBS2dCLE9BQWIsSUFBd0J4QixRQUFRUSxXQUFLaUIsUUFBdEMsR0FBa0QsSUFBbEQsR0FBeUQsS0FBaEU7QUFDRDtBQTNDSCxDIiwiZmlsZSI6InF1ZXJ5SGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29uZmlnLCBib3QsIHZhcnMsIGxhbmcsIGhlbHBlcn0gZnJvbSAnLi4vY29yZSc7XG5pbXBvcnQgbXNnQ29udHJvbCBmcm9tICcuL21zZ0NvbnRyb2wnO1xuXG4vKipcbiAqIOeCueWHu2FjdGlvbk1zZ+WQjuS8muS6p+eUn+Wbnuiwg+WHveW8j1xuICogQHR5cGVcbiAqL1xuZXhwb3J0IGRlZmF1bHRcbntcbiAgYXN5bmMgcHJvY2VzcyAocXVlcnkpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYWN0aW9uTXNnID0gcXVlcnkubWVzc2FnZTsvLyDmk43kvZznmoRhY3Rpb25Nc2dcbiAgICAgIGNvbnN0IGRhdGEgPSBxdWVyeS5kYXRhO1xuICAgICAgaWYgKHRoaXMuaXNBZG1pblJlY2VpdmVBY3Rpb24oZGF0YSkpIHsgYXdhaXQgbXNnQ29udHJvbC5yZWNlaXZlKHF1ZXJ5KSB9IFxuICAgICAgZWxzZSB7IHRoaXMucHJvY2Vzc1N1Ym1pc3Npb24oZGF0YSwgYWN0aW9uTXNnKSB9XG4gICAgICBib3QuYW5zd2VyQ2FsbGJhY2tRdWVyeShxdWVyeS5pZClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIubWVzc2FnZSA9PSB2YXJzLkJPVF9OT0FVVEhfS0lDSykge1xuICAgICAgICBlcnIubWVzc2FnZSA9IGxhbmcuZ2V0KCdlcnJfbm9fYXV0aF9raWNrJylcbiAgICAgIH0gZWxzZSBpZiAoZXJyLm1lc3NhZ2UgPT0gdmFycy5CT1RfTk9BVVRIKSB7XG4gICAgICAgIGVyci5tZXNzYWdlID0gbGFuZy5nZXQoJ2Vycl9ub19hdXRoJylcbiAgICAgIH1cbiAgICAgIGJvdC5hbnN3ZXJDYWxsYmFja1F1ZXJ5KHF1ZXJ5LmlkLCB7IHRleHQ6IGVyci5tZXNzYWdlLCBzaG93X2FsZXJ0OiB0cnVlIH0pXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9LFxuICAvKipcbiAgICog5aSE55CG55So5oi354K55Ye75oqV56i/5LqL5Lu2XG4gICAqIEBwYXJhbSAge1N0cmluZ30gdHlwZSAgICDmipXnqL/nsbvlnovvvIx2YXJzX1NVQipcbiAgICogQHBhcmFtICB7T2JqZWN0fSBhY3Rpb25Nc2cgQWN0aW9uTXNnIOWKqOS9nOS/oeaBr1xuICAgKi9cbiAgYXN5bmMgcHJvY2Vzc1N1Ym1pc3Npb24gKHR5cGUsIGFjdGlvbk1zZykge1xuICAgIGxldCBtZXNzYWdlID0gYWN0aW9uTXNnLnJlcGx5X3RvX21lc3NhZ2U7Ly8g56i/5Lu2XG4gICAgaWYgKGhlbHBlci5pc0Jsb2NrKG1lc3NhZ2UsIHRydWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlID09IHZhcnMuU1VCX0NBTkNFTCkge1xuICAgICAgLy8g54K55Ye75Y+W5raI5oqV56i/XG4gICAgICByZXR1cm4gbXNnQ29udHJvbC5lZGl0Q3VycmVudE1lc3NhZ2UobGFuZy5nZXQoJ3N1Yl9jYW5jZWxfdGlwJyksIGFjdGlvbk1zZyk7XG4gICAgfVxuICAgIG1zZ0NvbnRyb2wuZWRpdEN1cnJlbnRNZXNzYWdlKGxhbmcuZ2V0KCdzdWJfc3VibWl0X3RpcCcpLCBhY3Rpb25Nc2cpO1xuICAgIGxldCByZXNwID0gYXdhaXQgbXNnQ29udHJvbC5mb3J3YXJkTWVzc2FnZShtZXNzYWdlLCB0eXBlKTsvLyDovazlj5HliLDlrqHnqL/nvqRcbiAgICBtc2dDb250cm9sLmFza0FkbWluKHJlc3ApOy8vIOivoumXrueuoeeQhuWRmOWmguS9leaTjeS9nFxuICB9LFxuICAvKipcbiAgICog5piv566h55CG5ZGY54K55Ye75LqG6YeH57qz5ZCXXG4gICAqIEBwYXJhbSAge1N0cmluZ30gIGRhdGEgcXVlcnkuZGF0YVxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNBZG1pblJlY2VpdmVBY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gKGRhdGEgPT0gdmFycy5SRUNfQU5ZIHx8IGRhdGEgPT0gdmFycy5SRUNfUkVBTCkgPyB0cnVlIDogZmFsc2U7XG4gIH1cbn1cbiJdfQ==