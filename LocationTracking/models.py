from django.contrib import admin
from django.db import models

class Beacon(models.Model):
    uuid = models.CharField(max_length=40)
    major = models.IntegerField()
    minor = models.IntegerField()
    mac = models.CharField(max_length=20)
    x = models.DecimalField(decimal_places=4, max_digits=8)
    y = models.DecimalField(decimal_places=4, max_digits=8)
    z = models.DecimalField(decimal_places=4, max_digits=8)
    enabled = models.BooleanField(default=True)

admin.site.register(Beacon)
