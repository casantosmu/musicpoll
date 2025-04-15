import { useEffect, useLayoutEffect, useRef } from "react";

type Handler = (event: Event) => void;

/**
 * https://usehooks.com/useclickaway
 */
export default function useOnClickOutside<T extends Element>(cb: Handler) {
    const ref = useRef<T>(null);
    const refCb = useRef<Handler>(cb);

    useLayoutEffect(() => {
        refCb.current = cb;
    });

    useEffect(() => {
        const handler = (event: Event) => {
            const element = ref.current;
            if (element && !element.contains(event.target as Node)) {
                refCb.current(event);
            }
        };

        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    return ref;
}
