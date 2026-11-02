import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    ActivityIndicator, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform 
} from 'react-native';
import { useUserStore } from '@/App/store/auth';
import { User, Key } from 'lucide-react-native';
import { crudApi } from '@/App/api/crud';
import { Card, TextInput, Button } from '@/components';
import logo from '@/assets/logo.png';
import { alertaBasica } from '@/App/helpers'; 

const loginApi = crudApi("usuarios/login");

export default function Login({ navigation, route }: any) {
    const userStore = useUserStore();

    const [isLoading, setIsLoading] = useState(false);
    const [mensaje, setMensaje] = useState("Iniciando sesión...");
    const [error, setError] = useState<any>({});
    const [payload, setPayload] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async () => {
        if (isLoading) return;

        setMensaje("Autenticando...");
        setIsLoading(true);
        setError({});

        try {
            const response = await loginApi.create(payload);
            userStore.login(response.data);
        } catch (err: any) {
            setIsLoading(false);

            const errorData = err.response?.data || {};
            setError(errorData.data || errorData);

            const titulo = errorData.error ? "Error" : "Error al iniciar sesión";
            const mensajeBack = errorData.message || errorData.error || "Verifica tus datos e intenta nuevamente.";

            alertaBasica(titulo, mensajeBack, "Aceptar");
        }
    };

    useEffect(() => {
        const reason = route.params?.reason;

        if (reason === 'expired') {
            alertaBasica(
                "Sesión Caducada", 
                "Tu sesión ha expirado. Por favor, ingresa tus credenciales nuevamente.", 
                "Entendido"
            );
            navigation.setParams({ reason: null });
        } else if (reason === 'logout') {
            navigation.setParams({ reason: null });
        }
    }, [route.params?.reason]);

    const getFieldError = (err: any) => {
        if (!err) return '';
        return Array.isArray(err) ? err[0] : String(err);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                className="bg-background w-full px-4 py-8"
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                <Card cardStyle="w-full max-w-sm self-center" padding="p-6">
                    <View className="items-center mb-5">
                        <Image
                            source={logo}
                            style={{ width: 120, height: 120 }}
                            resizeMode="contain"
                        />
                    </View>

                    <Text className="text-center text-2xl font-bold text-foreground mb-2">
                        Iniciar Sesión
                    </Text>

                    <Text className="text-center text-sm text-muted-foreground mb-6">
                        Introduce tu usuario y contraseña para acceder a tu cuenta.
                    </Text>

                    <TextInput
                        label="Usuario"
                        placeholder="Usuario"
                        icon={User}
                        value={payload.username}
                        onChange={(text) => setPayload(prev => ({ ...prev, username: text }))}
                        error={getFieldError(error?.username)}
                        disabled={isLoading}
                    />

                    <TextInput
                        label="Contraseña"
                        type="password"
                        placeholder="Contraseña"
                        icon={Key}
                        value={payload.password}
                        onChange={(text) => setPayload(prev => ({ ...prev, password: text }))}
                        error={getFieldError(error?.password)}
                        disabled={isLoading}
                    />

                    <View className="mt-2">
                        <Button
                            label="Entrar"
                            onPress={handleLogin}
                            disabled={isLoading}
                            containerClass="w-full bg-primary"
                        />
                    </View>
                </Card>
            </ScrollView>

            {isLoading && (
                <View className="absolute inset-0 z-50 items-center justify-center bg-black/50">
                    <View className="bg-card px-6 py-6 rounded-2xl items-center shadow-lg">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="mt-3 text-base font-semibold text-foreground">
                            {mensaje}
                        </Text>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}