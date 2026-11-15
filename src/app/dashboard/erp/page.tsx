"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Product = { id: string; name: string; sku: string; cost: number; price: number; stock: number; minStock: number; category: string };
type Order = { id: string; customer: string; phone: string; wilaya: string; productId: string; productName: string; quantity: number; unitPrice: number; unitCost: number; deliveryCost: number; packagingCost: number; status: string; payment: string; date: string; note: string };
type Expense = { id: string; title: string; category: string; amount: number; date: string; type: string; note: string };
type Supplier = { id: string; name: string; phone: string; contact: string; note: string };
type StoreData = { products: Product[]; orders: Order[]; expenses: Expense[]; suppliers: Supplier[] };
type Section = "overview" | "orders" | "products" | "expenses" | "inventory" | "suppliers" | "reports" | "settings";
const KEY = "qitmir-mini-erp-v1";
const money = (n: number) => new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(Math.round(n || 0)) + " دج";
const today = () => new Date().toISOString().slice(0, 10);
const blank: StoreData = { products: [], orders: [], expenses: [], suppliers: [] };
const nav: { id: Section; label: string; icon: string; group: string }[] = [
  { id: "overview", label: "نظرة عامة", icon: "▦", group: "الرئيسية" },
  { id: "orders", label: "الطلبات والمبيعات", icon: "▤", group: "إدارة المتجر" },
  { id: "products", label: "المنتجات", icon: "◇", group: "إدارة المتجر" },
  { id: "inventory", label: "المخزون", icon: "▥", group: "إدارة المتجر" },
  { id: "suppliers", label: "الموردون", icon: "♧", group: "إدارة المتجر" },
  { id: "expenses", label: "المصاريف", icon: "↗", group: "المالية" },
  { id: "reports", label: "التقارير والأرباح", icon: "▥", group: "المالية" },
  { id: "settings", label: "الإعدادات والنسخ الاحتياطي", icon: "⚙", group: "النظام" }
];
const statuses = ["جديد", "تأكيد الطلب", "قيد التحضير", "مع شركة التوصيل", "تم التسليم", "ملغى", "مرتجع"];
const categories = ["شراء البضاعة", "الإعلانات والتسويق", "التوصيل", "التغليف", "اشتراكات وخدمات", "أجور", "تنقلات", "رسوم بنكية", "مصاريف عامة", "أخرى"];
const id = () => Math.random().toString(36).slice(2, 10);

