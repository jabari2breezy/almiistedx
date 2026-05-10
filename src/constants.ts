/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Speaker {
  id: string;
  name: string;
  topic: string;
  bio: string;
  image: string;
  segmentId: string;
}

export interface Segment {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

export const SEGMENTS: Segment[] = [
  {
    id: 'past',
    number: '01',
    title: 'The Past',
    subtitle: 'MEMORY & HERITAGE',
    description: 'Where we came from shapes who we are. Explore memory, culture, and the weight of history.',
    color: 'bg-brand-primary'
  },
  {
    id: 'present',
    number: '02',
    title: 'The Present',
    subtitle: 'ACTION & AWARENESS',
    description: 'The only moment we truly inhabit. Confront procrastination, capitalism, and the urgency of now.',
    color: 'bg-brand-secondary'
  },
  {
    id: 'future',
    number: '03',
    title: 'The Future',
    subtitle: 'LEGACY & VISION',
    description: 'The time we are borrowing against. Legacy, climate, AI — what we leave for those who come after.',
    color: 'bg-brand-primary'
  }
];

export const SOCIALS = {
  instagram: 'https://instagram.com/almuntazirschool',
  email: 'mailto:tedxalmuntazirschoolsyouth@gmail.com'
};

export const SPEAKERS: Speaker[] = [
  {
    id: '1',
    name: 'Anaya Rashid',
    topic: 'The Culture of Time',
    bio: 'Exploring how different cultures perceive and value the passage of time.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '2',
    name: 'Zahra Datoo',
    topic: 'The Architecture of Nostalgia',
    bio: 'How our built environment preserves or distorts our collective memory.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'past'
  },
  {
    id: '3',
    name: 'Hassan Abbas Mohammed',
    topic: 'The Procrastination Paradox',
    bio: 'The psychology behind why we delay the things that matter most.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '4',
    name: 'Zahra Moledina',
    topic: "Capitalism's Clock",
    bio: 'Analyzing the intersection of economic growth and our finite global resources.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'present'
  },
  {
    id: '5',
    name: 'Liyaan Karbelkar',
    topic: 'The Legacy We Leave',
    bio: 'Defining stewardship for the generations that will inherit our world.',
    image: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  },
  {
    id: '6',
    name: 'Sada Mbaruk Said',
    topic: 'Three Clocks: Climate, Animals, AI',
    bio: "Sada explores the concept of 'slow destruction,' challenging the notion of a sudden global catastrophe in favor of a more insidious reality: the gradual unraveling of our world through the small, everyday choices we often ignore. By examining the interconnected chain of conflict, societal collapse, and environmental decay, she reveals how seemingly isolated issues feed into a larger systemic crisis. Her talk serves as a powerful reminder that the true danger lies not in a single disaster, but in the millions of moments where we choose not to care, urging us to recognize our collective responsibility before the damage becomes irreversible.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=800',
    segmentId: 'future'
  }
];
