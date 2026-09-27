import { Notice, User, AppNotification, SearchQueryLog } from '../types';

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-001',
    noticeNumber: 'CP-2026-0042',
    title: 'HackNova 2026: 36-Hour Annual Campus Hackathon (Venue & Schedule Revision)',
    summary: 'Registrations are open for HackNova 2026 with a prize pool of $15,000. Venue relocated to APJ Abdul Kalam Auditorium due to overwhelming registrations.',
    content: `The Department of Computer Science & Engineering in association with the Google Developer Student Club (GDSC) cordially invites all students to participate in **HackNova 2026**, our flagship 36-hour hackathon.

### Important Revision Notice (v2.0):
Please note that due to higher-than-expected registrations (>800 applicants), the hackathon venue has been **relocated from Seminar Hall B to the APJ Abdul Kalam Central Auditorium (Block 4, 2nd Floor)**. The reporting time remains 08:30 AM on October 18, 2026.

### Event Highlights:
- **Themes**: Generative AI, Sustainable Energy, FinTech, Autonomous Systems & Smart Healthcare.
- **Prize Pool**: $15,000 in cash prizes, direct interview fast-tracks with industry sponsors, and cloud credit vouchers.
- **Hardware Lab Access**: IoT development boards and GPU compute clusters will be provided on-site.

### Eligibility & Team Composition:
1. Open to all undergraduate and postgraduate students from any discipline.
2. Teams must consist of 2 to 4 members. Inter-departmental teams are encouraged.
3. Every participant must carry a valid University Physical Identity Card and their registration confirmation email with QR code.

### Timeline & Deadlines:
- **Registration Deadline**: October 12, 2026, 11:59 PM IST
- **Team Confirmation & Mentorship Allocation**: October 15, 2026
- **Hackathon Kick-off**: October 18, 2026, 09:00 AM IST
- **Final Project Demo & Jury Pitch**: October 19, 2026, 04:00 PM IST

Meals, high-speed WiFi, sleeping pods, and energy beverages will be provided complimentary throughout the 36-hour duration. For inquiries, email hacknova@campus.edu or visit the GDSC Office at Block 3, Room 102.`,
    category: 'Hackathons',
    tags: ['hackathon', 'coding', 'ai', 'gdsc', 'prizes', 'apj auditorium', 'technology'],
    author: {
      name: 'Dr. Ramesh Sundaram',
      department: 'Department of Computer Science',
      email: 'r.sundaram@campus.edu',
    },
    publishedAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-22T14:30:00Z',
    createdAt: '2026-09-15T08:45:00Z',
    status: 'published',
    isImportant: true,
    isRevised: true,
    currentVersion: 'v2.0',
    hasEvent: true,
    eventData: {
      eventDate: '2026-10-18',
      eventTime: '08:30 AM - 05:00 PM (Oct 19)',
      venue: 'APJ Abdul Kalam Central Auditorium (Block 4)',
      organizer: 'Department of CSE & GDSC Club',
      registrationDeadline: '2026-10-12',
      registrationUrl: 'https://hacknova2026.campus.edu/register',
      maxParticipants: 800,
      currentRegistrations: 642,
      status: 'registration_open',
    },
    attachments: [
      {
        id: 'att-001',
        name: 'HackNova_2026_Rulebook_and_Guidelines_v2.pdf',
        size: '2.4 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Official Rulebook for HackNova 2026. Venue updated to APJ Abdul Kalam Auditorium. Registration closing on October 12, 2026.',
      },
      {
        id: 'att-002',
        name: 'Hackathon_Problem_Statements.docx',
        size: '1.1 MB',
        type: 'docx',
        url: '#',
        extractedText: 'Track 1: Generative AI for Education. Track 2: Clean Tech & EV Charging optimization. Track 3: Decentralized Finance.',
      },
    ],
    revisions: [
      {
        id: 'rev-001',
        version: 'v1.0',
        editedAt: '2026-09-15T09:00:00Z',
        editedBy: 'Dr. Ramesh Sundaram',
        editorRole: 'Department Head',
        changeSummary: 'Initial publication with Seminar Hall B as venue and registration deadline Oct 10.',
        changedFields: ['title', 'content', 'venue', 'registrationDeadline'],
        previousSnapshot: {
          title: 'HackNova 2026: 36-Hour Annual Campus Hackathon',
          summary: 'Registrations are open for HackNova 2026 with a prize pool of $15,000.',
          content: 'The Department of CSE invites students to HackNova 2026 at Seminar Hall B. Registration deadline is October 10, 2026.',
          category: 'Hackathons',
          isImportant: true,
          eventDate: '2026-10-18',
          eventTime: '09:00 AM',
          venue: 'Seminar Hall B (Block 2)',
          registrationDeadline: '2026-10-10',
          registrationUrl: 'https://hacknova2026.campus.edu/register',
        },
        currentSnapshot: {
          title: 'HackNova 2026: 36-Hour Annual Campus Hackathon (Venue & Schedule Revision)',
          summary: 'Registrations are open for HackNova 2026 with a prize pool of $15,000. Venue relocated to APJ Abdul Kalam Auditorium.',
          content: 'The Department of CSE in association with GDSC invites all students. Due to registrations exceeding 800, venue is relocated to APJ Abdul Kalam Central Auditorium. Registration deadline extended to October 12, 2026.',
          category: 'Hackathons',
          isImportant: true,
          eventDate: '2026-10-18',
          eventTime: '08:30 AM',
          venue: 'APJ Abdul Kalam Central Auditorium (Block 4)',
          registrationDeadline: '2026-10-12',
          registrationUrl: 'https://hacknova2026.campus.edu/register',
        },
      },
    ],
    viewCount: 1420,
    bookmarkCount: 184,
  },
  {
    id: 'notice-002',
    noticeNumber: 'CP-2026-0043',
    title: 'Mid-Semester Examinations Schedule (Autumn 2026) - Revised Timetable',
    summary: 'The Mid-Semester Examination schedule has been rescheduled by one week. Exams commence from October 14, 2026 across all undergraduate programs.',
    content: `### Office of the Controller of Examinations
**Circular No: COE/EXAM/2026-27/088**

All students of B.Tech, B.Sc, BCA, and Dual Degree programs are hereby notified regarding the **rescheduled Mid-Semester Examinations for Autumn 2026**.

### Revised Examination Dates:
- **Commencement Date**: October 14, 2026 (Shifted from earlier tentative date of October 05, 2026)
- **Conclusion Date**: October 23, 2026
- **Examination Timings**:
  - Morning Shift (Slot 1): 09:30 AM to 11:30 AM
  - Afternoon Shift (Slot 2): 02:00 PM to 04:00 PM

### Key Instructions for Examinees:
1. **Admit Cards**: Hall tickets will be downloadable via the Student Portal starting **October 08, 2026**.
2. **Attendance Eligibility Criteria**: Minimum mandatory attendance of **75%** in each subject is strictly enforced. Students with attendance between 65% - 74% with authorized medical certificates must submit their documentation to the Dean of Student Affairs by **October 06, 2026, 05:00 PM**.
3. **Prohibited Items**: Smart watches, programmable calculators, and mobile phones are strictly forbidden inside examination halls.
4. **Seating Arrangements**: Department-wise room allocations will be displayed outside the Central Library and on digital notice boards on October 13, 2026.

For queries or scheduling conflicts in elective subjects, reach out to coe@campus.edu before October 07, 2026.`,
    category: 'Exams',
    tags: ['midterm', 'exams', 'autumn 2026', 'attendance', 'hall ticket', 'coe', 'schedule'],
    author: {
      name: 'Prof. Ananya Sen',
      department: 'Office of the Controller of Examinations',
      email: 'coe@campus.edu',
    },
    publishedAt: '2026-09-18T11:00:00Z',
    updatedAt: '2026-09-24T16:15:00Z',
    createdAt: '2026-09-18T10:30:00Z',
    status: 'published',
    isImportant: true,
    isRevised: true,
    currentVersion: 'v1.2',
    hasEvent: false,
    attachments: [
      {
        id: 'att-003',
        name: 'Autumn_2026_MidSem_TimeTable_Final.pdf',
        size: '1.8 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Autumn 2026 Mid-Semester Exam Schedule. B.Tech Semester 3, 5, 7. Dates: Oct 14 to Oct 23, 2026. Morning Slot 9:30 AM, Afternoon Slot 2:00 PM.',
      },
    ],
    revisions: [
      {
        id: 'rev-002',
        version: 'v1.1',
        editedAt: '2026-09-24T16:15:00Z',
        editedBy: 'Prof. Ananya Sen',
        editorRole: 'Controller of Examinations',
        changeSummary: 'Updated medical certificate submission deadline from Oct 03 to Oct 06 and added Slot 2 timings.',
        changedFields: ['content', 'summary'],
        previousSnapshot: {
          title: 'Mid-Semester Examinations Schedule (Autumn 2026)',
          summary: 'Mid-Semester Examination schedule starts October 14, 2026.',
          content: 'Exams commence from October 14, 2026. Medical certificates deadline was October 03, 2026.',
          category: 'Exams',
          isImportant: true,
        },
        currentSnapshot: {
          title: 'Mid-Semester Examinations Schedule (Autumn 2026) - Revised Timetable',
          summary: 'The Mid-Semester Examination schedule has been rescheduled by one week. Exams commence from October 14, 2026.',
          content: 'Exams commence October 14, 2026. Medical certificates deadline extended to October 06, 2026, 05:00 PM. Morning Slot 9:30-11:30 AM, Afternoon Slot 2:00-4:00 PM.',
          category: 'Exams',
          isImportant: true,
        },
      },
    ],
    viewCount: 3890,
    bookmarkCount: 520,
  },
  {
    id: 'notice-003',
    noticeNumber: 'CP-2026-0044',
    title: 'Google & Microsoft Campus Placement Drive 2026-27: Registration & Eligibility',
    summary: 'On-campus recruitment for Software Engineers, Cloud Associates, and Data Analysts. Registration closes September 30, 2026 for final year students.',
    content: `### Career Development & Placement Cell (CDPC)
**Placement Circular 2026/P-044**

We are thrilled to announce that **Google LLC** and **Microsoft Corporation** will conduct combined on-campus recruitment for the graduating batch of 2027 (and 2026 PG batches).

### Job Roles & CTC Package:
- **Software Development Engineer I (Google)**: $135,000 / ₹42 LPA base + stocks
- **Cloud Solutions Architect (Microsoft)**: ₹38 LPA CTC
- **Data Engineering Associate (Microsoft)**: ₹34 LPA CTC

### Eligibility Criteria:
1. **Academic Cutoff**: Minimum **7.5 CGPA** or equivalent without any active standing backlogs across all semesters.
2. **Degrees Eligible**: B.Tech / M.Tech in CSE, IT, ECE, EEE, AI & Data Science, and MCA.
3. **Internship Status**: Students currently on semester internships can apply and attend virtual interviews.

### Mandatory Selection Rounds:
- **Online Coding Assessment (OA)**: October 04, 2026 (2 hours on HackerRank platform)
- **Technical Round 1 & 2 (Virtual)**: October 09 - October 11, 2026
- **System Design & Hiring Manager Round**: October 14, 2026

### Action Required:
Interested and eligible candidates must register on the **Superset Placement Portal** before **September 30, 2026, 11:59 PM**. Late submissions will not be accommodated under any circumstances. Upload your updated ATS-compliant PDF resume and verified transcripts.`,
    category: 'Placements',
    tags: ['placements', 'google', 'microsoft', 'sde', 'cdpc', 'jobs', 'careers', 'cgpa 7.5'],
    author: {
      name: 'Dr. Rajiv Malhotra',
      department: 'Head, Training & Placements',
      email: 'placements@campus.edu',
    },
    publishedAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-20T10:00:00Z',
    createdAt: '2026-09-20T09:30:00Z',
    status: 'published',
    isImportant: true,
    isRevised: false,
    currentVersion: 'v1.0',
    hasEvent: true,
    eventData: {
      eventDate: '2026-10-04',
      eventTime: '10:00 AM - 12:00 PM',
      venue: 'Online Assessment (HackerRank Portal) & CS Computer Labs 1-4',
      organizer: 'Career Development & Placement Cell',
      registrationDeadline: '2026-09-30',
      registrationUrl: 'https://placements.campus.edu/superset/google-msft',
      maxParticipants: 500,
      currentRegistrations: 385,
      status: 'registration_open',
    },
    attachments: [
      {
        id: 'att-004',
        name: 'Google_Microsoft_Job_Descriptions_2026.pdf',
        size: '3.1 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Google Software Engineer I Job Description. Microsoft Cloud Solutions Architect. Required skills: Data Structures, Algorithms, Distributed Systems, Python, Java, C++, TypeScript.',
      },
    ],
    revisions: [],
    viewCount: 2940,
    bookmarkCount: 410,
  },
  {
    id: 'notice-004',
    noticeNumber: 'CP-2026-0045',
    title: 'Hands-on Workshop: Building Autonomous Agents with Large Language Models & LangChain',
    summary: 'A 2-day intensive technical workshop on Generative AI and multi-agent systems with industry certification on October 10-11, 2026.',
    content: `The Department of Artificial Intelligence in collaboration with the AI Research Lab announces an exclusive hands-on workshop: **"Autonomous AI Agents: From Zero to Production"**.

### Workshop Syllabus:
- **Day 1 (Oct 10)**: Foundations of Agentic Workflows, Tool Calling, Vector Databases (ChromaDB/Pinecone), RAG Architecture.
- **Day 2 (Oct 11)**: Building multi-agent swarms with LangGraph and CrewAI, deploying reasoning agents with local Ollama & OpenAI APIs.

### Prerequisites:
- Intermediate proficiency in Python.
- Personal laptop with Docker and VS Code installed.
- Free HuggingFace & Gemini API key setup prior to session.

### Registration & Certificate:
- **Dates**: October 10 - October 11, 2026 (10:00 AM - 04:30 PM)
- **Venue**: Turing Computational Lab (Block 1, 3rd Floor)
- **Fee**: FREE for registered university students (Sponsored by Industry AI Grant).
- **Seats**: Strictly capped at 60 seats on first-come-first-served basis.
- **Registration Deadline**: October 07, 2026. Certificates of Completion with verification credentials will be issued.`,
    category: 'Workshops',
    tags: ['ai', 'workshop', 'langchain', 'generative ai', 'hands-on', 'turing lab', 'certification'],
    author: {
      name: 'Dr. Priya Nambiar',
      department: 'Department of AI & Data Science',
      email: 'priya.n@campus.edu',
    },
    publishedAt: '2026-09-21T14:00:00Z',
    updatedAt: '2026-09-21T14:00:00Z',
    createdAt: '2026-09-21T13:30:00Z',
    status: 'published',
    isImportant: false,
    isRevised: false,
    currentVersion: 'v1.0',
    hasEvent: true,
    eventData: {
      eventDate: '2026-10-10',
      eventTime: '10:00 AM - 04:30 PM',
      venue: 'Turing Computational Lab (Block 1, 3rd Floor)',
      organizer: 'AI Research Lab & Dept of AI',
      registrationDeadline: '2026-10-07',
      registrationUrl: 'https://aiworkshop.campus.edu/enroll',
      maxParticipants: 60,
      currentRegistrations: 52,
      status: 'registration_closing_soon',
    },
    attachments: [
      {
        id: 'att-005',
        name: 'AI_Workshop_Setup_Guide_and_Environment.pdf',
        size: '1.2 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Pre-workshop software installation checklist. Python 3.11+, Conda environment, Docker container setup.',
      },
    ],
    revisions: [],
    viewCount: 1620,
    bookmarkCount: 230,
  },
  {
    id: 'notice-005',
    noticeNumber: 'CP-2026-0046',
    title: 'Merit-Cum-Means & National Diversity Scholarships 2026-27: Application Guidelines',
    summary: 'Financial aid applications are invited for academic year 2026-27. Tuition fee waivers up to 100% available for eligible candidates. Deadline: October 25, 2026.',
    content: `### Student Welfare & Financial Aid Committee
**Notice No: SW/SCHOLARSHIP/2026-27/019**

Applications are officially open for the university's **Merit-Cum-Means Scholarship Scheme** and **National Diversity Grant** for the 2026-2027 academic session.

### Scholarship Categories & Benefits:
1. **Category A (Full Tuition Waiver - 100%)**: For students with family annual income < ₹2.5 Lakhs and CGPA >= 8.5.
2. **Category B (Partial Tuition Waiver - 50%)**: For students with family annual income between ₹2.5 Lakhs - ₹6.0 Lakhs and CGPA >= 7.5.
3. **Category C (Women in STEM Fellowship)**: Special stipend of ₹25,000 per semester for female students enrolled in engineering and research programs.

### Mandatory Documents Required:
- Verified Income Certificate issued by competent revenue authority (dated on or after April 01, 2026).
- Previous year grade sheets and Mark transcripts.
- Copy of student bank account passbook (linked with Aadhaar/Govt ID).
- Affidavit of non-receipt of any other external government scholarship.

### Submission Process:
Submit the complete application packet along with self-attested document photocopies at the **Student Welfare Counter, Admin Block (Room 12)** or apply online through the University Scholarship Portal before **October 25, 2026, 05:00 PM**.`,
    category: 'Scholarships',
    tags: ['scholarship', 'financial aid', 'fee waiver', 'merit', 'diversity', 'student welfare'],
    author: {
      name: 'Dean of Student Welfare',
      department: 'Office of Student Affairs',
      email: 'studentwelfare@campus.edu',
    },
    publishedAt: '2026-09-17T08:30:00Z',
    updatedAt: '2026-09-17T08:30:00Z',
    createdAt: '2026-09-17T08:00:00Z',
    status: 'published',
    isImportant: true,
    isRevised: false,
    currentVersion: 'v1.0',
    hasEvent: false,
    attachments: [
      {
        id: 'att-006',
        name: 'Scholarship_Application_Form_2026.pdf',
        size: '950 KB',
        type: 'pdf',
        url: '#',
        extractedText: 'Application Form for Merit-cum-Means Scholarship Scheme 2026-27. Income verification declaration form.',
      },
    ],
    revisions: [],
    viewCount: 2280,
    bookmarkCount: 310,
  },
  {
    id: 'notice-006',
    noticeNumber: 'CP-2026-0047',
    title: 'Semester Fee Payment Deadline Extension & Zero Late Penalty (Updated)',
    summary: 'The last date for payment of Autumn Semester 2026 tuition and hostel fees has been extended to October 10, 2026 without any late fee penalty.',
    content: `### Finance & Accounts Department
**Circular: FIN/FEE/EXT-02/2026**

In consideration of requests from student representations and recent banking gateway technical maintenance, the Competent Authority has approved an extension of the deadline for **Autumn Semester 2026 Fee Remittance**.

### Updated Fee Schedule:
- **Extended Deadline (Without Late Fine)**: **October 10, 2026, 11:59 PM** (Extended from earlier deadline of September 25, 2026)
- **Late Payment Window (With ₹1,500 Fine)**: October 11 to October 18, 2026
- **De-registration Date**: Students failing to pay fees by October 18, 2026 will have their portal access suspended temporarily.

### Accepted Modes of Payment:
1. Online via NetBanking, UPI, or Credit/Debit Card through the official **PayU Campus ERP Portal**.
2. Education Loan NEFT/RTGS directly to University Account (submit UTR receipt to accounts@campus.edu).
3. Demand Draft in favor of "Campus University General Fund" payable at campus branch.

No cash transactions will be accepted at the accounts counter. Ensure you download and retain your fee receipt for semester registration verification.`,
    category: 'Registration',
    tags: ['fee payment', 'tuition fee', 'deadline extension', 'accounts', 'erp', 'hostel fee'],
    author: {
      name: 'Mr. Arvind Joshi',
      department: 'Finance & Accounts Branch',
      email: 'accounts@campus.edu',
    },
    publishedAt: '2026-09-23T12:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z',
    createdAt: '2026-09-23T11:40:00Z',
    status: 'published',
    isImportant: true,
    isRevised: true,
    currentVersion: 'v2.0',
    hasEvent: false,
    attachments: [
      {
        id: 'att-007',
        name: 'Fee_Breakup_Structure_Autumn_2026.pdf',
        size: '1.4 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Autumn 2026 semester fee breakdown. Tuition, examination fees, lab charges, hostel mess charges.',
      },
    ],
    revisions: [
      {
        id: 'rev-003',
        version: 'v1.0',
        editedAt: '2026-09-23T12:00:00Z',
        editedBy: 'Mr. Arvind Joshi',
        editorRole: 'Finance Officer',
        changeSummary: 'Original circular stating fee deadline September 25 with standard late fee policy.',
        changedFields: ['content', 'summary', 'title'],
        previousSnapshot: {
          title: 'Semester Fee Payment Deadline Notice',
          summary: 'Last date for payment of Autumn Semester 2026 tuition fee is September 25, 2026.',
          content: 'Tuition fees must be paid by September 25, 2026. Late fees apply thereafter.',
          category: 'Registration',
          isImportant: true,
        },
        currentSnapshot: {
          title: 'Semester Fee Payment Deadline Extension & Zero Late Penalty (Updated)',
          summary: 'The last date for payment of Autumn Semester 2026 tuition and hostel fees has been extended to October 10, 2026.',
          content: 'Extended deadline without late fine is October 10, 2026, 11:59 PM. Late payment with ₹1500 fine allowed till Oct 18.',
          category: 'Registration',
          isImportant: true,
        },
      },
    ],
    viewCount: 3120,
    bookmarkCount: 440,
  },
  {
    id: 'notice-007',
    noticeNumber: 'CP-2026-0048',
    title: 'University Robotics & Autonomous Systems Club (URAC) - Annual Induction 2026',
    summary: 'Auditions and recruitment for software, hardware, and design divisions of the competitive robotics team. October 05-06, 2026.',
    content: `Are you passionate about building battlebots, autonomous drones, ROS2 robotics, or computer vision systems?

**URAC (University Robotics & Autonomous Systems Club)** announces its annual recruitment drive for the 2026-2027 competitive season. We compete annually in RoboSub, NASA Rover Challenge, and National Mechatronics Olympiad.

### Open Sub-Teams:
1. **Mechanical & Fabrication**: CAD Modeling (SolidWorks/Fusion360), 3D printing, chassis dynamics, CNC machining.
2. **Electronics & Embedded**: PCB Design (KiCAD), STM32/ESP32 firmware, motor control algorithms.
3. **Software & Perception**: ROS2, SLAM, OpenCV, Reinforcement Learning, path planning.
4. **Operations & Media**: Sponsorship outreach, graphic design, social media storytelling.

### Induction Schedule:
- **Round 1 (Aptitude & Task Submission)**: October 05, 2026, 05:30 PM (Makerspace Lab, Mechanical Block)
- **Round 2 (Personal Interview & Project Review)**: October 06, 2026, 02:00 PM onwards

No prior advanced hardware experience is required for 1st-year students—we provide comprehensive training bootcamps! Bring your enthusiasm and curiosity.`,
    category: 'Clubs & Societies',
    tags: ['robotics', 'club', 'induction', 'recruitment', 'makerspace', 'drones', 'ros2'],
    author: {
      name: 'Advait Sharma',
      department: 'President, URAC Club',
      email: 'robotics@campus.edu',
    },
    publishedAt: '2026-09-22T16:00:00Z',
    updatedAt: '2026-09-22T16:00:00Z',
    createdAt: '2026-09-22T15:00:00Z',
    status: 'published',
    isImportant: false,
    isRevised: false,
    currentVersion: 'v1.0',
    hasEvent: true,
    eventData: {
      eventDate: '2026-10-05',
      eventTime: '05:30 PM - 08:30 PM',
      venue: 'Makerspace Lab & Mechatronics Hall (Block 5)',
      organizer: 'URAC Robotics Student Society',
      registrationDeadline: '2026-10-04',
      registrationUrl: 'https://robotics.campus.edu/join',
      maxParticipants: 150,
      currentRegistrations: 98,
      status: 'registration_open',
    },
    attachments: [
      {
        id: 'att-008',
        name: 'URAC_Induction_Task_Sheet_2026.pdf',
        size: '1.9 MB',
        type: 'pdf',
        url: '#',
        extractedText: 'Task sheet for electronics and software auditions. ROS2 simulation task, PCB layout challenge.',
      },
    ],
    revisions: [],
    viewCount: 1150,
    bookmarkCount: 175,
  },
  {
    id: 'notice-008',
    noticeNumber: 'CP-2026-0049',
    title: 'Central Library 24x7 Night Owl Study Wing Opening & Digital Catalog Launch',
    summary: 'The Central Library 3rd floor reading hall will now remain open 24x7 during exam preparation months starting October 01, 2026 with high-speed WiFi and coffee stations.',
    content: `### University Central Library System
**Notice: LIB/2026/NIGHT-WING-01**

In response to student council recommendations for enhanced late-night study spaces during the upcoming examination period, the Central Library is pleased to inaugurate the **24x7 Night Owl Study Commons**.

### Facility Highlights:
- **Operating Hours**: 24 Hours, 7 Days a week from **October 01 to November 30, 2026**.
- **Location**: 3rd Floor East Wing (Air-conditioned, capacity: 350 seats).
- **Amenities**: Ergonomic study pods, individual power outlets at every desk, silent study pods, and complimentary hot beverage vending machines from 11:00 PM to 06:00 AM.
- **Security**: RFID smart card swipe access only; 24-hour campus security guard and CCTV monitoring.

### Guidelines for Students:
1. Entry after 10:00 PM requires tap-in with active Student ID card.
2. Group discussions must be confined to designated sound-proof discussion rooms (Room 304 & 305).
3. Books can be checked out self-service using the newly installed RFID kiosk machines.

For issues with digital library accounts or IEEE/ACM digital library remote access, contact library@campus.edu.`,
    category: 'Announcements',
    tags: ['library', 'study wing', '24x7', 'facilities', 'books', 'digital catalog', 'campus life'],
    author: {
      name: 'Dr. Meera Vasudevan',
      department: 'Chief Librarian',
      email: 'library@campus.edu',
    },
    publishedAt: '2026-09-24T09:30:00Z',
    updatedAt: '2026-09-24T09:30:00Z',
    createdAt: '2026-09-24T09:00:00Z',
    status: 'published',
    isImportant: false,
    isRevised: false,
    currentVersion: 'v1.0',
    hasEvent: false,
    attachments: [],
    revisions: [],
    viewCount: 1890,
    bookmarkCount: 295,
  },
  {
    id: 'notice-009',
    noticeNumber: 'CP-2026-0050',
    title: 'Draft: Winter Inter-College Sports Fest "Olympus 2026" Schedule & Tryouts',
    summary: 'Preliminary announcement for the annual sports tournament spanning Football, Basketball, Cricket, and Athletics.',
    content: `### Sports & Athletics Council
**Draft Notice for Internal Review**

The Department of Physical Education is planning the 14th Annual Sports Meet "Olympus 2026" from November 12-15, 2026. Tryouts for campus teams will commence in late October.`,
    category: 'Events',
    tags: ['sports', 'olympus', 'football', 'basketball', 'athletics'],
    author: {
      name: 'Coach Vikram Singh',
      department: 'Department of Physical Education',
      email: 'sports@campus.edu',
    },
    publishedAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z',
    createdAt: '2026-09-25T09:30:00Z',
    status: 'draft',
    isImportant: false,
    isRevised: false,
    currentVersion: 'v0.1',
    hasEvent: true,
    eventData: {
      eventDate: '2026-11-12',
      eventTime: '08:00 AM - 06:00 PM',
      venue: 'University Main Sports Complex',
      organizer: 'Athletics & Sports Council',
      status: 'upcoming',
    },
    attachments: [],
    revisions: [],
    viewCount: 12,
    bookmarkCount: 0,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Aarav Sharma',
    email: 'student@campus.edu',
    role: 'student',
    studentId: '2023CS0142',
    department: 'Computer Science & Engineering',
    enrollmentYear: '2023',
    savedNoticesCount: 4,
    lastActive: 'Just now',
    createdAt: '2023-08-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'user-002',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@campus.edu',
    role: 'admin',
    department: 'Dean of Academic Affairs & Chief Notice Admin',
    lastActive: 'Just now',
    createdAt: '2022-01-10T08:00:00Z',
    status: 'active',
  },
  {
    id: 'user-003',
    name: 'Rohan Mehta',
    email: 'rohan.m@campus.edu',
    role: 'student',
    studentId: '2024EC0089',
    department: 'Electronics & Communication',
    enrollmentYear: '2024',
    savedNoticesCount: 7,
    lastActive: '2 hours ago',
    createdAt: '2024-08-12T11:20:00Z',
    status: 'active',
  },
  {
    id: 'user-004',
    name: 'Pooja Krishnan',
    email: 'pooja.k@campus.edu',
    role: 'student',
    studentId: '2022AI0014',
    department: 'Artificial Intelligence & Data Science',
    enrollmentYear: '2022',
    savedNoticesCount: 12,
    lastActive: 'Yesterday',
    createdAt: '2022-08-20T09:15:00Z',
    status: 'active',
  },
  {
    id: 'user-005',
    name: 'Tanya Sengupta',
    email: 'tanya.s@campus.edu',
    role: 'student',
    studentId: '2023ME0051',
    department: 'Mechanical Engineering',
    enrollmentYear: '2023',
    savedNoticesCount: 3,
    lastActive: '3 days ago',
    createdAt: '2023-08-18T14:40:00Z',
    status: 'active',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'HackNova 2026 Venue Changed',
    message: 'The venue for HackNova 2026 has been updated to APJ Abdul Kalam Central Auditorium (Block 4).',
    type: 'revision',
    targetNoticeId: 'notice-001',
    isRead: false,
    createdAt: '2026-09-22T14:35:00Z',
  },
  {
    id: 'notif-002',
    title: 'Mid-Semester Examination Schedule Released',
    message: 'Autumn 2026 Mid-Semester exams commence from October 14, 2026. Check the revised timetable.',
    type: 'important',
    targetNoticeId: 'notice-002',
    isRead: false,
    createdAt: '2026-09-24T16:20:00Z',
  },
  {
    id: 'notif-003',
    title: 'Fee Payment Deadline Extended to Oct 10',
    message: 'Tuition and hostel fee payment deadline has been extended with zero late fine penalty.',
    type: 'deadline',
    targetNoticeId: 'notice-006',
    isRead: true,
    createdAt: '2026-09-25T10:05:00Z',
  },
  {
    id: 'notif-004',
    title: 'Google & Microsoft Placement Registration Closing Soon',
    message: 'Superset portal registration for Google and Microsoft closes on September 30, 2026.',
    type: 'event_update',
    targetNoticeId: 'notice-003',
    isRead: true,
    createdAt: '2026-09-26T09:00:00Z',
  },
];

