from django.db import models

class PDFDocument(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/')
    processed_at = models.DateTimeField(auto_now_add=True)