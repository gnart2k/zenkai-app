import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

interface InterviewCompletedProps {
  recordedChunks: Blob[];
  transcript: string;
  generatedFeedback: string;
}

export default function InterviewCompleted({
  recordedChunks,
  transcript,
  generatedFeedback,
}: InterviewCompletedProps) {
  return (
    <div className="w-full flex flex-col max-w-[1080px] mx-auto mt-[10vh] overflow-y-auto pb-8 md:pb-12">
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.075, 0.82, 0.165, 1] }}
        className="relative md:aspect-[16/9] w-full max-w-[1080px] overflow-hidden bg-[#1D2B3A] rounded-lg ring-1 ring-gray-900/5 shadow-md flex flex-col items-center justify-center"
      >
        <video
          className="w-full h-full rounded-lg"
          controls
          crossOrigin="anonymous"
          autoPlay
        >
          <source
            src={URL.createObjectURL(
              new Blob(recordedChunks, { type: "video/mp4" })
            )}
            type="video/mp4"
          />
        </video>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.15,
          ease: [0.23, 1, 0.82, 1],
        }}
        className="flex flex-col md:flex-row items-center mt-2 md:mt-4 md:justify-between space-y-1 md:space-y-0"
      >
        <div className="flex flex-row items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-[#407BBF] shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
          <p className="text-[14px] font-normal leading-[20px] text-[#1a2b3b]">
            Video is not stored on our servers, and will go away as soon as you
            leave the page.
          </p>
        </div>
        <Link
          href="https://github.com/Tameyer41/liftoff"
          target="_blank"
          className="group rounded-full pl-[8px] min-w-[180px] pr-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#1E2B3A] text-white hover:[linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #0D2247] no-underline flex gap-x-2  active:scale-95 scale-100 duration-75"
          style={{
            boxShadow:
              "0px 1px 4px rgba(13, 34, 71, 0.17), inset 0px 0px 0px 1px #061530, inset 0px 0px 0px 2px rgba(255, 255, 255, 0.1)",
          }}
        >
          <span className="w-5 h-5 rounded-full bg-[#407BBF] flex items-center justify-center">
            <svg
              className="w-[16px] h-[16px] text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.75 7.75C4.75 6.64543 5.64543 5.75 6.75 5.75H17.25C18.3546 5.75 19.25 6.64543 19.25 7.75V16.25C19.25 17.3546 18.3546 18.25 17.25 18.25H6.75C5.64543 18.25 4.75 17.3546 4.75 16.25V7.75Z"
              ></path>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.5 6.5L12 12.25L18.5 6.5"
              ></path>
            </svg>
          </span>
          Star on Github
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.15,
          ease: [0.23, 1, 0.82, 1],
        }}
        className="mt-8 flex flex-col"
      >
        <div>
          <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
            Transcript
          </h2>
          <p className="prose prose-sm max-w-none">
            {transcript.length > 0
              ? transcript
              : "Don't think you said anything. Want to try again?"}
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-left text-[#1D2B3A] mb-2">
            Feedback
          </h2>
          <div className="mt-4 text-sm flex gap-2.5 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-4 leading-6 text-gray-900 min-h-[100px]">
            <p className="prose prose-sm max-w-none">{generatedFeedback}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
