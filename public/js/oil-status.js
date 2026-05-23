renderSidebar();

let allRows = [];
let sortCol = "status_order";
let sortDir = "asc";
let activeStatusFilter = "";

const REPORT_CONFIG = {
  engine_oil: {
    title: "تقرير زيت ماتور",
    fetchPath: "/reports/oil-status",
  },
  oil_filter: {
    title: "تقرير فلاتر زيت",
    fetchPath: "/filters?filter_type=oil",
  },
  air_filter: {
    title: "تقرير فلاتر هواء",
    fetchPath: "/filters?filter_type=air",
  },
  fuel_filter: {
    title: "تقرير فلتر جاز",
    fetchPath: "/filters?filter_type=fuel",
  },
};

function getCurrentReportType() {
  return document.getElementById("report-type")?.value || "engine_oil";
}

function normalizeFilterRow(row) {
  const kmAtChange = row.km_at_change != null ? Number(row.km_at_change) : null;
  const nextChangeKm =
    row.next_change_km != null ? Number(row.next_change_km) : null;
  const currentKm = Number(row.current_km || 0);
  const nextAtKm =
    row.next_filter_at_km != null
      ? Number(row.next_filter_at_km)
      : kmAtChange != null && nextChangeKm != null
        ? kmAtChange + nextChangeKm
        : null;
  const remaining =
    row.km_remaining != null
      ? Number(row.km_remaining)
      : nextAtKm != null
        ? nextAtKm - currentKm
        : null;
  const usagePct =
    kmAtChange != null && nextChangeKm
      ? ((currentKm - kmAtChange) / nextChangeKm) * 100
      : 0;

  return {
    ...row,
    last_oil_date: row.change_date || null,
    last_oil_km: kmAtChange,
    next_oil_at_km: nextAtKm,
    km_remaining: remaining,
    usage_pct: usagePct,
  };
}

function calcStatus(row) {
  if (row.last_oil_km == null) {
    return {
      key: "none",
      label: "بدون سجل",
      icon: "•",
      cls: "sb-none",
      order: 0,
    };
  }
  const rem = Number(row.km_remaining);
  if (rem < 0)
    return {
      key: "overdue",
      label: "متأخر " + Math.abs(rem).toLocaleString("ar-EG") + " كم",
      icon: "!",
      cls: "sb-overdue",
      order: 1,
    };
  if (rem < 1500)
    return {
      key: "urgent",
      label: "عاجل",
      icon: "!",
      cls: "sb-urgent",
      order: 2,
    };
  if (rem < 3000)
    return { key: "soon", label: "قريب", icon: "~", cls: "sb-soon", order: 3 };
  return { key: "ok", label: "سليم", icon: "+", cls: "sb-ok", order: 4 };
}

function getStatusSummary(rows) {
  return {
    total: rows.length,
    overdue: rows.filter(
      (row) => row.km_remaining != null && Number(row.km_remaining) < 0,
    ).length,
    urgent: rows.filter(
      (row) =>
        row.km_remaining != null &&
        Number(row.km_remaining) >= 0 &&
        Number(row.km_remaining) < 1500,
    ).length,
    soon: rows.filter(
      (row) =>
        row.km_remaining != null &&
        Number(row.km_remaining) >= 1500 &&
        Number(row.km_remaining) < 3000,
    ).length,
    ok: rows.filter(
      (row) => row.km_remaining != null && Number(row.km_remaining) >= 3000,
    ).length,
    no_record: rows.filter((row) => row.last_oil_km == null).length,
  };
}

