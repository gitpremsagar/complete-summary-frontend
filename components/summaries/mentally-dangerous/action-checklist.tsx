import { ChecklistExercise } from "@/components/summary/checklist-exercise";

const ITEMS = [
  "Get 5-10 minutes of sunlight in my eyes within the first hour after waking (a 10,000 lux light if there's no sun)",
  "Hydrate, have my caffeine and move a little in that first hour; no phone in bed",
  "Exercise six days a week, ideally in the first half of the day, with one full rest day",
  "No caffeine in the 8 hours before sleep",
  "Dim the lights in the final hour of the day and keep my mind off work",
  "Do five long exhales during the day (or one long one before sleep)",
  "Either fully relax or fully work; stop doing a hybrid of the two",
  "Once a month, write my left column (concerns) and right column (what I can control)",
  "When my mind drifts to the left column, get present: literal actions, what I hear, see and feel",
  "Practice yoga nidra / NSDR for 10-30 minutes, 1-7 days a week (first thing in the morning after a bad night)",
  "Use the eye-movement trick when I wake at night: side, side, counterclockwise, clockwise, nose, exhale",
  "Check what state I'm in before opening social media",
  "Take myself seriously: act like a pro athlete in my field, including the rest",
  "Find my edge (the most real work I can sustain), then work around that average",
  "Make the day the unit of time: what can I do today, knowing I'm coming back tomorrow?",
  "Take one reset day a week (sunlight still, but no exercise and nothing to prove)",
  "When I freeze before a risk, lower the stakes: commit for three days, then three more",
  "Chop wood, carry water: on hard days, just do today's work without asking why",
  "Cold shower with walls: stay in past one more urge to get out (max 3 minutes, not ice)",
  "Do 10 breaths of meditation before getting out of bed",
  "Make my work sets harder, not easier",
  "When overwhelmed, dilate my gaze to take in the whole room, then pick things off one by one",
  "Recall something I survived or built, and own my part in it",
  "Do the slightly harder thing when I notice it",
  "Self-test after every book or podcast: what did I learn? Look up what I can't remember",
  "Never self-attack or attack others; if I can't do anything useful, do nothing for 5 minutes",
  "Keep a committee of people I respect to pressure-test big decisions",
  "Keep social media on a separate phone or in a lock box during focused work",
  "Ask \"am I a consumer or a creator right now?\" and spend some time creating every day",
  "Become the producer of the thing I consume the most",
];

export function ActionChecklist() {
  return <ChecklistExercise items={ITEMS} />;
}
