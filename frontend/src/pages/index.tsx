import LoginForm from "@/components/login/LoginForm";
import { useRouter } from "next/router";

export default function Login(){
  const router = useRouter();
  const handleRoutingByRole=(role:string)=>{
    router.push(role==="ADMIN"?"/admin":"/user",);
  }
  return (
    <div>
      <LoginForm onRoute={handleRoutingByRole}></LoginForm>
    </div>
  );
}