"use client"

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from 'next/navigation';
import { updateThreadLikes } from "@/lib/actions/thread.actions";

interface Props {
    id: string;
    loggedInUserId: string;
    likers: any;
  }
const Like = ({ id, loggedInUserId, likers }: Props) => {

  const router = useRouter();
  const pathname = usePathname();

  const handleLike = async () => {
    const thread = await updateThreadLikes({ threadId: id, userId: loggedInUserId, path: pathname})
    console.log(thread);
    router.refresh();
    //make sure to test this: is it userId or {userId: id} and also this Refresh() and also the way you save likers in db
  }

  return (
    <div>
    <button onClick={handleLike}>
        <Image
        src={likers?.includes({_id: loggedInUserId}) ? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
        alt='heart'
        width={24}
        height={24}
        className='cursor-pointer object-contain'
        />
    </button>

    {/*<p>{ (Array.isArray(likers)) ?? likers?.length != 0 ?? likers?.length }</p>*/}
    </div>
  )
}
            
export default Like;