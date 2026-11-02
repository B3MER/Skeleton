import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    User,
    Mail,
    Shield,
    Users,
    Monitor,
    CheckCircle2,
    XCircle,
    Fingerprint,
    LogOut,
    Moon,
    Sun,
    Settings
} from 'lucide-react-native';

import { useUserStore, useThemeStore } from '@/App/store';
import { alertaBasica, errorHandler } from '@/App/helpers';
import { Button } from '@/components';

const InfoRow = ({ icon: Icon, label, value, valueClass = "text-foreground" }: any) => (
    <View className="flex-row items-center py-4 border-b border-border/50">
        <View className="bg-muted p-2 rounded-lg mr-4">
            <Icon size={20} color="#64748b" />
        </View>
        <View className="flex-1">
            <Text className="text-xs text-muted-foreground mb-0.5">{label}</Text>
            <Text className={`text-sm font-medium ${valueClass}`}>{value}</Text>
        </View>
    </View>
);

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    // --- STORES ---
    const rawUserData = useUserStore((state) => state.userData);
    const systemName = useUserStore((state) => state.systemName());
    const logoutStore = useUserStore((state) => state.logout);
    const isDark = useThemeStore((state) => state.isDark);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    const profile = Array.isArray(rawUserData?.data) ? rawUserData.data[0] : rawUserData;

    if (!profile) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Text className="text-muted-foreground">No se encontró información del perfil.</Text>
            </View>
        );
    }

    // Formateo de datos
    const fullName = [profile.nombre, profile.apellido].filter(Boolean).join(' ').trim();
    const displayName = fullName || 'No especificado';
    const displayEmail = profile.email || 'Sin correo asignado';
    const userInitial = profile.username?.charAt(0).toUpperCase() || '?';

    // --- ACCIONES ---
    const handleLogout = () => {
        alertaBasica(
            "Cerrar Sesión",
            "¿Deseas cerrar sesión de la cuenta?",
            "Aceptar",
            "Cancelar",
            () => {
                try {
                    logoutStore();
                } catch (e) {
                    errorHandler(e);
                }
            }
        );
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerStyle={{
                paddingTop: insets.top + 20,
                paddingBottom: insets.bottom + 20,
                paddingHorizontal: 20
            }}
            showsVerticalScrollIndicator={false}
        >
            {/* Cabecera del Perfil */}
            <View className="items-center mb-8 mt-4">
                <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4 border-4 border-blue-500/20">
                    <Text className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {userInitial}
                    </Text>
                </View>
                <Text className="text-2xl font-bold text-foreground">
                    @{profile.username}
                </Text>
                {/* <View className={`flex-row items-center mt-2 px-3 py-1 rounded-full ${profile.is_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {profile.is_active ? (
                        <>
                            <CheckCircle2 size={14} color="#16a34a" />
                            <Text className="text-green-700 dark:text-green-400 text-xs font-semibold ml-1.5">Activo</Text>
                        </>
                    ) : (
                        <>
                            <XCircle size={14} color="#dc2626" />
                            <Text className="text-red-700 dark:text-red-400 text-xs font-semibold ml-1.5">Inactivo</Text>
                        </>
                    )}
                </View> */}
            </View>

            {/* Tarjeta de Información Personal */}
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider ml-1">
                Información Personal
            </Text>
            <View className="bg-card rounded-2xl px-4 border border-border shadow-sm mb-6">
                <InfoRow
                    icon={User}
                    label="Nombre Completo"
                    value={displayName}
                    valueClass={!fullName ? "text-muted-foreground italic" : "text-foreground"}
                />
                <InfoRow
                    icon={Mail}
                    label="Correo Electrónico"
                    value={displayEmail}
                    valueClass={!profile.email ? "text-muted-foreground italic" : "text-foreground"}
                />
            </View>

            {/* Tarjeta de Permisos y Sistema */}
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider ml-1">
                Accesos y Roles
            </Text>
            <View className="bg-card rounded-2xl px-4 border border-border shadow-sm mb-6">
                <InfoRow
                    icon={Shield}
                    label="Nivel de Acceso"
                    value={profile.is_superuser ? 'Superusuario' : (profile.is_staff ? 'Staff' : 'Usuario Estándar')}
                    valueClass={profile.is_superuser ? "text-blue-600 font-bold" : "text-foreground"}
                />
                <InfoRow
                    icon={Users}
                    label="Grupos Asignados"
                    value={profile.groups?.length > 0 ? profile.groups.join(', ') : 'Ningún grupo'}
                    valueClass={!profile.groups?.length ? "text-muted-foreground italic" : "text-foreground"}
                />
                <View className="flex-row items-center py-4">
                    <View className="bg-muted p-2 rounded-lg mr-4">
                        <Monitor size={20} color="#64748b" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-muted-foreground mb-0.5">Sistema de Trabajo</Text>
                        <Text className="text-sm font-medium text-foreground">{systemName}</Text>
                    </View>
                </View>
            </View>

            {/* Tarjeta de Preferencias (Tema) */}
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider ml-1">
                Preferencias
            </Text>
            <View className="bg-card rounded-2xl px-4 border border-border shadow-sm mb-6">
                <TouchableOpacity
                    onPress={toggleTheme}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between py-4"
                >
                    <View className="flex-row items-center">
                        <View className="bg-muted p-2 rounded-lg mr-4">
                            <Settings size={20} color="#64748b" />
                        </View>
                        <View>
                            <Text className="text-sm font-medium text-foreground">Apariencia</Text>
                            <Text className="text-xs text-muted-foreground mt-0.5">
                                {isDark ? 'Modo Oscuro activado' : 'Modo Claro activado'}
                            </Text>
                        </View>
                    </View>

                    <View className={`p-2 rounded-full ${isDark ? 'bg-indigo-900/40' : 'bg-amber-100'}`}>
                        {isDark ? (
                            <Moon size={20} color="#818cf8" />
                        ) : (
                            <Sun size={20} color="#f59e0b" />
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            <Button
                label='Cerrar Sesión'
                onPress={handleLogout}
                icon={LogOut}
                iconClass='secondary-foreground'
                variant='normal'
            />
        </ScrollView>
    );
}