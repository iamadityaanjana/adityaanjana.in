import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Aditya Anjana",
  initials: "AA",
  url: "https://adityaanjana.in",
  location: "San Francisco, CA",
  locationLink: "https://www.google.com/maps/place/jaipur",
  description:
    "Software Engineer. I love building things and helping people. Very active on Twitter.",
  summary:
    "At the end of 2023, I started learning machine learning and AI along with some magic of web development.",
  avatarUrl: "/me.jpg",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python",
    "HTML",
    "Postgres",
    "CSS",
    "Python",
    "Java",
    "C++",
    "ML/AI",
    "Streamlit",
    "MongoDB",
    "Git",
    "PyTorch",
    "TensorFlow",
    "Gen AI"
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "hello@adityaanjana.in",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/iamadityaanjana",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/adityaanjana/",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/iamadityaanjana",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:hello@adityaanjana.in",
        icon: Icons.email,
        navbar: true,
      },
    },
  },
  work: [
    {
      company: "Manipal University, Jaipur",
      href: "https://jaipur.manipal.edu/",
      badges: [],
      location: "On-Site",
      title: "Research Intern",
      logoUrl: "/Manipal_University_Jaipur_logo.png",
      start: "Sep 2024",
      end: "Ongoing",
      description:
        "Working on disease detection using machine learning algorithms and implemented explainable AI",
    },
    {
      company: "Freelancing",
      href: "https://adityaanjana.in",
      badges: [],
      location: "Remote",
      title: "Website Developer",
      logoUrl: "",
      start: "May 2023",
      end: "Ongoing",
      description:
        "Designed and implemented responsive web design and brought ideas to life.",
    },
  ],
  education: [
    {
      school: "Manipal University, Jaipur",
      href: "https://jaipur.manipal.edu/",
      degree: "B.Tech CSE (Data Science)",
      logoUrl: "/Manipal_University_Jaipur_logo.png",
      start: "2023",
      end: "2027",
    },
    {
      school: "Board of Secondary Education, Rajasthan",
      href: "https://rajeduboard.rajasthan.gov.in/",
      degree: "High School",
      logoUrl: "/images.jpeg",
      start: "2010",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "Slate",
      href: "https://slate.adityaanjana.in",
      dates: "Dec 2024 - Jan 2025",
      active: true,
      description:
        "Built a collaborative note-taking app, supports multiple users at once along with custom cursors to show the user activity.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "DrizzleORM",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website",
          href: "https://slate.adityaanjana.in",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/slate.png",
      video: "",
    },
    {
      title: "Chexpert",
      href: "https://github.com/iamadityaanjana/Chexpert-mini",
      dates: "June 2024 - July 2024",
      active: true,
      description:
        "Designed, developed a ML model to identify different diseases using Chest X-ray and also applied Explainable AI.",
      technologies: [
        "Python",
        "Numpy",
        "TensorFlow",
        "Pandas",
        "Jupyter-Lab",
        "ML algorithms",
        "Image Processing"
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/iamadityaanjana/Chexpert-mini",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/chexpert.png",
      video: "",
    },
    {
      title: "Iris",
      href: "https://iris.adityaanjana.in",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "A roadmap generator with learning resources and sharing capabilities using unique ID and QR code.",
      technologies: [
        "Next.js",
        "Typescript",
        "MongoDB",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Gen AI",
        "APIs"
      ],
      links: [
        {
          type: "Website",
          href: "https://iris.adityaanjana.in",
          icon: <Icons.globe className="size-3" />,
        }
      ],
      image: "/iris.png",
      video: "",
    },
    {
      title: "Movie recommendation system",
      href: "https://github.com/iamadityaanjana/Movies_recommend",
      dates: "April 2024 - March 2024",
      active: true,
      description:
        "A machine learning-based application that provides personalized movie recommendations to users.",
      technologies: [
        "Python",
        "TensorFlow",
        "ML algorithms",
        "Streamlit",
        "Data Preprocessing",
        "Numpy",
        "Pandas",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/iamadityaanjana/Movies_recommend",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/movie.png",
      video: "",
    },
  ],
} as const;
