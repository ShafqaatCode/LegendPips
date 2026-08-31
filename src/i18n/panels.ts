import type { LocaleCode } from "./locales";

export type PanelCopy = {
  member: string;
  workspace: string;
  userFallback: string;
  main: string;
  content: string;
  community: string;
  system: string;
  homepage: string;
  logout: string;
  dashboard: string;
  profile: string;
  verification: string;
  contests: string;
  signals: string;
  rebates: string;
  liveAccounts: string;
  invite: string;
  ibChange: string;
  traderProfile: string;
  copyTrading: string;
  webinars: string;
  courses: string;
  videos: string;
  analysis: string;
  forum: string;
  reviews: string;
  complaints: string;
  activity: string;
  calendar: string;
  settings: string;
  adminConsole: string;
  staffConsole: string;
  users: string;
  bulkEmail: string;
  kycRecords: string;
  brokers: string;
  brokerReviews: string;
  feedback: string;
  referrals: string;
  reports: string;
  security: string;
  adminTeam: string;
  viewWebsite: string;
  superAdmin: string;
  teamStaff: string;
  staff: string;
  search: string;
  notifications: string;
  openMenu: string;
  closeMenu: string;
  consoleCrumb: string;
  userDetail: string;
  kycReview: string;
  admin: string;
  welcome: string;
  dashSub: string;
  kycTitle: string;
  kycIncomplete: string;
  kycPending: string;
  kycApproved: string;
  kycRejected: string;
  viewStatus: string;
  manageKyc: string;
  activityMonth: string;
  events: string;
  vsLast: string;
  overview: string;
  thisMonth: string;
  quick: string;
  preferences: string;
  qlRebates: string;
  qlRebatesD: string;
  qlLive: string;
  qlLiveD: string;
  qlInvite: string;
  qlInviteD: string;
  qlKyc: string;
  qlKycD: string;
  statContests: string;
  statSignals: string;
  statWebinars: string;
  statCourses: string;
  statForum: string;
  statRebates: string;
  statusIncomplete: string;
  statusPending: string;
  statusApproved: string;
  statusRejected: string;
  usersAll: string;
  usersKycOk: string;
  usersKycWait: string;
  usersEmail: string;
  usersActive: string;
  usersBanned: string;
  kycAll: string;
  kycPend: string;
  kycOk: string;
  kycNo: string;
  authLogin: string;
  authGoogle: string;
  authEmail: string;
  authPassword: string;
  authEmailReq: string;
  authPassReq: string;
  authTerms: string;
  authTermsReq: string;
  authForgot: string;
  authLogging: string;
  authRegister: string;
  authInvalid: string;
  authFail: string;
  authOr: string;
  authEmailReg: string;
  authFirst: string;
  authLast: string;
  authFirstReq: string;
  authLastReq: string;
  authSendCode: string;
  authSending: string;
  authOtpHint: string;
  authOtp: string;
  authOtpReq: string;
  authConfirm: string;
  authConfirmReq: string;
  authUnderstand: string;
  authRegistering: string;
  authEnterEmail: string;
  authValidEmail: string;
  authOtpSent: string;
  authOtpFail: string;
  authPassMatch: string;
  authNeedOtp: string;
  authRegOk: string;
  authRegFail: string;
  pageProfile: string;
  pageInvite: string;
};

