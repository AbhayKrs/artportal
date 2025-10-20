import React from "react";
import { Link } from "react-router-dom";

const PostText = ({ text }) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/i;
    const tagRegex = /#([^\s#]+)/g;

    const combinedRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?|#[\w]+)/gi;
    const parts = text.split(combinedRegex).filter(Boolean);

    return (
        <p className="text-lg text-neutral-800 dark:text-gray-200 whitespace-pre-wrap">
            {parts.map((part, i) => {
                // Match URL
                const m = part.match(urlRegex);
                const t = part.match(tagRegex);

                if (m) {
                    const raw = m[0].replace(/[.,!?;:]+$/g, "");
                    let href = raw;
                    if (!/^https?:\/\//i.test(href)) href = "https://" + href;
                    return (
                        <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
                        >
                            {raw}
                        </a>
                    );
                }

                if (part.startsWith("#")) {
                    const tag = part.slice(1);
                    return (
                        <Link
                            key={`tag-${i}`}
                            to={`/search?q=${tag.toLowerCase()}&type=posts&filter=trending`}
                            className="text-blue-600 dark:text-blue-400 hover:underline mr-1"
                        >
                            {part}
                        </Link>
                    );
                }

                // if (t) {
                //     const elements = [];
                //     t.forEach((part, i) => {
                //         // elements.push(<span key={`txt-${i}`}>{part}</span>);
                //         const tag = t[i].substring(1); // remove '#'
                //         elements.push(
                //             <Link
                //                 key={`tag-${i}`}
                //                 to={`/tags/${tag.toLowerCase()}`}
                //                 className="text-blue-600 dark:text-blue-400 hover:underline mr-1"
                //             >
                //                 #{tag}
                //             </Link>
                //         );

                //     });
                //     return elements;
                // }

                return <span key={i}>{part}</span>;
            })}
        </p>
    );
}
export default PostText;