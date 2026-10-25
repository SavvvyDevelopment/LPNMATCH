import type { MemberRole } from "@/lib/db/schema";

export const site = {
  name: "LPN Match",
  tagline: "Podcast hosts and guests, matched directly.",
  email: "hello@lpnmatch.com",
};

export const marketingNav = [
  { href: "/#how", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#members", label: "Members" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

export const pricing = {
  host: { standard: 29, professional: 79 },
  guest: { standard: 49, professional: 99 },
  both: { standard: 78, professional: 149 },
  agency: { base: 199, extraClient: 29 },
  affiliatePercent: 20,
  standardPins: 8,
  professionalPins: 25,
  bookingCredit: 75,
} as const;

export const roleCopy: Record<
  MemberRole,
  {
    tab: string;
    label: string;
    title: string;
    body: string;
    points: string[];
    steps: { title: string; body: string }[];
    stat: { value: number; suffix: string; label: string };
  }
> = {
  host: {
    tab: "I'm a host",
    label: "Hosts",
    title: "Book guests your listeners will actually want.",
    body: "Skip the pitch inbox and the booking agents. Matches arrive already fit to your topics, and you message them yourself.",
    points: [
      "A show page guests can review before they say yes",
      "Matches ranked by topic fit and reliability",
      "Recording dates and prep tracked in one place",
    ],
    steps: [
      {
        title: "Publish your show page",
        body: "List the topics you cover, the topics you won't, and who actually listens. Guests read it before they reply.",
      },
      {
        title: "Get matched with guests",
        body: "Guests land on your dashboard ranked by topic fit, response rate, and reliability. Explore searches past those matches.",
      },
      {
        title: "Message, then book",
        body: "Accept a match and the thread is just the two of you. The recording date, prep, and release live in Interviews.",
      },
    ],
    stat: { value: 3, suffix: " hrs", label: "saved per booked episode" },
  },
  guest: {
    tab: "I'm a guest",
    label: "Guests",
    title: "Get on the shows your audience already listens to.",
    body: "Your one-sheet does the pitching. Hosts see your topics, past episodes and reviews, then reach out directly.",
    points: [
      "A one-sheet with topics, video pitch and past episodes",
      "Direct threads with hosts, no assistant in the loop",
      "Reviews from hosts that follow you to the next show",
    ],
    steps: [
      {
        title: "Build your one-sheet",
        body: "Topics you talk about, topics you don't, a short bio, and an optional video pitch. That's the pitch hosts see.",
      },
      {
        title: "Get matched with shows",
        body: "Hosts whose audience fits your topics show up ranked. You can also search Explore for a specific show.",
      },
      {
        title: "Confirm in one thread",
        body: "No assistant forwards the email. You and the host agree on the topic, the date, and the release.",
      },
    ],
    stat: { value: 12, suffix: "+", label: "matched shows in your first week" },
  },
  both: {
    tab: "I'm both",
    label: "Both",
    title: "Host your show and guest on others, from one account.",
    body: "Run both sides of your podcast life together. Book guests, land interviews and cross-promote without juggling two inboxes.",
    points: [
      "One profile with a show page and a guest one-sheet",
      "Interview swaps with other hosts",
      "One calendar for every recording",
    ],
    steps: [
      {
        title: "One profile, both sides",
        body: "Your show page and your guest one-sheet live together, including what you'll talk about and what you won't.",
      },
      {
        title: "Swap interviews",
        body: "Match with other hosts. You book them on your show, and they book you on theirs.",
      },
      {
        title: "One calendar",
        body: "Every recording, whether you're the host or the guest, sits in the same Interviews list.",
      },
    ],
    stat: { value: 2, suffix: "x", label: "the reach from swaps" },
  },
  agency: {
    tab: "I'm an agency",
    label: "Agencies",
    title: "Book your clients straight onto the right shows.",
    body: "Give every client a profile, see their matches side by side, and keep every host conversation in one workspace.",
    points: [
      "A profile per client, under one login",
      "Every host thread and recording date in one view",
      "Episode links and reviews collected for client reports",
    ],
    steps: [
      {
        title: "A profile per client",
        body: "Each founder, author, or host you represent gets a public one-sheet with their own topics and reviews.",
      },
      {
        title: "Matches, side by side",
        body: "See incoming hosts for every client without a second spreadsheet. Premium filters come with the agency plan.",
      },
      {
        title: "Book and report",
        body: "Recording dates, episode links, and reviews stay in one workspace you can hand back to the client.",
      },
    ],
    stat: { value: 21, suffix: "", label: "episodes booked by a single agency" },
  },
};

export const howItWorks = [
  {
    title: "Create your profile",
    body: "Hosts publish a show page. Guests publish a one-sheet with topics they cover and topics they won't.",
  },
  {
    title: "Match",
    body: "Hosts and guests are paired by topic, audience, and reliability. Explore searches past your matches.",
  },
  {
    title: "Message",
    body: "Talk to the person directly. The thread shows the status and the next step. No email chain.",
  },
  {
    title: "Schedule",
    body: "Accepting a match opens the interview. The recording date stays on the calendar.",
  },
  {
    title: "Run workflows",
    body: "Checklists cover talking points, the recording link, the edit, and release-day promo.",
  },
  {
    title: "Reviews and leaderboard",
    body: "Leave a public review. Badges and points put the people who follow through at the top.",
  },
  {
    title: "Keep the history",
    body: "Past interviews, episode links, and reviews stay in one list. Stats track views and reach.",
  },
] as const;

export const productAreas = [
  { title: "Matches", body: "Ranked by topic fit, with response and reliability on every card.", tone: "bg-sun" },
  { title: "Messages", body: "A private thread with the booking status sitting beside it.", tone: "bg-lilac" },
  { title: "Profile", body: "A public show page or one-sheet, including topics you won't cover.", tone: "bg-peach" },
  { title: "Interviews", body: "Recording dates, episode links, and reviews in one list.", tone: "bg-mint" },
  { title: "Stats", body: "Profile views, requests, and social reach over six months.", tone: "bg-brand-soft" },
] as const;

export const features = [
  {
    title: "Matches",
    body: "Hosts and guests ranked by topic fit, with response, acceptance and reliability on every card.",
    tag: "Daily",
  },
  {
    title: "Direct messages",
    body: "Each thread shows the booking status and the next step. Nobody sits between you and the person you're booking.",
    tag: "No middlemen",
  },
  {
    title: "Show pages & one-sheets",
    body: "Public profiles you can share anywhere. Your link also works as your referral link.",
    tag: "Public",
  },
  {
    title: "Interview CRM",
    body: "Every recording, release link and review from past interviews, all in one list.",
    tag: "History",
  },
  {
    title: "Workflows",
    body: "Checklists for prep, recording and promotion, so nothing slips between booking and release day.",
    tag: "Checklists",
  },
  {
    title: "Stats & leaderboard",
    body: "Track profile views, interview requests and social reach, and see who's booking the most.",
    tag: "Insights",
  },
] as const;

export const faqs = [
  {
    q: "Who is LPN Match for?",
    a: "Podcast hosts looking for guests, people who want to be guests on podcasts, people who do both, and agencies booking interviews for their clients.",
  },
  {
    q: "What do you mean by no middlemen?",
    a: "Hosts and guests message each other directly. There are no booking assistants, PR gatekeepers or forwarded email chains between you.",
  },
  {
    q: "Do I have to leave LPN Match to book an interview?",
    a: "No. Accept a match, agree on a topic in the thread, and track the recording date, prep and release from your dashboard.",
  },
  {
    q: "What is a booking credit?",
    a: "A recorded credit for an interview booked through LPN Match. Plan prices are on the pricing page. Card checkout isn't connected in this build.",
  },
  {
    q: "Can people see my profile without an account?",
    a: "Yes. Every show page and one-sheet has a public link you can share. Messages, matches and workflows stay behind sign-in.",
  },
] as const;

export const testimonials = [
  {
    name: "Dana Brooks",
    title: "Host, The Bootstrapped Hour",
    quote:
      "I used to spend Mondays sorting PR pitches. Now my matches already fit the show, and I book guests in a single thread.",
  },
  {
    name: "Marcus Hale",
    title: "Guest, founder and author",
    quote:
      "I landed eleven interviews in two months without hiring a booking agent. Hosts could read my one-sheet before they messaged me.",
  },
  {
    name: "Sofia Ramirez",
    title: "Host & guest, Mindful Money",
    quote:
      "Interview swaps doubled our downloads. Both sides of my podcast life finally live in one dashboard.",
  },
  {
    name: "Signal Studio",
    title: "Podcast booking agency",
    quote:
      "Every client has their own profile, and we see every host conversation and recording date without a spreadsheet.",
  },
] as const;

export const categories = [
  "Business",
  "Entrepreneurship",
  "Marketing",
  "Technology",
  "Health & Wellness",
  "Personal Finance",
  "Leadership",
  "Self-Improvement",
  "Comedy",
  "True Crime",
  "Education",
  "Parenting",
  "Sports",
  "Spirituality",
  "Science",
  "Culture",
] as const;

export const topics = [
  "Business",
  "Marketing",
  "Technology",
  "Health & Wellness",
  "Personal Finance",
  "Leadership",
  "Self-Improvement",
  "Parenting",
  "Education",
  "Science",
  "Culture",
] as const;

export const authPanel = {
  eyebrow: "For podcast hosts and guests",
  title: "Book the interview. Skip the middlemen.",
  text: "Hosts and guests match by topic, message directly and track every recording from one dashboard.",
  points: [
    "Free to create a profile",
    "Direct messages, no assistants",
    "Public show pages and one-sheets",
  ],
};
