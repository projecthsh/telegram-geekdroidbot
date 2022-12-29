'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var BlackList = function (_Db) {
  (0, _inherits3.default)(BlackList, _Db);

  function BlackList() {
    (0, _classCallCheck3.default)(this, BlackList);
    return (0, _possibleConstructorReturn3.default)(this, (BlackList.__proto__ || (0, _getPrototypeOf2.default)(BlackList)).apply(this, arguments));
  }

  (0, _createClass3.default)(BlackList, [{
    key: 'unbanWithUserId',

    /**
     * 取消封锁一个用户，透过ID
     * @param  {Int} userId 用户ID
     * @return {String}        成功返回文案，失败抛出异常
     */
    value: function unbanWithUserId(userId) {
      var condition = { id: userId };
      if (this.has(condition)) {
        this.del(condition);
        return _core.lang.get('blacklist_unban_only_id', condition);
      }
      throw { message: _core.lang.get('blacklist_unban_notexists') };
    }
  }, {
    key: 'unbanWithMessage',

    /**
     * 从管理员的指令消息包含的稿件里解除封锁某个用户
     * @param  {[type]} repMsg 用户用 /unban 命令回复的那个消息
     * @return {String}        成功返回文案，失败抛出异常
     */
    value: function unbanWithMessage(repMsg) {
      var message = _core.subs.getMsgWithReply(repMsg);
      if (!message) {
        throw { message: _core.lang.get('sub_not_exists') };
      };
      var condition = { id: message.from.id };
      var userinfo = _core.lang.getUser(message.from);
      // 若用户已经被封锁
      if (blacklist.has(condition)) {
        blacklist.del(condition);
        return _core.lang.get('blacklist_unban', userinfo);
      }
      throw { message: _core.lang.get('blacklist_unban_notexists') };
    }
  }, {
    key: 'banWithUserId',

    /**
     * 透过UserID封锁用户
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    value: function banWithUserId(userId) {
      var condition = { id: userId };
      if (this.has(condition)) {
        throw { message: _core.lang.get('blacklist_exists_only_id', condition) };
      }
      this.add(condition);
      return _core.lang.get('blacklist_success_only_id');
    }
  }, {
    key: 'banWithMessage',

    /**
     * 透过用户指令来封锁用户
     * @param  {[type]} repMsg 用户用 /unban 命令回复的那个消息
     * @return {[type]}     [description]
     */
    value: function banWithMessage(repMsg) {
      var message = _core.subs.getMsgWithReply(repMsg);
      if (!message) {
        throw { message: _core.lang.get('sub_not_exists') };
      }
      var userinfo = _core.lang.getUser(message.from);
      // 若用户已经被封锁
      if (this.has({ id: message.from.id })) {
        throw { message: _core.lang.get('blacklist_exists', userinfo) };
      }
      this.add(message.from);
      return _core.lang.get('blacklist_success', userinfo);
    }
  }]);
  return BlackList;
}(_Db3.default);

var blacklist = new BlackList('blacklist');

