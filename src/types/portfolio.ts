export interface IPortFolioProduct {
    id: string;
    name: string;
    symbol: string;
    type: string;
    volume: number;
    current_price: number;
    industry: string;
    image_url: string;
    maturity_date?: string;
}

export interface IProductData {
    name: string;
    total_value: number;
    created_at: string;
    product: IPortFolioProduct[];
} 