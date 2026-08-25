import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string | string[];
  href?: string;
  logoUrl?: string;
}

export default function Experience() {
  const experiences: ExperienceItem[] = [
    {
      company: "Demandbase",
      position: "SDE",
      duration: "Aug 2026 – Present",
      description: `• Building backend services in Java and Spring Boot.
• Working on scalable systems: APIs, service design, and keeping things reliable as load grows.`,
      href: "https://www.demandbase.com",
      logoUrl: "/demandbase.png",
    },
    {
      company: "Kurma",
      position: "Co-founder",
      duration: "Sep 2025 – Present",
      description: `• Building a Flutter app end-to-end, translating product requirements into scalable, high-performance mobile features.
• Designed and implemented a NestJS backend, handling APIs, business logic, and secure data flows for the mobile application.
• Architected and managed the Supabase (PostgreSQL) database, including schema design, auth integration, and performance-optimized queries.`,
      href: "https://www.getkurma.com",
      logoUrl: "./Logo - Curved.png",
    },
    {
      company: "Cyro Labs",
      position: "Blockchain Application Developer",
      duration: "Jun 2025 – Jul 2025",
      description: `• Designed and developed a full-stack blockchain application on Xion, implementing Stripe-like one-touch on-chain payments for seamless user transactions.
• Built gated NFT content, a referral system, and blockchain-based authentication and profiles, enabling secure access control and user identity management.
• Led end-to-end development from architecture to deployment, integrating smart contracts with the frontend to deliver a smooth Web3 user experience.`,
      href: "https://cyrostudios.com/",
      logoUrl: "./cyro_studios_logo.jpeg",
    },
  ];

  return (
    <div className="space-y-8 mb-12">
      {experiences.map((exp, index) => (
        <div key={`${exp.company}-${index}`} className="flex gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 last:pb-0">
          {exp.logoUrl && (
            <Avatar className="border size-12 bg-muted-background dark:bg-foreground shrink-0">
              <AvatarImage
                src={exp.logoUrl}
                alt={exp.company}
                className="object-contain"
              />
              <AvatarFallback>{exp.company[0]}</AvatarFallback>
            </Avatar>
          )}
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {exp.href ? (
                  <a
                    href={exp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-200 hover:underline"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <h3 className="text-lg md:text-xl font-medium text-neutral-800 dark:text-neutral-200">
                    {exp.company}
                  </h3>
                )}
                
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 mt-1">
                  {exp.position}
                </p>
              </div>
              
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                {exp.duration}
              </p>
            </div>
            
            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
              {exp.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}