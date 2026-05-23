/**
 * asyncHandler
 * بيلف أي async controller function عشان يمسك الـ errors تلقائياً
 * بدله من try/catch في كل controller
 *
 * الاستخدام في الـ route:
 *   router.get('/', asyncHandler(myController.getAll));
 *
 * أو في الـ controller مباشرةً لو عاوز تطبقه هناك
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