function renderStatusBar(summary) {
  const cards = [
    {
      id: "total",
      cls: "s-total",
      lbl: "كل السيارات",
      val: summary.total,
      filter: null,
    },
    {
      id: "overdue",
      cls: "s-overdue",
      lbl: "متأخر",
      val: summary.overdue,
      filter: "overdue",
    },
    {
      id: "urgent",
      cls: "s-urgent",
      lbl: "عاجل",
      val: summary.urgent,
      filter: "urgent",
    },
    {
      id: "soon",
      cls: "s-soon",
      lbl: "قريب",
      val: summary.soon,
      filter: "soon",
    },
    { id: "ok", cls: "s-ok", lbl: "سليمة", val: summary.ok, filter: "ok" },
    {
      id: "none",
      cls: "s-none",
      lbl: "بدون سجل",
      val: summary.no_record,
      filter: "none",
    },
  ];

  document.getElementById("status-bar").innerHTML = cards
    .map(
      (card) => `
          <div class="status-card ${card.cls} ${activeStatusFilter === card.filter ? "active" : ""}" 
               onclick="filterQuick('${card.filter || ""}')" style="cursor:pointer">
            <div class="sc-val">${card.val}</div>
            <div class="sc-lbl">${card.lbl}</div>
          </div>
        `,
    )
    .join("");
}

function filterQuick(status) {
  // Toggle: إذا كان الفلتر مختاراً بالفعل، قم بإلغائه
  activeStatusFilter = activeStatusFilter === status ? "" : status;
  applyFilters();
}

function applyFilters() {
  const search = document.getElementById("search").value.trim().toLowerCase();

  // 1. الفلترة بناءً على البحث فقط (لتحديث أرقام الكروت)
  const searchFiltered = allRows.filter((row) => {
    return (
      !search ||
      row.plate.toLowerCase().includes(search) ||
      (row.driver || "").toLowerCase().includes(search) ||
      (row.make + " " + row.model).toLowerCase().includes(search)
    );
  });

  // تحديث الكروت بناءً على نتيجة البحث
  renderStatusBar(getStatusSummary(searchFiltered));

  // 2. الفلترة بناءً على الحالة والبحث معاً (لعرض الجدول)
  const finalFiltered = searchFiltered
    .filter((row) => {
      if (!activeStatusFilter) return true;
      return calcStatus(row).key === activeStatusFilter;
    })
    .sort((a, b) => {
      let va =
        a[sortCol] ?? (sortCol === "status_order" ? calcStatus(a).order : null);
      let vb =
        b[sortCol] ?? (sortCol === "status_order" ? calcStatus(b).order : null);

      if (sortCol === "status_order") {
        va = calcStatus(a).order;
        vb = calcStatus(b).order;
      }

      if (["plate", "model", "driver"].includes(sortCol)) {
        va = String(va || "");
        vb = String(vb || "");
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc"
        ? Number(va ?? 99999) - Number(vb ?? 99999)
        : Number(vb ?? 99999) - Number(va ?? 99999);
    });

  const tbody = document.getElementById("table-body");
  if (!finalFiltered.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--text2)">لا توجد نتائج مطابقة</td></tr>`;
  } else {
    tbody.innerHTML = finalFiltered
      .map((row, index) => renderRow(row, index))
      .join("");
  }

  document.getElementById("row-count").textContent =
    `${finalFiltered.length} سيارة`;
}

// --- بقية الدوال المساعدة (نفس الكود السابق) ---
function barColor(pct) {
  if (pct >= 100) return "var(--red)";
  if (pct >= 85) return "var(--orange)";
  if (pct >= 70) return "var(--yellow)";
  return "var(--green)";
}
function safeFmtKm(value) {
  return Number(value || 0).toLocaleString("ar-EG") + " كم";
}
function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("ar-EG") : "—";
}

