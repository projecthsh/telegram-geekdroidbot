'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = require('lowdb/adapters/FileSync');

var _FileSync2 = _interopRequireDefault(_FileSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var adapter = new _FileSync2.default('db.json');
var db = (0, _lowdb2.default)(adapter);

db.defaults({ re: [], blacklist: [], subs: [] }).write();

var Db = function () {
  (0, _createClass3.default)(Db, [{
    key: 'db',

    /**
     * 获取DB对象
     * @return {lowdb}
     */
    get: function get() {
      return db;
    }
  }]);

  /**
   * 创建一个DB对象
   * @param {String} table 表名
   */
  function Db(table) {
    (0, _classCallCheck3.default)(this, Db);

    this.table = table;
  }

  (0, _createClass3.default)(Db, [{
    key: 'add',

    /**
     * 添加一行记录
     * @param {Object} data 参数
     */
    value: function add(data) {
      db.get(this.table).push(data).write();
      return data;
    }
  }, {
    key: 'has',

    /**
     * 是否存在某记录
     * @param  {[type]}  data [description]
     * @return {Boolean}      [description]
     */
    value: function has(data) {
      return this.get(data) ? true : false;
    }
  }, {
    key: 'get',

    /**
     * 获取符合条件的记录
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    value: function get(data) {
      var row = db.get(this.table).filter(data).value();
      if (Array.isArray(row) && row.length === 0) {
        return null;
      }
      return row;
    }
  }, {
    key: 'one',

    /**
     * 查找一个记录
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    value: function one(data) {
      return db.get(this.table).find(data).value();
    }
  }, {
    key: 'del',

    /**
     * 删除符合条件的记录
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    value: function del(data) {
      db.get(this.table).remove(data).write();
    }
  }, {
    key: 'update',

    /**
     * 更新符合条件的记录
     * @param  {Object} condition 查询条件
     * @param  {Object} data      要更新的数据
     * @return {[type]}           [description]
     */
    value: function update(condition, data) {
      return db.get(this.table).find(condition).assign(data).write();
    }
  }]);
  return Db;
}();

exports.default = Db;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9EYi5qcyJdLCJuYW1lcyI6WyJhZGFwdGVyIiwiRmlsZVN5bmMiLCJkYiIsImRlZmF1bHRzIiwicmUiLCJibGFja2xpc3QiLCJzdWJzIiwid3JpdGUiLCJEYiIsInRhYmxlIiwiZGF0YSIsImdldCIsInB1c2giLCJyb3ciLCJmaWx0ZXIiLCJ2YWx1ZSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsImZpbmQiLCJyZW1vdmUiLCJjb25kaXRpb24iLCJhc3NpZ24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBQ0EsSUFBTUEsVUFBVSxJQUFJQyxrQkFBSixDQUFhLFNBQWIsQ0FBaEI7QUFDQSxJQUFNQyxLQUFLLHFCQUFJRixPQUFKLENBQVg7O0FBRUFFLEdBQUdDLFFBQUgsQ0FBWSxFQUFFQyxJQUFJLEVBQU4sRUFBVUMsV0FBVyxFQUFyQixFQUF5QkMsTUFBTSxFQUEvQixFQUFaLEVBQWdEQyxLQUFoRDs7SUFFTUMsRTs7OztBQUVKOzs7O3dCQUlVO0FBQ1IsYUFBT04sRUFBUDtBQUNEOzs7QUFDRDs7OztBQUlBLGNBQWFPLEtBQWIsRUFBb0I7QUFBQTs7QUFDbEIsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0Q7Ozs7O0FBQ0Q7Ozs7d0JBSUtDLEksRUFBTTtBQUNUUixTQUFHUyxHQUFILENBQU8sS0FBS0YsS0FBWixFQUFtQkcsSUFBbkIsQ0FBd0JGLElBQXhCLEVBQThCSCxLQUE5QjtBQUNBLGFBQU9HLElBQVA7QUFDRDs7OztBQUNEOzs7Ozt3QkFLS0EsSSxFQUFNO0FBQ1QsYUFBTyxLQUFLQyxHQUFMLENBQVNELElBQVQsSUFBaUIsSUFBakIsR0FBd0IsS0FBL0I7QUFDRDs7OztBQUNEOzs7Ozt3QkFLS0EsSSxFQUFNO0FBQ1QsVUFBSUcsTUFBTVgsR0FBR1MsR0FBSCxDQUFPLEtBQUtGLEtBQVosRUFBbUJLLE1BQW5CLENBQTBCSixJQUExQixFQUFnQ0ssS0FBaEMsRUFBVjtBQUNBLFVBQUlDLE1BQU1DLE9BQU4sQ0FBY0osR0FBZCxLQUFzQkEsSUFBSUssTUFBSixLQUFlLENBQXpDLEVBQTRDO0FBQzFDLGVBQU8sSUFBUDtBQUNEO0FBQ0QsYUFBT0wsR0FBUDtBQUNEOzs7O0FBQ0Q7Ozs7O3dCQUtLSCxJLEVBQU07QUFDVCxhQUFPUixHQUFHUyxHQUFILENBQU8sS0FBS0YsS0FBWixFQUFtQlUsSUFBbkIsQ0FBd0JULElBQXhCLEVBQThCSyxLQUE5QixFQUFQO0FBQ0Q7Ozs7QUFDRDs7Ozs7d0JBS0tMLEksRUFBTTtBQUNUUixTQUFHUyxHQUFILENBQU8sS0FBS0YsS0FBWixFQUFtQlcsTUFBbkIsQ0FBMEJWLElBQTFCLEVBQWdDSCxLQUFoQztBQUNEOzs7O0FBQ0Q7Ozs7OzsyQkFNUWMsUyxFQUFXWCxJLEVBQU07QUFDdkIsYUFBT1IsR0FBR1MsR0FBSCxDQUFPLEtBQUtGLEtBQVosRUFBbUJVLElBQW5CLENBQXdCRSxTQUF4QixFQUFtQ0MsTUFBbkMsQ0FBMENaLElBQTFDLEVBQWdESCxLQUFoRCxFQUFQO0FBQ0Q7Ozs7O2tCQUdZQyxFIiwiZmlsZSI6IkRiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGxvdyBmcm9tICdsb3dkYic7XG5pbXBvcnQgRmlsZVN5bmMgZnJvbSAnbG93ZGIvYWRhcHRlcnMvRmlsZVN5bmMnO1xuY29uc3QgYWRhcHRlciA9IG5ldyBGaWxlU3luYygnZGIuanNvbicpXG5jb25zdCBkYiA9IGxvdyhhZGFwdGVyKVxuXG5kYi5kZWZhdWx0cyh7IHJlOiBbXSwgYmxhY2tsaXN0OiBbXSwgc3ViczogW119KS53cml0ZSgpO1xuXG5jbGFzcyBEYlxue1xuICAvKipcbiAgICog6I635Y+WRELlr7nosaFcbiAgICogQHJldHVybiB7bG93ZGJ9XG4gICAqL1xuICBnZXQgZGIgKCkge1xuICAgIHJldHVybiBkYjtcbiAgfTtcbiAgLyoqXG4gICAqIOWIm+W7uuS4gOS4qkRC5a+56LGhXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0YWJsZSDooajlkI1cbiAgICovXG4gIGNvbnN0cnVjdG9yICh0YWJsZSkge1xuICAgIHRoaXMudGFibGUgPSB0YWJsZTtcbiAgfTtcbiAgLyoqXG4gICAqIOa3u+WKoOS4gOihjOiusOW9lVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSDlj4LmlbBcbiAgICovXG4gIGFkZCAoZGF0YSkge1xuICAgIGRiLmdldCh0aGlzLnRhYmxlKS5wdXNoKGRhdGEpLndyaXRlKCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG4gIC8qKlxuICAgKiDmmK/lkKblrZjlnKjmn5DorrDlvZVcbiAgICogQHBhcmFtICB7W3R5cGVdfSAgZGF0YSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgaGFzIChkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KGRhdGEpID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuICAvKipcbiAgICog6I635Y+W56ym5ZCI5p2h5Lu255qE6K6w5b2VXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBnZXQgKGRhdGEpIHtcbiAgICBsZXQgcm93ID0gZGIuZ2V0KHRoaXMudGFibGUpLmZpbHRlcihkYXRhKS52YWx1ZSgpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJvdykgJiYgcm93Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiByb3c7XG4gIH07XG4gIC8qKlxuICAgKiDmn6Xmib7kuIDkuKrorrDlvZVcbiAgICogQHBhcmFtICB7W3R5cGVdfSBkYXRhIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIG9uZSAoZGF0YSkge1xuICAgIHJldHVybiBkYi5nZXQodGhpcy50YWJsZSkuZmluZChkYXRhKS52YWx1ZSgpO1xuICB9O1xuICAvKipcbiAgICog5Yig6Zmk56ym5ZCI5p2h5Lu255qE6K6w5b2VXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZGF0YSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBkZWwgKGRhdGEpIHtcbiAgICBkYi5nZXQodGhpcy50YWJsZSkucmVtb3ZlKGRhdGEpLndyaXRlKCk7XG4gIH07XG4gIC8qKlxuICAgKiDmm7TmlrDnrKblkIjmnaHku7bnmoTorrDlvZVcbiAgICogQHBhcmFtICB7T2JqZWN0fSBjb25kaXRpb24g5p+l6K+i5p2h5Lu2XG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSAgICAgIOimgeabtOaWsOeahOaVsOaNrlxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICB1cGRhdGUgKGNvbmRpdGlvbiwgZGF0YSkge1xuICAgIHJldHVybiBkYi5nZXQodGhpcy50YWJsZSkuZmluZChjb25kaXRpb24pLmFzc2lnbihkYXRhKS53cml0ZSgpXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERiO1xuIl19