const en: PanelCopy = {
  member: "Member",
  workspace: "LegendPips workspace",
  userFallback: "User",
  main: "Main",
  content: "Content",
  community: "Community",
  system: "System",
  homepage: "Homepage",
  logout: "Logout",
  dashboard: "Dashboard",
  profile: "My Profile",
  verification: "Identity Verification",
  contests: "My Contests",
  signals: "My Signals",
  rebates: "My Rebates",
  liveAccounts: "My live accounts",
  invite: "Invite a friend",
  ibChange: "IB change",
  traderProfile: "Trader profile",
  copyTrading: "Copy trading",
  webinars: "My Webinars",
  courses: "My Courses",
  videos: "Trading Videos",
  analysis: "Saved Analysis",
  forum: "Forum Posts",
  reviews: "Broker reviews",
  complaints: "My complaints",
  activity: "Activity",
  calendar: "Calendar",
  settings: "Settings",
  adminConsole: "Admin console",
  staffConsole: "Staff console",
  users: "Users",
  bulkEmail: "Bulk Email",
  kycRecords: "KYC Records",
  brokers: "Brokers",
  brokerReviews: "Broker reviews",
  feedback: "Feedback",
  referrals: "Referrals",
  reports: "Analytics",
  security: "Security",
  adminTeam: "Admin team",
  viewWebsite: "View website",
  superAdmin: "Super administrator",
  teamStaff: "Team staff",
  staff: "Staff",
  search: "Search…",
  notifications: "Notifications",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  consoleCrumb: "LegendPips · Console",
  userDetail: "User Detail",
  kycReview: "KYC Review",
  admin: "Admin",
  welcome: "Welcome back, {name}",
  dashSub: "Track contests, rebates, signals, and verification — all in one place.",
  kycTitle: "Identity Verification",
  kycIncomplete: "Complete verification to unlock full platform access.",
  kycPending: "Your documents are under review — we'll update you soon.",
  kycApproved: "Your identity is verified. Full access is enabled.",
  kycRejected: "Verification was declined. Review feedback and resubmit.",
  viewStatus: "View status",
  manageKyc: "Manage verification",
  activityMonth: "Activity this month:",
  events: "events",
  vsLast: "vs last month",
  overview: "Overview",
  thisMonth: "this month",
  quick: "Quick actions",
  preferences: "Preferences",
  qlRebates: "My Rebates",
  qlRebatesD: "Cashback & credits",
  qlLive: "Live accounts",
  qlLiveD: "Track setup requests",
  qlInvite: "Invite friends",
  qlInviteD: "Earn referral rewards",
  qlKyc: "Verification",
  qlKycD: "KYC status",
  statContests: "Contests joined",
  statSignals: "Signal activity (logged)",
  statWebinars: "Webinars watched (logged)",
  statCourses: "Courses completed",
  statForum: "Forum activity",
  statRebates: "Available rebates",
  statusIncomplete: "Incomplete",
  statusPending: "Pending",
  statusApproved: "Approved",
  statusRejected: "Rejected",
  usersAll: "All Users",
  usersKycOk: "KYC Verified",
  usersKycWait: "KYC Pending",
  usersEmail: "Email Verified",
  usersActive: "Active Users",
  usersBanned: "Banned Users",
  kycAll: "All KYC Records",
  kycPend: "Pending",
  kycOk: "Approved",
  kycNo: "Rejected",
  authLogin: "Login",
  authGoogle: "Continue with Google",
  authEmail: "Email Address",
  authPassword: "Password",
  authEmailReq: "Email is required",
  authPassReq: "Password is required",
  authTerms: "I Accept The Terms And Disclaimer Set Forth By Legend Pips.",
  authTermsReq: "You must accept the terms",
  authForgot: "Forget The Password?",
  authLogging: "Logging in...",
  authRegister: "Register",
  authInvalid: "Invalid email or password.",
  authFail: "Login failed. Please try again.",
  authOr: "or",
  authEmailReg: "Register with Email",
  authFirst: "First Name",
  authLast: "Last Name",
  authFirstReq: "First Name is required",
  authLastReq: "Last Name is required",
  authSendCode: "Send code",
  authSending: "Sending…",
  authOtpHint: "We'll email a 6-digit code. Enter it below to verify this address before you register.",
  authOtp: "6-digit code",
  authOtpReq: "Verification code is required",
  authConfirm: "Confirm Password",
  authConfirmReq: "Confirm your password",
  authUnderstand: "I Understand And Accept The Terms And Disclaimer Set Forth By Legend Pips.",
  authRegistering: "Registering...",
  authEnterEmail: "Enter your email first, then request a code.",
  authValidEmail: "Enter a valid email address.",
  authOtpSent: "Verification code sent. Check your inbox.",
  authOtpFail: "Could not send verification code.",
  authPassMatch: "Passwords do not match",
  authNeedOtp: "Enter the 6-digit verification code sent to your email.",
  authRegOk: "Registration successful! You can now login.",
  authRegFail: "Registration failed. Please try again.",
  pageProfile: "My Profile",
  pageInvite: "Invite a friend by email",
};

type DeepPartial<T> = { [K in keyof T]?: T[K] };

function fill(p: DeepPartial<PanelCopy>): PanelCopy {
  return { ...en, ...p };
}

