export const CURRENT_USER_REG_NO = "711521104001";

export const studentProfile = {
  name: "Arjun Kumar",
  regNo: CURRENT_USER_REG_NO,
  degree: "B.Tech",
  branch: "Computer Science and Engineering",
  batch: "2021-2025",
  college: "Anna University Regional Campus Coimbatore",
  dob: "04-Sep-2003",
  overallCGPA: 8.92,
  classification: "First Class with Distinction",
  totalCredits: 135,
  rank: 12,
  arrears: 0
};

export const semesterResults = [
  {
    semester: 1,
    gpa: 8.4,
    credits: 22,
    subjects: [
      { code: "MA101", name: "Engineering Mathematics I", internal: 35, external: 55, total: 90, grade: "S", credits: 4 },
      { code: "PH101", name: "Engineering Physics", internal: 32, external: 50, total: 82, grade: "A", credits: 3 },
      { code: "CH101", name: "Engineering Chemistry", internal: 38, external: 52, total: 90, grade: "S", credits: 3 },
      { code: "CS101", name: "Python Programming", internal: 39, external: 58, total: 97, grade: "S", credits: 4 },
      { code: "EE101", name: "Basic Electrical Engineering", internal: 30, external: 49, total: 79, grade: "B", credits: 3 },
      { code: "EG101", name: "Engineering Graphics", internal: 35, external: 50, total: 85, grade: "A", credits: 3 },
      { code: "PC101", name: "Physics & Chemistry Lab", internal: 45, external: 48, total: 93, grade: "S", credits: 2 }
    ]
  },
  {
    semester: 2,
    gpa: 8.6,
    credits: 24,
    subjects: [
      { code: "MA102", name: "Engineering Mathematics II", internal: 36, external: 58, total: 94, grade: "S", credits: 4 },
      { code: "CS102", name: "C Programming", internal: 35, external: 52, total: 87, grade: "A", credits: 4 },
      { code: "EE102", name: "Basic Electronics", internal: 33, external: 48, total: 81, grade: "A", credits: 3 },
      { code: "ME101", name: "Engineering Mechanics", internal: 31, external: 45, total: 76, grade: "B", credits: 3 },
      { code: "CE101", name: "Basic Civil Engineering", internal: 38, external: 55, total: 93, grade: "S", credits: 3 },
      { code: "EN101", name: "Technical English", internal: 40, external: 50, total: 90, grade: "S", credits: 3 },
      { code: "WP101", name: "Workshop Practice", internal: 45, external: 45, total: 90, grade: "S", credits: 2 },
      { code: "CP101", name: "C Programming Lab", internal: 48, external: 49, total: 97, grade: "S", credits: 2 }
    ]
  },
  {
    semester: 3,
    gpa: 8.8,
    credits: 23,
    subjects: [
      { code: "MA201", name: "Transforms and Partial Differential Equations", internal: 34, external: 56, total: 90, grade: "S", credits: 4 },
      { code: "CS201", name: "Data Structures", internal: 38, external: 55, total: 93, grade: "S", credits: 3 },
      { code: "CS202", name: "Object Oriented Programming", internal: 39, external: 58, total: 97, grade: "S", credits: 3 },
      { code: "EC201", name: "Digital Principles and System Design", internal: 35, external: 48, total: 83, grade: "A", credits: 4 },
      { code: "CS203", name: "Software Engineering", internal: 36, external: 50, total: 86, grade: "A", credits: 3 },
      { code: "DS201", name: "Data Structures Lab", internal: 48, external: 48, total: 96, grade: "S", credits: 2 },
      { code: "OP201", name: "OOP Lab", internal: 45, external: 47, total: 92, grade: "S", credits: 2 },
      { code: "CS204", name: "Professional Ethics", internal: 38, external: 50, total: 88, grade: "A", credits: 2 }
    ]
  },
  {
    semester: 4,
    gpa: 9.1,
    credits: 22,
    subjects: [
      { code: "MA202", name: "Probability and Queueing Theory", internal: 36, external: 58, total: 94, grade: "S", credits: 4 },
      { code: "CS211", name: "Computer Architecture", internal: 35, external: 52, total: 87, grade: "A", credits: 3 },
      { code: "CS212", name: "Database Management Systems", internal: 39, external: 58, total: 97, grade: "S", credits: 3 },
      { code: "CS213", name: "Design and Analysis of Algorithms", internal: 38, external: 55, total: 93, grade: "S", credits: 3 },
      { code: "CS214", name: "Operating Systems", internal: 37, external: 51, total: 88, grade: "A", credits: 3 },
      { code: "DB201", name: "DBMS Lab", internal: 48, external: 49, total: 97, grade: "S", credits: 2 },
      { code: "OS201", name: "Operating Systems Lab", internal: 47, external: 46, total: 93, grade: "S", credits: 2 },
      { code: "SS201", name: "Advanced Reading and Writing", internal: 45, external: 50, total: 95, grade: "S", credits: 2 }
    ]
  },
  {
    semester: 5,
    gpa: 8.9,
    credits: 24,
    subjects: [
      { code: "MA301", name: "Discrete Mathematics", internal: 35, external: 53, total: 88, grade: "A", credits: 4 },
      { code: "CS301", name: "Computer Networks", internal: 37, external: 50, total: 87, grade: "A", credits: 3 },
      { code: "CS302", name: "Theory of Computation", internal: 33, external: 48, total: 81, grade: "A", credits: 3 },
      { code: "CS303", name: "Microprocessors and Microcontrollers", internal: 36, external: 54, total: 90, grade: "S", credits: 3 },
      { code: "CS304", name: "Web Technology", internal: 39, external: 58, total: 97, grade: "S", credits: 3 },
      { code: "CN301", name: "Networks Lab", internal: 48, external: 47, total: 95, grade: "S", credits: 2 },
      { code: "MC301", name: "Microprocessors Lab", internal: 45, external: 46, total: 91, grade: "S", credits: 2 },
      { code: "WT301", name: "Web Technology Lab", internal: 49, external: 49, total: 98, grade: "S", credits: 2 },
      { code: "PT301", name: "Professional Training", internal: 50, external: 50, total: 100, grade: "S", credits: 2 }
    ]
  },
  {
    semester: 6,
    gpa: 9.3,
    credits: 22,
    subjects: [
      { code: "CS311", name: "Artificial Intelligence", internal: 39, external: 58, total: 97, grade: "S", credits: 3 },
      { code: "CS312", name: "Compiler Design", internal: 38, external: 56, total: 94, grade: "S", credits: 4 },
      { code: "CS313", name: "Distributed Systems", internal: 37, external: 53, total: 90, grade: "S", credits: 3 },
      { code: "CS314", name: "Mobile Computing", internal: 36, external: 51, total: 87, grade: "A", credits: 3 },
      { code: "CS315", name: "Cryptography and Network Security", internal: 38, external: 55, total: 93, grade: "S", credits: 3 },
      { code: "AI301", name: "AI Web Lab", internal: 48, external: 49, total: 97, grade: "S", credits: 2 },
      { code: "CD301", name: "Compiler Lab", internal: 46, external: 48, total: 94, grade: "S", credits: 2 },
      { code: "MP301", name: "Mini Project", internal: 50, external: 48, total: 98, grade: "S", credits: 2 }
    ]
  }
];