export const INITIAL_SEARCH_LOGS: SearchQueryLog[] = [
  {
    id: 'log-001',
    query: 'What is the venue for HackNova 2026?',
    timestamp: '2026-09-26T14:10:00Z',
    resultsCount: 1,
    matchedCategory: 'Hackathons',
    matchedNoticeIds: ['notice-001'],
    wasAnswered: true,
    userRole: 'student',
  },
  {
    id: 'log-002',
    query: 'When do mid semester exams start?',
    timestamp: '2026-09-26T15:20:00Z',
    resultsCount: 1,
    matchedCategory: 'Exams',
    matchedNoticeIds: ['notice-002'],
    wasAnswered: true,
    userRole: 'student',
  },
  {
    id: 'log-003',
    query: 'Google placement drive cutoff CGPA',
    timestamp: '2026-09-26T16:05:00Z',
    resultsCount: 1,
    matchedCategory: 'Placements',
    matchedNoticeIds: ['notice-003'],
    wasAnswered: true,
    userRole: 'student',
  },
  {
    id: 'log-004',
    query: 'Swimming pool operating timings and membership fee',
    timestamp: '2026-09-26T17:40:00Z',
    resultsCount: 0,
    matchedCategory: 'None',
    matchedNoticeIds: [],
    wasAnswered: false,
    userRole: 'student',
  },
  {
    id: 'log-005',
    query: 'Bus route schedule for South Campus shuttles',
    timestamp: '2026-09-26T18:15:00Z',
    resultsCount: 0,
    matchedCategory: 'None',
    matchedNoticeIds: [],
    wasAnswered: false,
    userRole: 'student',
  },
  {
    id: 'log-006',
    query: 'Last date for tuition fee payment without fine',
    timestamp: '2026-09-27T08:30:00Z',
    resultsCount: 1,
    matchedCategory: 'Registration',
    matchedNoticeIds: ['notice-006'],
    wasAnswered: true,
    userRole: 'student',
  },
];
