# Generated by Django 5.1.2 on 2025-02-17 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0011_alumni_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alumni',
            name='username',
            field=models.CharField(default='default_username', max_length=255, unique=True),
        ),
    ]
