from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

class Record(models.Model):
    major = models.IntegerField()
    minor = models.IntegerField()
    mac = models.CharField(max_length=20)
    rssi = models.DecimalField(decimal_places=4, max_digits=8)
    distance = models.DecimalField(decimal_places=4, max_digits=8)
    user = models.ForeignKey(User, editable = False)
    timestamp = models.DateTimeField()

admin.site.register(Record)