const ur = fill({
  member: "ممبر",
  workspace: "LegendPips ورک اسپیس",
  userFallback: "صارف",
  main: "مین",
  content: "مواد",
  community: "کمیونٹی",
  system: "سسٹم",
  homepage: "ہوم پیج",
  logout: "لاگ آؤٹ",
  dashboard: "ڈیش بورڈ",
  profile: "میری پروفائل",
  verification: "شناخت کی تصدیق",
  contests: "میرے مقابلے",
  signals: "میرے سگنلز",
  rebates: "میرے ریبیٹس",
  liveAccounts: "میرے لائیو اکاؤنٹس",
  invite: "دوست کو مدعو کریں",
  ibChange: "IB تبدیلی",
  traderProfile: "ٹریڈر پروفائل",
  copyTrading: "کاپی ٹریڈنگ",
  webinars: "میرے ویبینارز",
  courses: "میرے کورسز",
  videos: "ٹریڈنگ ویڈیوز",
  analysis: "محفوظ تجزیے",
  forum: "فورم پوسٹس",
  reviews: "بروکر ریویوز",
  complaints: "میری شکایات",
  activity: "سرگرمی",
  calendar: "کیلنڈر",
  settings: "ترتیبات",
  adminConsole: "ایڈمن کنسول",
  staffConsole: "اسٹاف کنسول",
  users: "صارفین",
  bulkEmail: "بلک ای میل",
  kycRecords: "KYC ریکارڈز",
  brokers: "بروکرز",
  brokerReviews: "بروکر ریویوز",
  feedback: "فیڈبیک",
  referrals: "ریفرلز",
  reports: "رپورٹس",
  security: "سیکیورٹی",
  adminTeam: "ایڈمن ٹیم",
  viewWebsite: "ویب سائٹ دیکھیں",
  superAdmin: "سپر ایڈمنسٹریٹر",
  teamStaff: "ٹیم اسٹاف",
  staff: "اسٹاف",
  search: "تلاش…",
  notifications: "اطلاعات",
  openMenu: "مینو کھولیں",
  closeMenu: "مینو بند کریں",
  consoleCrumb: "LegendPips · کنسول",
  userDetail: "صارف تفصیل",
  kycReview: "KYC جائزہ",
  admin: "ایڈمن",
  welcome: "خوش آمدید، {name}",
  dashSub: "مقابلے، ریبیٹس، سگنلز اور تصدیق ایک جگہ ٹریک کریں۔",
  kycTitle: "شناخت کی تصدیق",
  kycIncomplete: "مکمل رسائی کے لیے تصدیق مکمل کریں۔",
  kycPending: "آپ کے دستاویزات جائزے میں ہیں — جلد بتائیں گے۔",
  kycApproved: "شناخت تصدیق شدہ ہے۔ مکمل رسائی فعال ہے۔",
  kycRejected: "تصدیق مسترد ہوئی۔ فیڈبیک دیکھ کر دوبارہ جمع کرائیں۔",
  viewStatus: "سٹیٹس دیکھیں",
  manageKyc: "تصدیق منظم کریں",
  activityMonth: "اس مہینے کی سرگرمی:",
  events: "ایونٹس",
  vsLast: "پچھلے مہینے کے مقابلے",
  overview: "جائزہ",
  thisMonth: "اس مہینے",
  quick: "فوری اقدامات",
  preferences: "ترجیحات",
  qlRebates: "میرے ریبیٹس",
  qlRebatesD: "کیش بیک اور کریڈٹس",
  qlLive: "لائیو اکاؤنٹس",
  qlLiveD: "سیٹ اپ درخواستیں ٹریک کریں",
  qlInvite: "دوست مدعو کریں",
  qlInviteD: "ریفرل انعامات کمائیں",
  qlKyc: "تصدیق",
  qlKycD: "KYC سٹیٹس",
  statContests: "شمولیت یافتہ مقابلے",
  statSignals: "سگنل سرگرمی",
  statWebinars: "دیکھے گئے ویبینارز",
  statCourses: "مکمل کورسز",
  statForum: "فورم سرگرمی",
  statRebates: "دستیاب ریبیٹس",
  statusIncomplete: "نامکمل",
  statusPending: "زیرِ التوا",
  statusApproved: "منظور",
  statusRejected: "مسترد",
  usersAll: "تمام صارفین",
  usersKycOk: "KYC تصدیق شدہ",
  usersKycWait: "KYC زیرِ التوا",
  usersEmail: "ای میل تصدیق شدہ",
  usersActive: "فعال صارفین",
  usersBanned: "بلاک صارفین",
  kycAll: "تمام KYC ریکارڈز",
  kycPend: "زیرِ التوا",
  kycOk: "منظور",
  kycNo: "مسترد",
  authLogin: "لاگ ان",
  authGoogle: "گوگل سے جاری رکھیں",
  authEmail: "ای میل ایڈریس",
  authPassword: "پاس ورڈ",
  authEmailReq: "ای میل ضروری ہے",
  authPassReq: "پاس ورڈ ضروری ہے",
  authTerms: "میں Legend Pips کی شرائط اور ڈس کلیمر قبول کرتا/کرتی ہوں۔",
  authTermsReq: "شرائط قبول کرنا ضروری ہے",
  authForgot: "پاس ورڈ بھول گئے؟",
  authLogging: "لاگ ان ہو رہا ہے...",
  authRegister: "رجسٹر",
  authInvalid: "ای میل یا پاس ورڈ غلط ہے۔",
  authFail: "لاگ ان ناکام۔ دوبارہ کوشش کریں۔",
  authOr: "یا",
  authEmailReg: "ای میل سے رجسٹر",
  authFirst: "پہلا نام",
  authLast: "آخری نام",
  authFirstReq: "پہلا نام ضروری ہے",
  authLastReq: "آخری نام ضروری ہے",
  authSendCode: "کوڈ بھیجیں",
  authSending: "بھیجا جا رہا ہے…",
  authOtpHint: "ہم 6 ہندسوں کا کوڈ ای میل کریں گے۔ رجسٹر سے پہلے نیچے درج کریں۔",
  authOtp: "6 ہندسوں کا کوڈ",
  authOtpReq: "تصدیقی کوڈ ضروری ہے",
  authConfirm: "پاس ورڈ تصدیق",
  authConfirmReq: "پاس ورڈ تصدیق کریں",
  authUnderstand: "میں Legend Pips کی شرائط اور ڈس کلیمر سمجھتا/سمجھتی اور قبول کرتا/کرتی ہوں۔",
  authRegistering: "رجسٹر ہو رہا ہے...",
  authEnterEmail: "پہلے ای میل درج کریں، پھر کوڈ مانگیں۔",
  authValidEmail: "درست ای میل درج کریں۔",
  authOtpSent: "تصدیقی کوڈ بھیج دیا۔ ان باکس چیک کریں۔",
  authOtpFail: "تصدیقی کوڈ نہیں بھیج سکے۔",
  authPassMatch: "پاس ورڈ مماثل نہیں",
  authNeedOtp: "ای میل پر بھیجا گیا 6 ہندسوں کا کوڈ درج کریں۔",
  authRegOk: "رجسٹریشن کامیاب! اب لاگ ان کر سکتے ہیں۔",
  authRegFail: "رجسٹریشن ناکام۔ دوبارہ کوشش کریں۔",
  pageProfile: "میری پروفائل",
  pageInvite: "ای میل سے دوست مدعو کریں",
});

