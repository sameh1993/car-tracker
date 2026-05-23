// timeline - استبدل بالجدول
const tl = document.getElementById("timeline");
if (!logs.length) {
  tl.innerHTML = `<div class="empty"><div class="empty-icon">📭</div><h3>لا توجد قراءات مسجلة</h3><p>سجل أول قراءة من اليمين</p></div>`;
  return;
}

// ترتيب السجلات من الأحدث للأقدم
logs.sort((a, b) => new Date(b.reading_date) - new Date(a.reading_date));

// إنشاء الجدول
tl.innerHTML = `
  <table class="odo-table">
    <thead>
      <tr>
        <th>التاريخ</th>
        <th>القراءة</th>
        <th>الفرق</th>
        <th>المصدر</th>
        <th>ملاحظات</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${logs
        .map((log, index) => {
          const nextLog = logs[index + 1];
          const diff = nextLog ? log.reading_km - nextLog.reading_km : 0;
          const diffFormatted =
            diff > 0
              ? `+${diff.toLocaleString("ar-EG")}`
              : diff.toLocaleString("ar-EG");
          const diffClass = diff > 0 ? "positive" : diff < 0 ? "negative" : "";

          const sourceInfo = SOURCE_LABELS[log.source] || SOURCE_LABELS.other;

          return `
          <tr>
            <td>${fmtDate(log.reading_date)}</td>
            <td class="km-cell">${Number(log.reading_km).toLocaleString("ar-EG")} كم</td>
            <td class="diff-cell ${diffClass}">${diffFormatted} كم</td>
            <td><span class="source-badge source-${log.source}">${sourceInfo.label}</span></td>
            <td style="color: var(--text2); font-size: 12px;">${log.notes || "—"}</td>
            <td>
              ${
                log.source === "manual"
                  ? `<button class="delete-btn" onclick="deleteReading(${log.id})" title="حذف">🗑️</button>`
                  : ""
              }
            </td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>
`;

// قبل الجدول، أضف summary
const totalKm =
  logs.length > 1 ? logs[0].reading_km - logs[logs.length - 1].reading_km : 0;

tl.innerHTML =
  `
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
    <div style="font-size: 12px; color: var(--text2)">
      إجمالي الكيلومترات المقطوعة: <strong style="color: var(--text)">${totalKm.toLocaleString("ar-EG")} كم</strong>
    </div>
    <div style="font-size: 12px; color: var(--text2)">
      متوسط شهري: <strong style="color: var(--text)">${calculateMonthlyAverage(logs).toLocaleString("ar-EG")} كم</strong>
    </div>
  </div>
  ` + tl.innerHTML;

// وأضف هذه الدالة المساعدة
function calculateMonthlyAverage(logs) {
  if (logs.length < 2) return 0;

  const firstDate = new Date(logs[logs.length - 1].reading_date);
  const lastDate = new Date(logs[0].reading_date);
  const totalMonths =
    (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (lastDate.getMonth() - firstDate.getMonth());

  if (totalMonths <= 0) return 0;

  const totalKm = logs[0].reading_km - logs[logs.length - 1].reading_km;
  return Math.round(totalKm / totalMonths);
}
