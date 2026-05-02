//import { ExecFileSyncOptionsWithBufferEncoding } from "child_process";

export interface BlogPost {
  id: string
  title: string
  description: string
  image?: string
  content: string
  date: string
  author: string
  tags: string[]
  readTime: string
  slug: string
}

