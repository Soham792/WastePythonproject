# Generated by Django 4.2.11 on 2025-02-03 22:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classifier', '0004_remove_classificationresult_instructions'),
    ]

    operations = [
        migrations.AddField(
            model_name='classificationresult',
            name='instructions',
            field=models.JSONField(null=True),
        ),
    ]
