import os
import csv
import re
import unicodedata
from django.core.management.base import BaseCommand
from django.db import transaction
from Catalogos.models import Estado, Municipio, Colonia, Zona, CodigoPostal

ZONAS_CDMX = {
    "CENTRO": ["CUAUHTEMOC", "BENITO JUAREZ"],
    "NORTE": ["GUSTAVO A. MADERO", "AZCAPOTZALCO"],
    "SUR": ["COYOACAN", "TLALPAN", "XOCHIMILCO", "LA MAGDALENA CONTRERAS", "MILPA ALTA"],
    "ORIENTE": ["VENUSTIANO CARRANZA", "IZTACALCO", "IZTAPALAPA", "TLAHUAC"],
    "PONIENTE": ["MIGUEL HIDALGO", "ALVARO OBREGON", "CUAJIMALPA DE MORELOS"]
}

class Command(BaseCommand):
    help = 'Migra códigos postales con validación extrema y barra de progreso.'

    def add_arguments(self, parser):
        parser.add_argument('archivo', nargs='?', type=str, default='codigo_postal.csv')

    def limpiar_texto(self, texto):
        if not texto: return ""
        texto = str(texto).strip().upper()
        texto = texto.replace('Ν', 'N').replace('Ο', 'O').replace('Α', 'A').replace('Ε', 'E')
        texto = ''.join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')
        texto = re.sub(r'[^A-Z0-9 \.\-]', '', texto)
        return re.sub(r'\s+', ' ', texto).strip()

    def resolver_ruta(self, archivo, default):
        archivo = archivo or default
        archivo = os.path.expanduser(archivo)
        if os.path.dirname(archivo): return os.path.abspath(archivo)
        return os.path.join(os.getcwd(), archivo)

    def mostrar_progreso(self, iteracion, total, prefijo='', longitud=40):
        porcentaje = f"{100 * (iteracion / float(total)):.1f}"
        relleno = int(longitud * iteracion // total)
        barra = '█' * relleno + '-' * (longitud - relleno)
        self.stdout.write(f'\r{prefijo} |{barra}| {porcentaje}% Completado', ending='')
        self.stdout.flush()
        if iteracion == total: self.stdout.write('\n')

    def buscar_o_crear_flexible_cache(self, Modelo, descripcion, cache_dict, **kwargs):
        desc = self.limpiar_texto(descripcion)
        if not desc: return None
        llave_cache = f"{desc}_{kwargs.get('estado', '')}"
        
        if llave_cache in cache_dict: return cache_dict[llave_cache]
        obj = Modelo.objects.filter(descripcion=desc, **kwargs).first()
        if obj:
            cache_dict[llave_cache] = obj
            return obj

        for existente in Modelo.objects.filter(**kwargs):
            if (desc in existente.descripcion or existente.descripcion in desc) and len(desc) > 3:
                cache_dict[llave_cache] = existente
                return existente

        obj = Modelo.objects.create(descripcion=desc, **kwargs)
        cache_dict[llave_cache] = obj
        return obj

    def obtener_zona_cdmx(self, municipio):
        mun_limpio = self.limpiar_texto(municipio)
        for zona, alcaldias in ZONAS_CDMX.items():
            for alc in alcaldias:
                if mun_limpio in alc or alc in mun_limpio: return zona
        return "NO DEFINIDA"

    def handle(self, *args, **options):
        ruta_archivo = self.resolver_ruta(options['archivo'], 'codigo_postal.csv')
        if not os.path.exists(ruta_archivo): return

        cache_estados, cache_municipios, cache_zonas, cache_colonias = {}, {}, {}, {}

        with open(ruta_archivo, mode='r', encoding='utf-8') as f:
            total_lineas = sum(1 for row in f) - 1
            f.seek(0)
            reader = csv.DictReader(f)
            if reader.fieldnames: reader.fieldnames = [str(col).strip().lower() for col in reader.fieldnames]

            with transaction.atomic():
                for i, row in enumerate(reader, 1):
                    estado_str = row.get('d_estado', '')
                    if not estado_str: continue
                        
                    estado_obj = self.buscar_o_crear_flexible_cache(Estado, estado_str, cache_estados)
                    municipio_obj = self.buscar_o_crear_flexible_cache(Municipio, row.get('d_mnpio', ''), cache_municipios, estado=estado_obj)
                    
                    est_limpio = self.limpiar_texto(estado_str)
                    if est_limpio in ['CIUDAD DE MEXICO', 'DISTRITO FEDERAL']:
                        zona_str = self.obtener_zona_cdmx(row.get('d_mnpio', ''))
                    else:
                        zona_str = row.get('d_zona', '') or "URBANO"
                            
                    zona_obj = self.buscar_o_crear_flexible_cache(Zona, zona_str, cache_zonas)
                    colonia_obj = self.buscar_o_crear_flexible_cache(Colonia, row.get('d_asenta', ''), cache_colonias)
                    cp_str = str(row.get('d_codigo', '')).strip().zfill(5)
                    colonia_tipo_str = self.limpiar_texto(row.get('d_tipo_asenta', ''))
                    
                    CodigoPostal.objects.get_or_create(
                        codigo_postal=cp_str, colonia=colonia_obj, 
                        defaults={'estado': estado_obj, 'municipio': municipio_obj, 'colonia_tipo': colonia_tipo_str, 'zona': zona_obj}
                    )
                    self.mostrar_progreso(i, total_lineas, prefijo='Migrando CP:')
        self.stdout.write(self.style.SUCCESS("¡Códigos Postales importados!"))