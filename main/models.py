from django.db import models
from django.utils import timezone
from cloudinary.models import CloudinaryField

class Batch(models.Model):
    from_year = models.IntegerField()
    to_year = models.IntegerField()
    batch_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.from_year}-{self.to_year} ({self.batch_type})"

class Graduate(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)  # Ensure email uniqueness
    contact = models.CharField(max_length=15)
    address = models.TextField()
    course = models.CharField(max_length=150)
    ambition = models.CharField(max_length=255, blank=True, null=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

    photo = CloudinaryField('image', blank=True, null=True)
    qr_code = models.ImageField(upload_to='graduates/qrcodes/', blank=True, null=True)  # Optional

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Account(models.Model):
    graduate = models.OneToOneField(Graduate, on_delete=models.CASCADE)
    public_key = models.TextField()
    private_key = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class GraduateTracerForm(models.Model):
    graduate = models.ForeignKey(Graduate, on_delete=models.CASCADE, related_name='tracer_forms')

    # Personal Information
    full_name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    mobile_number = models.CharField(max_length=20, null=True, blank=True)
    civil_status = models.CharField(max_length=50, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    sex = models.CharField(max_length=30, null=True, blank=True)
    province = models.CharField(max_length=100, null=True, blank=True)
    residence_location = models.CharField(max_length=100, null=True, blank=True)

    # Educational Background
    degree = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    college_name = models.CharField(max_length=255, null=True, blank=True)
    year_graduated = models.CharField(max_length=10, null=True, blank=True)
    honors = models.CharField(max_length=255, null=True, blank=True)
    exam_passed = models.CharField(max_length=255, null=True, blank=True)
    exam_date = models.DateField(null=True, blank=True)
    exam_rating = models.CharField(max_length=20, null=True, blank=True)

    # Undergraduate and Graduate Study Reasons
    undergrad_reasons = models.TextField(null=True, blank=True)
    grad_reasons = models.TextField(null=True, blank=True)
    grad_reasons_other = models.CharField(max_length=255, null=True, blank=True)

    # Trainings
    trainings = models.TextField(null=True, blank=True)
    advance_reason = models.CharField(max_length=100, null=True, blank=True)

    # Employment
    employment_status = models.CharField(max_length=20, null=True, blank=True)
    unemployed_reasons = models.TextField(null=True, blank=True)

    # Employed details
    occupation = models.CharField(max_length=100, null=True, blank=True)
    business_line = models.CharField(max_length=100, null=True, blank=True)
    work_location = models.CharField(max_length=100, null=True, blank=True)
    first_job = models.CharField(max_length=20, null=True, blank=True)
    stay_reasons = models.TextField(null=True, blank=True)
    job_course_relation = models.CharField(max_length=10, null=True, blank=True)
    job_finding_time = models.CharField(max_length=20, null=True, blank=True)
    job_accept_reasons = models.TextField(null=True, blank=True)
    job_change_reasons = models.TextField(null=True, blank=True)
    first_job_duration = models.CharField(max_length=30, null=True, blank=True)
    first_job_position = models.CharField(max_length=30, null=True, blank=True)
    current_job_position = models.CharField(max_length=30, null=True, blank=True)

    current_employer_name = models.CharField(max_length=255, null=True, blank=True)
    current_employer_address = models.TextField(null=True, blank=True)
    current_supervisor_name = models.CharField(max_length=255, null=True, blank=True)
    current_employer_contact = models.CharField(max_length=20, null=True, blank=True)

    # Income and Curriculum Relevance
    initial_salary = models.CharField(max_length=30, null=True, blank=True)
    curriculum_relevance = models.CharField(max_length=10, null=True, blank=True)
    college_competencies = models.TextField(null=True, blank=True)
    other_skills_specified = models.CharField(max_length=255, null=True, blank=True)

    # Privacy consent
    data_privacy = models.BooleanField(default=False)

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tracer Form: {self.full_name} (Graduate ID {self.graduate.id})"
