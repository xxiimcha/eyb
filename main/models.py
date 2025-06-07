from django.db import models

class Batch(models.Model):
    from_year = models.IntegerField()
    to_year = models.IntegerField()
    batch_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.from_year}-{self.to_year} ({self.batch_type})"

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    contact = models.CharField(max_length=20)
    address = models.TextField()
    course = models.CharField(max_length=150)
    ambition = models.CharField(max_length=255, blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class UserAccount(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Store hashed password
    private_key = models.TextField(blank=True, null=True)
    public_key = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
