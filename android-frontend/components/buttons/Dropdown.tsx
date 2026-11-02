import 'global.css';
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, LayoutChangeEvent } from 'react-native';
import { ChevronDown, Check, LucideIcon } from 'lucide-react-native';

// --- Interfaces ---
interface Option {
  id: string | number;
  label: string;
  [key: string]: any;
}

interface Props {
  id: string; 
  label?: string;
  modelValue: any; 
  onUpdateModelValue: (value: any) => void;
  options: Option[];
  multiple?: boolean;
  inverse?: boolean;
  disabled?: boolean;
  containerClass?: string;
  panelClass?: string;
  optionClass?: string;
  icon?: LucideIcon;
  iconClass?: string;
  iconSize?: number;
  onPress?: (data: { id: string | number; label: string }) => void;
}

const Dropdown: React.FC<Props> = ({
  id,
  label = 'Seleccionar',
  modelValue = {},
  onUpdateModelValue,
  options = [],
  multiple = false,
  inverse = false,
  disabled = false,
  containerClass = '',
  panelClass = '',
  optionClass = '',
  icon: Icon,
  iconClass = '',
  iconSize = 16,
  onPress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initializedInverse, setInitializedInverse] = useState(false);
  const [width, setWidth] = useState<number>(0);

  const currentFieldValue = modelValue?.[id];

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  // --- Lógica de Inicialización (Inverse) ---
  useEffect(() => {
    if (inverse && options.length > 0 && !initializedInverse) {
      // Si es múltiple, verificamos si el array está vacío
      const isEmpty = !currentFieldValue || 
        (multiple ? (Array.isArray(currentFieldValue) && currentFieldValue.length === 0) : false);

      if (isEmpty) {
        let newValue;
        if (multiple) {
          newValue = options.map(val => ({
            id: val.id,
            label: val.label
          }));
        } else {
          newValue = options[0].id;
        }
        
        onUpdateModelValue({ ...modelValue, [id]: newValue });
        setInitializedInverse(true);
      }
    }
  }, [options, inverse, initializedInverse, multiple]);

  // --- Helpers de Selección ---
  const isSelected = (option: Option) => {
    if (!currentFieldValue) return false;
    if (multiple) {
      // Ahora buscamos dentro del array de objetos
      return Array.isArray(currentFieldValue) && 
             currentFieldValue.some((item: any) => item.id === option.id);
    }
    return currentFieldValue === option.id;
  };

  const selectOption = (option: Option) => {
    let nextValue;

    if (multiple) {
      const currentArray = Array.isArray(currentFieldValue) ? currentFieldValue : [];
      const isAlreadySelected = currentArray.some((item: any) => item.id === option.id);

      if (isAlreadySelected) {
        // Quitamos del array
        nextValue = currentArray.filter((item: any) => item.id !== option.id);
      } else {
        // Agregamos al array manteniendo solo id y label
        nextValue = [...currentArray, { id: option.id, label: option.label }];
      }
    } else {
      nextValue = currentFieldValue === option.id ? null : option.id;
      setIsOpen(false);
    }

    onUpdateModelValue({
      ...modelValue,
      [id]: nextValue
    });
  };

  const computedClass = useMemo(() => {
    const baseClasses = 'flex-row items-center justify-between rounded-md h-10 px-4 bg-primary';
    return `${baseClasses} ${disabled ? 'opacity-50' : ''} ${containerClass}`;
  }, [disabled, containerClass]);

  return (
    <View className="relative z-50" onLayout={onLayout}>
      <Pressable
        onPress={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            onPress?.({ id, label });
          }
        }}
        disabled={disabled}
        className={`${computedClass} active:opacity-80`}
      >
        <View className="flex-row items-center">
          {Icon && (
            <View className={`${iconClass} mr-2`}>
              <Icon size={iconSize} color="white" />
            </View>
          )}
          <Text className="text-primary-foreground text-sm font-medium">
            {label}
          </Text>
        </View>
        <View className="opacity-50">
          <ChevronDown size={14} color="white" />
        </View>
      </Pressable>

      {isOpen && (
        <View
          style={{ width, elevation: 5 }}
          className={`${panelClass} absolute top-full left-0 mt-1 rounded-md border border-border bg-popover p-1 shadow-md`}
        >
          {options.length > 0 ? (
            <ScrollView bounces={false} className="max-h-52">
              {options.map((opt) => (
                <Pressable
                  key={opt.id}
                  onPress={() => selectOption(opt)}
                  className={`${optionClass} flex-row items-center justify-between rounded-sm px-2 py-2.5 active:bg-neutro/20`}
                >
                  <Text className="text-sm text-popover-foreground flex-1">
                    {opt.label}
                  </Text>
                  {isSelected(opt) && (
                    <Check size={14} color="black" strokeWidth={3} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View className="px-2 py-2">
              <Text className="text-sm text-muted-foreground italic">Sin opciones</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Dropdown;