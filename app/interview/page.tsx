"use client";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuid } from "uuid";
import { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { questions, interviewers } from "./components/constants";
import InterviewHeader from "./components/InterviewHeader";
import QuestionSelector from "./components/QuestionSelector";
import InterviewerSelector from "./components/InterviewerSelector";
import InterviewSidebar from "./components/InterviewSidebar";
import InterviewCompleted from "./components/InterviewCompleted";
import InterviewRecorder from "./components/InterviewRecorder";

export default function InterviewPage() {
  const [selected, setSelected] = useState(questions[0]);
  const [selectedInterviewer, setSelectedInterviewer] = useState(
    interviewers[0]
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const webcamRef = useRef<Webcam | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [seconds, setSeconds] = useState(150);
  const [videoEnded, setVideoEnded] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(true);
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("Processing");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [generatedFeedback, setGeneratedFeedback] = useState("");

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    if (videoEnded) {
      const element = document.getElementById("startTimer");

      if (element) {
        element.style.display = "flex";
      }

      setCapturing(true);
      setIsVisible(false);

      if (webcamRef.current && webcamRef.current.stream) {
        mediaRecorderRef.current = new MediaRecorder(
          webcamRef.current.stream as MediaStream
        );
        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
      }
    }
  }, [videoEnded, webcamRef, setCapturing, mediaRecorderRef]);

  const handleStartCaptureClick = useCallback(() => {
    const startTimer = document.getElementById("startTimer");
    if (startTimer) {
      startTimer.style.display = "none";
    }

    if (vidRef.current) {
      vidRef.current.play();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }: BlobEvent) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  useEffect(() => {
    let timer: any = null;
    if (capturing) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
      if (seconds === 0) {
        handleStopCaptureClick();
        setCapturing(false);
        setSeconds(0);
      }
    }
    return () => {
      clearInterval(timer);
    };
  });

  const handleDownload = async () => {
    if (recordedChunks.length) {
      setSubmitting(true);
      setStatus("Processing");

      const file = new Blob(recordedChunks, {
        type: `video/webm`,
      });

      const unique_id = uuid();

      // For now, mocking the conversion since ffmpeg was commented out
       const output = new File([file], `${unique_id}.mp3`, {
        type: "audio/mp3",
      });

      const formData = new FormData();
      formData.append("file", output, `${unique_id}.mp3`);
      formData.append("model", "whisper-1");

      const question =
        selected.name === "Behavioral"
          ? `Tell me about yourself. Why don${`’`}t you walk me through your resume?`
          : selectedInterviewer.name === "John"
          ? "What is a Hash Table, and what is the average case and worst case time for each of its operations?"
          : selectedInterviewer.name === "Richard"
          ? "Uber is looking to expand its product line. Talk me through how you would approach this problem."
          : "You have a 3-gallon jug and 5-gallon jug, how do you measure out exactly 4 gallons?";

      setStatus("Transcribing");

      const upload = await fetch(
        `/api/transcribe?question=${encodeURIComponent(question)}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const results = await upload.json();

      if (upload.ok) {
        setIsSuccess(true);
        setSubmitting(false);

        if (results.error) {
          setTranscript(results.error);
        } else {
          setTranscript(results.transcript);
        }

        console.log("Uploaded successfully!");

        await Promise.allSettled([
          new Promise((resolve) => setTimeout(resolve, 800)),
        ]).then(() => {
          setCompleted(true);
          console.log("Success!");
        });

        if (results.transcript.length > 0) {
          const prompt = `Please give feedback on the following interview question: ${question} given the following transcript: ${
            results.transcript
          }. ${
            selected.name === "Behavioral"
              ? "Please also give feedback on the candidate's communication skills. Make sure their response is structured (perhaps using the STAR or PAR frameworks)."
              : "Please also give feedback on the candidate's communication skills. Make sure they accurately explain their thoughts in a coherent way. Make sure they stay on topic and relevant to the question."
          } \n\n\ Feedback on the candidate's response:`;

          setGeneratedFeedback("");
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt,
            }),
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          // This data is a ReadableStream
          const data = response.body;
          if (!data) {
            return;
          }

          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;

          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setGeneratedFeedback((prev: any) => prev + chunkValue);
          }
        }
      } else {
        console.error("Upload failed.");
      }

      setTimeout(function () {
        setRecordedChunks([]);
      }, 1500);
    }
  };

  function restartVideo() {
    setRecordedChunks([]);
    setVideoEnded(false);
    setCapturing(false);
    setIsVisible(true);
    setSeconds(150);
  }

  const videoConstraints = isDesktop
    ? { width: 1280, height: 720, facingMode: "user" }
    : { width: 480, height: 640, facingMode: "user" };

  const handleUserMedia = () => {
    setTimeout(() => {
      setLoading(false);
      setCameraLoaded(true);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {step === 3 ? (
        <div className="w-full min-h-screen flex flex-col px-4 pt-2 pb-8 md:px-8 md:py-2 bg-[#FCFCFC] relative overflow-x-hidden">
          <InterviewHeader />
          {completed ? (
            <InterviewCompleted
              recordedChunks={recordedChunks}
              transcript={transcript}
              generatedFeedback={generatedFeedback}
            />
          ) : (
            <InterviewRecorder
              recordingPermission={recordingPermission}
              selected={selected}
              selectedInterviewer={selectedInterviewer}
              cameraLoaded={cameraLoaded}
              loading={loading}
              seconds={seconds}
              isVisible={isVisible}
              vidRef={vidRef}
              videoEnded={videoEnded}
              setVideoEnded={setVideoEnded}
              webcamRef={webcamRef}
              videoConstraints={videoConstraints}
              handleUserMedia={handleUserMedia}
              setRecordingPermission={setRecordingPermission}
              recordedChunks={recordedChunks}
              isSuccess={isSuccess}
              isSubmitting={isSubmitting}
              status={status}
              capturing={capturing}
              handleStartCaptureClick={handleStartCaptureClick}
              handleStopCaptureClick={handleStopCaptureClick}
              handleDownload={handleDownload}
              restartVideo={restartVideo}
              setStep={setStep}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row w-full md:overflow-hidden">
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute w-full md:w-1/2 top-0 h-[60px] flex flex-row justify-between"
          >
             <span className="text-sm text-[#1a2b3b] font-medium">
               demo interview
             </span>
             <span className="text-sm text-[#1a2b3b] font-medium opacity-20">
               demo interview
             </span>
             <span className="text-sm text-[#1a2b3b] font-medium">
               demo interview
             </span>
             <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden sm:block">
               demo interview
             </span>
             <span className="text-sm text-[#1a2b3b] font-medium hidden sm:block">
               demo interview
             </span>
             <span className="text-sm text-[#1a2b3b] font-medium opacity-20 hidden xl:block">
               demo interview
             </span>
          </motion.p>
          <div className="w-full min-h-[60vh] md:w-1/2 md:h-screen flex flex-col px-4 pt-2 pb-8 md:px-0 md:py-2 bg-[#FCFCFC] justify-center">
            <div className="h-full w-full items-center justify-center flex flex-col">
              {step === 1 ? (
                <QuestionSelector
                  selected={selected}
                  setSelected={setSelected}
                  setStep={setStep}
                />
              ) : step === 2 ? (
                <InterviewerSelector
                  selectedInterviewer={selectedInterviewer}
                  setSelectedInterviewer={setSelectedInterviewer}
                  setStep={setStep}
                />
              ) : (
                <p>Step 3</p>
              )}
            </div>
          </div>
          <InterviewSidebar
            step={step}
            selected={selected}
            selectedInterviewer={selectedInterviewer}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
