import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { CreditCard, Shield, Bell, User, Check, Download, Smartphone, Mail } from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

type Tab = 'profile' | 'billing' | 'notifications' | 'security';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: 'علي',
    lastName: 'ناصر',
    email: 'ali.nasser@glasscrm.io',
    jobTitle: 'مدير مبيعات إقليمي'
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'billing', label: 'الفوترة والخطة', icon: CreditCard },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'security', label: 'الأمان', icon: Shield },
  ];

  // Validation Handlers
  const validateProfile = () => {
    const errors: Record<string, string> = {};
    if (!profileForm.firstName.trim()) errors.firstName = 'الاسم الأول مطلوب';
    if (!profileForm.lastName.trim()) errors.lastName = 'اسم العائلة مطلوب';
    if (!profileForm.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'بريد إلكتروني غير صالح';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSave = () => {
    if (validateProfile()) {
      // Mock API call
      alert('تم حفظ تغييرات الملف الشخصي بنجاح!');
    }
  };

  const validatePassword = () => {
    const errors: Record<string, string> = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'كلمة المرور الحالية مطلوبة';
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'كلمة المرور الجديدة مطلوبة';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'يجب أن تكون كلمة المرور 8 أحرف على الأقل';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordUpdate = () => {
    if (validatePassword()) {
      // Mock API call
      alert('تم تحديث كلمة المرور بنجاح!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const getProfileInputClass = (field: keyof typeof profileForm) => `
    w-full bg-white/30 dark:bg-slate-800/50 
    border ${profileErrors[field] ? 'border-red-500' : 'border-white/40 dark:border-white/10'} 
    rounded-lg px-4 py-2.5 text-[14px] 
    text-slate-700 dark:text-slate-200 
    focus:outline-none focus:bg-white/50 dark:focus:bg-slate-800
    ${profileErrors[field] ? 'focus:ring-2 focus:ring-red-500/20' : ''}
  `;

  const getPasswordInputClass = (field: keyof typeof passwordForm) => `
    w-full bg-white/30 dark:bg-slate-800/50 
    border ${passwordErrors[field] ? 'border-red-500' : 'border-white/40 dark:border-white/10'} 
    rounded-lg px-4 py-2.5 text-[14px] 
    text-slate-700 dark:text-slate-200 
    focus:outline-none focus:bg-white/50 dark:focus:bg-slate-800
    ${passwordErrors[field] ? 'focus:ring-2 focus:ring-red-500/20' : ''}
  `;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <header className="mb-10 text-center md:text-right">
        <h1 className="text-3xl font-light text-slate-800 dark:text-slate-100">الإعدادات</h1>
        <p className="text-slate-500 dark:text-slate-400 font-light mt-1 text-sm">إدارة تفاصيل الحساب والفوترة.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Nav */}
        <div className="space-y-2 col-span-1">
           {tabs.map((item) => (
             <Tooltip key={item.id} content={item.label} position="left" className="w-full">
               <button
                 onClick={() => setActiveTab(item.id as Tab)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all ${activeTab === item.id ? 'bg-white/50 dark:bg-slate-700/50 text-indigo-900 dark:text-indigo-100 shadow-sm font-medium' : 'text-slate-500 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-slate-800/30'}`}
               >
                 <item.icon size={18} strokeWidth={1.5} />
                 {item.label}
               </button>
             </Tooltip>
           ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <GlassCard className="p-8">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-6">معلومات الملف الشخصي</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-white/50 dark:ring-white/10">
                  <img src="https://picsum.photos/200/200?random=user" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div>
                   <Tooltip content="رفع صورة جديدة" position="top">
                     <button className="px-4 py-2 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 transition-colors">تغيير الصورة</button>
                   </Tooltip>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">الاسم الأول <span className="text-red-500">*</span></label>
                   <input 
                    type="text" 
                    value={profileForm.firstName} 
                    onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                    className={getProfileInputClass('firstName')} 
                   />
                   {profileErrors.firstName && <p className="text-red-500 text-xs">{profileErrors.firstName}</p>}
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">اسم العائلة <span className="text-red-500">*</span></label>
                   <input 
                    type="text" 
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                    className={getProfileInputClass('lastName')}
                   />
                   {profileErrors.lastName && <p className="text-red-500 text-xs">{profileErrors.lastName}</p>}
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">البريد الإلكتروني <span className="text-red-500">*</span></label>
                   <input 
                    type="email" 
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className={getProfileInputClass('email')} 
                   />
                   {profileErrors.email && <p className="text-red-500 text-xs">{profileErrors.email}</p>}
                 </div>
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">الوصف الوظيفي</label>
                   <textarea 
                    rows={3} 
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm({...profileForm, jobTitle: e.target.value})}
                    className="w-full bg-white/30 dark:bg-slate-800/50 border border-white/40 dark:border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white/50 dark:focus:bg-slate-800" 
                   />
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10 flex justify-end">
                 <button onClick={handleProfileSave} className="px-6 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl shadow-lg shadow-slate-800/20 hover:bg-slate-700 dark:hover:bg-white transition-all font-light text-sm">حفظ التغييرات</button>
              </div>
            </GlassCard>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">الخطة الاحترافية</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">35,000 د.ع</span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">/ شهرياً</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">مثالية للفرق الصغيرة والشركات الناشئة.</p>
                    <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">ترقية الخطة</button>
                  </div>
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl"></div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">طريقة الدفع</h3>
                  <div className="flex items-center gap-4 p-4 border border-white/40 dark:border-white/10 rounded-xl bg-white/20 dark:bg-slate-800/30 mb-4">
                    <div className="w-10 h-6 bg-slate-800 dark:bg-slate-700 rounded flex items-center justify-center text-white text-[8px]">VISA</div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">تنتهي في 12/2024</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline">إضافة طريقة دفع جديدة</button>
                </GlassCard>
              </div>

              <GlassCard className="p-0 overflow-hidden">
                <div className="p-6 border-b border-white/10 dark:border-white/5">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">تاريخ الفواتير</h3>
                </div>
                <div className="w-full">
                  {[
                    { date: '1 أكتوبر 2023', id: 'INV-2023-001', amount: '35,000 د.ع', status: 'مدفوع' },
                    { date: '1 سبتمبر 2023', id: 'INV-2023-002', amount: '35,000 د.ع', status: 'مدفوع' },
                    { date: '1 أغسطس 2023', id: 'INV-2023-003', amount: '35,000 د.ع', status: 'مدفوع' },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/20 dark:hover:bg-slate-800/40 transition-colors border-b border-white/10 dark:border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                         <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                           <Check size={14} />
                         </div>
                         <div>
                           <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{inv.date}</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400">{inv.id}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{inv.amount}</span>
                        <Tooltip content="تحميل الفاتورة" position="left">
                          <button className="p-2 hover:bg-white/40 dark:hover:bg-slate-700/50 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                            <Download size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
             <GlassCard className="p-8">
               <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-6">إعدادات الإشعارات</h3>
               
               <div className="space-y-6">
                 <div>
                   <h4 className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase mb-4">
                     <Mail size={16} /> البريد الإلكتروني
                   </h4>
                   <div className="space-y-4">
                     {[
                       'عملاء جدد تم تعيينهم لي',
                       'تحديثات في مسار الصفقات',
                       'ملخص الأداء الأسبوعي',
                       'نصائح ومقالات مفيدة'
                     ].map((label, i) => (
                       <div key={i} className="flex items-center justify-between">
                         <span className="text-slate-700 dark:text-slate-200 text-sm">{label}</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                           <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                         </label>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="pt-6 border-t border-white/20 dark:border-white/10">
                   <h4 className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase mb-4">
                     <Bell size={16} /> تنبيهات النظام
                   </h4>
                   <div className="space-y-4">
                     {[
                       'إشارة في التعليقات (Mentions)',
                       'تذكير بالمهام المستحقة',
                       'صوت التنبيهات'
                     ].map((label, i) => (
                       <div key={i} className="flex items-center justify-between">
                         <span className="text-slate-700 dark:text-slate-200 text-sm">{label}</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                           <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                         </label>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
               
               <div className="mt-8 pt-6 border-t border-white/20 dark:border-white/10 flex justify-end">
                   <button className="px-6 py-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-xl shadow-lg shadow-slate-800/20 hover:bg-slate-700 dark:hover:bg-white transition-all font-light text-sm">حفظ التفضيلات</button>
               </div>
             </GlassCard>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <>
              <GlassCard className="p-8 mb-6">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-6">كلمة المرور</h3>
                <div className="space-y-4 max-w-md">
                   <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">كلمة المرور الحالية <span className="text-red-500">*</span></label>
                     <input 
                      type="password" 
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className={getPasswordInputClass('currentPassword')} 
                     />
                     {passwordErrors.currentPassword && <p className="text-red-500 text-xs">{passwordErrors.currentPassword}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">كلمة المرور الجديدة <span className="text-red-500">*</span></label>
                     <input 
                      type="password" 
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className={getPasswordInputClass('newPassword')} 
                     />
                     {passwordErrors.newPassword && <p className="text-red-500 text-xs">{passwordErrors.newPassword}</p>}
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">تأكيد كلمة المرور <span className="text-red-500">*</span></label>
                     <input 
                      type="password" 
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className={getPasswordInputClass('confirmPassword')}
                     />
                     {passwordErrors.confirmPassword && <p className="text-red-500 text-xs">{passwordErrors.confirmPassword}</p>}
                   </div>
                   <div className="pt-2">
                     <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-white/40 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-lg text-sm hover:bg-white/80 dark:hover:bg-slate-700/80 transition-colors">تحديث كلمة المرور</button>
                   </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                 <div className="flex items-start justify-between">
                   <div>
                     <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">المصادقة الثنائية (2FA)</h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md">إضافة طبقة حماية إضافية لحسابك عن طريق طلب رمز من هاتفك عند تسجيل الدخول.</p>
                   </div>
                   <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                     <Smartphone size={24} strokeWidth={1.5} />
                   </div>
                 </div>
                 <div className="mt-6 flex items-center gap-4">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">تفعيل المصادقة</button>
                 </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">منطقة الخطر</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">بمجرد حذف حسابك، لا يمكن التراجع عن هذا الإجراء. يرجى التأكد تماماً.</p>
                <button className="px-4 py-2 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">حذف الحساب</button>
              </GlassCard>
            </>
          )}

        </div>
      </div>
    </div>
  );
};