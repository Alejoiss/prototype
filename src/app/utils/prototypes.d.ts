declare global {
    interface String {
        toDate(): Date | null;
    }
}
export {};
