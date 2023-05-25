import * as React from "react";
import ViewUser from "../../modules/UsersManagement/viewuser";
import { useRouter } from "next/router";
export default function Users() {
    const router = useRouter();
    const { userId } = router.query;
    return (
        <ViewUser id={userId} />
    );
}
