export interface TestCase {
  slNo: number;
  id: string;
  moduleId: string;
  version: string;
  testCaseId: string;
  useCase: string;
  scenario: string;
  steps: string;
  expected: string;
  attributes: { key: string; value: string }[];
  uploads?: string[]; // base64 strings or file names
}

export const DUMMY_TEST_CASES: TestCase[] = [
  {
    slNo: 1,
    id: '1',
    moduleId: 'mod1',
    version: 'v1.0',
    testCaseId: 'TC101',
    useCase: 'Login Functionality',
    scenario: 'User logs in with valid credentials',
    steps: 'Enter valid username and password, click login',
    expected: 'Dashboard opens successfully',
    attributes: [],
    uploads: []
  },
  {
    slNo: 2,
    id: '2',
    moduleId: 'mod2',
    version: 'v2.1',
    testCaseId: 'TC202',
    useCase: 'Custom Date Range Report',
    scenario: 'User generates report for custom date range',
    steps: 'Go to Reports > Select Date Range > Generate',
    expected: 'Report displays data for selected range',
    attributes: [],
    uploads: []
  },
  {
    slNo: 3,
    id: '3',
    moduleId: 'mod1',
    version: 'v1.1',
    testCaseId: 'TC103',
    useCase: 'Password Reset',
    scenario: 'User resets password using registered email',
    steps: 'Click Forgot Password > Enter Email > Submit',
    expected: 'Password reset link sent to email',
    attributes: [],
    uploads: []
  },
  {
    slNo: 4,
    id: '4',
    moduleId: 'mod3',
    version: 'v3.0',
    testCaseId: 'TC304',
    useCase: 'Profile Update',
    scenario: 'User updates profile with valid data',
    steps: 'Go to Profile > Edit > Update details > Save',
    expected: 'Profile updated successfully',
    attributes: [],
    uploads: []
  },
  {
    slNo: 5,
    id: '5',
    moduleId: 'mod4',
    version: 'v4.2',
    testCaseId: 'TC405',
    useCase: 'Add to Cart',
    scenario: 'User adds product to cart',
    steps: 'Select product > Click Add to Cart',
    expected: 'Product added to cart with quantity 1',
    attributes: [],
    uploads: []
  },
  {
    slNo: 6,
    id: '6',
    moduleId: 'mod4',
    version: 'v4.2',
    testCaseId: 'TC406',
    useCase: 'Remove from Cart',
    scenario: 'User removes product from cart',
    steps: 'Go to Cart > Click Remove icon',
    expected: 'Product removed from cart',
    attributes: [],
    uploads: []
  },
  {
    slNo: 7,
    id: '7',
    moduleId: 'mod2',
    version: 'v2.0',
    testCaseId: 'TC207',
    useCase: 'Logout Functionality',
    scenario: 'User logs out from dashboard',
    steps: 'Click on Logout in user menu',
    expected: 'Redirected to login page',
    attributes: [],
    uploads: []
  },
  {
    slNo: 8,
    id: '8',
    moduleId: 'mod5',
    version: 'v5.0',
    testCaseId: 'TC508',
    useCase: 'Search Feature',
    scenario: 'User searches with valid keyword',
    steps: 'Enter keyword in search bar > Press Enter',
    expected: 'Relevant search results are displayed',
    attributes: [],
    uploads: []
  },
  {
    slNo: 9,
    id: '9',
    moduleId: 'mod1',
    version: 'v1.2',
    testCaseId: 'TC109',
    useCase: 'Multi-factor Authentication',
    scenario: 'User completes MFA successfully',
    steps: 'Enter password > Enter OTP > Submit',
    expected: 'User is logged in securely',
    attributes: [],
    uploads: []
  },
  {
    slNo: 10,
    id: '10',
    moduleId: 'mod3',
    version: 'v3.1',
    testCaseId: 'TC310',
    useCase: 'Notification Preferences',
    scenario: 'User disables email notifications',
    steps: 'Settings > Notifications > Disable Email',
    expected: 'Email notifications are disabled',
    attributes: [],
    uploads: []
  },
  {
    slNo: 11,
    id: '11',
    moduleId: 'mod6',
    version: 'v6.0',
    testCaseId: 'TC611',
    useCase: 'File Upload',
    scenario: 'User uploads a valid PDF file',
    steps: 'Click Upload > Select File > Submit',
    expected: 'File uploaded and listed in files section',
    attributes: [],
    uploads: []
  },
  {
    slNo: 12,
    id: '12',
    moduleId: 'mod2',
    version: 'v2.3',
    testCaseId: 'TC212',
    useCase: 'Report Download',
    scenario: 'User downloads a report as Excel',
    steps: 'Generate report > Click Download as Excel',
    expected: 'Report downloaded successfully as .xlsx',
    attributes: [],
    uploads: []
  },
  {
    slNo: 13,
    id: '13',
    moduleId: 'mod7',
    version: 'v7.0',
    testCaseId: 'TC713',
    useCase: 'Dark Mode Toggle',
    scenario: 'User switches between light and dark mode',
    steps: 'Click on theme toggle in header',
    expected: 'UI switches to selected theme',
    attributes: [],
    uploads: []
  }
];
