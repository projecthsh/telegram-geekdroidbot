'use strict';

var _core = require('././core');

var _queryHandler = require('./handler/queryHandler');

var _queryHandler2 = _interopRequireDefault(_queryHandler);

var _botCommand = require('./handler/botCommand');

var _botCommand2 = _interopRequireDefault(_botCommand);

var _msgHandler = require('./handler/msgHandler');

var _msgHandler2 = _interopRequireDefault(_msgHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setting up the message handler
_core.bot.on('message', function (message) {
    _msgHandler2.default.process(message);
});
// set up the asynchronous callback handler
_core.bot.on('callback_query', function (query) {
    _queryHandler2.default.process(query);
});
// setting error handler
_core.bot.on('polling_error', function (error) {
    throw error;
});

console.log("Server is running...");

if (process.env.BOT_ENV == 'test') {
    setTimeout(function () {
        console.log('Exiting automatically...');
        process.exit(0);
    }, 3000);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbImJvdCIsIm9uIiwibWVzc2FnZSIsIm1zZ0hhbmRsZXIiLCJwcm9jZXNzIiwicXVlcnkiLCJxdWVyeUhhbmRsZXIiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJlbnYiLCJCT1RfRU5WIiwic2V0VGltZW91dCIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTtBQUNBQSxVQUFJQyxFQUFKLENBQU8sU0FBUCxFQUFrQixVQUFDQyxPQUFELEVBQWE7QUFBRUMseUJBQVdDLE9BQVgsQ0FBbUJGLE9BQW5CO0FBQTZCLENBQTlEO0FBQ0E7QUFDQUYsVUFBSUMsRUFBSixDQUFPLGdCQUFQLEVBQXlCLFVBQUNJLEtBQUQsRUFBVztBQUFFQywyQkFBYUYsT0FBYixDQUFxQkMsS0FBckI7QUFBNkIsQ0FBbkU7QUFDQTtBQUNBTCxVQUFJQyxFQUFKLENBQU8sZUFBUCxFQUF3QixVQUFDTSxLQUFELEVBQVc7QUFBRSxVQUFNQSxLQUFOO0FBQWMsQ0FBbkQ7O0FBRUFDLFFBQVFDLEdBQVIsQ0FBWSxzQkFBWjs7QUFFQSxJQUFJTCxRQUFRTSxHQUFSLENBQVlDLE9BQVosSUFBdUIsTUFBM0IsRUFBbUM7QUFDL0JDLGVBQVksWUFBTTtBQUNkSixnQkFBUUMsR0FBUixDQUFZLDBCQUFaO0FBQ0FMLGdCQUFRUyxJQUFSLENBQWEsQ0FBYjtBQUNILEtBSEQsRUFHRyxJQUhIO0FBSUgiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvdCB9IGZyb20gJy4vLi9jb3JlJztcbmltcG9ydCBxdWVyeUhhbmRsZXIgZnJvbSAnLi9oYW5kbGVyL3F1ZXJ5SGFuZGxlcidcbmltcG9ydCBib3RDb21tYW5kIGZyb20gJy4vaGFuZGxlci9ib3RDb21tYW5kJ1xuaW1wb3J0IG1zZ0hhbmRsZXIgZnJvbSAnLi9oYW5kbGVyL21zZ0hhbmRsZXInXG5cbi8vIHNldHRpbmcgdXAgdGhlIG1lc3NhZ2UgaGFuZGxlclxuYm90Lm9uKCdtZXNzYWdlJywgKG1lc3NhZ2UpID0+IHsgbXNnSGFuZGxlci5wcm9jZXNzKG1lc3NhZ2UpIH0pO1xuLy8gc2V0IHVwIHRoZSBhc3luY2hyb25vdXMgY2FsbGJhY2sgaGFuZGxlclxuYm90Lm9uKCdjYWxsYmFja19xdWVyeScsIChxdWVyeSkgPT4geyBxdWVyeUhhbmRsZXIucHJvY2VzcyhxdWVyeSkgfSk7XG4vLyBzZXR0aW5nIGVycm9yIGhhbmRsZXJcbmJvdC5vbigncG9sbGluZ19lcnJvcicsIChlcnJvcikgPT4geyB0aHJvdyBlcnJvcjsgfSk7XG5cbmNvbnNvbGUubG9nKFwiU2VydmVyIGlzIHJ1bm5pbmcuLi5cIik7XG5cbmlmIChwcm9jZXNzLmVudi5CT1RfRU5WID09ICd0ZXN0Jykge1xuICAgIHNldFRpbWVvdXQoICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ0V4aXRpbmcgYXV0b21hdGljYWxseS4uLicpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgfSwgMzAwMClcbn0iXX0=