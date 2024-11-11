import UserMedalsView from "@/components/user-medals/UserMedalsView";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function Medallas() {
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
      <UserMedalsView/>
    </div>
  );
};
