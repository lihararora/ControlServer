from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from api.models import Record
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime

# Create your views here.

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def post(request):
    data = JSONParser().parse(request)
    curtime = datetime.now()
    try:
        for beacon in data:
            r = Record()
            r.major = beacon['major']
            r.minor = beacon['minor']
            r.mac = beacon['mac']
            r.rssi = beacon['rssi']
            r.distance = beacon['distance']
            r.user = request.user
            r.timestamp = curtime
            r.save()
        return JSONResponse({"success":"true"}, status=201)
    except Exception as e:
        return JSONResponse({"success":"false"}, status=400)