export const mockLeaderboard = [
  { rank: 1, name: "Sneha Reddy", regNo: "711521104055", cgpa: 9.85 },
  { rank: 2, name: "Rahul Verma", regNo: "711521104041", cgpa: 9.72 },
  { rank: 3, name: "Ananya Iyer", regNo: "711521104005", cgpa: 9.68 },
  { rank: 4, name: "Vikram Singh", regNo: "711521104112", cgpa: 9.55 },
  { rank: 5, name: "Neha Sharma", regNo: "711521104033", cgpa: 9.48 },
  { rank: 6, name: "Karthik Nair", regNo: "711521104022", cgpa: 9.41 },
  { rank: 7, name: "Priya Patel", regNo: "711521104038", cgpa: 9.35 },
  { rank: 8, name: "Aditya Menon", regNo: "711521104002", cgpa: 9.29 },
  { rank: 9, name: "Aisha Khan", regNo: "711521104003", cgpa: 9.22 },
  { rank: 10, name: "Rohan Das", regNo: "711521104044", cgpa: 9.15 },
  { rank: 11, name: "Meera Krishnan", regNo: "711521104028", cgpa: 9.08 },
  { rank: 12, name: "Arjun Kumar", regNo: CURRENT_USER_REG_NO, cgpa: 8.92 },
  { rank: 13, name: "Riya Gupta", regNo: "711521104043", cgpa: 8.85 },
  { rank: 14, name: "Siddharth Jain", regNo: "711521104052", cgpa: 8.79 },
  { rank: 15, name: "Nina Rao", regNo: "711521104035", cgpa: 8.74 },
  { rank: 16, name: "Varun Desai", regNo: "711521104058", cgpa: 8.68 },
  { rank: 17, name: "Tanya Kapoor", regNo: "711521104056", cgpa: 8.61 },
  { rank: 18, name: "Karan Johar", regNo: "711521104021", cgpa: 8.55 },
  { rank: 19, name: "Devika Rani", regNo: "711521104015", cgpa: 8.48 },
  { rank: 20, name: "Gaurav Sen", regNo: "711521104018", cgpa: 8.42 }
];
