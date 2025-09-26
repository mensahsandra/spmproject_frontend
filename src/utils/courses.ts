// Categorized courses list.
export interface CourseCategory { category: string; courses: string[] }

export const COURSE_CATEGORIES: CourseCategory[] = [
  { category: 'Engineering/Technology', courses: [
    'B.Sc. Geomatic Engineering',
    'B.Sc. Agricultural Engineering',
    'B.Sc. Mechanical Engineering',
    'B.Sc. Computer Engineering',
    'B.Sc. Telecommunication Engineering',
    'B.Sc. Electrical Engineering',
    'B.Sc. Petroleum Engineering (online only)',
    'B.Sc. Chemical Engineering (online only)'
  ]},
  { category: 'Built Environment', courses: [
    'B.Sc. Quantity Surveying & Construction Economics',
    'B.Sc. Construction Technology & Management'
  ]},
  { category: 'Science/IT', courses: [
    'B.Sc. Computer Science',
    'B.Sc. Statistics',
    'B.Sc. Actuarial Science',
    'B.Sc. Information Technology',
    'B.Sc. Physics'
  ]},
  { category: 'Business/Social Sciences', courses: [
    'B.Sc. Business Administration (Human Resource Management)',
    'B.Sc. Business Administration (Accounting)',
    'B.Sc. Business Administration (Banking and Finance)',
    'B.Sc. Business Administration (Marketing)',
    'B.Sc. Business Administration (Hospitality Management)',
    'B.Sc. Business Administration (Logistics and Supply Chain Management)',
    'B.A. Social Work',
    'B.A. Sociology'
  ]}
];

export const ALL_COURSES = COURSE_CATEGORIES.flatMap(c => c.courses);
