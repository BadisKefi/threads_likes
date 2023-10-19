"use client";


import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/lib/actions/thread.actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Image
        src='/assets/delete.svg'
        alt='delte'
        width={18}
        height={18}
        className='cursor-pointer object-contain'
      />
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-slate-950">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-light-1">Are you absolutely sure ?</AlertDialogTitle>
        <AlertDialogDescription className="text-light-2">
          This action cannot be undone. This will permanently delete the thread
          and all its data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-800" onClick={async () => {
          await deleteThread(JSON.parse(threadId), pathname);
          if (!parentId || !isComment) {
            router.push("/");
          }
        }}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  );
}

export default DeleteThread;