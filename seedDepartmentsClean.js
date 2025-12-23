import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDb, closeDb } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MANUALLY CREATED CLEAN SEED DATA BASED ON departmentsdata.js
// This version has NO imports, NO path aliases, just plain data

const departmentsSeedData = {
  english: {
    name: "English",
    image: "history-dept.webp",
    departmentGallery: [
      "history-dept.webp",
      "history-dept.webp",
      "history-dept.webp",
    ],
    about:
      "The Department of English had its inception in the year 2009 and widened its horizon with a huge strength of students and vibrant faculty members.",
    aboutDepartment: {
      history:
        "The Department of English had its inception in the year 2009 and widened its horizon by having a huge strength of students and faculty members. It is led by a team of vibrant, aspirant, and experienced faculty members who always strive for the student's community by grooming their thought-process and developing various skills.",
      overview:
        "The B.A. English course is the culmination of both teaching language through literature and appreciating the aesthetics of literature through language. It serves with an aim of motivating students to exhibit and explore a wide range of new ideas in literature from the early and modern to the contemporary period. The department is instrumental in conducting various intra and intercollegiate competitions to evaluate student advancement and foster leadership qualities.",
      strengths: [
        "Vibrant, aspirant, and experienced faculty team.",
        "Unique culmination of language teaching and literary aesthetics.",
        "Annual 'Literary Meet' to accelerate hidden talents.",
        "Strong emphasis on extra-curricular activities to transform students into responsible citizens.",
        "Periodical Guest Lectures, Literary forums, and Industrial/Library visits.",
      ],
    },
    vision:
      "To create morally and intellectually aspiring individuals through language and literature, fostering self-confidence and creativity to face the challenging world.",
    mission: [
      "Inaugurate and maintain active Literary Clubs to foster creative expression.",
      "Provide informative and academically enriching sessions through seminars and workshops.",
      "Improve phonetic and linguistic understanding through comprehensive curriculum delivery.",
      "Encourage language skills and leadership through active participation in intercollegiate events.",
    ],
    objectives: [
      "Conduct Literary Meet competitions every year to accelerate hidden talent.",
      "Train students to be morally and intellectually aspiring individuals.",
      "Provide guidance on Higher Education, career prospects, and archival research.",
      "Nurture storytelling, narrative skills, and digital storytelling abilities.",
    ],
    programsOffered: [
      {
        degree: "B.A. English",
        duration: "3 Years",
        description:
          "Focus on the culmination of language teaching and literary appreciation across historical periods.",
      },
    ],
    certificateCourses: ["Content Writing Workshop", "Digital Storytelling"],
    skillPrograms: [
      "Chat Your Story (Narrative Skills)",
      "Phonetics training",
      "Archival Practices",
    ],
    faculty: [],
    departmentActivities: [
      {
        programTitle: "National Level Workshop on Content Writing",
        date: "21.11.2024",
        location: "Campus",
        aboutProgram: [
          "Led by Mr. N. Mohandas Ganthi, Project Manager, IGNITE Labs.",
          "60 students from various colleges participated to enhance their writing skills.",
        ],
        programOutcomes: [
          "Enhanced professional writing skills and industry readiness.",
        ],
      },
    ],
  },

  language: {
    name: "Languages",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp", "history-dept.webp"],
    about: "Department of Languages offering comprehensive language education.",
    aboutDepartment: {
      history: "Established to provide quality language education.",
      overview:
        "Our language programs focus on communication skills and cultural understanding.",
      strengths: ["Experienced language faculty", "Modern teaching methods"],
    },
    vision: "To be a center of excellence in language education.",
    mission: [
      "Provide quality language education",
      "Foster cultural understanding",
    ],
    objectives: [
      "Improve language proficiency",
      "Develop communication skills",
    ],
    programsOffered: [],
    certificateCourses: [],
    skillPrograms: [],
    faculty: [],
    departmentActivities: [],
  },

  mathematics: {
    name: "Mathematics",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about:
      "Mathematics plays an important role in accelerating the social, economical, and technological growth of a nation.",
    aboutDepartment: {
      history:
        "Started in 2004, the department continues to produce proficient graduates equipped with strong analytical and problem-solving skills.",
      overview:
        "Leadership has transitioned through several experienced faculty heads, contributing to the department's consistent academic achievements. The department provides a strong foundation in both pure and applied mathematical sciences, preparing students for research and industrial applications.",
      strengths: [
        "Produces several gold medalists consistently.",
        "Strong research-oriented staff with publications in Scopus, WoS, and UGC journals.",
        "Integration of value-added courses like Tally, DTP, and SCILAB.",
        "Active alumni network supporting career guidance and social awareness.",
      ],
    },
    vision:
      "To produce logically strong graduates capable of solving complex socio-economic problems through mathematical rigor and technological adaptability.",
    mission: [
      "Organize workshops on R programming and modern statistical methods.",
      "Provide Vedic Mathematics usage to enhance competitive skills for graduates.",
      "Facilitate alumni talks for career guidance and global opportunities.",
      "Support holistic growth through self-defense workshops and social outreach.",
    ],
    objectives: [
      "Understand the critical importance of Statistics and its scope in various fields.",
      "Enable the application of Mathematics in business and engineering contexts.",
      "Promote social awareness regarding human trafficking, drug abuse, and women empowerment.",
      "Maintain a high standard of research publication in Scopus/WoS/UGC journals.",
    ],
    programsOffered: [
      {
        degree: "B.Sc. Mathematics",
        duration: "3 Years",
        description:
          "Comprehensive study of Pure and Applied Mathematical Sciences.",
      },
    ],
    certificateCourses: [
      "R Programming",
      "Invitation to SCILAB",
      "Tally & DTP",
    ],
    skillPrograms: [
      "Vedic Mathematics",
      "Data Analysis through SPSS",
      "Wavelet Transform Processing",
    ],
    faculty: [],
    departmentActivities: [],
  },

  "computer-science": {
    name: "Computer Science",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about:
      "The Department of Computer Science (UG) was established in the year 2004 with B.Sc. Computer Science.",
    aboutDepartment: {
      history:
        "The Department of Computer Science (UG) was established in the year 2004 with the introduction of two courses in B.Sc. Computer Science. Since its inception, the department has made an everlasting impression in the world of computer education in the region.",
      overview:
        "The department is well-equipped with all the basic and latest technical resources and comprises a well-qualified, dedicated faculty team. The academic performance has been consistently outstanding.",
      strengths: [
        "Well-qualified and dedicated faculty team focused on student success.",
        "Outstanding academic performance records and global alumni network.",
        "Equipped with basic and latest technical resources for practical learning.",
        "Adherence to Choice Based Credit System (CBCS) as recommended by Pondicherry University since 2017-2018.",
      ],
    },
    vision:
      "To excel in transforming the graduates to be proficient in Computer Technology and Application that generates competent IT professionals, researchers and entrepreneurs globally.",
    mission: [
      "M1 - Excellence in Education: To impart quality education by instilling confidence towards taking up various challenges in the ever growing Industrial sectors.",
      "M2 - Research and Modernization: To indoctrinate innovative research programs through enhancing technical competencies to balance the upgrading industrial and societal needs.",
      "M3 - Placement and Entrepreneurship: To be recognized as experts by creating extensive global opportunities in placements and cultivating entrepreneurship skills for effective dissemination of creative ideas in business ventures.",
      "M4 - Moral Ethics: To produce ethically strong professionals by infusing optimistic approach for the significant contribution to the society.",
    ],
    objectives: [
      "To bring Innovation in technology and go beyond fundamentals to build interest in specialized research.",
      "To guide students in the development of new languages and instill interest in hardware production.",
      "To invent new operating systems and develop database languages.",
      "To introduce innovative need-based and skill-based courses through the Choice Based Credit System (CBCS).",
    ],
    programsOffered: [
      {
        degree: "B.Sc. Computer Science",
        duration: "3 Years",
        description:
          "Standard curriculum focusing on core software principles, hardware production, and system development under the CBCS system.",
      },
    ],
    certificateCourses: ["Skill-based credits", "UI/UX Design Process"],
    skillPrograms: [
      "AWS Cloud Computing",
      "Robotics Process Automation (RPA)",
      "AI Fundamentals",
    ],
    faculty: [],
    departmentActivities: [],
  },

  "computer-application": {
    name: "Computer Application (BCA)",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about:
      "Established in 2004, the Department of Computer Applications was founded to meet the growing demand for highly skilled professionals in the field of computing.",
    aboutDepartment: {
      history:
        "Established in 2004, the Department of Computer Applications was founded to meet the growing demand for highly skilled professionals in the field of computing. It has since evolved to offer a four-year Bachelor of Computer Applications (BCA Honors) program under the National Education Policy (NEP-2020).",
      overview:
        "Our department is designed to provide students with a strong foundation in computer science theory alongside practical expertise in software and application development.",
      strengths: [
        "Dedicated and highly qualified faculty team committed to professional success.",
        "Curriculum aligned with NEP-2020 Honors standards.",
        "Emphasis on career readiness, lifelong learning, and higher education.",
        "State-of-the-art computer laboratory with extensive practical training across multiple languages.",
      ],
    },
    vision:
      "To be a leading center of excellence in computer applications education, fostering innovation, practical expertise, and global competitiveness.",
    mission: [
      "Deliver quality education in computer science and applications through a balanced blend of theory and practical training.",
      "Empower students with industry-relevant skills in software development, system analysis, and emerging technologies.",
      "Promote innovation and research by encouraging creative problem-solving and lifelong learning.",
      "Prepare graduates for global opportunities by instilling professionalism, ethical values, and adaptability to diverse work environments.",
    ],
    objectives: [
      "Provide a strong foundation in computing concepts and business practices to effectively manage enterprise software and information systems.",
      "Develop analytical skills for system development, enabling students to assess organizational needs and design efficient solutions.",
      "Equip graduates with software development expertise to pursue careers or entrepreneurial opportunities in both Indian and global markets.",
      "Offer specialization pathways in legacy application software, system software, and mobile application development to meet diverse industry demands.",
    ],
    programsOffered: [
      {
        degree: "BCA (Honors)",
        duration: "4 Years",
        description:
          "An NEP-2020 aligned program designed to provide a strong foundation in theory and application development.",
      },
    ],
    certificateCourses: ["Enterprise Software Management", "Legacy Systems"],
    skillPrograms: ["UI/UX Design Process", "Mobile Application Development"],
    faculty: [],
    departmentActivities: [],
  },

  "information-technology": {
    name: "Information Technology",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about:
      "Founded in 2005, our department has grown into a vibrant center of innovation, learning, and career-focused education.",
    aboutDepartment: {
      history:
        "Since its establishment in 2005, the department has consistently aligned with current tech trends and industry needs.",
      overview:
        "Our curriculum blends computer science foundations with domains like networking, cybersecurity, data analytics, software development, and cloud computing.",
      strengths: [
        "Strong ties with industry and research institutions",
        "Excellent placement record in MNCs like Sutherland, Iamneo, and Edutech",
        "Focus on diverse domains: IT Support, Data Analytics, and Cloud Computing",
        "Hands-on learning through hackathons and skill-building workshops",
      ],
    },
    vision:
      "To be a leading Department of Information Technology that imparts quality education, fosters innovation, and develops skilled professionals to meet global technological challenges.",
    mission: [
      "To provide strong academic foundations in information technology through effective teaching and learning practices.",
      "To equip students with practical skills in programming, networking, web technologies, and emerging IT trends.",
      "To promote innovation, research, and ethical values among students.",
      "To prepare graduates for successful careers and lifelong learning in the IT industry.",
    ],
    objectives: [
      "Align student skills with professional expectations and future technologies.",
      "Facilitate high-tier placements in national and multinational organizations.",
      "Encourage research publishing and participation in technical hackathons.",
      "Empower students to stand out in competitive hiring assessments.",
    ],
    programsOffered: [
      {
        degree: "B.Sc. Information Technology",
        duration: "3 Years",
        description:
          "Focus on networking, web technologies, and software engineering.",
      },
    ],
    certificateCourses: [
      "SWAYAM–NPTEL Online Courses",
      "Power BI Certification",
    ],
    skillPrograms: [
      "AI Data Mining Tools",
      "IoT Automation using Raspberry Pi",
      "Azure with AI",
    ],
    faculty: [],
    departmentActivities: [],
  },

  "bio-technology": {
    name: "Bio-Technology",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about: "Department of Bio-Technology",
    aboutDepartment: {
      history: "BioTechnology department history.",
      overview: "BioTechnology overview.",
      strengths: [],
    },
    vision: "BioTechnology vision.",
    mission: [],
    objectives: [],
    programsOffered: [],
    certificateCourses: [],
    skillPrograms: [],
    faculty: [],
    departmentActivities: [],
  },

  "commerce-and-management": {
    name: "Commerce and Management",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about: "Department of Commerce and Management",
    aboutDepartment: {
      history: "Commerce and Management department history.",
      overview: "Commerce and Management overview.",
      strengths: [],
    },
    vision: "Commerce and Management vision.",
    mission: [],
    objectives: [],
    programsOffered: [],
    certificateCourses: [],
    skillPrograms: [],
    faculty: [],
    departmentActivities: [],
  },

  "corporate-secretaryship": {
    name: "Corporate Secretaryship",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about: "Department of Corporate Secretaryship",
    aboutDepartment: {
      history: "Corporate Secretaryship department history.",
      overview: "Corporate Secretaryship overview.",
      strengths: [],
    },
    vision: "Corporate Secretaryship vision.",
    mission: [],
    objectives: [],
    programsOffered: [],
    certificateCourses: [],
    skillPrograms: [],
    faculty: [],
    departmentActivities: [],
  },

  "visual-communication": {
    name: "Visual Communication",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about:
      "The Visual Communication Department fosters excellence in creative and media education, blending artistic expression with professional advancement.",
    aboutDepartment: {
      history:
        "The Visual Communication Department was founded with the aim of fostering excellence in creative and media education.",
      overview:
        "Our programs are thoughtfully crafted to keep pace with the latest developments in media, design, and digital platforms.",
      strengths: [
        "Experienced educators and professionals from the media and creative industries.",
        "Hands-on experience in photography, filmmaking, animation, and graphic design.",
      ],
    },
    vision: "To be a pioneering department in Visual Communication.",
    mission: [
      "To deliver quality education in visual communication by combining creative skills, technical knowledge, and ethical values.",
    ],
    objectives: [],
    programsOffered: [
      {
        degree: "B.Sc. Visual Communication",
        duration: "3 Years",
        description:
          "A comprehensive program keeping pace with media and digital platforms.",
      },
    ],
    certificateCourses: ["Digital Photography", "Graphic Designing"],
    skillPrograms: ["Short film making", "Video Editing"],
    faculty: [],
    departmentActivities: [],
  },

  library: {
    name: "Library",
    image: "history-dept.webp",
    departmentGallery: ["history-dept.webp"],
    about: "College Library",
    aboutDepartment: {
      history: "Library history.",
      overview: "Library overview.",
      strengths: [],
    },
    vision: "Library vision.",
    mission: [],
    objectives: [],
    programsOffered: [],
    certificateCourses: [],
    skillPrograms: [],
    faculty: [],
    departmentActivities: [],
  },
};

const seedDepartmentsData = async () => {
  try {
    console.log("🚀 Seeding Departments Data (Clean Version)...\n");
    const db = await getDb();
    const collection = db.collection("academics__departmentsdata");

    console.log(
      `📊 Prepared ${Object.keys(departmentsSeedData).length} departments\n`
    );

    // Show sample
    const firstKey = Object.keys(departmentsSeedData)[0];
    const sampleDept = departmentsSeedData[firstKey];
    console.log(`Sample department (${firstKey}):`);
    console.log(`  - name: ${sampleDept.name}`);
    console.log(`  - about: ${sampleDept.about.substring(0, 80)}...`);
    console.log(`  - vision: ${typeof sampleDept.vision}\n`);

    // Clear existing data
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} old documents\n`);

    // Insert new document
    const result = await collection.insertOne({ data: departmentsSeedData });
    console.log(`✅ Inserted document with _id: ${result.insertedId}\n`);

    await closeDb();
    console.log("✨ Departments Data Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDepartmentsData();
