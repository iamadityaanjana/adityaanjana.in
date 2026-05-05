import { BlogPost } from '@/types/blog'

export const blogs: BlogPost[] = [
  {
    id: 'load-balancing',
    slug: 'load-balancing',
    title: 'Load Balancing — A Visual Deep Dive',
    description: 'From round-robin to least-connections, health checks to L4 vs L7 — everything you need to understand load balancing, with interactive demos.',
    date: '2026-05-05',
    author: 'Aditya Anjana',
    tags: ['systems', 'infrastructure', 'backend', 'networking'],
    readTime: '12 min read',
    content: '__CUSTOM__',
  },
  {
    id: 'being-judgemental',
    slug: 'being-judgemental',
    title: 'Being Judgemental',
    description: 'We often think that being judgemental is a symbol of arrogance — but that\'s not always true. Sometimes it has its own benefits.',
    date: '2024-09-18',
    author: 'Aditya Anjana',
    tags: ['thoughts', 'machine learning', 'philosophy'],
    readTime: '2 min read',
    content: `We often think that being judgemental is a symbol of arrogance but that's not true everytime, sometimes it have its own benefits.

In 1996, David Wolpert gave NFL (No Free Lunch) Theorem for optimizations which stated:

> "That if you make no assumptions about data, then there is no way to identify which machine learning model works better than others."

For some datasets model A would perform better while for some datasets it won't, given that we make some assumptions about the data.

In real world it's not possible to train all machine learning models and evaluate them. So, we make some rational assumptions about the data to narrow down the choice of models which will perform better on that specific dataset.

Well well well, there is no such use of this theorem in real life, in almost all cases. The author himself rejected the use of this theorem :)`,
  },
]

export const getBlogById = (id: string): BlogPost | undefined => {
  return blogs.find(blog => blog.id === id)
}
