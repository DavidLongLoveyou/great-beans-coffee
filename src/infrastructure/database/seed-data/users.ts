import type {
  UserRole,
  UserStatus,
  UserDepartment,
} from '../../../domain/entities/user.entity';

export interface SeedUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  department?: UserDepartment;
  position?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location: {
    country: string;
    city: string;
    timezone: string;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    currency: string;
  };
  permissions: string[];
  lastLoginAt?: string;
  emailVerifiedAt?: string;
  twoFactorEnabled: boolean;
  isActive: boolean;
  employmentDetails?: {
    employeeId: string;
    startDate: string;
    salary?: number;
    benefits: string[];
    manager?: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills: string[];
  certifications: string[];
  createdBy: string;
  updatedBy: string;
}

export const usersData: SeedUser[] = [
  {
    id: 'admin-001',
    email: 'admin@greatbeans.com',
    username: 'admin',
    firstName: 'Nguyen',
    lastName: 'Van Admin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    department: 'MANAGEMENT',
    position: 'System Administrator',
    phone: '+84-123-456-789',
    avatar: 'admin-avatar.jpg',
    bio: 'System administrator with full access to all platform features and settings.',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      currency: 'USD',
    },
    permissions: [
      'users.create',
      'users.read',
      'users.update',
      'users.delete',
      'products.create',
      'products.read',
      'products.update',
      'products.delete',
      'orders.create',
      'orders.read',
      'orders.update',
      'orders.delete',
      'rfqs.create',
      'rfqs.read',
      'rfqs.update',
      'rfqs.delete',
      'content.create',
      'content.read',
      'content.update',
      'content.delete',
      'analytics.read',
      'settings.update',
      'system.admin',
    ],
    lastLoginAt: '2024-02-01T08:00:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-001',
      startDate: '2024-01-01',
      benefits: ['health-insurance', 'dental', 'vision', 'retirement'],
      manager: 'ceo-001',
    },
    skills: [
      'system-administration',
      'database-management',
      'security',
      'troubleshooting',
    ],
    certifications: ['AWS-Solutions-Architect', 'CompTIA-Security+'],
    createdBy: 'system',
    updatedBy: 'admin-001',
  },
  {
    id: 'sales-manager-001',
    email: 'sales.manager@greatbeans.com',
    username: 'sales_manager',
    firstName: 'Tran',
    lastName: 'Thi Lan',
    role: 'SALES_MANAGER',
    status: 'ACTIVE',
    department: 'SALES',
    position: 'Sales Manager',
    phone: '+84-987-654-321',
    avatar: 'sales-manager-avatar.jpg',
    bio: 'Experienced sales manager specializing in B2B coffee exports and international client relationships.',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: 'USD',
    },
    permissions: [
      'rfqs.create',
      'rfqs.read',
      'rfqs.update',
      'rfqs.assign',
      'clients.create',
      'clients.read',
      'clients.update',
      'orders.create',
      'orders.read',
      'orders.update',
      'products.read',
      'analytics.sales',
      'reports.sales',
    ],
    lastLoginAt: '2024-02-01T09:30:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-002',
      startDate: '2023-06-01',
      salary: 25000,
      benefits: [
        'health-insurance',
        'dental',
        'commission',
        'travel-allowance',
      ],
      manager: 'admin-001',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/tran-thi-lan',
      website: 'https://greatbeans.com/team/lan-tran',
    },
    skills: [
      'b2b-sales',
      'international-trade',
      'client-relationship-management',
      'coffee-expertise',
      'negotiation',
    ],
    certifications: [
      'International-Trade-Certificate',
      'Coffee-Quality-Institute-Q-Grader',
    ],
    createdBy: 'admin-001',
    updatedBy: 'sales-manager-001',
  },
  {
    id: 'sales-rep-001',
    email: 'sales.rep1@greatbeans.com',
    username: 'sales_rep_1',
    firstName: 'Le',
    lastName: 'Van Duc',
    role: 'SALES_REP',
    status: 'ACTIVE',
    department: 'SALES',
    position: 'Senior Sales Representative',
    phone: '+84-456-789-123',
    avatar: 'sales-rep-1-avatar.jpg',
    bio: 'Senior sales representative focusing on European and North American markets.',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: 'USD',
    },
    permissions: [
      'rfqs.create',
      'rfqs.read',
      'rfqs.update',
      'clients.read',
      'clients.update',
      'orders.read',
      'orders.update',
      'products.read',
      'analytics.personal',
    ],
    lastLoginAt: '2024-02-01T07:45:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: false,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-003',
      startDate: '2023-09-15',
      salary: 18000,
      benefits: ['health-insurance', 'commission', 'performance-bonus'],
      manager: 'sales-manager-001',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/le-van-duc',
    },
    skills: [
      'sales',
      'customer-service',
      'coffee-knowledge',
      'multilingual',
      'crm-systems',
    ],
    certifications: ['Coffee-Cupping-Certificate'],
    createdBy: 'sales-manager-001',
    updatedBy: 'sales-rep-001',
  },
  {
    id: 'content-manager-001',
    email: 'content@greatbeans.com',
    username: 'content_manager',
    firstName: 'Pham',
    lastName: 'Thi Hong',
    role: 'CONTENT_MANAGER',
    status: 'ACTIVE',
    department: 'MARKETING',
    position: 'Content Marketing Manager',
    phone: '+84-789-123-456',
    avatar: 'content-manager-avatar.jpg',
    bio: 'Content marketing specialist with expertise in coffee industry storytelling and multilingual content creation.',
    location: {
      country: 'Vietnam',
      city: 'Hanoi',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: 'USD',
    },
    permissions: [
      'content.create',
      'content.read',
      'content.update',
      'content.publish',
      'media.upload',
      'media.manage',
      'seo.manage',
      'analytics.content',
    ],
    lastLoginAt: '2024-02-01T08:15:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: false,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-004',
      startDate: '2023-08-01',
      salary: 15000,
      benefits: [
        'health-insurance',
        'creative-tools-allowance',
        'training-budget',
      ],
      manager: 'admin-001',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/pham-thi-hong',
      twitter: 'https://twitter.com/hongpham_content',
    },
    skills: [
      'content-creation',
      'seo',
      'social-media',
      'photography',
      'multilingual-writing',
      'coffee-expertise',
    ],
    certifications: [
      'Google-Analytics-Certified',
      'Content-Marketing-Certificate',
    ],
    createdBy: 'admin-001',
    updatedBy: 'content-manager-001',
  },
  {
    id: 'quality-manager-001',
    email: 'quality@greatbeans.com',
    username: 'quality_manager',
    firstName: 'Hoang',
    lastName: 'Van Minh',
    role: 'QUALITY_MANAGER',
    status: 'ACTIVE',
    department: 'OPERATIONS',
    position: 'Quality Control Manager',
    phone: '+84-321-654-987',
    avatar: 'quality-manager-avatar.jpg',
    bio: 'Quality control expert with 15 years of experience in coffee grading, cupping, and quality assurance.',
    location: {
      country: 'Vietnam',
      city: 'Dak Lak',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      currency: 'USD',
    },
    permissions: [
      'products.read',
      'products.update',
      'quality.test',
      'quality.approve',
      'orders.quality-check',
      'analytics.quality',
      'reports.quality',
    ],
    lastLoginAt: '2024-02-01T06:30:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-005',
      startDate: '2022-03-01',
      salary: 20000,
      benefits: [
        'health-insurance',
        'technical-training',
        'equipment-allowance',
      ],
      manager: 'admin-001',
    },
    skills: [
      'coffee-cupping',
      'quality-control',
      'laboratory-testing',
      'sensory-analysis',
      'grading-standards',
    ],
    certifications: [
      'Q-Grader-Arabica',
      'Q-Grader-Robusta',
      'SCA-Coffee-Skills-Program',
    ],
    createdBy: 'admin-001',
    updatedBy: 'quality-manager-001',
  },
  {
    id: 'client-user-001',
    email: 'purchasing@schwarzwaldkaffee.de',
    username: 'schwarzwald_buyer',
    firstName: 'Klaus',
    lastName: 'Mueller',
    role: 'CLIENT',
    status: 'ACTIVE',
    position: 'Head of Purchasing',
    phone: '+49-7661-123456',
    avatar: 'client-klaus-avatar.jpg',
    bio: 'Head of Purchasing at Schwarzwald Kaffeerösterei, specializing in premium coffee sourcing.',
    location: {
      country: 'Germany',
      city: 'Black Forest',
      timezone: 'Europe/Berlin',
    },
    preferences: {
      language: 'de',
      theme: 'light',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      currency: 'EUR',
    },
    permissions: [
      'rfqs.create',
      'rfqs.read',
      'rfqs.update.own',
      'orders.read.own',
      'products.read',
      'profile.update',
    ],
    lastLoginAt: '2024-01-31T14:20:00Z',
    emailVerifiedAt: '2024-01-15T00:00:00Z',
    twoFactorEnabled: false,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/klaus-mueller-coffee',
    },
    skills: [
      'coffee-purchasing',
      'quality-assessment',
      'supply-chain-management',
      'german-coffee-market',
    ],
    certifications: ['Coffee-Quality-Institute-Certificate'],
    createdBy: 'sales-rep-001',
    updatedBy: 'client-user-001',
  },
  {
    id: 'client-user-002',
    email: 'sourcing@mountainpeakcoffee.com',
    username: 'mountain_peak_sourcing',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'CLIENT',
    status: 'ACTIVE',
    position: 'Sourcing Manager',
    phone: '+1-555-123-4567',
    avatar: 'client-sarah-avatar.jpg',
    bio: 'Sourcing Manager at Mountain Peak Coffee Company, focused on sustainable and specialty coffee procurement.',
    location: {
      country: 'United States',
      city: 'Portland, OR',
      timezone: 'America/Los_Angeles',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      currency: 'USD',
    },
    permissions: [
      'rfqs.create',
      'rfqs.read',
      'rfqs.update.own',
      'orders.read.own',
      'products.read',
      'profile.update',
    ],
    lastLoginAt: '2024-01-30T16:45:00Z',
    emailVerifiedAt: '2024-01-10T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarah-johnson-coffee',
      twitter: 'https://twitter.com/sarahj_coffee',
    },
    skills: [
      'specialty-coffee-sourcing',
      'sustainability-assessment',
      'cupping',
      'supply-chain-ethics',
    ],
    certifications: ['SCA-Coffee-Skills-Program', 'Fair-Trade-Certification'],
    createdBy: 'sales-manager-001',
    updatedBy: 'client-user-002',
  },
  {
    id: 'client-user-003',
    email: 'import@tokyocoffee.co.jp',
    username: 'tokyo_coffee_import',
    firstName: 'Takeshi',
    lastName: 'Yamamoto',
    role: 'CLIENT',
    status: 'ACTIVE',
    position: 'Import Director',
    phone: '+81-3-1234-5678',
    avatar: 'client-takeshi-avatar.jpg',
    bio: 'Import Director at Tokyo Coffee Import Co., specializing in Southeast Asian coffee varieties.',
    location: {
      country: 'Japan',
      city: 'Tokyo',
      timezone: 'Asia/Tokyo',
    },
    preferences: {
      language: 'ja',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      currency: 'JPY',
    },
    permissions: [
      'rfqs.create',
      'rfqs.read',
      'rfqs.update.own',
      'orders.read.own',
      'products.read',
      'profile.update',
    ],
    lastLoginAt: '2024-02-01T09:00:00Z',
    emailVerifiedAt: '2024-01-08T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/takeshi-yamamoto-coffee',
    },
    skills: [
      'coffee-importing',
      'japanese-market-analysis',
      'quality-control',
      'logistics-coordination',
    ],
    certifications: ['Japan-Coffee-Association-Certificate'],
    createdBy: 'sales-rep-001',
    updatedBy: 'client-user-003',
  },
  {
    id: 'logistics-coordinator-001',
    email: 'logistics@greatbeans.com',
    username: 'logistics_coordinator',
    firstName: 'Vo',
    lastName: 'Thi Thao',
    role: 'LOGISTICS_COORDINATOR',
    status: 'ACTIVE',
    department: 'OPERATIONS',
    position: 'Logistics Coordinator',
    phone: '+84-654-321-987',
    avatar: 'logistics-coordinator-avatar.jpg',
    bio: 'Logistics coordinator specializing in international coffee shipments and supply chain optimization.',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
      currency: 'USD',
    },
    permissions: [
      'orders.read',
      'orders.update.shipping',
      'logistics.manage',
      'tracking.update',
      'documents.shipping',
      'analytics.logistics',
    ],
    lastLoginAt: '2024-02-01T07:00:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: false,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-006',
      startDate: '2023-11-01',
      salary: 12000,
      benefits: ['health-insurance', 'transportation-allowance'],
      manager: 'admin-001',
    },
    skills: [
      'logistics-coordination',
      'international-shipping',
      'customs-procedures',
      'supply-chain-management',
    ],
    certifications: ['International-Freight-Forwarder-Certificate'],
    createdBy: 'admin-001',
    updatedBy: 'logistics-coordinator-001',
  },
  {
    id: 'market-analyst-001',
    email: 'analyst@greatbeans.com',
    username: 'market_analyst',
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    role: 'ANALYST',
    status: 'ACTIVE',
    department: 'RESEARCH',
    position: 'Senior Market Analyst',
    phone: '+84-111-222-333',
    avatar: 'market-analyst-avatar.jpg',
    bio: 'Senior Market Analyst with 15 years of experience in agricultural commodities and coffee market research.',
    location: {
      country: 'Vietnam',
      city: 'Ho Chi Minh City',
      timezone: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      language: 'en',
      theme: 'dark',
      notifications: {
        email: true,
        push: false,
        sms: false,
      },
      currency: 'USD',
    },
    permissions: [
      'analytics.read',
      'analytics.create',
      'reports.create',
      'reports.publish',
      'market-data.access',
      'research.conduct',
    ],
    lastLoginAt: '2024-02-01T08:30:00Z',
    emailVerifiedAt: '2024-01-01T00:00:00Z',
    twoFactorEnabled: true,
    isActive: true,
    employmentDetails: {
      employeeId: 'EMP-007',
      startDate: '2022-01-15',
      salary: 28000,
      benefits: ['health-insurance', 'research-budget', 'conference-allowance'],
      manager: 'admin-001',
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/dr-sarah-chen-analyst',
      website: 'https://sarahchen-research.com',
    },
    skills: [
      'market-analysis',
      'statistical-modeling',
      'data-visualization',
      'economic-forecasting',
      'research-methodology',
    ],
    certifications: [
      'PhD-Agricultural-Economics',
      'CFA-Charter',
      'Data-Science-Certificate',
    ],
    createdBy: 'admin-001',
    updatedBy: 'market-analyst-001',
  },
];

export default usersData;
