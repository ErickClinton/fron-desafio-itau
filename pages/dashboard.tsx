import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Container, Grid, Typography,
    TextField, InputAdornment, IconButton, Paper,
    Chip, Divider, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { apiService } from "@/pages/services/investments";

type QuotationMessageDto = {
    assetCode: string;
    unitPrice: number;
    timestamp: string;
};

const Index = () => {


    const [totalInvestido, setTotalInvestido] = useState<{ asset: string; total: number; color: string }[]>([]);
    const [posicoes, setPosicoes] = useState<{ asset: string; quantity: number; profit: number; color: string }[]>([]);
    const [corretagemTotal, setCorretagemTotal] = useState(0);
    const [posicaoGlobal, setPosicaoGlobal] = useState<number | null>(null);
    const [searchCode, setSearchCode] = useState('');
    const [cotacao, setCotacao] = useState<QuotationMessageDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const userIdStr = localStorage.getItem('userId');
                const emailFromStorage = localStorage.getItem('userEmail');

                if (!userIdStr) {
                    console.error('Usuário não encontrado no localStorage.');
                    return;
                }

                const userId = parseInt(userIdStr, 10);
                setEmail(emailFromStorage);

                const [inv, pos, corr, global] = await Promise.all([
                    apiService.fetchTotalInvestedByUser(userId),
                    apiService.fetchUserPositions(userId),
                    apiService.fetchTotalBrokerage(userId),
                    apiService.fetchGlobalPosition(userId)
                ]);

                setTotalInvestido(inv.map((i: any) => ({ asset: i.assetCode, total: i.totalInvest, color: '#FF6B00' })));
                setPosicoes(pos.map((p: any) => ({ asset: p.assetCode, quantity: p.quantity, profit: p.profitLoss, color: '#001E4C' })));
                setCorretagemTotal(corr);
                setPosicaoGlobal(global.totalProfitLoss);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
            }
        };

        loadData();
    }, []);

    const fetchCotacao = async () => {
        if (!searchCode.trim()) return;

        setIsLoading(true);
        try {
            const data = await apiService.fetchLatestQuote(searchCode.toUpperCase());
            setCotacao(data);
        } catch {
            alert('Cotação não encontrada!');
            setCotacao(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && fetchCotacao();

    return (
        <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Paper elevation={2} sx={{ backgroundColor: '#001E4C', color: 'white', mb: 4 }}>
                <Container>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
                        <Avatar sx={{ bgcolor: '#FF6B00', mr: 2 }}>
                            <AccountBalanceIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">Painel do Investidor</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>{email}</Typography>
                        </Box>
                    </Box>
                </Container>
            </Paper>

            <Container maxWidth="xl">
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Typography variant="h4" color="#001E4C" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                            <ShowChartIcon /> Total Investido por Ativo
                        </Typography>
                        <Divider sx={{ backgroundColor: '#FF6B00', height: 3, width: 60, mb: 3 }} />
                        <Grid container spacing={3}>
                            {totalInvestido.map((item, i) => (
                                <Grid item xs={12} sm={6} lg={4} key={i}>
                                    <Card elevation={3} sx={{
                                        height: '140px', borderLeft: `6px solid ${item.color}`,
                                        transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                    }}>
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                            <Typography variant="h5" fontWeight="bold" color="#001E4C">{item.asset}</Typography>
                                            <Typography variant="h6" color="#666">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h4" color="#001E4C" fontWeight="bold" mt={4} display="flex" alignItems="center" gap={1}>
                            <AttachMoneyIcon /> Posição por Papel
                        </Typography>
                        <Divider sx={{ backgroundColor: '#001E4C', height: 3, width: 60, mb: 3 }} />
                        <Grid container spacing={3}>
                            {posicoes.map((p, i) => (
                                <Grid item xs={12} sm={6} lg={4} key={i}>
                                    <Card elevation={3} sx={{
                                        height: '160px', borderLeft: `6px solid ${p.color}`,
                                        transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                    }}>
                                        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                            <Typography variant="h5" fontWeight="bold" color="#001E4C">{p.asset}</Typography>
                                            <Typography variant="body1" color="#666">Quantidade: {p.quantity}</Typography>
                                            <Chip
                                                icon={p.profit >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                                label={`${p.profit >= 0 ? 'Lucro' : 'Prejuízo'}: R$ ${Math.abs(p.profit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                                color={p.profit >= 0 ? 'success' : 'error'}
                                                variant="filled"
                                                sx={{ fontWeight: 'bold', mt: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}

                            {/* Posição Global */}
                            <Grid item xs={12} sm={6} lg={4}>
                                <Card elevation={3} sx={{
                                    height: '160px',
                                    borderLeft: `6px solid ${posicaoGlobal && posicaoGlobal >= 0 ? '#2e7d32' : '#d32f2f'}`,
                                    transition: '0.3s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
                                    background: '#001E4C',
                                    color: 'white'
                                }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                                            Posição Global
                                        </Typography>
                                        <Chip
                                            icon={posicaoGlobal && posicaoGlobal >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                            label={`${posicaoGlobal && posicaoGlobal >= 0 ? 'Lucro' : 'Prejuízo'}: R$ ${Math.abs(posicaoGlobal ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                            color={posicaoGlobal && posicaoGlobal >= 0 ? 'success' : 'error'}
                                            sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                        </Grid>
                    </Grid>

                    {/* Corretagem + Cotação */}
                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            {/* Corretagem */}
                            <Grid item xs={12} md={4}>
                                <Card elevation={6} sx={{
                                    height: '180px', background: 'linear-gradient(135deg, #FF6B00 0%, #FF8A50 100%)',
                                    color: 'white', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 }
                                }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <Typography variant="h5" fontWeight="bold" mb={2}>Total de Corretagem</Typography>
                                        <Typography variant="h4" fontWeight="bold">
                                            R$ {corretagemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Cotação */}
                            <Grid item xs={12} md={8}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h5" color="#001E4C" fontWeight="bold" mb={2}>
                                        Pesquisar Cotação de Ativo
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth label="Código do ativo" value={searchCode}
                                                onChange={e => setSearchCode(e.target.value.toUpperCase())}
                                                onKeyPress={handleKeyPress}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={fetchCotacao} disabled={isLoading} sx={{ color: '#FF6B00' }}>
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Card elevation={3} sx={{
                                                height: '140px', borderLeft: `6px solid ${cotacao ? '#001E4C' : '#FF6B00'}`,
                                                transition: '0.3s', background: cotacao ? '#fff' : '#f8f9fa'
                                            }}>
                                                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                                    <Typography variant="h5" fontWeight="bold" color="#001E4C" mb={1}>
                                                        {cotacao?.assetCode || '--'}
                                                    </Typography>
                                                    <Typography variant="h6" color="#666">
                                                        Valor atual: R$ {cotacao ? cotacao.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                                                    </Typography>
                                                    <Typography variant="body2" color="#999">
                                                        {cotacao?.timestamp
                                                            ? `Atualizado em: ${new Date(cotacao.timestamp).toLocaleString('pt-BR')}`
                                                            : 'Aguardando pesquisa...'}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Index;
