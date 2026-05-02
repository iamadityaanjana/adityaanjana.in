export type ProjectStatus = 'Completed' | 'Building' | 'Live';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  video?: string;
  image?: string;
  liveLink?: string;
  githubLink?: string;
  tags: string[];
  date?: string;
  tweetUrl?: string;
  status?: ProjectStatus; //Manually set status: 'Completed' or 'Building'
}
