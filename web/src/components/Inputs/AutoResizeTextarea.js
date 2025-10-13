import React, { useRef, useEffect } from "react";

const AutoResizeTextarea = ({
    value,
    onChange,
    placeholder = "",
    className = "",
}) => {
    const ref = useRef(null);

    const TAGS = ["art", "abstract", "portrait", "landscape", "digital", "oilpaint", "watercolor"];

    useEffect(() => {
        const ta = ref.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
    }, [value]);

    // linkify function
    const urlRegex =
        /((https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|io|co|in|ai|dev|app|xyz)(\/[^\s]*)?)/gi;
    const linkified = (value || "").replace(
        urlRegex,
        (url) => `<a href="${url.startsWith("http") ? url : "https://" + url}"
                 target="_blank"
                 class="text-blue-500 underline">${url}</a>`
    );

    return (
        <div className="relative w-full">
            {/* Linkified overlay */}
            <div
                className={`absolute inset-0 p-2 text-lg leading-tight text-gray-300 whitespace-pre-wrap break-words pointer-events-none ${className}`}
                dangerouslySetInnerHTML={{
                    __html: linkified || `<span class='text-gray-500'>${placeholder}</span>`,
                }}
            />
            {/* Actual textarea (transparent) */}
            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder=""
                className={`relative w-full resize-none border-0 outline-none bg-transparent text-lg leading-tight text-gray-300 p-2 caret-white ${className}`}
                style={{
                    color: "transparent", // hide text
                    WebkitTextFillColor: "transparent", // Safari fix
                }}
            />
        </div>
    );
};

export default AutoResizeTextarea;
