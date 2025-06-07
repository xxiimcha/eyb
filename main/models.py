from django.db import models
from django.utils import timezone

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

    photo = models.ImageField(upload_to='graduates/photos/', blank=True, null=True)
    qr_code = models.ImageField(upload_to='graduates/qrcodes/', blank=True, null=True)  # Optional

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class Account(models.Model):
    graduate = models.OneToOneField(Graduate, on_delete=models.CASCADE)
    public_key = models.TextField()
    private_key = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
