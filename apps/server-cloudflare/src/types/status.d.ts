export interface RequestBody {
    pageId: number;
    timeframe?: '45d' | '30d' | '7d' | '1d';
}