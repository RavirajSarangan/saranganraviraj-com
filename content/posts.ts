/**
 * Blog seed content.
 *
 * These six posts are Sarangan's own writing, migrated from the previous site.
 * They are the seed for the Convex `posts` table — once the admin panel is live,
 * Convex is the source of truth and this file is only the initial import.
 *
 * Body is structured rather than raw HTML so the same data can render in the
 * public post page and in the admin editor without a parsing step.
 */

export type PostBlock =
  { type: "heading"; text: string } | { type: "paragraph"; text: string };

export type Post = {
  slug: string;
  /** Display index on the cover plate and the blog index. */
  index: string;
  title: string;
  excerpt: string;
  /** ISO date; the previous site's display dates were "Feb 5, 2025" style. */
  date: string;
  category: string;
  readingMinutes: number;
  body: PostBlock[];
  /** Two hex colours driving the generated cover plate. */
  duotone: [string, string];
  /** Drop an image at /public/blog/<slug>.webp and set it here to replace the plate. */
  image?: string;
};

export const posts: Post[] = [
  {
    slug: "creating-websites-that-truly-connect",
    index: "01",
    title: "Creating Websites That Truly Connect",
    excerpt:
      "How to design and build websites that genuinely connect with the people who use them.",
    date: "2025-04-05",
    category: "Web Design",
    readingMinutes: 2,
    body: [
      { type: "heading", text: "Understanding the Brand’s Essence" },
      {
        type: "paragraph",
        text: "Over the years, I’ve learned that the most impactful websites don’t just look good—they feel right. They speak clearly, guide effortlessly, and align deeply with the brand’s values. That’s why I always start by listening. I want to understand the heart behind a business: what it stands for, who it serves, and how it wants to be remembered. This discovery phase isn’t fluff—it’s the foundation of meaningful design.",
      },
      {
        type: "paragraph",
        text: "During this phase, I often collect brand artifacts: mood boards, testimonials, even product packaging or internal documents. These pieces give me a clearer picture of what makes the brand unique, beyond just aesthetics. When you build from a place of understanding, every design choice becomes a reflection of purpose.",
      },
      { type: "heading", text: "Collaboration at the Core" },
      {
        type: "paragraph",
        text: "No project is ever built in isolation. I work closely with clients to uncover their unique story, voice, and business needs—then translate that into a digital presence that feels authentic. Through workshops, shared notes, and iterative reviews, we co-create something that’s not just beautiful, but meaningful.",
      },
      { type: "heading", text: "Design with Intention, Not Just Style" },
      {
        type: "paragraph",
        text: "When I design with purpose, every element has intention. The color palette evokes emotion, the layout guides the user’s journey, and the typography quietly reinforces personality. It’s not about showing off flashy trends—it’s about building digital spaces that foster connection and trust. Because when users feel understood, they stick around. And when they do, that’s when real engagement begins.",
      },
      {
        type: "heading",
        text: "Beyond the Visual: Creating Emotional Connection",
      },
      {
        type: "paragraph",
        text: "Purposeful design creates a sense of belonging. A website can be a quiet invitation, a confident handshake, or a warm welcome. These emotional cues aren’t accidental—they're crafted through clarity, consistency, and care. In my work, I aim to bridge the gap between user goals and brand personality, so each site doesn’t just function—it resonates.",
      },
      {
        type: "paragraph",
        text: "When people feel emotionally connected, they trust. And trust is what drives clicks, sign-ups, or sales—not clever tricks or animations. That’s why I build websites not only to function beautifully, but to feel like a human conversation.",
      },
    ],
    duotone: ["#1f3a4d", "#0a0a0b"],
  },
  {
    slug: "my-freelance-client-workflow",
    index: "02",
    title: "My Freelance Client Workflow",
    excerpt:
      "An inside look at my end-to-end freelance client workflow, from first contact to delivery.",
    date: "2025-03-28",
    category: "Web Design",
    readingMinutes: 2,
    body: [
      { type: "heading", text: "The Importance of a Thoughtful Workflow" },
      {
        type: "paragraph",
        text: "One of the most underestimated parts of freelancing is process. It’s easy to think the job is all about creativity—but behind every smooth project is a structure that holds it together. Over time, I’ve built a workflow that takes clients from first message to final invoice with confidence and clarity.",
      },
      {
        type: "paragraph",
        text: "Every touchpoint matters—from that first response email to the final handoff. I want clients to feel heard, informed, and excited—not overwhelmed or confused.",
      },
      { type: "heading", text: "Tools That Support Trust and Transparency" },
      {
        type: "paragraph",
        text: "It starts with a warm, human reply and a discovery call that’s more conversation than interrogation. Then comes a clear proposal outlining scope, timeline, deliverables, and pricing. I break projects into stages—like wireframes, mockups, and final handoff—so clients feel progress without overwhelm. I also integrate tools like Notion and Trello to track feedback and milestones, and Dubsado for contracts and payments. A well-crafted process doesn’t just make my life easier—it makes clients feel cared for, respected, and excited to work together.",
      },
      {
        type: "paragraph",
        text: "I also invite clients into a Notion dashboard where they can track progress, see upcoming tasks, and leave comments. This shared space creates accountability and keeps communication clear. No more endless email chains or lost feedback.",
      },
      {
        type: "heading",
        text: "Building Long-Term Relationships, Not Just Deliverables",
      },
      {
        type: "paragraph",
        text: "One of the most important shifts I made in my workflow was moving from a project-based mindset to a relationship-driven one. I treat every client interaction—whether it’s a kickoff call or a quick feedback loop—as an opportunity to build trust and rapport.",
      },
      {
        type: "paragraph",
        text: "This not only makes the design process smoother but often leads to ongoing collaborations, referrals, and retainer work. When clients feel seen, heard, and guided, they don’t just get a website—they gain a creative partner who understands their goals. That kind of trust is what truly sustains a freelance practice.",
      },
      { type: "heading", text: "Consistency Builds Confidence" },
      {
        type: "paragraph",
        text: "When clients know what to expect, they relax. And relaxed clients give better feedback, make faster decisions, and become long-term partners. A strong workflow isn’t just operational—it’s relational. It shows that I value their time as much as my own.",
      },
    ],
    duotone: ["#3d2b4f", "#0a0a0b"],
  },
  {
    slug: "the-power-of-typography-in-web-design",
    index: "03",
    title: "The Power of Typography in Web Design",
    excerpt:
      "How typography shapes effective, readable, and beautiful web design.",
    date: "2025-03-10",
    category: "Web Design",
    readingMinutes: 2,
    body: [
      { type: "heading", text: "The Emotional Role of Typography" },
      {
        type: "paragraph",
        text: "Typography is one of the quiet heroes of web design. Most users won’t consciously notice a perfect font pairing or ideal line height—but they’ll feel it. The right type choices create rhythm, hierarchy, and tone. They make reading easy, effortless, and sometimes even joyful. One of the first things I do when designing is choose a typeface that aligns with the brand’s voice—modern and clean, classic and serifed, playful and rounded.",
      },
      {
        type: "paragraph",
        text: "I always ask myself: how should this brand feel? Should the headlines be bold and loud, or soft and thoughtful? Should the paragraph spacing encourage quick scanning or immersive reading? These questions guide my typographic palette.",
      },
      { type: "heading", text: "Designing for Readability Across Screens" },
      {
        type: "paragraph",
        text: "Good typography supports the message. A clear headline draws the eye. A consistent system of headings, body text, and labels creates trust. Responsive scaling ensures legibility across all devices. And when it’s done right, typography becomes the invisible thread tying a whole experience together. In short, it’s not just about looking good—it’s about feeling natural and helping users flow from point to point without friction.",
      },
      { type: "heading", text: "Typography as a Brand Voice" },
      {
        type: "paragraph",
        text: "Typography does more than organize information—it speaks. A well-chosen typeface conveys a brand’s tone before a single word is read. Is it bold and assertive? Gentle and trustworthy? Sophisticated or playful? I often spend hours experimenting with pairings not just for visual contrast, but for emotional resonance. The right type treatment can make a website feel instantly aligned with the user’s expectations, reinforcing identity and building trust. It’s a quiet but powerful way to tell a story—one letter at a time.",
      },
      { type: "heading", text: "Elevating Design Through Subtle Precision" },
      {
        type: "paragraph",
        text: "Choosing typography is never just an aesthetic decision—it’s a UX decision. The difference between a cluttered page and a calming one often comes down to spacing, scale, and restraint. Great typography doesn’t shout. It whispers, “you’re in the right place.”",
      },
      {
        type: "paragraph",
        text: "I believe every detail, down to the hyphenation or the optical alignment of text blocks, contributes to a more polished and emotionally resonant experience. It’s not just graphic design—it’s human design.",
      },
    ],
    duotone: ["#4a3a1a", "#0a0a0b"],
  },
  {
    slug: "how-to-price-your-design",
    index: "04",
    title: "How to Price Your Design",
    excerpt:
      "Practical guidance on how to price your design work confidently as a freelancer.",
    date: "2025-02-25",
    category: "Web Design",
    readingMinutes: 2,
    body: [
      { type: "heading", text: "The Challenge of Knowing Your Worth" },
      {
        type: "paragraph",
        text: "Pricing is one of the most emotionally charged parts of freelancing. Early in my career, I made the mistake of charging what I thought people would pay—often far below what the work deserved. But I’ve since learned that pricing isn’t just about numbers. It’s a reflection of value, clarity, and confidence. Clients aren’t just paying for your hours—they’re paying for your expertise, your process, and the impact your work will have on their business.",
      },
      { type: "heading", text: "Value Over Hours" },
      {
        type: "paragraph",
        text: "Now, I base my pricing on value and outcomes. I ask: what’s the client trying to achieve? How will my work support that goal? I also break down my deliverables clearly and offer packages with set prices, which removes ambiguity and builds trust. Remember, when you price your work fairly and transparently, you attract clients who respect your skills—and projects that energize rather than drain you.",
      },
      { type: "heading", text: "Confidence Comes with Clarity" },
      {
        type: "paragraph",
        text: "When you price clearly and fairly, you attract clients who respect your time. Confidence isn’t arrogance—it’s clarity paired with kindness. And that clarity is what opens the door to better work, better clients, and better balance.",
      },
      { type: "heading", text: "Transparency Builds Confidence" },
      {
        type: "paragraph",
        text: "When pricing is vague, trust erodes. That’s why I break every proposal into clear, digestible parts—UX audit, wireframes, design system, development handoff, etc. Each phase has a purpose, each cost is explained.",
      },
      {
        type: "paragraph",
        text: "It might sound overly formal, but it’s not about red tape—it’s about making the client feel safe and informed. When they understand what they’re paying for, they’re more willing to pay well.",
      },
      { type: "heading", text: "Making Space for Growth" },
      {
        type: "paragraph",
        text: "As I grew more confident in pricing, I noticed another benefit: I could reinvest in myself. Higher rates meant I could buy better tools, take design courses, and spend more time on craft rather than chasing volume. Pricing fairly creates space for excellence.",
      },
    ],
    duotone: ["#4a2418", "#0a0a0b"],
  },
  {
    slug: "building-trust-through-thoughtful-ux",
    index: "05",
    title: "Building Trust Through Thoughtful UX",
    excerpt:
      "Why thoughtful UX builds user trust, and how to apply it in real projects.",
    date: "2025-02-05",
    category: "Web Design",
    readingMinutes: 1,
    body: [
      { type: "heading", text: "Why Trust Is a UX Priority" },
      {
        type: "paragraph",
        text: "User Experience (UX) isn’t just about usability—it’s about creating feelings of comfort, clarity, and trust. A user decides within seconds whether they feel “safe” on a website: Are the buttons where they expect them? Is the copy clear? Does the site load fast? All of these micro-decisions influence whether they stay or leave. That’s why I design experiences that are as thoughtful as they are beautiful.",
      },
      { type: "heading", text: "Designing for Ease and Understanding" },
      {
        type: "paragraph",
        text: "I focus on small details that guide users with ease—like meaningful navigation labels, visual hierarchy, and smart feedback cues. I also test across different devices and screen sizes to make sure nothing gets lost. And I write with empathy, using friendly, human-centered language. A website is more than pixels on a screen—it’s a conversation between brand and visitor. When done well, it earns attention, builds trust, and gently leads users to act.",
      },
      {
        type: "heading",
        text: "UX That Feels Invisible, but Works Powerfully",
      },
      {
        type: "paragraph",
        text: "The best UX almost disappears—it doesn’t ask the user to think too much. It allows them to flow from question to solution without friction. Thoughtful UX is ultimately a form of respect: for the user’s time, attention, and experience.",
      },
      {
        type: "paragraph",
        text: "No system is perfect. So I design with that in mind. What happens if a form fails? What if an image doesn’t load? I write friendly error messages and add fallback states that reassure instead of frustrate.",
      },
      {
        type: "paragraph",
        text: "Trust isn’t built by preventing every mistake—it’s built by handling them with grace.",
      },
    ],
    duotone: ["#1d4038", "#0a0a0b"],
  },
  {
    slug: "tools-i-use-daily-as-a-freelancer",
    index: "06",
    title: "Tools I Use Daily as a Freelancer",
    excerpt:
      "The everyday tools that power my freelance design and development workflow.",
    date: "2025-01-18",
    category: "Web Design",
    readingMinutes: 1,
    body: [
      { type: "heading", text: "Why the Right Tools Matter" },
      {
        type: "paragraph",
        text: "The right tools don’t just make life easier—they make creativity flow. As a freelance web designer, I wear many hats: designer, project manager, client communicator, problem-solver. That’s why my toolkit is intentionally curated to support both my workflow and my sanity. Figma is my design home. I love how easy it is to collaborate, organize components, and share designs without endless email chains.",
      },
      { type: "heading", text: "My Core Toolset" },
      {
        type: "paragraph",
        text: "For project tracking, I rely on Notion—everything from moodboards to timelines lives there. Loom helps me walk clients through designs asynchronously, and Clockify keeps my time in check (without micromanaging). I also use Dubsado for contracts and invoices—automating the business side so I can focus on what I do best: designing. No tool is magic on its own, but together, they shape a process that’s calm, consistent, and genuinely enjoyable.",
      },
      { type: "heading", text: "Less Time Managing, More Time Creating" },
      {
        type: "paragraph",
        text: "The best part of having a reliable system is peace of mind. I spend less time worrying about logistics and more time designing experiences that matter. Tools don’t replace skill—but they can elevate your process to help you do your best work consistently.",
      },
      { type: "heading", text: "Building My Own Ecosystem" },
      {
        type: "paragraph",
        text: "The best thing about curating my own system is that it becomes mine. Over time, I’ve tailored my setup to support my workflow, my energy, and my creative rhythm. It’s like designing my own studio—digital tools are the furniture.",
      },
      {
        type: "paragraph",
        text: "And when everything flows, I get to do my best work—and help clients do theirs.",
      },
    ],
    duotone: ["#2a2f52", "#0a0a0b"],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
