from django.shortcuts import render_to_response, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.template import RequestContext
from models import Beacon
from django.http import HttpResponse
from api.models import Record
from django.db.models import Max
from django.core import serializers

@login_required
def index(request):
    beacons = Beacon.objects.all().filter(enabled=True)
    return render_to_response('LocationTracking/html/index.html',{'beacons':beacons}, RequestContext(request))

@login_required
def get_current_position(request):
    maxtime = (Record.objects.all().aggregate(Max('timestamp')))['timestamp__max']
    records = Record.objects.all().filter(timestamp = maxtime).order_by('distance')
    data = serializers.serialize('json', records, fields=('major','minor', 'mac', 'rssi', 'distance', 'user'))
    return HttpResponse(data)


def login(request):
    if request.method == 'GET':
    	return render_to_response('LocationTracking/html/login.html',{}, RequestContext(request))
    elif request.method == 'POST':
	username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth_login(request, user)
        return redirect('/')

def logout(request):
    auth_logout(request)
    return redirect('/')
