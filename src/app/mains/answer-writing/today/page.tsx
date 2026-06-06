import { redirect } from "next/navigation";

// "Write Answer" entry point — route to the answer-writing hub for now.
export default function TodayAnswerWritingPage() {
  redirect("/mains/answer-writing");
}
