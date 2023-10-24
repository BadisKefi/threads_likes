"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";


interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function EditThread({
  threadId,
  currentUserId,
  authorId,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src='/assets/edit.svg'
      alt='edit'
      width={18}
      height={18}
      className='cursor-pointer object-contain'
      onClick={() => router.push(`/edit-thread/${threadId}`)}
    />
  );
}

export default EditThread;