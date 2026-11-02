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
            name='RegistroEjemplo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('activo', models.BooleanField(default=True)),
                ('titulo', models.CharField(max_length=150)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('estado', models.CharField(default='ACTIVO', max_length=50)),
                ('usuario', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Registro Ejemplo',
                'verbose_name_plural': 'Registros Ejemplo',
                'ordering': ['-update_at', '-id'],
                'abstract': False,
            },
        ),
    ]