const ar = fill({
  member: "عضو",
  workspace: "مساحة LegendPips",
  userFallback: "مستخدم",
  main: "رئيسي",
  content: "المحتوى",
  community: "المجتمع",
  system: "النظام",
  homepage: "الصفحة الرئيسية",
  logout: "تسجيل الخروج",
  dashboard: "لوحة التحكم",
  profile: "ملفي",
  verification: "التحقق من الهوية",
  contests: "مسابقاتي",
  signals: "إشاراتي",
  rebates: "ريبيتاتي",
  liveAccounts: "حساباتي الحية",
  invite: "ادعُ صديقًا",
  ibChange: "تغيير الوسيط المعرّف",
  traderProfile: "ملف المتداول",
  copyTrading: "نسخ التداول",
  webinars: "ندواتي",
  courses: "دوراتي",
  videos: "فيديوهات التداول",
  analysis: "تحليلات محفوظة",
  forum: "منشورات المنتدى",
  reviews: "مراجعات الوسطاء",
  complaints: "شكاواي",
  activity: "النشاط",
  calendar: "التقويم",
  settings: "الإعدادات",
  adminConsole: "لوحة المشرف",
  staffConsole: "لوحة الموظفين",
  users: "المستخدمون",
  bulkEmail: "بريد جماعي",
  kycRecords: "سجلات KYC",
  brokers: "الوسطاء",
  brokerReviews: "مراجعات الوسطاء",
  feedback: "الملاحظات",
  referrals: "الإحالات",
  reports: "التقارير",
  security: "الأمان",
  adminTeam: "فريق الإدارة",
  viewWebsite: "عرض الموقع",
  superAdmin: "مشرف أعلى",
  teamStaff: "موظف فريق",
  staff: "موظف",
  search: "بحث…",
  notifications: "الإشعارات",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  consoleCrumb: "LegendPips · وحدة التحكم",
  userDetail: "تفاصيل المستخدم",
  kycReview: "مراجعة KYC",
  admin: "مشرف",
  welcome: "مرحبًا بعودتك، {name}",
  dashSub: "تابع المسابقات والريبيت والإشارات والتحقق في مكان واحد.",
  kycTitle: "التحقق من الهوية",
  kycIncomplete: "أكمل التحقق لفتح الوصول الكامل.",
  kycPending: "مستنداتك قيد المراجعة.",
  kycApproved: "تم التحقق من هويتك.",
  kycRejected: "رُفض التحقق. راجع الملاحظات وأعد الإرسال.",
  viewStatus: "عرض الحالة",
  manageKyc: "إدارة التحقق",
  activityMonth: "نشاط هذا الشهر:",
  events: "أحداث",
  vsLast: "مقارنة بالشهر الماضي",
  overview: "نظرة عامة",
  thisMonth: "هذا الشهر",
  quick: "إجراءات سريعة",
  preferences: "التفضيلات",
  qlRebates: "ريبيتاتي",
  qlRebatesD: "كاش باك وأرصدة",
  qlLive: "حسابات حية",
  qlLiveD: "تتبع طلبات الإعداد",
  qlInvite: "ادعُ أصدقاء",
  qlInviteD: "اكسب مكافآت الإحالة",
  qlKyc: "التحقق",
  qlKycD: "حالة KYC",
  statContests: "مسابقات منضم إليها",
  statSignals: "نشاط الإشارات",
  statWebinars: "ندوات تمت مشاهدتها",
  statCourses: "دورات مكتملة",
  statForum: "نشاط المنتدى",
  statRebates: "ريبيت متاح",
  statusIncomplete: "غير مكتمل",
  statusPending: "قيد الانتظار",
  statusApproved: "موافق عليه",
  statusRejected: "مرفوض",
  usersAll: "كل المستخدمين",
  usersKycOk: "KYC موثق",
  usersKycWait: "KYC معلق",
  usersEmail: "بريد موثق",
  usersActive: "مستخدمون نشطون",
  usersBanned: "محظورون",
  kycAll: "كل سجلات KYC",
  kycPend: "معلق",
  kycOk: "موافق",
  kycNo: "مرفوض",
  authLogin: "تسجيل الدخول",
  authGoogle: "المتابعة مع جوجل",
  authEmail: "البريد الإلكتروني",
  authPassword: "كلمة المرور",
  authEmailReq: "البريد مطلوب",
  authPassReq: "كلمة المرور مطلوبة",
  authTerms: "أوافق على الشروط والإخلاء الصادرة عن Legend Pips.",
  authTermsReq: "يجب قبول الشروط",
  authForgot: "نسيت كلمة المرور؟",
  authLogging: "جارٍ تسجيل الدخول...",
  authRegister: "تسجيل",
  authInvalid: "بريد أو كلمة مرور غير صحيحة.",
  authFail: "فشل تسجيل الدخول. حاول مجددًا.",
  authOr: "أو",
  authEmailReg: "التسجيل بالبريد",
  authFirst: "الاسم الأول",
  authLast: "اسم العائلة",
  authFirstReq: "الاسم الأول مطلوب",
  authLastReq: "اسم العائلة مطلوب",
  authSendCode: "إرسال الرمز",
  authSending: "جارٍ الإرسال…",
  authOtpHint: "سنرسل رمزًا من 6 أرقام. أدخله للتحقق قبل التسجيل.",
  authOtp: "رمز من 6 أرقام",
  authOtpReq: "رمز التحقق مطلوب",
  authConfirm: "تأكيد كلمة المرور",
  authConfirmReq: "أكد كلمة المرور",
  authUnderstand: "أفهم وأوافق على شروط وإخلاء Legend Pips.",
  authRegistering: "جارٍ التسجيل...",
  authEnterEmail: "أدخل بريدك أولًا ثم اطلب الرمز.",
  authValidEmail: "أدخل بريدًا صالحًا.",
  authOtpSent: "تم إرسال رمز التحقق.",
  authOtpFail: "تعذر إرسال رمز التحقق.",
  authPassMatch: "كلمتا المرور غير متطابقتين",
  authNeedOtp: "أدخل رمز التحقق المكون من 6 أرقام.",
  authRegOk: "تم التسجيل! يمكنك تسجيل الدخول الآن.",
  authRegFail: "فشل التسجيل. حاول مجددًا.",
  pageProfile: "ملفي",
  pageInvite: "ادعُ صديقًا بالبريد",
});

export const PANEL_COPY: Record<LocaleCode, PanelCopy> = {
  en,
  ar,
  es: fill({}),
  pt: fill({}),
  id: fill({}),
  vi: fill({}),
  fr: fill({}),
  tr: fill({}),
  ur,
};
