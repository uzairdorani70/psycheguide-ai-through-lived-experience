import sleep from "./assets/sleep3.jpg";
import anixty1 from "./assets/anixty1.jpg";
import anixty2 from "./assets/panic.jpg";
import mind from "./assets/mind1.jpg";
import mind1 from "./assets/mind2.jpg";
import sleep1 from "./assets/sleep2.jpg";
import depression1 from "./assets/depresion1.jpg";
import depression2 from "./assets/depresion2.jpg";
import care from "./assets/care.jpg";
import think from "./assets/think.jpg";
import emotion from "./assets/emotion.jpg";
// icons
import { IoChatbubblesOutline } from "react-icons/io5";
import { LuBookOpen } from "react-icons/lu";
import { AiOutlineSafety } from "react-icons/ai";

export const resourcesData = [
  {
    id: 1,
    title: "I Didn't Realize It Was Anxiety Until It Took Over My Daily Life",
    img: anixty1,
    category: "Anxiety",
    readTime: "Real Lived Experience",
    description:
      "A personal reflection on how anxiety slowly started affecting daily life, focus, and relationships.",
    link: "https://www.reddit.com/r/confession/",
    fullText: `
"I used to think I was just overthinking everything."

It started small — I would feel nervous before meetings or social events. But slowly, it became constant. Even simple tasks like replying to messages felt overwhelming.

I remember sitting in my room, heart racing for no reason, thinking something bad was about to happen. Nothing was happening — but my body didn’t believe that.

Sleep became difficult. My mind wouldn’t stop replaying conversations I had earlier in the day.

I didn't even know this was anxiety. I thought I was just weak or not disciplined enough.

What helped me slowly:
- Talking to someone instead of keeping it inside
- Learning breathing techniques
- Realizing I wasn’t alone

I still have anxious days, but now I understand them. They don’t control me like before.
`,
  },
  {
    id: 2,
    title: "A Panic Attack That Changed My Entire Life",
    img: `${anixty2}`,
    description:
      "A personal lived experience of a sudden panic attack triggered by a movie scene that left a long-lasting emotional impact.",
    readTime: "Real Lived Experience",
    category: "Anxiety",
    link: "https://x.com/GPB_GA/status/2048526925669286326?s=20",
    fullText: `
Let me start by saying I am not usually an anxious person. I had never experienced a panic attack before this moment.

In 1988, I watched a movie called *The Seventh Sign*. During one particular scene, I suddenly experienced a strong panic attack triggered by what I saw.

That moment felt extremely intense and emotional, and it changed how I viewed things from that day onward.

After this experience, I developed a deep belief connected to what I felt during that moment. Over the years, I often shared this story with others, and it remained a significant part of my life experience.

For more than three decades, I have reflected on that moment and the emotional impact it had on me. It shaped my thoughts, feelings, and life perspective in a lasting way.

This experience continues to influence how I understand myself and my purpose in life.
`,
  },

  {
    id: 3,
    title: "The Power of Mindful Breathing",
    img: `${mind}`,
    description:
      "Discover how simple breathing exercises can transform your mental state and bring calm to chaotic moments.",
    readTime: "5 min read",
    category: "Mindfulness",
    link: "/resources/mindfulness",
    fullText: `
Mindful breathing is the foundation of present-moment awareness.
It pulls your attention away from worries of the past and fears of the future.

Try This:
Place one hand on your chest and one on your belly.
Breathe slowly — feel your belly rise before your chest.
Notice warmth, movement, and rhythm without judgment.

If the mind wanders — that's okay.
Gently bring it back to your breath, again and again.
The return is the practice.

Mindful breathing creates space between stimulus and reaction — 
allowing you to respond rather than react.
`,
  },
  {
    id: 4,
    title: "Mindfulness for Focus and Clarity",
    img: `${mind1}`,
    description:
      "Slow down racing thoughts and improve focus through practical mindfulness habits.",
    readTime: "9 min read",
    category: "Mindfulness",
    link: "/resources/mindfulness/focus",
    fullText: `
Focus weakens when the mind jumps rapidly between thoughts.
Mindfulness sharpens focus by training your attention like a muscle.

One-Minute Mind Reset:
• Sit still
• Breathe slowly
• Count breaths from 1–10
• If your mind wanders, restart gently
This resets attention and improves clarity.

Mindful Transitions:
Before switching tasks, pause for 10 seconds.
Acknowledge what you're leaving, breathe, and set an intention for what's next.
This prevents mental overload and reduces stress.

Remember:
Clarity doesn't come from rushing — it comes from *pausing*.
`,
  },

  {
    id: 5,
    title: "Creating a Sleep Sanctuary",
    img: `${sleep}`,
    description:
      "Transform your bedroom into a haven for restful sleep with these evidence-based tips and strategies.",
    readTime: "7 min read",
    category: "Sleep",
    link: "/resources/sleep",
    fullText: `
Good sleep begins with your environment.
A calm space supports a calm mind.

Sleep Sanctuary Tips:
• Keep lighting warm and gentle at night
• Reduce noise using fans or soft sounds
• Remove screens 30–60 minutes before bed
• Keep your bed for sleep — not work or scrolling

Your body remembers what you repeat.
When your bedroom becomes a signal for rest, sleep comes easier.
`,
  },
  {
    id: 6,
    title: "Night Routine for Better Sleep",
    img: `${sleep1}`,
    description:
      "Build a relaxing night-time routine to fall asleep faster and wake up refreshed.",
    readTime: "6 min read",
    category: "Sleep",
    link: "/resources/sleep/routine",
    fullText: `
Creating a routine trains your brain to wind down naturally.

Try This Routine:
• Dim lights after sunset
• Stretch gently for 5 minutes
• Write down tomorrow’s tasks to empty your mind
• Read 5 pages of a calming book
• Practice slow breathing

Consistency is more powerful than perfection.
Sleep improves one evening at a time.
`,
  },

  {
    id: 7,
    title: "Recognizing Early Signs of Depression",
    img: `${depression1}`,
    description:
      "Learn how depression can show up subtly and when to seek support.",
    readTime: "10 min read",
    category: "Depression",
    link: "/resources/depression",
    fullText: `
Depression doesn't always appear as constant sadness.
Sometimes it's quiet: loss of interest, exhaustion, numbness, or withdrawal.

Early Signs:
• Losing motivation for things you once enjoyed
• Feeling heavy or tired without clear reason
• Sleeping too much or too little
• Thoughts that feel foggy or slow

Reaching out is a strength.
Support from friends, family, or professionals can open the first door to recovery.
`,
  },
  {
    id: 8,
    title: "Small Daily Habits to Fight Depression",
    img: `${depression2}`,
    description:
      "Tiny actions that slowly rebuild motivation and energy when everything feels heavy.",
    readTime: "5 min read",
    category: "Depression",
    link: "/resources/depression/habits",
    fullText: `
Recovery is built from small steps — not giant leaps.

Try:
• Drink one glass of water after waking
• Open your curtains to let light in
• Write one sentence a day
• Walk for five minutes outside
• Send one message to someone you trust

Healing grows through consistency, compassion, and patience with yourself.
Even tiny progress counts.
`,
  },

  {
    id: 9,
    title: "Daily Self-Care Checklist",
    img: `${care}`,
    description:
      "Simple actions to nourish your mind, body, and emotions every day.",
    readTime: "6 min read",
    category: "Self-Care",
    link: "/resources/selfcare",
    fullText: `
Self-care is not selfish — it's survival.
It's how you maintain energy to face life’s challenges.

Daily Checklist:
☐ Drink enough water
☐ Move your body gently
☐ Sleep 7–9 hours
☐ Spend 10 minutes without screens
☐ Say something kind to yourself

Small acts of self-care create big long-term change.
`,
  },

  {
    id: 11,
    title: "Grounding Techniques for Overthinking",
    img: `${think}`,
    description:
      "Bring awareness back to the present moment using grounding methods.",
    readTime: "6 min read",
    category: "Coping Strategies",
    link: "/resources/coping/grounding",
    fullText: `
Overthinking pulls you into the past or future.
Grounding returns you to the present moment.

Try:
• Hold something cold in your hand
• Touch your feet to the floor and notice pressure
• Look at one object and describe it in detail
• Remind yourself: "I am here. I am safe."

Grounding isn't escaping your thoughts — it's *pausing* them.
`,
  },
  {
    id: 12,
    title: "Journaling to Process Emotions",
    img: `${emotion}`,
    description:
      "Use writing as a tool to work through complex emotions and gain clarity.",
    readTime: "8 min read",
    category: "Coping Strategies",
    link: "/resources/coping/journaling",
    fullText: `
Journaling makes emotions visible — and once visible, they feel less overwhelming.

Write:
"What am I feeling right now?"
"Where do I feel this in my body?"
"What would support me today?"

There are no wrong words — only honest ones.
`,
  },
];

export const supportCard = [
  {
    icon: IoChatbubblesOutline,
    title: "Compassionate AI Conversations",
    para: "Engage with an AI trained to listen with empathy and provide thoughtful, supportive responses based on lived experience.",
  },
  {
    icon: LuBookOpen,
    title: "Resource Library",
    para: "Access curated articles and guides on coping strategies, mindfulness, sleep, anxiety, depression, and self-care.",
  },
  {
    icon: AiOutlineSafety,
    title: "Safe & Confidential",
    para: "Your conversations are private. We prioritize your emotional safety with a non-judgmental, supportive environment.",
  },
];
