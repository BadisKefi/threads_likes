import PostThread from "@/components/forms/PostThread";
import { fetchThread, fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
const { ObjectId } = require('mongodb');


const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if(!(userInfo?.status === 'active')) redirect('/activate-account');
  if (!userInfo?.onboarded) redirect("/onboarding");
  
    // fetch organization list created by user
    const thread = await fetchThread(params.id);
    return (
        <>
          <h1 className='head-text'>Edit Thread</h1>
    
          <PostThread userId={JSON.stringify(userInfo._id)} action="edit" thread={thread} />
        </>
      );
}

export default page