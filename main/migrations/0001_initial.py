# Generated by Django 5.2 on 2025-06-07 14:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Batch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('from_year', models.IntegerField()),
                ('to_year', models.IntegerField()),
                ('batch_type', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Graduate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('middle_name', models.CharField(blank=True, max_length=100, null=True)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('contact', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('course', models.CharField(max_length=150)),
                ('ambition', models.CharField(blank=True, max_length=255, null=True)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='graduates/photos/')),
                ('qr_code', models.ImageField(blank=True, null=True, upload_to='graduates/qrcodes/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('batch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.batch')),
            ],
        ),
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('public_key', models.TextField()),
                ('private_key', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('graduate', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='main.graduate')),
            ],
        ),
    ]
