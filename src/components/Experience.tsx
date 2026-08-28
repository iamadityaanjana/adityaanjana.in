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
      description: `• Java, Spring Boot, scalable systems. Mostly gasping and hoping I don't break anything.`,
      href: "https://www.demandbase.com",
      logoUrl: "/demandbase.png",
    },
    {
      company: "Kurma",
      position: "Co-founder",
      duration: "Sep 2025 – Present",
      description: `• Testing in production.`,
      href: "https://www.getkurma.com",
      logoUrl: "./Logo - Curved.png",
    },
    {
      company: "Cyro Labs",
      position: "Blockchain Application Developer",
      duration: "Jun 2025 – Jul 2025",
      description: `• Led one more useless blockchain product all the way to deployment.`,
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