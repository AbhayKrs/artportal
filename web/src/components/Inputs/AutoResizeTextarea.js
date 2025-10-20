import React, { useRef, useEffect, useState } from "react";

const TAGS = [
    "art",
    "abstract",
    "portrait",
    "landscape",
    "digital",
    "oilpaint",
    "watercolor",
];

export default function AutoResizeTextarea({
    value,
    onChange,
    placeholder = "",
    className = "",
    tags
}) {
    const ref = useRef(null);
    const wrapperRef = useRef(null);
    const overlayRef = useRef(null);
    const [dropdown, setDropdown] = useState({ visible: false, x: 0, y: 0, items: [] });
    const [filter, setFilter] = useState("");

    // URL linkify regex
    const urlRegex =
        /((https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|io|co|in|ai|dev|app|xyz)(\/[^\s]*)?)/gi;

    const linkified = (value || "").replace(
        urlRegex,
        (url) =>
            `<a href="${url.startsWith("http") ? url : "https://" + url}" target="_blank" class="text-blue-500 underline">${url}</a>`
    );

    // Auto-resize textarea
    useEffect(() => {
        const ta = ref.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
    }, [value]);

    // Get caret coordinates relative to wrapper
    const getCaretCoordinates = (textarea, wrapper) => {
        const div = document.createElement("div");
        const style = window.getComputedStyle(textarea);
        for (const prop of style) div.style[prop] = style[prop];

        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.whiteSpace = "pre-wrap";
        div.style.width = textarea.offsetWidth + "px";

        wrapper.appendChild(div);

        const textBeforeCaret = textarea.value.substring(0, textarea.selectionStart);
        div.textContent = textBeforeCaret;

        const span = document.createElement("span");
        span.textContent = "\u200b"; // zero-width space
        div.appendChild(span);

        const rect = span.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        wrapper.removeChild(div);

        return {
            x: rect.left - wrapperRect.left - 25,
            y: rect.top - wrapperRect.top + 25, // adjust 20px below caret
        };
    };

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(e);

        const caretPos = e.target.selectionStart;
        const textUptoCaret = val.slice(0, caretPos);
        const match = textUptoCaret.match(/#(\w*)$/);

        if (match) {
            const typed = match[1].toLowerCase();
            const filtered = TAGS.filter((tag) => tag.startsWith(typed));
            if (filtered.length > 0) {
                const { x, y } = getCaretCoordinates(e.target, wrapperRef.current);
                setDropdown({ visible: true, x, y, items: filtered });
                setFilter(typed);
                return;
            }
        }
        setDropdown({ visible: false, x: 0, y: 0, items: [] });
    };

    const handleSelectTag = (tag) => {
        const ta = ref.current;
        const caretPos = ta.selectionStart;
        const before = value.slice(0, caretPos).replace(/#\w*$/, `#${tag} `);
        const after = value.slice(caretPos);
        const newVal = before + after;
        onChange({ target: { value: newVal } });

        setDropdown({ visible: false, x: 0, y: 0, items: [] });
        setFilter("");

        requestAnimationFrame(() => {
            ta.focus();
            const newCaret = before.length;
            ta.setSelectionRange(newCaret, newCaret);
        });
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className={`absolute inset-0 p-2 text-lg leading-tight text-gray-300 whitespace-pre-wrap break-words pointer-events-none ${className}`}
                dangerouslySetInnerHTML={{
                    __html:
                        linkified ||
                        `<span class='text-gray-500'>${placeholder}</span>`,
                }}
            />

            {/* Transparent textarea */}
            <textarea
                ref={ref}
                value={value}
                onChange={handleChange}
                placeholder=""
                className={`relative w-full resize-none border-0 outline-none bg-transparent text-lg leading-tight text-gray-300 p-2 caret-white ${className}`}
                style={{
                    color: "transparent",
                    caretColor: "white",
                }}
            />

            {/* Dropdown (positioned at caret) */}
            {dropdown.visible && (
                <div
                    className="absolute w-40 p-1 z-20 bg-neutral-800 text-gray-200 shadow-lg rounded-lg max-h-48 overflow-y-auto"
                    style={{ left: dropdown.x, top: dropdown.y }}
                >
                    {dropdown.items.map((tag) => (
                        <div
                            key={tag}
                            onMouseDown={() => handleSelectTag(tag)}
                            className="px-3 py-1 rounded-lg cursor-pointer hover:bg-neutral-700"
                        >
                            #{tag}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
