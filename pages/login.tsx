import {Box, Button, Container, Paper, TextField, Typography,} from '@mui/material';
import {useRouter} from 'next/router';
import {useState} from 'react';
import Image from 'next/image';
import {apiService} from '@/pages/services/investments';

export default function Login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLoginOrCreate = async () => {
        if (!email || !name) return;

        setLoading(true);
        try {
            let user;
            try {
                user = await apiService.login(email);
            } catch {
                user = await apiService.createUser({name, email});
            }

            localStorage.setItem('userId', user.id);
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);

            router.push(`/dashboard?email=${encodeURIComponent(user.email)}`);
        } catch (error) {
            alert('Erro ao autenticar/criar usuário. Tente novamente.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FF6B00' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 4,
                    py: 2,
                    backgroundColor: '#001E4C',
                }}
            >
                <Image
                    src="/Itaú_Unibanco_logo_2023.svg.png"
                    alt="Logo Itaú"
                    width={40}
                    height={40}
                />
                <Typography variant="h6" color="white" ml={2} fontWeight="bold">
                    Itaú Corretora
                </Typography>
            </Box>

            <Box sx={{ py: 6, textAlign: 'center', color: 'white' }}>
                <Typography variant="h3" fontWeight="bold">
                    Acesso ao Painel de Investimentos
                </Typography>
                <Typography variant="h6" mt={1}>
                    Visualize sua posição financeira, corretagens e ativos.
                </Typography>
            </Box>

            <Container maxWidth="sm">
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backgroundColor: 'white',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="h5"
                        color="#001E4C"
                        fontWeight="bold"
                        mb={2}
                    >
                        Entrar com e-mail
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        fullWidth
                        size="large"
                        onClick={handleLoginOrCreate}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#FF6B00',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#e05f00',
                            },
                        }}
                    >
                        {loading ? 'Carregando...' : 'Entrar / Criar Conta'}
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
