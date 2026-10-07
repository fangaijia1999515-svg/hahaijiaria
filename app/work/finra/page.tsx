/**
 * /work/finra — FINRA has no old-register (/work) version; the case lives at
 * /work-classic/finra only. This stub exists because getNextProject() links
 * are /work/<id>-shaped on the /work/* pages, so the loop must not 404.
 */
import { redirect } from "next/navigation"

export default function Page() {
  redirect("/work-classic/finra")
}
