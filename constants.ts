import { Lead, PipelineStage, LeadList } from './types';

export const STAGES: PipelineStage[] = [
  { id: 'new', title: 'عميل جديد', order: 1, color: 'bg-blue-500' },
  { id: 'contacted', title: 'تم التواصل', order: 2, color: 'bg-yellow-500' },
  { id: 'proposal', title: 'أرسل العرض', order: 3, color: 'bg-purple-500' },
  { id: 'closed', title: 'صفقة ناجحة', order: 4, color: 'bg-green-500' },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'سارة أحمد',
    company: 'تك فلو',
    email: 'sarah@techflow.io',
    phone: '+971 50 123 4567',
    value: 12500,
    stageId: 'new',
    listId: '1',
    createdAt: '2023-10-01',
    avatarUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'كريم يوسف',
    company: 'بيلد كورب',
    email: 'karim@buildcorp.ae',
    phone: '+971 50 987 6543',
    value: 45000,
    stageId: 'contacted',
    listId: '1',
    createdAt: '2023-10-02',
    avatarUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: 'ليلى محمود',
    company: 'ستوديو التصميم',
    email: 'layla@design.co',
    phone: '+966 50 111 2222',
    value: 8200,
    stageId: 'proposal',
    listId: '2',
    createdAt: '2023-10-03',
    avatarUrl: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: 'عمر حسن',
    company: 'فيوتشر فاينانس',
    email: 'omar@ff.sa',
    phone: '+966 50 333 4444',
    value: 120000,
    stageId: 'closed',
    listId: '2',
    createdAt: '2023-09-28',
    avatarUrl: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: '5',
    name: 'نادية علي',
    company: 'مجموعة التجزئة',
    email: 'nadia@retail.com',
    phone: '+971 50 555 6666',
    value: 5500,
    stageId: 'new',
    listId: '3',
    createdAt: '2023-10-05',
    avatarUrl: 'https://picsum.photos/200/200?random=5'
  }
];

export const MOCK_LISTS: LeadList[] = [
  { id: '1', title: 'عملاء مؤتمر الربع الثالث', count: 145, updatedAt: 'منذ يومين' },
  { id: '2', title: 'تسجيلات الموقع', count: 890, updatedAt: 'منذ 4 ساعات' },
  { id: '3', title: 'التواصل البارد - دبي', count: 50, updatedAt: 'منذ أسبوع' },
];