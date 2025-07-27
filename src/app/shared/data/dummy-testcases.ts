export interface TestCase {
  id: string;
  slNo: number;
  moduleId: string;
  version: string;
  testCaseId: string;
  useCase: string;
  scenario: string;
  steps: string;
  expected: string;
  result?: 'Pass' | 'Fail' | 'Pending' | 'Blocked';
  actual?: string;
  remarks?: string;
  attributes: TestCaseAttribute[];
  uploads?: string[];
}

export interface TestCaseAttribute {
  key: string;
  value: string;
}

export const DUMMY_TEST_CASES: TestCase[] = [
  {
    id: '1',
    slNo: 1,
    moduleId: 'mod1',
    version: 'v1.0',
    testCaseId: 'TC101',
    useCase: 'Login Functionality',
    scenario: 'User logs in with valid credentials',
    steps: '1. Enter username\n2. Enter password\n3. Click login',
    expected: 'Dashboard should be displayed',
    result: 'Pending',
    attributes: [],
    uploads: []
  },
  {
    id: '2',
    slNo: 2,
    moduleId: 'mod2',
    version: 'v1.0',
    testCaseId: 'TC102',
    useCase: 'Report Generation',
    scenario: 'User generates monthly report',
    steps: '1. Navigate to Reports\n2. Select month\n3. Click Generate',
    expected: 'PDF report should download',
    result: 'Pass',
    attributes: [
      { key: 'ReportType', value: 'Monthly' }
    ],
    uploads: ['report-screenshot.png']
  },
  {
    id: '3',
    slNo: 3,
    moduleId: 'mod1',
    version: 'v1.1',
    testCaseId: 'TC103',
    useCase: 'Password Reset',
    scenario: 'User resets forgotten password',
    steps: '1. Click Forgot Password\n2. Enter email\n3. Submit',
    expected: 'Password reset email should be sent',
    result: 'Fail',
    actual: 'Email not sent due to SMTP error',
    remarks: 'Need to check email server configuration',
    attributes: [],
    uploads: []
  },
  {
    id: '4',
    slNo: 4,
    moduleId: 'mod3',
    version: 'v2.0',
    testCaseId: 'TC104',
    useCase: 'Profile Update',
    scenario: 'User updates profile information',
    steps: '1. Go to Profile\n2. Edit fields\n3. Save changes',
    expected: 'Profile should update with new information',
    result: 'Pending',
    attributes: [
      { key: 'ProfileSection', value: 'PersonalInfo' }
    ],
    uploads: []
  }
];

export interface Module {
  id: string;
  name: string;
  description?: string;
}