import { ChecklistExercise } from "@/components/summary/checklist-exercise";

const ITEMS = [
  'Write my "future self" story on paper (from the version of me who already believes) and review it every day',
  'Identify one limiting story I carry ("I\'m a victim", "I can\'t sleep") and rip it up',
  'Use attentional redirection: when the victim story starts, tell my brain "zip it" and go back to the story I want',
  'Write one identity-based belief: identity/value, data, benefits, new habit in one "I\'m the type of person who..." sentence',
  "Turn one goal into an implementation intention (WHEN [exact situation], THEN [tiny first step]), described like a movie",
  "Make the first step tiny (e.g. brush my teeth at 11 p.m. to cut off the kitchen, then pajamas)",
  'For a bad habit: take a cognitive pause and ask "What am I feeling right now?" before acting',
  "Use a 60-second eyes-closed/breathing replacement behavior before scrolling (and allow myself to scroll after, if I still want to)",
  'Stop using scrolling as a "break"; take a real break (walk outside, rest, water, snack, stretch)',
  'Create a phone "parking lot" (a box or another room) for focused work; out of sight, out of mind',
  "Get phones out of the room for important meetings and brainstorms",
  "Keep my phone off the table on coffee chats and dates",
  "Phone off 30 (or 15) minutes before bed and not on until 30 (or 15) minutes after waking",
  "Use the first minutes of the morning to review my beliefs, goals and priorities before any inputs",
  "Turn off computer notifications (Slack, email, watch) during deep work; one task at a time",
  "Accept that multitasking is task switching and batch similar work",
  'Schedule "think time" to be bored and let my mind wander (a little each morning and before bed)',
  "For hard problems: load up the data, then walk away and add a new variable (shower, walk, water, new room)",
  "Change my content diet: unfollow junk accounts, and bloom scroll instead of doom scroll",
  "Try a news cleanse if my mind feels foggy; the world will go on",
  "Watch a 90+ minute movie with no second screen",
  "Prefer long-form content (20-30 minutes of quality YouTube or podcasts); cap short-form at about 10 minutes a day",
  "When lonely, reach out in person or by call/FaceTime/text instead of scrolling social media",
  "Get 7+ hours of quality, unbroken sleep (ideally starting before midnight)",
  "Take the chronotype assessment and find my 2-3 hour peak window",
  "Put creative, admin and deep work in the right windows for my chronotype; work out during my dip",
  "Close my stress cycles: let stress go up and come back down each day",
  "3M breaks: micro (10+ min daily), meso (2-4 h weekly), macro (half to full day monthly), with complete psychological detachment",
  "Pick up a new, challenging active hobby (harmonica, juggling, guitar, a new recipe, a new running route)",
  "Audit and protect what I let into my mind; visualize myself powerful when I feel powerless",
];

export function ActionChecklist() {
  return <ChecklistExercise items={ITEMS} />;
}
