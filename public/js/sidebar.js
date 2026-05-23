function renderSidebar() {
  const html = `
  <aside class="sidebar">
    <img src="./img/close.png"> 
    <div class="sidebar-logo">
      <div class="logo-icon">🚗</div>
      <h1>كار تراكر</h1>
      <p>نظام متابعة السيارات</p>
    </div>
    <nav class="nav-section" style="margin-top:8px">

      <div class="nav-label">القائمة</div>
      <a class="nav-item" href="/" data-page="">
        <span class="nav-icon">📊</span> لوحة المتابعة
      </a>
      <a class="nav-item" href="/cars" data-page="cars">
        <span class="nav-icon">🚙</span> السيارات
        <span class="nav-badge blue hidden" id="nb-cars"></span>
      </a>
      <a class="nav-item" href="/odometer" data-page="odometer">
        <span class="nav-icon">🧭</span> قراءات العداد
      </a>
      <a class="nav-item" href="/odometer-capture" data-page="odometer-capture">
        <span class="nav-icon">📸</span> تسجيل عداد بالكاميرا
      </a>
      <a class="nav-item" href="/oil" data-page="oil">
        <span class="nav-icon">🛢️</span> تغيير الزيت
        <span class="nav-badge hidden" id="nb-oil"></span>
      </a>
      <a class="nav-item" href="/filters" data-page="filters">
        <span class="nav-icon">🧰</span> الفلاتر
        <span class="nav-badge warn hidden" id="nb-filters"></span>
      </a>
      <a class="nav-item" href="/licenses" data-page="licenses">
        <span class="nav-icon">📋</span> الرخص
        <span class="nav-badge hidden" id="nb-licenses"></span>
      </a>
      <a class="nav-item" href="/reports" data-page="reports">
        <span class="nav-icon">📈</span> التقارير
      </a>
      <a class="nav-item" href="/monthly-reports" data-page="monthly-reports">
        <span class="nav-icon">🗓</span> تقارير الشهر
      </a>
      <a class="nav-item" href="/oil-status" data-page="oil-status">
        <span class="nav-icon">🛢️</span> حالة الزيت
      </a>
    </nav>
  </aside>`;
  document.getElementById('sidebar-mount').innerHTML = html;
}
