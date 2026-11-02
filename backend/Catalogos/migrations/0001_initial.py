import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Nacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=100, unique=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Nacion',
                'verbose_name_plural': 'Naciones',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Estado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=100, unique=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Estado',
                'verbose_name_plural': 'Estados',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Colonia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=100)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Colonia',
                'verbose_name_plural': 'Colonias',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Zona',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=100, unique=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Zona',
                'verbose_name_plural': 'Zonas',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Color',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=50, unique=True)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Color',
                'verbose_name_plural': 'Colores',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Municipio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('descripcion', models.CharField(max_length=100, unique=True)),
                ('estado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='municipios', to='Catalogos.estado')),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Municipio',
                'verbose_name_plural': 'Municipios',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
                'unique_together': {('descripcion', 'estado')},
            },
        ),
        migrations.CreateModel(
            name='CodigoPostal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('codigo_postal', models.CharField(max_length=5)),
                ('colonia_tipo', models.CharField(max_length=50)),
                ('colonia', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='codigos_postales', to='Catalogos.colonia')),
                ('estado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='codigos_postales', to='Catalogos.estado')),
                ('municipio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='codigos_postales', to='Catalogos.municipio')),
                ('zona', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='codigos_postales', to='Catalogos.zona')),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Codigo Postal',
                'verbose_name_plural': 'Codigos Postales',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
    ]