exports.default = blacklist;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9CbGFja0xpc3QuanMiXSwibmFtZXMiOlsiQmxhY2tMaXN0IiwidXNlcklkIiwiY29uZGl0aW9uIiwiaWQiLCJoYXMiLCJkZWwiLCJsYW5nIiwiZ2V0IiwibWVzc2FnZSIsInJlcE1zZyIsInN1YnMiLCJnZXRNc2dXaXRoUmVwbHkiLCJmcm9tIiwidXNlcmluZm8iLCJnZXRVc2VyIiwiYmxhY2tsaXN0IiwiYWRkIiwiRGIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7OztJQUVNQSxTOzs7Ozs7Ozs7OztBQUVKOzs7OztvQ0FLaUJDLE0sRUFBUTtBQUN2QixVQUFJQyxZQUFZLEVBQUNDLElBQUlGLE1BQUwsRUFBaEI7QUFDQSxVQUFJLEtBQUtHLEdBQUwsQ0FBU0YsU0FBVCxDQUFKLEVBQXlCO0FBQ3ZCLGFBQUtHLEdBQUwsQ0FBU0gsU0FBVDtBQUNBLGVBQU9JLFdBQUtDLEdBQUwsQ0FBUyx5QkFBVCxFQUFvQ0wsU0FBcEMsQ0FBUDtBQUNEO0FBQ0QsWUFBTSxFQUFDTSxTQUFTRixXQUFLQyxHQUFMLENBQVMsMkJBQVQsQ0FBVixFQUFOO0FBQ0Q7Ozs7QUFDRDs7Ozs7cUNBS2tCRSxNLEVBQVE7QUFDeEIsVUFBSUQsVUFBVUUsV0FBS0MsZUFBTCxDQUFxQkYsTUFBckIsQ0FBZDtBQUNBLFVBQUksQ0FBQ0QsT0FBTCxFQUFjO0FBQUMsY0FBTSxFQUFFQSxTQUFTRixXQUFLQyxHQUFMLENBQVMsZ0JBQVQsQ0FBWCxFQUFOO0FBQThDO0FBQzdELFVBQUlMLFlBQVksRUFBQ0MsSUFBSUssUUFBUUksSUFBUixDQUFhVCxFQUFsQixFQUFoQjtBQUNBLFVBQUlVLFdBQVdQLFdBQUtRLE9BQUwsQ0FBYU4sUUFBUUksSUFBckIsQ0FBZjtBQUNBO0FBQ0EsVUFBSUcsVUFBVVgsR0FBVixDQUFjRixTQUFkLENBQUosRUFBOEI7QUFDNUJhLGtCQUFVVixHQUFWLENBQWNILFNBQWQ7QUFDQSxlQUFPSSxXQUFLQyxHQUFMLENBQVMsaUJBQVQsRUFBNEJNLFFBQTVCLENBQVA7QUFDRDtBQUNELFlBQU0sRUFBQ0wsU0FBU0YsV0FBS0MsR0FBTCxDQUFTLDJCQUFULENBQVYsRUFBTjtBQUNEOzs7O0FBQ0Q7Ozs7O2tDQUtlTixNLEVBQVE7QUFDckIsVUFBSUMsWUFBWSxFQUFDQyxJQUFJRixNQUFMLEVBQWhCO0FBQ0EsVUFBSSxLQUFLRyxHQUFMLENBQVNGLFNBQVQsQ0FBSixFQUF5QjtBQUN2QixjQUFNLEVBQUNNLFNBQVNGLFdBQUtDLEdBQUwsQ0FBUywwQkFBVCxFQUFxQ0wsU0FBckMsQ0FBVixFQUFOO0FBQ0Q7QUFDRCxXQUFLYyxHQUFMLENBQVNkLFNBQVQ7QUFDQSxhQUFPSSxXQUFLQyxHQUFMLENBQVMsMkJBQVQsQ0FBUDtBQUNEOzs7O0FBQ0Q7Ozs7O21DQUtnQkUsTSxFQUFRO0FBQ3RCLFVBQUlELFVBQVVFLFdBQUtDLGVBQUwsQ0FBcUJGLE1BQXJCLENBQWQ7QUFDQSxVQUFJLENBQUNELE9BQUwsRUFBYztBQUFFLGNBQU0sRUFBRUEsU0FBU0YsV0FBS0MsR0FBTCxDQUFTLGdCQUFULENBQVgsRUFBTjtBQUE4QztBQUM5RCxVQUFJTSxXQUFXUCxXQUFLUSxPQUFMLENBQWFOLFFBQVFJLElBQXJCLENBQWY7QUFDQTtBQUNBLFVBQUksS0FBS1IsR0FBTCxDQUFTLEVBQUNELElBQUlLLFFBQVFJLElBQVIsQ0FBYVQsRUFBbEIsRUFBVCxDQUFKLEVBQXFDO0FBQ25DLGNBQU0sRUFBQ0ssU0FBU0YsV0FBS0MsR0FBTCxDQUFTLGtCQUFULEVBQTZCTSxRQUE3QixDQUFWLEVBQU47QUFDRDtBQUNELFdBQUtHLEdBQUwsQ0FBU1IsUUFBUUksSUFBakI7QUFDQSxhQUFPTixXQUFLQyxHQUFMLENBQVMsbUJBQVQsRUFBOEJNLFFBQTlCLENBQVA7QUFDRDs7O0VBNURxQkksWTs7QUFnRXhCLElBQU1GLFlBQVksSUFBSWYsU0FBSixDQUFjLFdBQWQsQ0FBbEI7O2tCQUVlZSxTIiwiZmlsZSI6IkJsYWNrTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxhbmcsIHZhcnMsIGhlbHBlciwgc3VicyB9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IERiIGZyb20gJy4vRGInO1xuXG5jbGFzcyBCbGFja0xpc3QgZXh0ZW5kcyBEYlxue1xuICAvKipcbiAgICog5Y+W5raI5bCB6ZSB5LiA5Liq55So5oi377yM6YCP6L+HSURcbiAgICogQHBhcmFtICB7SW50fSB1c2VySWQg55So5oi3SURcbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAg5oiQ5Yqf6L+U5Zue5paH5qGI77yM5aSx6LSl5oqb5Ye65byC5bi4XG4gICAqL1xuICB1bmJhbldpdGhVc2VySWQgKHVzZXJJZCkge1xuICAgIGxldCBjb25kaXRpb24gPSB7aWQ6IHVzZXJJZH07XG4gICAgaWYgKHRoaXMuaGFzKGNvbmRpdGlvbikpIHtcbiAgICAgIHRoaXMuZGVsKGNvbmRpdGlvbik7XG4gICAgICByZXR1cm4gbGFuZy5nZXQoJ2JsYWNrbGlzdF91bmJhbl9vbmx5X2lkJywgY29uZGl0aW9uKTtcbiAgICB9XG4gICAgdGhyb3cge21lc3NhZ2U6IGxhbmcuZ2V0KCdibGFja2xpc3RfdW5iYW5fbm90ZXhpc3RzJyl9XG4gIH07XG4gIC8qKlxuICAgKiDku47nrqHnkIblkZjnmoTmjIfku6Tmtojmga/ljIXlkKvnmoTnqL/ku7bph4zop6PpmaTlsIHplIHmn5DkuKrnlKjmiLdcbiAgICogQHBhcmFtICB7W3R5cGVdfSByZXBNc2cg55So5oi355SoIC91bmJhbiDlkb3ku6Tlm57lpI3nmoTpgqPkuKrmtojmga9cbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAg5oiQ5Yqf6L+U5Zue5paH5qGI77yM5aSx6LSl5oqb5Ye65byC5bi4XG4gICAqL1xuICB1bmJhbldpdGhNZXNzYWdlIChyZXBNc2cpIHtcbiAgICBsZXQgbWVzc2FnZSA9IHN1YnMuZ2V0TXNnV2l0aFJlcGx5KHJlcE1zZyk7XG4gICAgaWYgKCFtZXNzYWdlKSB7dGhyb3cgeyBtZXNzYWdlOiBsYW5nLmdldCgnc3ViX25vdF9leGlzdHMnKSB9fTtcbiAgICBsZXQgY29uZGl0aW9uID0ge2lkOiBtZXNzYWdlLmZyb20uaWR9O1xuICAgIGxldCB1c2VyaW5mbyA9IGxhbmcuZ2V0VXNlcihtZXNzYWdlLmZyb20pO1xuICAgIC8vIOiLpeeUqOaIt+W3sue7j+iiq+WwgemUgVxuICAgIGlmIChibGFja2xpc3QuaGFzKGNvbmRpdGlvbikpIHtcbiAgICAgIGJsYWNrbGlzdC5kZWwoY29uZGl0aW9uKTtcbiAgICAgIHJldHVybiBsYW5nLmdldCgnYmxhY2tsaXN0X3VuYmFuJywgdXNlcmluZm8pO1xuICAgIH1cbiAgICB0aHJvdyB7bWVzc2FnZTogbGFuZy5nZXQoJ2JsYWNrbGlzdF91bmJhbl9ub3RleGlzdHMnKX1cbiAgfTtcbiAgLyoqXG4gICAqIOmAj+i/h1VzZXJJROWwgemUgeeUqOaIt1xuICAgKiBAcGFyYW0gIHtbdHlwZV19IHVzZXJJZCBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGJhbldpdGhVc2VySWQgKHVzZXJJZCkge1xuICAgIGxldCBjb25kaXRpb24gPSB7aWQ6IHVzZXJJZH07XG4gICAgaWYgKHRoaXMuaGFzKGNvbmRpdGlvbikpIHtcbiAgICAgIHRocm93IHttZXNzYWdlOiBsYW5nLmdldCgnYmxhY2tsaXN0X2V4aXN0c19vbmx5X2lkJywgY29uZGl0aW9uKX1cbiAgICB9XG4gICAgdGhpcy5hZGQoY29uZGl0aW9uKTtcbiAgICByZXR1cm4gbGFuZy5nZXQoJ2JsYWNrbGlzdF9zdWNjZXNzX29ubHlfaWQnKTtcbiAgfTtcbiAgLyoqXG4gICAqIOmAj+i/h+eUqOaIt+aMh+S7pOadpeWwgemUgeeUqOaIt1xuICAgKiBAcGFyYW0gIHtbdHlwZV19IHJlcE1zZyDnlKjmiLfnlKggL3VuYmFuIOWRveS7pOWbnuWkjeeahOmCo+S4qua2iOaBr1xuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBiYW5XaXRoTWVzc2FnZSAocmVwTXNnKSB7XG4gICAgbGV0IG1lc3NhZ2UgPSBzdWJzLmdldE1zZ1dpdGhSZXBseShyZXBNc2cpO1xuICAgIGlmICghbWVzc2FnZSkgeyB0aHJvdyB7IG1lc3NhZ2U6IGxhbmcuZ2V0KCdzdWJfbm90X2V4aXN0cycpIH19XG4gICAgbGV0IHVzZXJpbmZvID0gbGFuZy5nZXRVc2VyKG1lc3NhZ2UuZnJvbSk7XG4gICAgLy8g6Iul55So5oi35bey57uP6KKr5bCB6ZSBXG4gICAgaWYgKHRoaXMuaGFzKHtpZDogbWVzc2FnZS5mcm9tLmlkfSkpIHtcbiAgICAgIHRocm93IHttZXNzYWdlOiBsYW5nLmdldCgnYmxhY2tsaXN0X2V4aXN0cycsIHVzZXJpbmZvKX1cbiAgICB9XG4gICAgdGhpcy5hZGQobWVzc2FnZS5mcm9tKTtcbiAgICByZXR1cm4gbGFuZy5nZXQoJ2JsYWNrbGlzdF9zdWNjZXNzJywgdXNlcmluZm8pO1xuICB9O1xuXG59XG5cbmNvbnN0IGJsYWNrbGlzdCA9IG5ldyBCbGFja0xpc3QoJ2JsYWNrbGlzdCcpO1xuXG5leHBvcnQgZGVmYXVsdCBibGFja2xpc3Q7Il19