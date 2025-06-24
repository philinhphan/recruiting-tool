import { Button } from "@/components/ui/button"
import { LoadingButton } from "./loading-button"
import React, { RefObject } from "react"

type OpenQuestionProps = {
    question: string
    heading: string
    onContinue: (answer: string) => Promise<void>
    jumpTo: RefObject<HTMLDivElement | null>
}

export function OpenQuestion({ question, heading, onContinue, jumpTo }: OpenQuestionProps) {
    const [answer, setAnswer] = React.useState<string>("")

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="text-center mb-12">
                <h2 className="text-[#000000] text-3xl md:text-4xl font-bold mb-8">{heading}</h2>

                <div className="space-y-4 text-[#6e6e6e] text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    <p>{question}</p>
                </div>

                {/* Text Input Section */}
                <textarea
                    id="answer"
                    name="answer"
                    maxLength={500}
                    rows={6}
                    className="w-full h-full rounded-2xl p-4 text-base text-[#000000] focus:outline-none shadow-[rgba(0,0,0,0.1)_0px_0px_20px_0px] resize-none bg-white"
                    placeholder="Type your answer here (max 500 characters)..."
                    style={{ border: "none" }}
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value) }}
                />
            </div>

            {/* Continue Button */}
            <div className="text-center">
                <div className="flex justify-center">
                    <LoadingButton
                        disabled={!(answer.length > 10)}
                        onClick={async () => {
                            if (answer.length > 10) {
                                await onContinue(answer)
                                setTimeout(() => {
                                    jumpTo.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }, 100);
                            }
                        }}
                    >
                        Continue
                    </LoadingButton>

                </div>

                <p className="text-[#6e6e6e] text-sm mt-6">
                    By continuing, you agree to{" "}
                    <span className="text-[#00ea51] cursor-pointer hover:underline">Terms of Service</span>,{" "}
                    <span className="text-[#00ea51] cursor-pointer hover:underline">Privacy Policy</span>, and{" "}
                    <span className="text-[#00ea51] cursor-pointer hover:underline">Cookie Policy</span>
                </p>

            </div>
        </div>
    )
}