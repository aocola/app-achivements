import UserInitialView from "@/components/user-initial/UserInitialView";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function User(){
    const user = useSelector((state: any) => state.app.userState);
    const router = useRouter();

    useEffect(() => {
        if (!user || !user.userId || user.role!=="USER") {
        router.push("/"); 
        }
    }, [user, router]);

    if (!user || !user.userId) {
        return null; 
    }
    return (
        <div>
            <UserInitialView/>
        </div>
      );
}