/**
 * errorHandler — Global Express Error Middleware
 * لازم يكون آخر middleware في server.js
 * بيمسك أي error يتبعت من next(err) أو من asyncHandler
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(err.stack || err.message);

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      success: false,
      message: 'البيانات دي موجودة بالفعل (تكرار)',
    });
  }

  // MySQL foreign key violation
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'السيارة أو السجل المرتبط مش موجود',
    });
  }

  // باقي الأخطاء
  const status  = err.statusCode || err.status || 500;
  const message = err.message    || 'خطأ داخلي في السيرفر';

  res.status(status).json({ success: false, message });
};

module.exports = errorHandler;
