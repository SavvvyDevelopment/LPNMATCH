"use client";

import { ArrowUpRight, BadgeCheck, Headphones, Mic } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Face } from "@/components/member-face";
import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Profile } from "@/lib/db/schema";
import { formatCount, hostsShows, roleLabels } from "@/lib/labels";

function MemberCard({ person }: { person: Profile }) {
  return (
    <Card className="h-full border-0 py-0 shadow-e1 transition-shadow duration-300 hover:shadow-e2">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <Face name={person.displayName} photoKey={person.photoKey} className="size-14 text-[17px]" />
          <Badge variant="secondary">{roleLabels[person.role]}</Badge>
        </div>
        <h3 className="mt-5 flex items-center gap-1.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">
          {person.displayName}
          {person.verified && <BadgeCheck className="size-4 text-brand" />}
        </h3>
        <p className="mt-1 text-[14px] leading-snug text-ink-soft">
          {hostsShows(person.role) && person.showName ? person.showName : person.title}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {person.topics.slice(0, 3).map((topic) => (
            <li key={topic}>
              <Badge variant="sun">{topic}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-subtle pt-4 text-[13px] text-ink-soft">
          <span>
            {person.audienceSize > 0 ? `${formatCount(person.audienceSize)} listeners/ep` : `${person.reliability}% reliable`}
          </span>
          <ArrowUpRight className="size-4 text-ink" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MemberShowcase({ hosts, guests }: { hosts: Profile[]; guests: Profile[] }) {
  const [tab, setTab] = useState("guests");
  const groups = [
    { id: "guests", label: "View guests", icon: Headphones, people: guests },
    { id: "hosts", label: "View hosts", icon: Mic, people: hosts },
  ];

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(String(value))} className="mt-8">
      <TabsList className="h-auto! rounded-full bg-surface p-1 shadow-e1 ring-1 ring-line/70">
        {groups.map((group) => (
          <TabsTrigger
            key={group.id}
            value={group.id}
            className="h-10! rounded-full px-4 data-active:bg-ink! data-active:text-white!"
          >
            <group.icon />
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {groups.map((group) => (
        <TabsContent key={group.id} value={group.id}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {group.people.map((person, i) => (
              <Reveal key={person.id} delay={i * 0.05} className="h-full">
                <Link href={`/profile/${person.username}`} className="block h-full">
                  <MemberCard person={person} />
                </Link>
              </Reveal>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
