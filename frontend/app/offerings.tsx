import { Button } from "@/components/ui/button"
import React from "react"

export type OpenPosition = {
    title: string
    description: string
    location: string
}

type OfferingsProps = {
    heading: string
    openPositions: OpenPosition[]
}

export function Offerings({ heading, openPositions }: OfferingsProps) {

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="text-center mb-12">
                <h2 className="text-[#000000] text-3xl md:text-4xl font-bold mb-8">{heading}</h2>

                <div className="space-y-4 text-[#6e6e6e] text-lg leading-relaxed max-w-3xl mx-auto mb-8">
                    <p>I've found the top three job positions at Reply that I think are a perfect match for your skills and interests. I'm excited to share these with you and hope you'll find them appealing! If these aren't quite what you're looking for, no worries at all—you can easily explore all the available positions to find the one that suits you best. Let's find your dream job together!</p>
                    <p>Imagine the future, with us.</p>
                </div>

                {/* Job Offerings Section */}
                <div className="space-y-6">
                    {openPositions.slice(0, 3).map((position, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-[rgba(0,0,0,0.07)_0px_2px_8px_0px] p-6 text-left"
                        >
                            <h3 className="text-xl font-semibold text-[#000000] mb-2">{position.title}</h3>
                            <div className="text-[#00ea51] text-sm font-medium mb-2">{position.location}</div>
                            <p className="text-[#6e6e6e] text-base">
                                {position.description.length > 120
                                    ? position.description.slice(0, 120) + "..."
                                    : position.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* More Button */}
            <div className="text-center">
                <Button
                    className={`px-12 py-6 text-lg font-semibold rounded-full transition-all bg-[#00ea51] hover:bg-[#00d147] text-white`}
                    onClick={() => {
                    }}
                >
                    More
                </Button>

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