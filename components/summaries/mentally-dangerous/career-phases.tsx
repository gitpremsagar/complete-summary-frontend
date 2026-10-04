"use client";

import { useState } from "react";
import { useLocalized } from "@/components/providers/locale-provider";
import { Widget } from "@/components/summary/exercise";
import { cn } from "@/lib/utils";

const TEXT = {
  en: {
    title: "The 10-year arc",
    label: "Career phases",
    phases: [
      {
        years: "Years 1-3",
        name: "Gas pedal",
        points: [
          "Go all in: work, learn, repeat. Reset only as much as you need to keep coming back.",
          "Find your edge: how little sleep, how many hours, before you break? Then stay back from it.",
          "The only rule: don't die. No crazy risks with your health.",
          "You can't know what something could become until you've given it about three years of near-extreme effort.",
        ],
      },
      {
        years: "Years 4-6",
        name: "Dynamically regulate",
        points: [
          "This is when people who never learned to switch off start breaking: hair loss, skin issues, autoimmune problems, chronic fatigue.",
          "The cause: nighttime cortisol stays too high, so the nervous, endocrine and immune systems never reset.",
          'Driven, "electric" people don\'t crash. They keep going while their baseline quietly drops.',
          "Learn to bring balance in. The unit of time is the day: what can I do today, knowing I'm coming back tomorrow?",
        ],
      },
      {
        years: "Years 7+",
        name: "Pro",
        points: [
          "You know when you're stressed, when you need yoga nidra, and when to get off your phone.",
          "Now you can fine-tune, savor what you built, and guide your team.",
          "The top layer: ultra-disciplined and super-focused, but playful, because they're secure.",
        ],
      },
    ],
  },
  hi: {
    title: "10 साल का arc",
    label: "Career phases",
    phases: [
      {
        years: "Years 1-3",
        name: "Gas pedal",
        points: [
          "All in जाएँ: काम करो, सीखो, दोहराओ। बस उतना reset करें जितना वापस आते रहने के लिए ज़रूरी हो।",
          "अपना edge ढूँढें: टूटने से पहले कितनी कम नींद, कितने घंटे? फिर उससे थोड़ा पीछे रहें।",
          "एक ही rule: मरना नहीं है। Health के साथ कोई पागलपन वाला risk नहीं।",
          "लगभग तीन साल की near-extreme effort दिए बिना आप नहीं जान सकते कि कोई चीज़ क्या बन सकती है।",
        ],
      },
      {
        years: "Years 4-6",
        name: "Dynamically regulate",
        points: [
          "यही वो समय है जब switch off करना न सीखने वाले टूटने लगते हैं: बाल झड़ना, skin issues, autoimmune problems, chronic fatigue।",
          "वजह: रात का cortisol बहुत high रहता है, इसलिए nervous, endocrine और immune systems कभी reset नहीं होते।",
          'Driven, "electric" लोग crash नहीं करते। वो चलते रहते हैं जबकि उनका baseline चुपचाप गिरता रहता है।',
          "Balance लाना सीखें। समय की unit दिन है: आज मैं क्या कर सकता हूँ, यह जानते हुए कि कल फिर आना है?",
        ],
      },
      {
        years: "Years 7+",
        name: "Pro",
        points: [
          "आपको पता है कब आप stressed हैं, कब yoga nidra चाहिए, और कब phone छोड़ना है।",
          "अब आप fine-tune कर सकते हैं, जो बनाया उसका मज़ा ले सकते हैं, और अपनी team को guide कर सकते हैं।",
          "सबसे ऊपर की layer: ultra-disciplined और super-focused, लेकिन playful, क्योंकि वो secure हैं।",
        ],
      },
    ],
  },
};

export function CareerPhases() {
  const t = useLocalized(TEXT);
  const [active, setActive] = useState(0);
  const phase = t.phases[active];

  return (
    <Widget title={t.title}>
      <div role="tablist" aria-label={t.label} className="grid grid-cols-3 gap-2">
        {t.phases.map((p, i) => (
          <button
            key={p.years}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl border px-2 py-2.5 text-center transition-colors",
              active === i ? "border-brand bg-brand/10" : "bg-card hover:bg-muted",
            )}
          >
            <div className="text-xs text-muted-foreground">{p.years}</div>
            <div className="font-bold text-brand">{p.name}</div>
          </button>
        ))}
      </div>
      <ul role="tabpanel" className="mt-3! mb-0!">
        {phase.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </Widget>
  );
}