function renderRow(row, idx) {
  const st = calcStatus(row);
  const pct = Math.min(Math.max(Number(row.usage_pct) || 0, 0), 120);
  const rem = row.km_remaining != null ? Number(row.km_remaining) : null;
  const rowClass =
    st.key === "overdue"
      ? "row-overdue"
      : st.key === "urgent"
        ? "row-urgent"
        : "";

  return `
          <tr class="${rowClass}" data-status="${st.key}">
            <td style="color:var(--text3);font-size:12px">${idx + 1}</td>
            <td class="plate-cell">${row.plate}</td>
            <td>
              <div style="font-weight:600">${row.make} ${row.model}</div>
              <div class="date-cell">${row.last_oil_date ? "آخر تغيير: " + fmtDate(row.last_oil_date) : "لا يوجد سجل"}</div>
            </td>
            <td class="driver-cell">${row.driver || "—"}</td>
            <td class="km-cell">${row.last_oil_km != null ? safeFmtKm(row.last_oil_km) : "—"}</td>
            <td class="km-cell" style="color:var(--accent)">${safeFmtKm(row.current_km)}</td>
            <td class="km-cell">${row.next_oil_at_km != null ? safeFmtKm(row.next_oil_at_km) : "—"}</td>
            <td>
              ${
                rem !== null
                  ? `
                <div class="km-bar-wrap">
                  <div class="km-bar-bg"><div class="km-bar-fill" style="width:${Math.min(pct, 100)}%;background:${barColor(pct)}"></div></div>
                  <span class="km-pct-txt" style="color:${barColor(pct)}">${Math.round(pct)}%</span>
                </div>
                <div style="font-size:11px;margin-top:3px;color:${rem < 0 ? "var(--red)" : rem < 1500 ? "var(--orange)" : "var(--text2)"}">
                  ${rem < 0 ? "تجاوز " + safeFmtKm(Math.abs(rem)) : "متبقي " + safeFmtKm(rem)}
                </div>`
                  : '<span style="color:var(--text3)">—</span>'
              }
            </td>
            <td><span class="status-badge ${st.cls}">${st.icon} ${st.label}</span></td>
          </tr>`;
}

function sortBy(col) {
  if (sortCol === col) sortDir = sortDir === "asc" ? "desc" : "asc";
  else {
    sortCol = col;
    sortDir = "asc";
  }

  document
    .querySelectorAll(".report-tbl thead th")
    .forEach((th) => th.classList.remove("sort-asc", "sort-desc"));
  const headers = [
    "#",
    "plate",
    "model",
    "driver",
    "last_oil_km",
    "current_km",
    "next_oil_at_km",
    "km_remaining",
    "status_order",
  ];
  const idx = headers.indexOf(col);
  if (idx > -1)
    document
      .querySelectorAll(".report-tbl thead th")
      [idx].classList.add(sortDir === "asc" ? "sort-asc" : "sort-desc");

  applyFilters();
}

async function loadReport() {
  document.getElementById("table-body").innerHTML =
    `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--text2)">جارٍ التحميل...</td></tr>`;
  try {
    const reportType = getCurrentReportType();
    const config = REPORT_CONFIG[reportType] || REPORT_CONFIG.engine_oil;
    const response = await get(config.fetchPath);
    const rows =
      reportType === "engine_oil"
        ? response.rows || []
        : (response.data || []).map(normalizeFilterRow);
    const summary =
      reportType === "engine_oil"
        ? response.summary || getStatusSummary(rows)
        : getStatusSummary(rows);

    activeStatusFilter = "";
    if (document.getElementById("report-title"))
      document.getElementById("report-title").textContent = config.title;
    document.getElementById("report-date").textContent =
      "تم الإنشاء: " +
      new Date().toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    allRows = rows;
    renderExecutiveSummary(rows, summary); // تأكد أن هذه الدالة موجودة كما في كودك الأصلي
    applyFilters();
  } catch (e) {
    toast(e.message, "error");
    document.getElementById("table-body").innerHTML =
      `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--red)">${e.message}</td></tr>`;
  }
}

// إعادة تعريف RenderExecutiveSummary للتأكد من أنها تعمل مع النظام الجديد
function renderExecutiveSummary(rows, summary) {
  // ضع هنا نفس كود renderExecutiveSummary الموجود في ملفك الأصلي بدون تغيير
  // (لقد حذفته هنا للاختصار ولكن يجب أن تتركه في ملفك)
}

loadReport();
