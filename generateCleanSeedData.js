import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the source file
const sourceFile = path.join(
  __dirname,
  "../client/src/data/academics/departmentsdata.js"
);
const sourceContent = fs.readFileSync(sourceFile, "utf8");

// Create clean seed data
const cleanSeedData = {};

// Extract department exports (we'll do this manually for now)
// The structure we need:
const departmentsSeedData = {
  "visual-communication": {
    name: "Visual Communication",
    image: "history-dept.webp", // Simplified - just filename
    departmentGallery: ["history-dept.webp", "history-dept.webp"], // Simplified
    about:
      "The Visual Communication Department fosters excellence in creative and media education, blending artistic expression with professional advancement.",
    aboutDepartment: {
      history:
        "The Visual Communication Department was founded with the aim of fostering excellence in creative and media education. It has grown into a vibrant space where artistic expression meets academic and professional advancement.",
      overview:
        "Our programs are thoughtfully crafted to keep pace with the latest developments in media, design, and digital platforms. We emphasize a student-focused learning environment, providing hands-on experience in areas like photography, filmmaking, animation, graphic design, and advertising.",
      strengths: [
        "Experienced educators and professionals from the media and creative industries.",
        "Hands-on experience in photography, filmmaking, animation, and graphic design.",
        "Strong partnerships with production houses, studios, and creative agencies.",
        "Collaborative learning environment emphasizing industry practices and innovation.",
      ],
    },
    vision: [
      "To be a pioneering department in Visual Communication, cultivating a culture of creative excellence and empowering students to become leaders in the global media and design industry.",
      "To foster a vibrant academic environment that blends artistic expression with technology, preparing students to craft impactful visual narratives that inspire and inform society.",
    ],
    mission: [
      "To deliver quality education in visual communication by combining creative skills, technical knowledge, and ethical values.",
      "To nurture talented professionals through hands-on training, research, and industry exposure.",
      "To empower students with the ability to think visually, communicate effectively, and innovate across media platforms.",
      "To bridge academics with industry needs through experiential learning and creative exploration.",
    ],
    objectives: [
      "To strengthen practical training through workshops and hands-on sessions in photography, video production, and graphic design.",
      "To organize guest lectures and seminars with media professionals and industry experts.",
      "To enhance student participation in short film contests, design exhibitions, and creative competitions.",
      "To upgrade lab infrastructure and software tools to meet current industry standards.",
      "To encourage students to undertake internships with reputed media houses and design studios for real-time experience.",
      "To establish the department as a recognized centre for excellence in media education, research, and creative innovation.",
      "To build strong industry-academic partnerships for collaborative projects and placements.",
      "To introduce advanced diploma and postgraduate programs in specialized areas like animation and film production.",
      "To create a vibrant alumni network that supports mentoring and career opportunities.",
      "To publish student-led media content such as short films and digital magazines on national and international platforms.",
    ],
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
    faculty: [], // Will be populated separately or left empty for now
    departmentActivities: [
      {
        programTitle: "Field Visit to Eden Beach",
        date: "06.08.2024",
        location: "Eden Beach - Pondicherry",
        aboutProgram: [
          "The Department visited Eden Beach (Chinna Veerampattinam), a Blue Flag-certified beach known for sparkling white sand and backwaters.",
          "Purpose: Photography for core subjects: Basics of Photography, Page Layout and Design, and Documentary Production.",
          "25 students participated, capturing sunrise views, the Chunnambar river backwaters, and thick palm groves.",
        ],
        programOutcomes: [
          "Students gained real-world experience and improved social relations outside the classroom.",
          "Performed tasks with various photographic cameras and learned time-of-day shooting skills.",
          "Composed frames using different lenses and lighting conditions.",
          "Contextualized knowledge of natural light, strobe lighting, and supplemental flash.",
          "Understood report writing for various tourist spots.",
        ],
      },
      // ... more activities
    ],
  },
  // More departments will be added
};

console.log(
  "This is a template. The actual extraction will be done by reading and parsing the source file."
);
console.log(
  "For now, I'll create the complete seed file manually based on the structure."
);
