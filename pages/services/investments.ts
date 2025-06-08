import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5192/api',
});

export type QuotationMessageDto = {
    assetCode: string;
    unitPrice: number;
    timestamp: string;
};

export type TotalInvestedDto = {
    asset: string;
    total: number;
};

export type PositionDto = {
    asset: string;
    quantity: number;
    profit: number;
};

export type CreateTradeDto = {
    userId: number;
    assetCode: string;
    quantity: number;
    modality: 'Buy' | 'Sell';
};

export type CreateUserDto = {
    name: string;
    email: string;
};

export const apiService = {
    async fetchLatestQuote(assetCode: string): Promise<QuotationMessageDto> {
        const response = await api.get(`/quote/latest/${assetCode}`);
        return response.data;
    },

    async fetchTotalInvestedByUser(userId: number): Promise<TotalInvestedDto[]> {
        const response = await api.get(`/investments/user/${userId}/total-invested`);
        return response.data;
    },


    async fetchUserPositions(userId: number): Promise<PositionDto[]> {
        const response = await api.get(`/positions/user/${userId}/position`);
        return response.data;
    },

    async fetchTotalBrokerage(userId: number): Promise<number> {
        const response = await api.get(`/trades/${userId}`);
        return response.data;
    },

    async fetchGlobalPosition(userId: number): Promise<number> {
        const response = await api.get(`/positions/user/${userId}/global-position`);
        console.log(response)
        return response.data;
    },

    async executeTrade(trade: CreateTradeDto): Promise<void> {
        await api.post('/trades', trade);
    },

    async createUser(createUserDto: CreateUserDto): Promise<any> {
        const response = await api.post('/users', {
            Name: createUserDto.name,
            Email: createUserDto.email,
        });
        return response;
    }
};
