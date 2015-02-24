from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from rest_framework import status


class GetAuthToken(ObtainAuthToken):
    def post(self, request):
        serializer = self.serializer_class(data=request.DATA)
        if serializer.is_valid():
            try:
                Token.objects.filter(user=serializer.object['user']).delete()
            except:
                pass
            token  =  Token.objects.get_or_create(user=serializer.object['user'])

            return HttpResponse("{'token': '" + token[0].key + "'}")
        return HttpResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

get_auth_token = GetAuthToken.as_view()
