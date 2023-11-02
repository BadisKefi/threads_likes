"use client";

import Link from "next/link";

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    IconButton,
    useToast,
  } from '@chakra-ui/react'

  import { TriangleDownIcon,
        DeleteIcon,
        EditIcon,
        StarIcon,
        MinusIcon,
        LockIcon,
        UnlockIcon
       } from '@chakra-ui/icons'

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
import { banUser, deasctivateAccount, deleteAccount, unbanUser } from "@/lib/actions/user.actions";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ProfileMenu({ accountId, authUserId, role, type} : {accountId: string, authUserId:string, role:string, type: string}) {
const router = useRouter();
const toast = useToast();

  return (
    <div>
        <Menu placement='bottom-end' >
        <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<TriangleDownIcon color="white"/>}
            variant='outline'
            bg='transparent'
        />
        <MenuList
                style={{ maxHeight: '128px', overflowY: 'auto', minWidth: '120px', maxWidth: '190px'}}
                className='custom-scrollbar'
        >   
            
            {accountId === authUserId && type !== "Community" && (
            <Link href='/profile/edit'>
            <MenuItem 
            icon={<EditIcon />}
            >
            Edit Profile
            </MenuItem>
            </Link>
            )}
            
            
            {accountId === authUserId && type !== "Community" && (
                          <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <MenuItem 
                             icon={<DeleteIcon />}
                             >
                              Delete Account
                            </MenuItem>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
                               <AlertDialogDescription>
                                 This action will delete this account.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Cancel</AlertDialogCancel>
                               <AlertDialogAction onClick={async () => {
                                 const result = await deleteAccount(accountId);
                               }}>
                               <SignOutButton signOutCallback={() => { 
                                router.push("/sign-in")
                                }}
                                >
                                Delete
                              </SignOutButton>
                                </AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
            )}
            

            {accountId === authUserId && type !== "Community" && (
                          <AlertDialog>
                          <AlertDialogTrigger asChild>
                                <MenuItem icon={<MinusIcon />}
                                >
                                  Desactivate Account
                                </MenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will desactivate this account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={async () => {
                                const result = await deasctivateAccount(accountId);
                              }}
                              >
                              <SignOutButton signOutCallback={() => { 
                                router.push("/sign-in")
                                }}
                                >
                                Desactivate
                              </SignOutButton>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
            )}
            
            
            {(accountId !== authUserId && role === 'admin') && type !== "Community" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                    <MenuItem icon={<LockIcon />}
                    >
                      Bann Account
                    </MenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will bann this account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={async () => {
                    const result = await banUser(accountId);
                    toast({
                      title: 'Account banned.',
                      description: "You have successfully banned this account.",
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                    })
                  }}>Bann</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            )}
            
           
            {(accountId !== authUserId && role === 'admin') && type !== "Community" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <MenuItem icon={<UnlockIcon />}>
                  Unbann Account
                </MenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will unban this account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={async () => {
                    const result = await unbanUser(accountId);
                    toast({
                      title: 'Account deactivated.',
                      description: "You have successfully unbanned this account.",
                      status: 'success',
                      duration: 9000,
                      isClosable: true,
                    })
                  }}>Unban</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            )}

        </MenuList>
        </Menu>
    </div>
  )
}
