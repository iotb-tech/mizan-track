import { getInfo } from "@/hooks/useInfo";


// type UserProps = {
//     params: Promise<{user_id: string}>


// }
export default async function UserPage(){
    //  const { user_id }  = await params;
     const { user_id } = await getInfo();

    return <p>This is dynamic route:{user_id}</p>

}