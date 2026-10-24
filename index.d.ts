/**
 * Synthesizes Simlish-style speech for the given text.
 * Requires a browser with the Web Audio API.
 */
export declare function textToSimlish(text: string): Promise<void>;

/** Stops any currently playing Simlish speech. */
export declare function stopSimlish(): void;
