import Form from '@/components/forms/Form'; 
import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Mail, User, Phone } from 'lucide-react-native';

export default function PantallaRegistro() {
    // Estado principal del formulario
    const [formulario, setFormulario] = useState({});
    
    // Simulación de un objeto de errores proveniente de tu backend
    const [erroresDelBackend, setErroresDelBackend] = useState({
        correo: "El formato del correo es inválido",
    });

    // Las opciones para los componentes Select
    const opcionesGlobales = {
        genero: [
            { id: 'm', label: 'Masculino' },
            { id: 'f', label: 'Femenino' },
            { id: 'o', label: 'Otro' }
        ]
    };

    // El esquema (Schema) de tu formulario
    const esquemaFormulario = [
        {
            id: 'nombres',
            type: 'date',
            label: 'Nombres',
            placeholder: 'Tus nombres',
            icon: User,
        },
        {
            id: 'apellidos',
            type: 'mayusc',
            label: 'Apellidos',
            placeholder: 'Tus apellidos',
        },
        {
            id: 'correo',
            type: 'minusc',
            label: 'Correo Electrónico',
            placeholder: 'ejemplo@correo.com',
            icon: Mail,
        },
        {
            id: 'telefono',
            type: 'num',
            label: 'Teléfono',
            placeholder: '1234567890',
            maxlength: 10,
            icon: Phone,
        },
        {
            id: 'genero',
            type: 'select',
            label: 'Género',
            placeholder: 'Seleccione un género',
            icon: User,
        },
        {
            id: 'horario',
            type: 'time-range',
            label: 'Disponibilidad',
            icon: User,

        },
        {
            id: 'comentarios',
            type: 'textarea',
            label: 'Comentarios Adicionales',
            placeholder: 'Cuéntanos un poco más sobre ti...',
            maxlength: 150,
        }
    ];

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
            <Text className="text-2xl font-bold mb-6 text-foreground">
                Generador Dinámico
            </Text>

            {/* Invocamos al componente form dinámico y le decimos que use 2 columnas */}
            <Form
                data={esquemaFormulario}
                value={formulario}
                onChange={setFormulario}
                options={opcionesGlobales}
                cols={1} // El Form renderizará en 2 columnas, excepto el textarea que tomará el 100%
                error={erroresDelBackend}
            />

            {/* Debug del estado actual */}
            <View className="mt-8 p-4 bg-gray-100 rounded-xl">
                <Text className="font-bold text-gray-800">Estado en tiempo real:</Text>
                <Text className="text-gray-600 mt-2">{JSON.stringify(formulario, null, 2)}</Text>
            </View>
        </ScrollView>
    );
}