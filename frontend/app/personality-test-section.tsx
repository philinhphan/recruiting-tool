import { Button } from "@/components/ui/button"
import { LoadingButton } from "./loading-button"
import React, { RefObject } from "react"

export type OpenPosition = {
    title: string
    description: string
    location: string
}

type PersonalityTestSectionProps = {
    heading: string
    description: string
    questions: string[]
    jumpTo: RefObject<HTMLDivElement | null>
}

function toName(num: number): string {
    switch (num) {
        case 1:
            return "Strongly Disagree"
        case 2:
            return "Disagree"
        case 3:
            return "Neutral"
        case 4:
            return "Agree"
        case 5:
            return "Strongly Agree"
        default:
            return "Unknown"
    }
}

export function PersonalityTestSection({ heading, description, questions, jumpTo }: PersonalityTestSectionProps) {
    const [selectedAnswers, setSelectedAnswers] = React.useState<{ [key: number]: number | null }>({});

    const handleSelection = (questionIdx: number, value: number) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: value }));
    };

    const allQuestionsAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="text-center mb-12">
                <h2 className="text-[#000000] text-3xl md:text-4xl font-bold mb-8">{heading}</h2>

                <div className="space-y-4 text-[#6e6e6e] text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    <p>{description}</p>
                </div>

                {/* Personality Test Section */}
                <form className="space-y-6">
                    {questions.map((question, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-[rgba(0,0,0,0.1)_0px_0px_20px_0px] p-6 text-left flex flex-col md:flex-row md:items-center md:justify-between">
                            <label className="text-base font-medium text-[#000000] mb-2 md:mb-0 md:mr-6" htmlFor={`question-${idx}`}>
                                {question}
                            </label>
                            <div className="flex space-x-6 mt-2 md:mt-0">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <label key={num} className="flex flex-col items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question-${idx}`}
                                            value={toName(num)}
                                            className="appearance-none w-6 h-6 rounded-full border border-gray-300 checked:bg-[#00ea51] checked:border-[#00ea51] focus:outline-none transition"
                                            onChange={() => handleSelection(idx, num)}
                                        />
                                        <span className="mt-1 text-sm text-gray-700">{num}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </form>
            </div>

            {/* More Button */}
            <div className="text-center">
                <div className="flex justify-center">
                    <LoadingButton
                        className={`px-12 py-6 text-lg font-semibold rounded-full transition-all bg-[#00ea51] hover:bg-[#00d147] text-white`}
                        disabled={!allQuestionsAnswered}
                        onClick={async () => {
                            setTimeout(() => {
                                jumpTo.current?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 100);
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
    );
}