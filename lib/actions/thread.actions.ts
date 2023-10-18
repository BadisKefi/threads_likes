import { metadata } from './../../app/(root)/layout';
"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Community from '../models/community.model';

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}


// create thread
export async function createThread({ text, author, communityId, path }: Params) {
    connectToDB();
    try {
        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
            ).exec();

        const createdThread = await Thread.create({
            text,
            author,
            community: communityIdObject,
        });

        //Update user model
        const user = await User.findById(author);
        user.threads.push(createdThread._id);
        await user.save();

        //Update community model
        if (communityIdObject) {
            const community = await Community.findById(communityIdObject);
            community.threads.push(createdThread._id);
            await community.save();
        }

        //revalidate path
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`);
    }
}

// fetch threads that have no parents (top level threads)
export async function fetchThreads(pageNumber = 1, pageSize = 20){
    try {
        connectToDB();

        // calculate the number of threads to skip
        const skipAmount = (pageNumber - 1) * pageSize;

        const threads = await Thread.find({ parentId: {$in: [null, undefined]} })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path: 'author', model: 'User'})
        .populate({
            path: "community",
            model: Community,
          })
        .populate({
            path: 'children',
            model: 'Thread', 
            populate: {
                path: 'author',
                model: 'User',
                select: "_id name parentId image"
            }
        }).exec();

        const totalThreadsCount = await Thread.countDocuments({ parentId: {$in: [null, undefined]} });

        const isNext  = totalThreadsCount > skipAmount + threads.length;

        return { threads, isNext };
    } catch (error: any) {
        throw new Error(`Error fetching threads: ${error.message}`);
    }
}

// fetch thread by id
export async function fetchThreadById(id: string) {
    try {
        connectToDB();
        const thread = await Thread.findById(id)
        .populate({path: 'author', model: 'User', select: "_id id name image"})
        .populate({
            path: "community",
            model: Community,
            select: "_id id name image",
          })
        .populate({
            path: 'children',
            model: 'Thread',
            populate: [
            {
                path: 'author',
                model: 'User',
                select: "_id id name parentId image"
            },
            {
                path: 'children',
                model: 'Thread',
                populate: {
                path: 'author',
                model: 'User',
                select: "_id id name parentId image"
                }
            }
          ]
        }).exec();
        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`);
    }  
}

// add comment to thread
export async function addCommentToThread({ threadId, commentText, userId, pathname }:  {
    threadId: string,
    commentText: string,
    userId: string,
    pathname: string
}) {
    connectToDB();
    try {

      // Find the original thread by its ID
      const originalThread = await Thread.findById(threadId);
  
      if (!originalThread) {
        throw new Error("Thread not found");
      }
      // Create the new comment thread
      const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId, // Set the parentId to the original thread's ID
      });
      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save();
      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id);
      // Save the updated original thread to the database
      await originalThread.save();
      revalidatePath(pathname);
      
    } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
    }
  }



