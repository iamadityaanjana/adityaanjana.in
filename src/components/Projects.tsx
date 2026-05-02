'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowUpRight, Globe, Github } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { projects as projectData } from '@/data/projects';
import { Project, ProjectStatus } from '@/types/project';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fallbackThumbnail = '/me.jpg';

interface ProjectCardData {
  id: string;
  title: string;
  category: string;
  description: string;
  status?: ProjectStatus;
  link: string;
  backgroundImage: string;
  thumbnailImage: string;
  liveLink?: string;
  githubLink?: string;
}

const statusColor: Record<ProjectStatus, string> = {
  Live: 'text-green-500',
  Completed: 'text-blue-500',
  Building: 'text-orange-500',
};

const statusTextColor: Record<ProjectStatus, string> = {
  Live: 'text-green-600 dark:text-green-400',
  Completed: 'text-blue-600 dark:text-blue-400',
  Building: 'text-orange-600 dark:text-orange-400',
};

const transformProject = (project: Project, index: number): ProjectCardData => {
  const status: ProjectStatus | undefined = project.status;
  const category = project.tags && project.tags.length > 0 ? project.tags[0] : 'Project';
  const thumbnailImage = project.image || fallbackThumbnail;
  const backgroundImage = project.image || fallbackThumbnail;
  const link = project.liveLink || project.githubLink || '#';
  return {
    id: project.id,
    title: project.title,
    category,
    description: project.description,
    status,
    link,
    backgroundImage,
    thumbnailImage,
    liveLink: project.liveLink,
    githubLink: project.githubLink,
  };
};

const ProjectCard = ({ project }: { project: ProjectCardData }) => {
  const router = useRouter();
  
  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      
      {/* Top Half: Image & Background Area */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-900 flex items-center justify-center p-6">
        
        {/* Default Dark Background */}
        <div className="absolute inset-0 bg-neutral-900 z-0 transition-opacity duration-500 group-hover:opacity-0" />
        
        {/* Hover Background Image Layer */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Image
            src={project.backgroundImage}
            alt={`${project.title} background`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-neutral-100/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-md text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
          {project.category}
        </div>
        
        {/* The "Inner Image" / Browser Window Mockup */}
        <div className="relative z-10 w-full h-full bg-neutral-950 rounded-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            {/* Fake Browser Header */}
            <div className="h-4 bg-neutral-900 border-b border-white/5 flex items-center gap-1.5 px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            </div>
            {/* Thumbnail Image inside the browser window */}
            <div className="relative flex-1 w-full">
              <Image
                src={project.thumbnailImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
        </div>
      </div>
      
      {/* Bottom Half: Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-200">{project.title}</h3>
          
          {project.status && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "relative flex h-2 w-2",
                statusColor[project.status] || 'text-orange-500'
              )}>
                {project.status === 'Building' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  statusTextColor[project.status] || 'text-neutral-500 dark:text-neutral-400'
                )}
              >
                {project.status}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                View Project 
                <ArrowUpRight className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-3">
              {project.liveLink && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.liveLink, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  aria-label="View live project"
                >
                  <Globe className="w-4 h-4" />
                </button>
              )}
              {project.githubLink && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.githubLink, '_blank', 'noopener,noreferrer');
                  }}
                  className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  aria-label="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectsSection() {
  const transformedProjects = projectData.slice(0, 4).map((project, index) => 
    transformProject(project, index)
  );

  return (
    <section className="py-8 md:py-12">
      <div>
        <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-neutral-200">Projects.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {transformedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 md:mt-12 flex justify-center">
            <Link 
              href="/projects"
              className="px-6 py-2 bg-neutral-800 hover:bg-neutral-900 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
                View All <ArrowUpRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </section>
  );
}
