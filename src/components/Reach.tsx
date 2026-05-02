import { Button } from "@/components/ui/button";

interface SocialLink {
  name: string;
  url: string;
}

export default function Reach() {
  const socialLinks: SocialLink[] = [
    {
      name: "twitter/x",
      url: "https://x.com/iamadityaanjana",
    },
    {
      name: "github",
      url: "https://github.com/iamadityaanjana",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/adityaanjana/",
    },
    {
      name: "say hello",
      url: "mailto:hello@adityaanjana.in",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((link) => (
      <Button
        asChild
        key={link.name}
        variant="outline"
        className="rounded-full text-sm sm:text-md"
      >
        <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        >
          {link.name}
        </a>
      </Button>
      ))}
    </div>
  );
}