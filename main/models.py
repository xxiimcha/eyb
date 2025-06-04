# models.py
from django.db import models

class Batch(models.Model):
    from_year = models.IntegerField()
    to_year = models.IntegerField()
    batch_type = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.from_year}-{self.to_year} ({self.batch_type})"