export default function CommerceERPPage() {
  const [data, setData] = useState<StoreData>(blank);
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [modal, setModal] = useState<"order" | "product" | "expense" | "supplier" | null>(null);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("month");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState("الكل");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StoreData;
        setData({ ...blank, ...parsed });
      }
    } catch { setNotice("تعذر قراءة البيانات المحفوظة. جرّب استيراد نسخة احتياطية."); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, ready]);

  const setField = (key: string, value: string) => setForm((v) => ({ ...v, [key]: value }));
  const openModal = (kind: NonNullable<typeof modal>) => {
    setForm({ date: today(), status: "جديد", payment: "غير مدفوع", type: "متغيرة", category: categories[0], quantity: "1", stock: "0", minStock: "3", cost: "0", price: "0", deliveryCost: "0", packagingCost: "0" });
    setModal(kind);
  };
  const closeModal = () => setModal(null);
  const addExpense = (e: FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.title?.trim() || !Number.isFinite(amount) || amount <= 0) return;
    setData((d) => ({ ...d, expenses: [{ id: id(), title: form.title.trim(), category: form.category || "أخرى", amount, date: form.date || today(), type: form.type || "متغيرة", note: form.note || "" }, ...d.expenses] }));
    closeModal();
  };
  const addProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    const p: Product = { id: id(), name: form.name.trim(), sku: form.sku || "", cost: Number(form.cost) || 0, price: Number(form.price) || 0, stock: Number(form.stock) || 0, minStock: Number(form.minStock) || 0, category: form.category || "عام" };
    setData((d) => ({ ...d, products: [p, ...d.products] }));
    closeModal();
  };
  const addOrder = (e: FormEvent) => {
    e.preventDefault();
    const p = data.products.find((x) => x.id === form.productId);
    if (!form.customer?.trim() || !p || Number(form.quantity) < 1) return;
    if (Number(form.quantity) > p.stock) { window.alert("الكمية المطلوبة أكبر من المخزون المتاح."); return; }
    const quantity = Number(form.quantity);
    const order: Order = { id: "QT-" + Date.now().toString().slice(-7), customer: form.customer.trim(), phone: form.phone || "", wilaya: form.wilaya || "", productId: p.id, productName: p.name, quantity, unitPrice: Number(form.unitPrice || p.price), unitCost: p.cost, deliveryCost: Number(form.deliveryCost) || 0, packagingCost: Number(form.packagingCost) || 0, status: form.status || "جديد", payment: form.payment || "غير مدفوع", date: form.date || today(), note: form.note || "" };
    setData((d) => ({ ...d, orders: [order, ...d.orders], products: d.products.map((x) => x.id === p.id && !["ملغى", "مرتجع"].includes(order.status) ? { ...x, stock: Math.max(0, x.stock - quantity) } : x) }));
    closeModal();
  };
  const addSupplier = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    setData((d) => ({ ...d, suppliers: [{ id: id(), name: form.name.trim(), phone: form.phone || "", contact: form.contact || "", note: form.note || "" }, ...d.suppliers] }));
    closeModal();
  };
  const updateOrder = (orderId: string, patch: Partial<Order>) => setData((d) => {
    const current = d.orders.find((o) => o.id === orderId);
    if (!current) return d;
    const nextStatus = patch.status ?? current.status;
    const wasClosed = ["ملغى", "مرتجع"].includes(current.status);
    const isClosed = ["ملغى", "مرتجع"].includes(nextStatus);
    const stockDelta = wasClosed === isClosed ? 0 : (isClosed ? current.quantity : -current.quantity);
    return {
      ...d,
      orders: d.orders.map((o) => o.id === orderId ? { ...o, ...patch } : o),
      products: stockDelta === 0 ? d.products : d.products.map((p) => p.id === current.productId ? { ...p, stock: Math.max(0, p.stock + stockDelta) } : p)
    };
  });
  const deleteItem = (collection: keyof StoreData, itemId: string) => {
    if (!window.confirm("هل تريد حذف هذا السجل نهائياً؟")) return;
    setData((d) => ({ ...d, [collection]: d[collection].filter((x) => x.id !== itemId) }));
  };

  const orderRevenue = (o: Order) => o.status === "ملغى" || o.status === "مرتجع" ? 0 : o.unitPrice * o.quantity;
  const orderCost = (o: Order) => o.status === "ملغى" ? 0 : (o.unitCost * o.quantity) + o.deliveryCost + o.packagingCost;
  const delivered = data.orders.filter((o) => o.status === "تم التسليم");
  const totalSales = delivered.reduce((s, o) => s + orderRevenue(o), 0);
  const productCost = delivered.reduce((s, o) => s + o.unitCost * o.quantity, 0);
  const orderOpsCost = delivered.reduce((s, o) => s + o.deliveryCost + o.packagingCost, 0);
  const allExpenses = data.expenses.reduce((s, x) => s + x.amount, 0);
  const grossProfit = totalSales - productCost - orderOpsCost;
  const netProfit = grossProfit - allExpenses;
  const pending = data.orders.filter((o) => !["تم التسليم", "ملغى", "مرتجع"].includes(o.status)).length;
  const stockValue = data.products.reduce((s, p) => s + p.stock * p.cost, 0);
  const lowStock = data.products.filter((p) => p.stock <= p.minStock);
  const monthKey = today().slice(0, 7);
  const monthOrders = data.orders.filter((o) => o.date.startsWith(monthKey));
  const monthSales = monthOrders.filter((o) => o.status === "تم التسليم").reduce((s, o) => s + orderRevenue(o), 0);
  const recentOrders = data.orders.slice(0, 6);
  const filteredOrders = data.orders.filter((o) => (statusFilter === "الكل" || o.status === statusFilter) && [o.id, o.customer, o.phone, o.productName, o.wilaya].join(" ").toLowerCase().includes(query.toLowerCase()));
  const filteredProducts = data.products.filter((p) => [p.name, p.sku, p.category].join(" ").toLowerCase().includes(query.toLowerCase()));
  const expenseGroups = categories.map((c) => ({ name: c, value: data.expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  const pageTitle = nav.find((x) => x.id === section)?.label || "لوحة التحكم";

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "qitmir-erp-backup-" + today() + ".json"; a.click(); URL.revokeObjectURL(url);
  };
  const importData = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const imported = parsed.data || parsed;
        if (!Array.isArray(imported.products) || !Array.isArray(imported.orders) || !Array.isArray(imported.expenses) || !Array.isArray(imported.suppliers)) throw new Error("invalid");
        if (!window.confirm("سيتم استبدال البيانات الحالية بالنسخة المستوردة. هل تريد المتابعة؟")) return;
        setData(imported); setNotice("تم استيراد النسخة الاحتياطية بنجاح.");
      } catch { setNotice("ملف النسخة الاحتياطية غير صالح."); }
    };
    reader.readAsText(file);
  };

  if (!ready) return <div className="p-10 text-center text-muted-foreground">جارٍ تحميل بيانات متجرك…</div>;

  return (
    <div dir="rtl" className="min-h-screen bg-muted/20 text-foreground">
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 md:p-7">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002432] text-2xl font-black text-[#F78837] ring-1 ring-[#F78837]/30">ق</div>
            <div><p className="text-xs font-bold tracking-widest text-[#F78837]">QITMIR · قيتمير</p><h1 className="mt-1 text-2xl font-bold">إدارة تجارتك الإلكترونية</h1><p className="mt-1 text-sm text-muted-foreground">كل الطلبات والمخزون والمصاريف والأرباح في مكان واحد</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportData} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted">↓ تصدير نسخة احتياطية</button>
            <button onClick={() => openModal("order")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">＋ طلب جديد</button>
          </div>
        </div>

        {notice && <div className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"><span>{notice}</span><button onClick={() => setNotice("")}>✕</button></div>}

        <div className="grid grid-cols-2 gap-2 overflow-x-auto rounded-2xl border bg-card p-2 md:grid-cols-4 lg:grid-cols-8">
          {nav.map((item) => <button key={item.id} onClick={() => { setSection(item.id); setQuery(""); }} className={"flex min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition md:text-sm " + (section === item.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><span className="text-base">{item.icon}</span><span>{item.label}</span></button>)}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-bold">{pageTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{section === "overview" ? "ملخص شامل لأداء متجرك ووضعك المالي" : "إدارة ومتابعة بيانات نشاطك التجاري"}</p></div>
          <div className="flex flex-wrap gap-2">
            {section === "orders" && <button onClick={() => openModal("order")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">＋ إضافة طلب</button>}
            {section === "products" && <button onClick={() => openModal("product")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">＋ إضافة منتج</button>}
            {section === "expenses" && <button onClick={() => openModal("expense")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">＋ تسجيل مصروف</button>}
            {section === "suppliers" && <button onClick={() => openModal("supplier")} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">＋ مورد جديد</button>}
          </div>
        </div>

        {section === "overview" && <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric title="إجمالي المبيعات المسلّمة" value={money(totalSales)} hint="الطلبات التي تم تسليمها فقط" icon="↗" />
            <Metric title="صافي الربح التقديري" value={money(netProfit)} hint="بعد تكلفة البضاعة والتشغيل والمصاريف" icon="◈" positive={netProfit >= 0} />
            <Metric title="طلبات قيد المعالجة" value={String(pending)} hint="لا تشمل الملغاة والمرتجعة" icon="▤" />
            <Metric title="قيمة المخزون بالتكلفة" value={money(stockValue)} hint={lowStock.length + " منتجات عند حد إعادة الطلب"} icon="▥" />
          </div>
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5 xl:col-span-2"><div className="mb-4 flex items-center justify-between"><h3 className="font-bold">الأداء المالي</h3><span className="rounded-lg bg-muted px-3 py-1 text-xs text-muted-foreground">هذا الشهر</span></div><div className="grid gap-3 sm:grid-cols-3"><MiniStat label="مبيعات الشهر" value={money(monthSales)} /><MiniStat label="إجمالي المصاريف المسجلة" value={money(allExpenses)} /><MiniStat label="الربح الإجمالي" value={money(grossProfit)} /></div><div className="mt-5 rounded-xl bg-muted/60 p-4 text-sm leading-7 text-muted-foreground">يُحتسب الربح من الطلبات التي تم تسليمها فقط. صافي الربح = المبيعات − تكلفة المنتجات − التوصيل والتغليف − المصاريف العامة المسجلة. أضف كل المصاريف حتى تحصل على نتيجة واقعية.</div></div>
            <div className="rounded-2xl border bg-card p-5"><h3 className="mb-4 font-bold">تنبيهات المخزون</h3>{lowStock.length ? <div className="space-y-3">{lowStock.slice(0,5).map((p) => <div key={p.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"><div><p className="text-sm font-semibold">{p.name}</p><p className="text-xs text-muted-foreground">الحد الأدنى {p.minStock}</p></div><span className="rounded-lg bg-amber-100 px-2 py-1 text-sm font-bold text-amber-800">{p.stock} متبقي</span></div>)}</div> : <Empty text="لا توجد تنبيهات. أضف منتجاتك ومخزونك للبدء." />}</div>
          </div>
          <div className="rounded-2xl border bg-card p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-bold">أحدث الطلبات</h3><button onClick={() => setSection("orders")} className="text-sm font-semibold text-primary">عرض الكل ←</button></div><OrderTable orders={recentOrders} updateOrder={updateOrder} deleteOrder={(x) => deleteItem("orders", x)} /></div>
        </>}

        {section === "orders" && <div className="space-y-4 rounded-2xl border bg-card p-5"><div className="flex flex-col gap-2 sm:flex-row"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث برقم الطلب أو العميل أو المنتج…" className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border bg-background px-3 py-2 text-sm"><option>الكل</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div><OrderTable orders={filteredOrders} updateOrder={updateOrder} deleteOrder={(x) => deleteItem("orders", x)} /></div>}

        {section === "products" && <div className="rounded-2xl border bg-card p-5"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتج أو رمز SKU…" className="mb-4 w-full rounded-xl border bg-background px-3 py-2 text-sm sm:max-w-sm" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-right text-sm"><thead className="bg-muted/60 text-muted-foreground"><tr>{["المنتج","SKU","سعر الشراء","سعر البيع","هامش الوحدة","المخزون",""].map((x) => <th key={x} className="p-3 font-semibold">{x}</th>)}</tr></thead><tbody>{filteredProducts.map((p) => <tr key={p.id} className="border-b last:border-0"><td className="p-3 font-semibold">{p.name}<div className="text-xs text-muted-foreground">{p.category}</div></td><td className="p-3">{p.sku || "—"}</td><td className="p-3">{money(p.cost)}</td><td className="p-3">{money(p.price)}</td><td className="p-3 font-semibold text-emerald-700">{money(p.price-p.cost)}</td><td className="p-3">{p.stock}</td><td className="p-3"><button onClick={() => deleteItem("products", p.id)} className="text-xs text-red-600">حذف</button></td></tr>)}</tbody></table></div>{!filteredProducts.length && <Empty text="لا توجد منتجات بعد. أضف أول منتج لتبدأ إدارة المخزون والطلبات." />}</div>}

        {section === "inventory" && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.products.map((p) => <div key={p.id} className="rounded-2xl border bg-card p-5"><div className="flex items-start justify-between"><div><h3 className="font-bold">{p.name}</h3><p className="mt-1 text-xs text-muted-foreground">{p.sku || "بدون SKU"}</p></div><span className={"rounded-lg px-2 py-1 text-xs font-bold " + (p.stock <= p.minStock ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>{p.stock <= p.minStock ? "مخزون منخفض" : "متوفر"}</span></div><div className="mt-5 flex items-end justify-between"><div><p className="text-xs text-muted-foreground">الكمية الحالية</p><p className="text-3xl font-bold">{p.stock}</p></div><div className="text-left"><p className="text-xs text-muted-foreground">قيمة المخزون</p><p className="font-semibold">{money(p.stock*p.cost)}</p></div></div><div className="mt-4 flex gap-2"><button onClick={() => setData((d) => ({...d, products:d.products.map((x)=>x.id===p.id?{...x,stock:x.stock+1}:x)}))} className="flex-1 rounded-lg border py-2 text-sm hover:bg-muted">＋ زيادة</button><button onClick={() => setData((d) => ({...d, products:d.products.map((x)=>x.id===p.id?{...x,stock:Math.max(0,x.stock-1)}:x)}))} className="flex-1 rounded-lg border py-2 text-sm hover:bg-muted">− إنقاص</button></div></div>)}{!data.products.length && <Empty text="أضف المنتجات أولاً لتتمكن من متابعة المخزون." />}</div>}

        {section === "expenses" && <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-3"><Metric title="إجمالي المصاريف" value={money(allExpenses)} hint="كل السجلات" icon="↘" /><Metric title="مصاريف ثابتة" value={money(data.expenses.filter((e)=>e.type==="ثابتة").reduce((s,e)=>s+e.amount,0))} hint="مثل الاشتراكات والإيجار" icon="▣" /><Metric title="مصاريف متغيرة" value={money(data.expenses.filter((e)=>e.type!=="ثابتة").reduce((s,e)=>s+e.amount,0))} hint="مثل الإعلانات والتغليف" icon="↗" /></div><div className="rounded-2xl border bg-card p-5"><h3 className="mb-4 font-bold">سجل المصاريف</h3><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-right text-sm"><thead className="bg-muted/60 text-muted-foreground"><tr>{["التاريخ","البيان","التصنيف","النوع","المبلغ",""].map((x)=><th key={x} className="p-3">{x}</th>)}</tr></thead><tbody>{data.expenses.map((e)=><tr key={e.id} className="border-b last:border-0"><td className="p-3">{e.date}</td><td className="p-3 font-semibold">{e.title}<div className="text-xs text-muted-foreground">{e.note}</div></td><td className="p-3">{e.category}</td><td className="p-3">{e.type}</td><td className="p-3 font-bold">{money(e.amount)}</td><td className="p-3"><button onClick={()=>deleteItem("expenses",e.id)} className="text-xs text-red-600">حذف</button></td></tr>)}</tbody></table></div>{!data.expenses.length&&<Empty text="لا توجد مصاريف مسجلة. أضف كل ما تدفعه حتى يظهر صافي الربح الحقيقي." />}</div></div>}

        {section === "suppliers" && <div className="rounded-2xl border bg-card p-5"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{data.suppliers.map((s)=><div key={s.id} className="rounded-xl border p-4"><div className="flex justify-between gap-2"><h3 className="font-bold">{s.name}</h3><button onClick={()=>deleteItem("suppliers",s.id)} className="text-xs text-red-600">حذف</button></div><p className="mt-2 text-sm text-muted-foreground">{s.phone || "لا يوجد هاتف"}</p><p className="text-sm text-muted-foreground">{s.contact}</p><p className="mt-2 text-xs">{s.note}</p></div>)}</div>{!data.suppliers.length&&<Empty text="احفظ بيانات مورديك وأرقام التواصل لتسهيل إعادة الطلب." />}</div>}

        {section === "reports" && <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric title="المبيعات المسلّمة" value={money(totalSales)} hint="إيرادات الطلبات المكتملة" icon="↗" /><Metric title="تكلفة البضاعة المباعة" value={money(productCost)} hint="حسب تكلفة المنتج وقت الطلب" icon="▤" /><Metric title="مصاريف الطلبات" value={money(orderOpsCost)} hint="التوصيل والتغليف" icon="▣" /><Metric title="صافي الربح" value={money(netProfit)} hint="بعد المصاريف العامة" icon="◈" positive={netProfit>=0} /></div><div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-card p-5"><h3 className="mb-4 font-bold">المصاريف حسب التصنيف</h3>{expenseGroups.length?expenseGroups.map((g)=><div key={g.name} className="mb-4"><div className="mb-1 flex justify-between text-sm"><span>{g.name}</span><b>{money(g.value)}</b></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:Math.min(100,g.value/Math.max(1,allExpenses)*100)+"%"}} /></div></div>):<Empty text="سجّل مصاريفك لعرض توزيعها." />}</div><div className="rounded-2xl border bg-card p-5"><h3 className="mb-4 font-bold">ملخص حساب الأرباح</h3>{[["إجمالي المبيعات",totalSales],["تكلفة المنتجات",-productCost],["التوصيل والتغليف",-orderOpsCost],["الربح الإجمالي",grossProfit],["المصاريف العامة",-allExpenses],["صافي الربح",netProfit]].map(([label,value])=><div key={String(label)} className="flex justify-between border-b py-3 text-sm last:border-0"><span className={String(label).includes("الربح")?"font-bold":""}>{label}</span><b className={Number(value)<0?"text-red-600":""}>{money(Number(value))}</b></div>)}</div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">تنبيه محاسبي: هذا تقرير إداري تشغيلي وليس تصريحاً ضريبياً أو محاسبة قانونية. تأكد من تسجيل كل المصاريف، ولا تسجل مصروف شراء المخزون مرة أخرى كمصروف عام إذا كانت تكلفة البضاعة محسوبة ضمن الطلبات، لتجنب احتساب التكلفة مرتين.</div></div>}

        {section === "settings" && <div className="grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border bg-card p-5"><h3 className="font-bold">النسخ الاحتياطي واستعادة البيانات</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">بياناتك محفوظة محلياً داخل هذا المتصفح. صدّر نسخة احتياطية بانتظام، ثم استوردها عند الانتقال إلى جهاز آخر.</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={exportData} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">تنزيل نسخة احتياطية JSON</button><label className="cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-muted">استيراد نسخة<input type="file" accept="application/json,.json" className="hidden" onChange={(e)=>importData(e.target.files?.[0])} /></label></div></div><div className="rounded-2xl border bg-card p-5"><h3 className="font-bold">ملخص قاعدة البيانات المحلية</h3><div className="mt-4 grid grid-cols-2 gap-3">{[["المنتجات",data.products.length],["الطلبات",data.orders.length],["المصاريف",data.expenses.length],["الموردون",data.suppliers.length]].map(([k,v])=><div key={String(k)} className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div><p className="mt-4 text-xs leading-6 text-muted-foreground">هذه النسخة لا ترسل بياناتك إلى خادم. المزامنة المباشرة بين الهاتف والحاسوب وقاعدة البيانات السحابية تحتاج إعداد Backend آمن في مرحلة لاحقة.</p></div></div>}
      </div>

      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3" onMouseDown={(e)=>{if(e.target===e.currentTarget)closeModal();}}><form onSubmit={modal==="order"?addOrder:modal==="product"?addProduct:modal==="expense"?addExpense:addSupplier} className="my-6 max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl bg-card p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-lg font-bold">{modal==="order"?"إضافة طلب جديد":modal==="product"?"إضافة منتج":modal==="expense"?"تسجيل مصروف":"إضافة مورد"}</h3><button type="button" onClick={closeModal} className="rounded-lg border px-3 py-1">✕</button></div>
        {modal==="order"&&<><div className="grid gap-3 sm:grid-cols-2"><Field label="اسم العميل *" value={form.customer||""} onChange={(v)=>setField("customer",v)} required /><Field label="رقم الهاتف" value={form.phone||""} onChange={(v)=>setField("phone",v)} /><Field label="الولاية" value={form.wilaya||""} onChange={(v)=>setField("wilaya",v)} /><label className="grid gap-1 text-sm"><span>المنتج *</span><select required value={form.productId||""} onChange={(e)=>{const p=data.products.find(x=>x.id===e.target.value);setForm(v=>({...v,productId:e.target.value,unitPrice:String(p?.price??0)}));}} className="rounded-xl border bg-background px-3 py-2"><option value="">اختر منتجاً</option>{data.products.map(p=><option key={p.id} value={p.id}>{p.name} (المخزون: {p.stock})</option>)}</select></label><Field label="الكمية" type="number" value={form.quantity||"1"} onChange={(v)=>setField("quantity",v)} required /><Field label="سعر البيع للوحدة (دج)" type="number" value={form.unitPrice||""} onChange={(v)=>setField("unitPrice",v)} required /><Field label="مصاريف التوصيل (دج)" type="number" value={form.deliveryCost||"0"} onChange={(v)=>setField("deliveryCost",v)} /><Field label="التغليف (دج)" type="number" value={form.packagingCost||"0"} onChange={(v)=>setField("packagingCost",v)} /><Field label="تاريخ الطلب" type="date" value={form.date||today()} onChange={(v)=>setField("date",v)} /><label className="grid gap-1 text-sm"><span>حالة الطلب</span><select value={form.status||"جديد"} onChange={(e)=>setField("status",e.target.value)} className="rounded-xl border bg-background px-3 py-2">{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label className="grid gap-1 text-sm"><span>الدفع</span><select value={form.payment||"غير مدفوع"} onChange={(e)=>setField("payment",e.target.value)} className="rounded-xl border bg-background px-3 py-2"><option>غير مدفوع</option><option>مدفوع</option><option>عند الاستلام</option></select></label></div><Field label="ملاحظات" value={form.note||""} onChange={(v)=>setField("note",v)} /></>}
        {modal==="product"&&<div className="grid gap-3 sm:grid-cols-2"><Field label="اسم المنتج *" value={form.name||""} onChange={(v)=>setField("name",v)} required /><Field label="رمز SKU" value={form.sku||""} onChange={(v)=>setField("sku",v)} /><Field label="التصنيف" value={form.category||""} onChange={(v)=>setField("category",v)} /><Field label="سعر الشراء (دج)" type="number" value={form.cost||"0"} onChange={(v)=>setField("cost",v)} /><Field label="سعر البيع (دج)" type="number" value={form.price||"0"} onChange={(v)=>setField("price",v)} /><Field label="الكمية الأولية" type="number" value={form.stock||"0"} onChange={(v)=>setField("stock",v)} /><Field label="حد التنبيه للمخزون" type="number" value={form.minStock||"3"} onChange={(v)=>setField("minStock",v)} /></div>}
        {modal==="expense"&&<div className="grid gap-3 sm:grid-cols-2"><Field label="اسم المصروف *" value={form.title||""} onChange={(v)=>setField("title",v)} required /><Field label="المبلغ (دج) *" type="number" value={form.amount||""} onChange={(v)=>setField("amount",v)} required /><label className="grid gap-1 text-sm"><span>التصنيف</span><select value={form.category||categories[0]} onChange={(e)=>setField("category",e.target.value)} className="rounded-xl border bg-background px-3 py-2">{categories.map(c=><option key={c}>{c}</option>)}</select></label><label className="grid gap-1 text-sm"><span>نوع المصروف</span><select value={form.type||"متغيرة"} onChange={(e)=>setField("type",e.target.value)} className="rounded-xl border bg-background px-3 py-2"><option>متغيرة</option><option>ثابتة</option></select></label><Field label="التاريخ" type="date" value={form.date||today()} onChange={(v)=>setField("date",v)} /><Field label="ملاحظات" value={form.note||""} onChange={(v)=>setField("note",v)} /></div>}
        {modal==="supplier"&&<div className="grid gap-3 sm:grid-cols-2"><Field label="اسم المورد *" value={form.name||""} onChange={(v)=>setField("name",v)} required /><Field label="رقم الهاتف" value={form.phone||""} onChange={(v)=>setField("phone",v)} /><Field label="الشخص المسؤول" value={form.contact||""} onChange={(v)=>setField("contact",v)} /><Field label="ملاحظات" value={form.note||""} onChange={(v)=>setField("note",v)} /></div>}
        <div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={closeModal} className="rounded-xl border px-4 py-2 text-sm">إلغاء</button><button type="submit" className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">حفظ البيانات</button></div>
      </form></div>}
    </div>
  );
}

function Metric({title,value,hint,icon,positive=true}:{title:string;value:string;hint:string;icon:string;positive?:boolean}) {
  return <div className="rounded-2xl border bg-card p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{title}</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg text-primary">{icon}</span></div><p className={"mt-3 text-2xl font-bold tracking-tight " + (title.includes("الربح")&&!positive?"text-red-600":"")}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></div>;
}
function MiniStat({label,value}:{label:string;value:string}) { return <div className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-lg font-bold">{value}</p></div>; }
function Empty({text}:{text:string}) { return <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">{text}</div>; }
function Field({label,value,onChange,type="text",required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;required?:boolean}) { return <label className="grid gap-1 text-sm"><span>{label}</span><input required={required} type={type} min={type==="number"?"0":undefined} step={type==="number"?"any":undefined} value={value} onChange={(e)=>onChange(e.target.value)} className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30" /></label>; }
function OrderTable({orders,updateOrder,deleteOrder}:{orders:Order[];updateOrder:(id:string,p:Partial<Order>)=>void;deleteOrder:(id:string)=>void}) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-right text-sm"><thead className="bg-muted/60 text-muted-foreground"><tr>{["رقم الطلب","العميل","المنتج","الإجمالي","التكلفة","الربح المتوقع","الحالة","الدفع",""].map(x=><th key={x} className="p-3 font-semibold">{x}</th>)}</tr></thead><tbody>{orders.map((o)=>{const revenue=o.status==="ملغى"||o.status==="مرتجع"?0:o.unitPrice*o.quantity;const cost=o.status==="ملغى"?0:o.unitCost*o.quantity+o.deliveryCost+o.packagingCost;return <tr key={o.id} className="border-b last:border-0"><td className="p-3 font-semibold">{o.id}<div className="text-xs text-muted-foreground">{o.date}</div></td><td className="p-3">{o.customer}<div className="text-xs text-muted-foreground">{o.phone} {o.wilaya}</div></td><td className="p-3">{o.productName}<div className="text-xs text-muted-foreground">× {o.quantity}</div></td><td className="p-3">{money(revenue)}</td><td className="p-3">{money(cost)}</td><td className="p-3 font-semibold text-emerald-700">{money(revenue-cost)}</td><td className="p-3"><select value={o.status} onChange={(e)=>updateOrder(o.id,{status:e.target.value})} className="rounded-lg border bg-background px-2 py-1 text-xs">{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td className="p-3"><select value={o.payment} onChange={(e)=>updateOrder(o.id,{payment:e.target.value})} className="rounded-lg border bg-background px-2 py-1 text-xs"><option>غير مدفوع</option><option>مدفوع</option><option>عند الاستلام</option></select></td><td className="p-3"><button onClick={()=>deleteOrder(o.id)} className="text-xs text-red-600">حذف</button></td></tr>})}</tbody></table>{!orders.length&&<Empty text="لا توجد طلبات مطابقة. أضف طلبك الأول من الأعلى." />}</div>;
}
