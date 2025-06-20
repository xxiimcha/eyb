# Generated by Django 5.2 on 2025-06-08 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_graduatetracerform'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graduatetracerform',
            name='address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='advance_reason',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='birthday',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='business_line',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='civil_status',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='college_competencies',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='college_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='current_employer_address',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='current_employer_contact',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='current_employer_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='current_job_position',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='current_supervisor_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='curriculum_relevance',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='degree',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='employment_status',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='exam_passed',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='exam_rating',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='first_job',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='first_job_duration',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='first_job_position',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='grad_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='grad_reasons_other',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='honors',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='initial_salary',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='job_accept_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='job_change_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='job_course_relation',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='job_finding_time',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='mobile_number',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='occupation',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='other_skills_specified',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='province',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='region',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='residence_location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='sex',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='specialization',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='stay_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='trainings',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='undergrad_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='unemployed_reasons',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='work_location',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='graduatetracerform',
            name='year_graduated',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
