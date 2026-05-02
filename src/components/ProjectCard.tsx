import { Project } from '@/types/project'
import { FaGithub} from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  isDetailed?: boolean;
}

export const ProjectCard = ({ project, isDetailed = false }: ProjectCardProps) => {
  if (!isDetailed) {
    return (
      <Link href={`/projects/${project.id}`}>
        <div className="hover:underline py-2 text-lg md:text-xl pb-5 border-b border-neutral-600 dark:border-neutral-500">
          {project.title}
        </div>
      </Link>
    );
  }

  return (
    <article className="prose prose-neutral dark:prose-invert prose-headings:font-medium max-w-none">
      <header className="not-prose mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-medium">{project.title}</h1>
          <div className="flex items-center gap-4">
            {project.liveLink && (
              <Link href={project.liveLink} target="_blank" className="bg-neutral-200 dark:bg-neutral-800 p-2 rounded-full hover:opacity-70">
                <FiArrowUpRight className="size-5 md:size-6" />
              </Link>
            )}
            {project.githubLink && (
              <Link href={project.githubLink} target="_blank" className="bg-neutral-200 dark:bg-neutral-800 p-2 rounded-full hover:opacity-70">
                <FaGithub className="size-5 md:size-6" />
              </Link>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {project.video ? (
        <div className="mt-8 mb-8 aspect-video w-full">
          <video 
            src={project.video}
            className="w-full h-full rounded-lg object-cover"
            controls
            playsInline
          />
        </div>
      ) : project.image && (
        <div className="mt-8 mb-8 w-full aspect-video relative"> {/* Changed height to aspect-video */}
          <Image 
            src={project.image}
            alt={project.title}
            fill
            className="rounded-lg object-contain" // Changed to object-contain
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={95}
            priority
          />
        </div>
      )}

      <div className="mb-8">
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {project.description}
          {/* {project.tweetUrl && (
            <>
              {' '}
              <Link 
                href={project.tweetUrl} 
                target="_blank" 
                className="text-cyan-500 dark:text-cyan-600 hover:underline"
              >
                you can view the tweet here
              </Link>
            </>
          )} */}
        </p>
      </div>

      {project.longDescription && (
        <div className="mt-8 space-y-4">
          {project.longDescription.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </article>
  );
};
