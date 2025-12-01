import React, { useState } from 'react';
import { Modal } from './Modal';
import { useLeads } from '../context/LeadsContext';
import { usePipeline } from '../context/PipelineContext';
import { useToast } from '../context/ToastContext';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead } = useLeads();
  const { stages } = usePipeline();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    value: '',
    stageId: 'new'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.company.trim()) newErrors.company = 'الشركة مطلوبة';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    if (formData.phone && !/^[\d\+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صالح';
    }

    if (!formData.value) {
      newErrors.value = 'قيمة الصفقة مطلوبة';
    } else if (isNaN(Number(formData.value)) || Number(formData.value) < 0) {
      newErrors.value = 'يجب أن تكون القيمة رقماً موجباً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      addLead({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        value: Number(formData.value),
        stageId: formData.stageId
      });
      showToast('تم إضافة العميل بنجاح!', 'success');
      onClose();
      // Reset form, using first available stage if 'new' doesn't exist
      const defaultStage = stages.find(s => s.id === 'new') ? 'new' : stages[0]?.id || '';
      setFormData({ name: '', company: '', email: '', phone: '', value: '', stageId: defaultStage });
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const getInputClass = (fieldName: string) => `
    w-full bg-white/50 dark:bg-slate-800/50 
    border ${errors[fieldName] ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} 
    rounded-xl px-4 py-2.5 text-[14px] 
    focus:outline-none focus:ring-2 ${errors[fieldName] ? 'focus:ring-red-500/20' : 'focus:ring-indigo-500/50'} 
    dark:text-white transition-all
  `;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة عميل جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">الاسم <span className="text-red-500">*</span></label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={getInputClass('name')}
              placeholder="الاسم الكامل"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">الشركة <span className="text-red-500">*</span></label>
            <input 
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={getInputClass('company')}
              placeholder="اسم الشركة"
            />
            {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">البريد الإلكتروني</label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass('email')}
              placeholder="example@domain.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">الهاتف</label>
            <input 
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={getInputClass('phone')}
              placeholder="+971 50 ..."
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">قيمة الصفقة (د.ع) <span className="text-red-500">*</span></label>
            <input 
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className={getInputClass('value')}
              placeholder="0.00"
            />
            {errors.value && <p className="text-red-500 text-xs">{errors.value}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">المرحلة</label>
            <select 
              name="stageId"
              value={formData.stageId}
              onChange={handleChange}
              className="w-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
            >
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            إلغاء
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 text-sm"
          >
            إضافة العميل
          </button>
        </div>
      </form>
    </Modal>
  );
};