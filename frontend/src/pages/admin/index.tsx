import AdminView from "@/components/admin-initial/AdminView";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function Admin(){
  const user = useSelector((state: any) => state.app.userState);
  const router = useRouter();
  useEffect(() => {
    if (!user || !user.userId || user.role!=="ADMIN") {
    router.push("/"); 
    }
}, [user, router]);

if (!user || !user.userId) {
    return null; 
}
    return (
        <div>
          <AdminView/>
        </div>
      );
}