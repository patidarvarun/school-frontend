import * as React from "react";
import { useRouter } from "next/router";
import ViewCreditNotes from "../../modules/CreditNotes/viewcreditnotes";
export default function ViewCreditNote() {
    const router = useRouter();
    const { userId } = router.query;
    return (
        <ViewCreditNotes id={userId} />
    );
}
