import * as React from "react";
import EditUser from "../../modules/UsersManagement/edituser";
import { useRouter } from "next/router";
export default function Users() {
    const router = useRouter();
    const { userId } = router.query;
    return (
        <EditUser id={userId} />
    );
}
